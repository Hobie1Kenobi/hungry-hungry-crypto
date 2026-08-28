import { createServer } from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createHttpApp } from './app'
import { createGuestSession, getGuest, resetGuestsForTests } from './xrpl/guestWallets'

describe('guest wallet secrecy', () => {
  it('keeps the seed in server memory and off the public payload', () => {
    resetGuestsForTests()
    const guest = createGuestSession()
    expect(guest).not.toHaveProperty('seed')
    const json = JSON.stringify(guest)
    const stored = getGuest(guest.sessionId)
    expect(stored?.seed).toBeTruthy()
    expect(json).not.toContain(stored!.seed)
    expect(guest.address.startsWith('r')).toBe(true)
  })
})

describe('HTTP identity', () => {
  let port = 0
  let server: ReturnType<typeof createServer>

  beforeAll(async () => {
    server = createServer(createHttpApp())
    await new Promise<void>((resolve, reject) => {
      server.listen(0, () => resolve())
      server.once('error', reject)
    })
    const address = server.address()
    port = typeof address === 'object' && address ? address.port : 0
  })

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  it('serves Testnet config and a seedless guest session', async () => {
    const base = `http://127.0.0.1:${port}`
    const cfg = (await (await fetch(`${base}/xrpl/config`)).json()) as { network: string; wsUrl: string }
    expect(cfg.network).toBe('testnet')
    expect(cfg.wsUrl).toBe('wss://s.altnet.rippletest.net:51233')
    expect(JSON.stringify(cfg).toLowerCase()).not.toContain('mainnet')

    const guestRes = await fetch(`${base}/wallet/guest`, { method: 'POST' })
    const guest = (await guestRes.json()) as { sessionId: string; address: string; seed?: string }
    expect(guestRes.ok).toBe(true)
    expect(guest.seed).toBeUndefined()
    const stored = getGuest(guest.sessionId)
    expect(stored).toBeTruthy()
    expect(JSON.stringify(guest)).not.toContain(stored!.seed)
  })
})
