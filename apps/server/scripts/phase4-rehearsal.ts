import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from 'colyseus.js'
import { Wallet } from 'xrpl'
import { ROOM_NAME, type MatchResult } from '@hhc/shared'
import {
  createDurableIssuer,
  envPathAtRepoRoot,
  explorerTxUrl,
  getBalances,
  loadDotEnv,
  PHASE3_THROWAWAY_ISSUER,
  requestFaucet,
  setCrumbTrustline,
  XRPL_TESTNET_EXPLORER,
  XRPL_TESTNET_FAUCET,
  XRPL_TESTNET_WS,
  type NamedWrite,
} from '@hhc/xrpl'
import { startServer } from '../src/app'
import { getSettlement } from '../src/settle/settleMatch'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const envPath = envPathAtRepoRoot(repoRoot)

type TxRow = NamedWrite

function onceMessage<T>(
  room: { onMessage: (type: string, cb: (payload: T) => void) => void },
  type: string,
  ms: number,
): Promise<T> {
  return new Promise((resolveOnce, reject) => {
    const t = setTimeout(() => reject(new Error(`timed out waiting for ${type}`)), ms)
    room.onMessage(type, (payload) => {
      clearTimeout(t)
      resolveOnce(payload)
    })
  })
}

function renderReport(opts: {
  status: 'ok' | 'BLOCKED'
  blockedError?: string
  issuer?: string
  treasury?: string
  guest?: string
  matchId?: string
  rows: TxRow[]
}): string {
  const lines: string[] = [
    '# Public XRPL Testnet report — Hungry Hungry Crypto Phase 4',
    '',
    'Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.',
    '',
    '**CRUMB on Testnet has no value. This is not money.**',
    '',
    'Network: XRPL Testnet only.',
    '',
    '| Role | URL |',
    '| ---- | --- |',
    `| WebSocket | \`${XRPL_TESTNET_WS}\` |`,
    `| Faucet | \`${XRPL_TESTNET_FAUCET}\` |`,
    `| Explorer | [${XRPL_TESTNET_EXPLORER}](${XRPL_TESTNET_EXPLORER}) |`,
    '',
  ]

  if (opts.status === 'BLOCKED') {
    lines.push('## Status', '', '**BLOCKED.** Testnet/faucet did not complete the rehearsal.', '')
    lines.push('```', opts.blockedError ?? 'unknown', '```', '')
  } else {
    lines.push('## Status', '')
    lines.push(
      'Rehearsal completed against XRPL Testnet. Hashes below are real `tesSUCCESS` / `tec` results. None are invented.',
      '',
    )
  }

  if (opts.issuer) lines.push(`Durable issuer: \`${opts.issuer}\``, '')
  if (opts.treasury) lines.push(`Treasury: \`${opts.treasury}\``, '')
  if (opts.guest) lines.push(`Guest (bound human seat): \`${opts.guest}\``, '')
  if (opts.matchId) lines.push(`HungryRoom match: \`${opts.matchId}\``, '')

  lines.push('| What | Hash | Ledger | Result |')
  lines.push('| ---- | ---- | ------ | ------ |')
  if (opts.rows.length === 0) {
    lines.push('| _(none — rehearsal did not land a write)_ | — | — | — |')
  } else {
    for (const row of opts.rows) {
      const hash = row.hash ? `\`${row.hash}\`` : '—'
      const ledger = row.ledgerIndex != null ? String(row.ledgerIndex) : '—'
      const link = row.hash ? ` [explorer](${explorerTxUrl(row.hash)})` : ''
      lines.push(`| ${row.what} | ${hash}${link} | ${ledger} | ${row.result} |`)
    }
  }

  lines.push('')
  lines.push(
    'Phase 3 throwaway issuer `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW` is TrustSet-demo only. Its seed is not available and was not reused.',
  )
  lines.push('')
  lines.push(
    'Seeds live in `.env` only (`XRPL_ISSUER_SEED`, `XRPL_TREASURY_SEED`). They are never printed here and never committed.',
  )
  lines.push('')
  return `${lines.join('\n')}\n`
}

function writeArtifacts(body: unknown, report: string): void {
  mkdirSync(resolve(repoRoot, 'deployments'), { recursive: true })
  writeFileSync(resolve(repoRoot, 'deployments/testnet.json'), `${JSON.stringify(body, null, 2)}\n`)
  writeFileSync(resolve(repoRoot, 'PUBLIC_TESTNET_REPORT.md'), report)
}

async function driveHungryRoom(guestAddress: string): Promise<MatchResult> {
  const started = await startServer(0)
  const url = `ws://127.0.0.1:${started.port}`
  try {
    const client = new Client(url)
    const room = await client.joinOrCreate(ROOM_NAME, {
      fillMs: 0,
      roundSeconds: 2,
      address: guestAddress,
    })
    room.send('bindAddress', { address: guestAddress })
    room.onMessage('welcome', () => {})
    room.onMessage('lobby', () => {})
    room.onMessage('frame', () => {})
    const start = await onceMessage<{ matchId: string; seats: Array<{ kind: string }> }>(room, 'matchStart', 15_000)
    const humans = start.seats.filter((s) => s.kind === 'human')
    const ai = start.seats.filter((s) => s.kind === 'ai')
    if (start.seats.length !== 4 || humans.length !== 1 || ai.length !== 3) {
      throw new Error(`expected 1 human + 3 AI, got ${JSON.stringify(start.seats)}`)
    }
    const result = await onceMessage<MatchResult>(room, 'matchEnd', 180_000)
    room.leave()
    return result
  } finally {
    await started.shutdown()
  }
}

async function main(): Promise<void> {
  loadDotEnv(envPath)
  process.env.HHC_ALLOW_SHORT_ROUNDS = '1'
  process.env.HHC_SETTLE_LIVE = '1'

  if (process.env.XRPL_ISSUER_ADDRESS === PHASE3_THROWAWAY_ISSUER) {
    delete process.env.XRPL_ISSUER_ADDRESS
    delete process.env.XRPL_ISSUER_SEED
  }

  const rows: TxRow[] = []
  let issuer = ''
  let treasury = ''
  let guest = ''
  let matchId = ''

  try {
    const setup = await createDurableIssuer(envPath)
    issuer = setup.issuer
    treasury = setup.treasury
    rows.push(...setup.writes)
    console.info(`[phase4] issuer=${issuer}`)
    console.info(`[phase4] treasury=${treasury}`)
    for (const write of setup.writes) {
      console.info(
        `[phase4] ${write.what} hash=${write.hash} ledgerIndex=${write.ledgerIndex ?? 'n/a'} result=${write.result}`,
      )
    }

    const guestWallet = Wallet.generate()
    if (!guestWallet.seed) throw new Error('guest wallet produced no seed')
    guest = guestWallet.classicAddress
    console.info(`[phase4] guest address=${guest} (seed held in this process only, not printed)`)
    const fund = await requestFaucet(guest as `r${string}`)
    if (fund.hash) {
      rows.push({ what: 'Guest faucet', hash: fund.hash, ledgerIndex: undefined, result: 'tesSUCCESS' })
      console.info(`[phase4] guest faucet hash=${fund.hash}`)
    }
    const trust = await setCrumbTrustline(guestWallet, setup.issuer)
    rows.push({
      what: 'Guest TrustSet CRUMB',
      hash: trust.hash,
      ledgerIndex: trust.ledgerIndex,
      result: trust.result,
    })
    console.info(
      `[phase4] TrustSet hash=${trust.hash} ledgerIndex=${trust.ledgerIndex ?? 'n/a'} result=${trust.result}`,
    )
    await getBalances(guest as `r${string}`, setup.issuer)

    const match = await driveHungryRoom(guest)
    matchId = match.matchId
    const recorded = getSettlement(match.matchId)
    console.info(`[phase4] matchId=${match.matchId} winner=${match.winner} txHashes=${JSON.stringify(match.txHashes)}`)
    if (recorded) {
      for (const write of recorded.writes) {
        rows.push({
          what: `settleMatch CRUMB Payment dest=${write.dest}`,
          hash: write.hash ?? '',
          ledgerIndex: write.ledgerIndex,
          result: write.result,
        })
      }
    } else {
      for (const hash of match.txHashes) {
        rows.push({ what: 'settleMatch CRUMB Payment', hash, ledgerIndex: undefined, result: 'tesSUCCESS' })
      }
    }

    if (match.txHashes.length === 0) {
      throw new Error('BLOCKED: settleMatch submitted no tesSUCCESS CRUMB Payment')
    }

    writeArtifacts(
      {
        network: 'testnet',
        wsUrl: XRPL_TESTNET_WS,
        faucetUrl: XRPL_TESTNET_FAUCET,
        explorerUrl: XRPL_TESTNET_EXPLORER,
        issuer,
        treasury,
        guest,
        matchId,
        crumbName: 'CRUMB',
        crumbCurrency: '4352554D42000000000000000000000000000000',
        disclaimer: 'CRUMB on Testnet has no value. This is not money.',
        status: 'ok',
        transactions: rows,
      },
      renderReport({ status: 'ok', issuer, treasury, guest, matchId, rows }),
    )
    console.info('[phase4] wrote deployments/testnet.json and PUBLIC_TESTNET_REPORT.md')
    console.info('[phase4] CRUMB on Testnet has no value. This is not money.')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const blocked = msg.startsWith('BLOCKED:') ? msg : `BLOCKED: phase4-rehearsal: ${msg}`
    console.error(blocked)
    writeArtifacts(
      {
        network: 'testnet',
        wsUrl: XRPL_TESTNET_WS,
        faucetUrl: XRPL_TESTNET_FAUCET,
        explorerUrl: XRPL_TESTNET_EXPLORER,
        issuer: issuer || null,
        treasury: treasury || null,
        guest: guest || null,
        matchId: matchId || null,
        crumbName: 'CRUMB',
        crumbCurrency: '4352554D42000000000000000000000000000000',
        disclaimer: 'CRUMB on Testnet has no value. This is not money.',
        status: 'BLOCKED',
        blockedError: blocked,
        transactions: rows,
      },
      renderReport({
        status: 'BLOCKED',
        blockedError: blocked,
        issuer: issuer || undefined,
        treasury: treasury || undefined,
        guest: guest || undefined,
        matchId: matchId || undefined,
        rows,
      }),
    )
    process.exit(1)
  }
}

void main()
