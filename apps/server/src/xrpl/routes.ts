import type { Express, Request, Response } from 'express'
import {
  getBalances,
  hasCrumbTrustline,
  issuerAddressFromEnv,
  parseClassicAddress,
  publicXrplConfig,
} from '@hhc/xrpl'
import {
  balancesGuest,
  createGuestSession,
  fundGuest,
  getGuest,
  trustlineGuest,
} from './guestWallets'

function guestSessionId(req: Request): string | null {
  const fromBody = typeof req.body?.sessionId === 'string' ? req.body.sessionId : ''
  const fromHeader = typeof req.headers['x-hhc-guest'] === 'string' ? req.headers['x-hhc-guest'] : ''
  const id = (fromBody || fromHeader).trim()
  return id || null
}

function sendBlocked(res: Response, err: unknown, status = 502): void {
  const msg = err instanceof Error ? err.message : String(err)
  const blocked = msg.startsWith('BLOCKED:') ? msg : `BLOCKED: ${msg}`
  res.status(status).json({ error: blocked, blocked: true })
}

export function mountXrplRoutes(app: Express): void {
  app.get('/xrpl/config', (_req, res) => {
    res.json(publicXrplConfig())
  })

  app.get('/xrpl/balances/:address', async (req, res) => {
    const address = parseClassicAddress(req.params.address)
    if (!address) {
      res.status(400).json({ error: 'classic r-address required' })
      return
    }
    try {
      const balances = await getBalances(address, issuerAddressFromEnv())
      const issuer = issuerAddressFromEnv()
      const trustline = issuer ? await hasCrumbTrustline(address, issuer) : false
      res.json({ ...balances, trustline, issuer })
    } catch (err) {
      sendBlocked(res, err)
    }
  })

  app.post('/wallet/guest', (_req, res) => {
    const guest = createGuestSession()
    res.json(guest)
  })

  app.post('/wallet/guest/fund', async (req, res) => {
    const sessionId = guestSessionId(req)
    if (!sessionId || !getGuest(sessionId)) {
      res.status(404).json({ error: 'unknown guest session' })
      return
    }
    try {
      const funded = await fundGuest(sessionId)
      res.json({
        sessionId: funded.sessionId,
        address: funded.address,
        faucetHash: funded.fund.hash ?? null,
        amount: funded.fund.amount ?? null,
      })
    } catch (err) {
      sendBlocked(res, err)
    }
  })

  app.post('/wallet/guest/trustline', async (req, res) => {
    const sessionId = guestSessionId(req)
    if (!sessionId || !getGuest(sessionId)) {
      res.status(404).json({ error: 'unknown guest session' })
      return
    }
    try {
      const result = await trustlineGuest(sessionId)
      res.json({
        sessionId: result.sessionId,
        address: result.address,
        issuer: result.issuer,
        hash: result.trust.hash,
        ledgerIndex: result.trust.ledgerIndex ?? null,
        result: result.trust.result,
      })
    } catch (err) {
      sendBlocked(res, err)
    }
  })

  app.get('/wallet/guest/:sessionId/balances', async (req, res) => {
    const sessionId = String(req.params.sessionId ?? '')
    if (!getGuest(sessionId)) {
      res.status(404).json({ error: 'unknown guest session' })
      return
    }
    try {
      const balances = await balancesGuest(sessionId)
      res.json(balances)
    } catch (err) {
      sendBlocked(res, err)
    }
  })
}
