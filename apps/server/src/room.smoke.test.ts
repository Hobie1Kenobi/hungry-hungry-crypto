import { afterEach, describe, expect, it } from 'vitest'
import { Client } from 'colyseus.js'
import { ROOM_NAME } from '@hhc/shared'
import { startServer, type StartedServer } from './app'
import { resetCodesForTests } from './rooms/codes'
import { getSettlement, resetSettlementsForTests } from './settle/settleMatch'

async function waitFor<T>(label: string, fn: () => T | undefined, timeoutMs = 8000): Promise<T> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const value = fn()
    if (value !== undefined) return value
    await new Promise((r) => setTimeout(r, 25))
  }
  throw new Error(`timed out waiting for ${label}`)
}

describe('HungryRoom smoke', () => {
  let started: StartedServer | undefined

  afterEach(async () => {
    if (started) {
      await started.shutdown()
      started = undefined
    }
    resetCodesForTests()
    resetSettlementsForTests()
  })

  it('1 human + 3 AI complete a round with empty txHashes', async () => {
    started = await startServer(0)
    const client = new Client(`ws://127.0.0.1:${started.port}`)
    const room = await client.joinOrCreate(ROOM_NAME, { fillMs: 0, roundSeconds: 1.5 })

    const start = await new Promise<{ matchId: string; seats: Array<{ seat: number; kind: string }> }>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('no matchStart')), 5000)
      room.onMessage('matchStart', (payload) => {
        clearTimeout(t)
        resolve(payload)
      })
    })

    expect(start.matchId).toBeTruthy()
    expect(start.seats).toHaveLength(4)
    expect(start.seats.filter((s) => s.kind === 'human')).toHaveLength(1)
    expect(start.seats.filter((s) => s.kind === 'ai')).toHaveLength(3)
    expect(start.seats.map((s) => s.seat).sort()).toEqual([0, 1, 2, 3])

    const result = await new Promise<{
      matchId: string
      scores: Record<number, number>
      winner: number
      txHashes: string[]
      addresses: Record<string, unknown>
    }>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('no matchEnd')), 8000)
      room.onMessage('matchEnd', (payload) => {
        clearTimeout(t)
        resolve(payload)
      })
    })

    expect(result.matchId).toBe(start.matchId)
    expect(result.txHashes).toEqual([])
    expect([0, 1, 2, 3]).toContain(result.winner)
    expect(result.scores[0] + result.scores[1] + result.scores[2] + result.scores[3]).toBeGreaterThanOrEqual(0)

    const recorded = await waitFor('settlement', () => getSettlement(result.matchId))
    expect(recorded.xrplSubmitted).toBe(false)
    expect(recorded.txHashes).toEqual([])
    expect(recorded.addresses).toEqual({ 0: null, 1: null, 2: null, 3: null })
    expect(recorded.seatMap).toHaveLength(4)

    room.leave()
  })

  it('private room code lets a second human join before AI fill', async () => {
    started = await startServer(0)
    const host = new Client(`ws://127.0.0.1:${started.port}`)
    const created = await host.create(ROOM_NAME, { mode: 'private', fillMs: 4000, roundSeconds: 1 })
    const code = created.state.code as string
    expect(code.length).toBeGreaterThanOrEqual(5)

    const lookup = await fetch(`http://127.0.0.1:${started.port}/rooms/${code}`)
    expect(lookup.ok).toBe(true)
    const body = (await lookup.json()) as { roomId: string }
    expect(body.roomId).toBe(created.roomId)

    const guest = new Client(`ws://127.0.0.1:${started.port}`)
    const joined = await guest.joinById(body.roomId, { mode: 'private' })
    expect(joined.roomId).toBe(created.roomId)

    const humans = [...created.state.seats].filter((s) => s.kind === 'human')
    expect(humans.length).toBeGreaterThanOrEqual(2)

    created.leave()
    joined.leave()
  })
})
