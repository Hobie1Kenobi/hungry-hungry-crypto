import { describe, expect, it } from 'vitest'
import { clampClientTime, planSeats } from '@hhc/shared'
import { generateCode, lookupRoomId, normalizeCode, registerRoomCode, resetCodesForTests, unregisterRoom } from './rooms/codes'
import { resetSettlementsForTests, settleMatch } from './settle/settleMatch'

describe('4-seat fill', () => {
  it('fills empty seats with AI after humans take seats first', () => {
    const seats = planSeats([0])
    expect(seats).toHaveLength(4)
    expect(seats[0]).toMatchObject({ seat: 0, kind: 'human' })
    expect(seats[1]).toMatchObject({ seat: 1, kind: 'ai', personality: 'easy' })
    expect(seats[2]).toMatchObject({ seat: 2, kind: 'ai', personality: 'normal' })
    expect(seats[3]).toMatchObject({ seat: 3, kind: 'ai', personality: 'hungry' })
  })

  it('keeps later seats human when more players join', () => {
    const seats = planSeats([0, 1], { 0: 'a', 1: 'b' })
    expect(seats.filter((s) => s.kind === 'human')).toHaveLength(2)
    expect(seats.filter((s) => s.kind === 'ai')).toHaveLength(2)
    expect(seats[0].sessionId).toBe('a')
    expect(seats[1].sessionId).toBe('b')
  })
})

describe('desync tolerance', () => {
  it('replaces wildly skewed clientTime with server now', () => {
    expect(clampClientTime(12, 1_700_000_000_000)).toBe(1_700_000_000_000)
    expect(clampClientTime(1000, 1100)).toBe(1000)
    expect(clampClientTime(Number.NaN, 50)).toBe(50)
  })
})

describe('settleMatch stub', () => {
  it('records matchId, four address slots, and seat map without XRPL submits', () => {
    resetSettlementsForTests()
    const record = settleMatch(
      {
        matchId: 'hhc-test',
        scores: { 0: 3, 1: 1, 2: 2, 3: 8 },
        addresses: {},
        winner: 3,
        txHashes: [],
      },
      planSeats([0]),
    )
    expect(record.matchId).toBe('hhc-test')
    expect(record.addresses).toEqual({ 0: null, 1: null, 2: null, 3: null })
    expect(record.seatMap).toHaveLength(4)
    expect(record.xrplSubmitted).toBe(false)
    expect(record.txHashes).toEqual([])
  })

  it('records a bound classic address without submitting XRPL settlement', () => {
    resetSettlementsForTests()
    const record = settleMatch(
      {
        matchId: 'hhc-bound',
        scores: { 0: 1, 1: 0, 2: 0, 3: 0 },
        addresses: { 0: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe' },
        winner: 0,
        txHashes: [],
      },
      planSeats([0]),
    )
    expect(record.addresses[0]).toBe('rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe')
    expect(record.addresses[1]).toBeNull()
    expect(record.xrplSubmitted).toBe(false)
    expect(record.txHashes).toEqual([])
  })
})

describe('private room codes', () => {
  it('registers and looks up a room id', () => {
    resetCodesForTests()
    const code = generateCode()
    expect(code).toMatch(/^[A-Z0-9]{5,}$/)
    registerRoomCode(code, 'room-1')
    expect(lookupRoomId(code.toLowerCase())).toBe('room-1')
    expect(normalizeCode(` ${code} `)).toBe(code)
    unregisterRoom('room-1')
    expect(lookupRoomId(code)).toBeUndefined()
  })
})
