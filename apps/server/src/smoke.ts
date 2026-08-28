process.env.HHC_ALLOW_SHORT_ROUNDS = process.env.HHC_ALLOW_SHORT_ROUNDS ?? '1'

import { Client } from 'colyseus.js'
import { ROOM_NAME } from '@hhc/shared'
import { startServer } from './app'
import { getSettlement, resetSettlementsForTests } from './settle/settleMatch'
import { resetCodesForTests } from './rooms/codes'

function onceMessage<T>(room: { onMessage: (type: string, cb: (payload: T) => void) => void }, type: string, ms = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timed out waiting for ${type}`)), ms)
    room.onMessage(type, (payload) => {
      clearTimeout(t)
      resolve(payload)
    })
  })
}

async function main(): Promise<void> {
  resetCodesForTests()
  resetSettlementsForTests()
  const started = await startServer(0)
  const url = `ws://127.0.0.1:${started.port}`
  console.info(`[smoke] server ${url} room=${ROOM_NAME}`)

  try {
    const health = await fetch(`http://127.0.0.1:${started.port}/health`)
    const healthBody = (await health.json()) as { ok: boolean; room: string; xrplWrites: boolean }
    if (!healthBody.ok || healthBody.room !== ROOM_NAME || healthBody.xrplWrites !== false) {
      throw new Error(`health check failed: ${JSON.stringify(healthBody)}`)
    }
    const cfg = await fetch(`http://127.0.0.1:${started.port}/xrpl/config`)
    const cfgBody = (await cfg.json()) as { network: string; wsUrl: string }
    if (cfgBody.network !== 'testnet' || cfgBody.wsUrl !== 'wss://s.altnet.rippletest.net:51233') {
      throw new Error(`xrpl config failed: ${JSON.stringify(cfgBody)}`)
    }

    const client = new Client(url)
    const room = await client.joinOrCreate(ROOM_NAME, { fillMs: 0, roundSeconds: 1.5 })
    room.onMessage('welcome', () => {})
    room.onMessage('lobby', () => {})
    room.onMessage('frame', () => {})
    const start = await onceMessage<{
      matchId: string
      seats: Array<{ seat: number; kind: string }>
    }>(room, 'matchStart')

    const humans = start.seats.filter((s) => s.kind === 'human')
    const ai = start.seats.filter((s) => s.kind === 'ai')
    if (start.seats.length !== 4 || humans.length !== 1 || ai.length !== 3) {
      throw new Error(`expected 1 human + 3 AI, got ${JSON.stringify(start.seats)}`)
    }
    console.info(`[smoke] matchStart ${start.matchId} seats=${start.seats.map((s) => `${s.seat}:${s.kind}`).join(',')}`)

    const result = await onceMessage<{
      matchId: string
      txHashes: string[]
      winner: number
      scores: Record<number, number>
    }>(room, 'matchEnd')
    if (result.matchId !== start.matchId) throw new Error('matchId mismatch')
    if (!Array.isArray(result.txHashes) || result.txHashes.length !== 0) {
      throw new Error(`txHashes must be [], got ${JSON.stringify(result.txHashes)}`)
    }
    const recorded = getSettlement(result.matchId)
    if (!recorded || recorded.xrplSubmitted !== false || recorded.txHashes.length !== 0) {
      throw new Error(`settleMatch stub failed: ${JSON.stringify(recorded)}`)
    }
    if (recorded.addresses[0] !== null || recorded.seatMap.length !== 4) {
      throw new Error('settleMatch must record 4 address slots and seat map')
    }
    console.info(`[smoke] matchEnd winner=${result.winner} txHashes=[] settle recorded`)
    room.leave()

    const host = new Client(url)
    const created = await host.create(ROOM_NAME, { mode: 'private', fillMs: 4000, roundSeconds: 1 })
    created.onMessage('lobby', () => {})
    created.send('hello')
    const welcome = await onceMessage<{ roomCode: string; seat: number }>(created, 'welcome')
    const code = welcome.roomCode || String(created.state.code ?? '')
    if (code.length < 5) throw new Error(`expected private code, got ${code}`)
    const lookup = await fetch(`http://127.0.0.1:${started.port}/rooms/${code}`)
    if (!lookup.ok) throw new Error(`GET /rooms/${code} failed`)
    const body = (await lookup.json()) as { roomId: string }
    if (body.roomId !== created.roomId) throw new Error('code lookup roomId mismatch')
    const guest = new Client(url)
    const joined = await guest.joinById(body.roomId, { mode: 'private' })
    joined.onMessage('welcome', () => {})
    joined.onMessage('lobby', () => {})
    if (joined.roomId !== created.roomId) throw new Error('joinById mismatch')
    console.info(`[smoke] private code ${code} joined by second human`)
    created.leave()
    joined.leave()

    const identified = await new Client(url).joinOrCreate(ROOM_NAME, {
      address: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe',
      fillMs: 12_000,
      roundSeconds: 1,
    })
    identified.onMessage('welcome', () => {})
    identified.onMessage('lobby', () => {})
    await new Promise((r) => setTimeout(r, 80))
    const bound = [...identified.state.seats].find((s) => s.sessionId === identified.sessionId)
    if (!bound || bound.address !== 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe') {
      throw new Error(`expected seat bind, got ${JSON.stringify(bound)}`)
    }
    identified.leave()

    console.info('[smoke] ok — 1 human + 3 AI round, private room code, r-address seat bind, no settlement writes')
  } finally {
    await started.shutdown()
  }
}

main().catch((err) => {
  console.error('[smoke] failed', err)
  process.exit(1)
})
