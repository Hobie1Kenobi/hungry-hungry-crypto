import { describe, expect, it } from 'vitest'
import type { ChompInput, Pellet, Seat } from '@hhc/shared'
import { pelletInChompZone } from '@hhc/shared'
import { createEasyPolicy } from './easy'
import { createHungryPolicy } from './hungry'
import { createIdleFill, createPracticePolicies, PRACTICE_AI_MAP, seededRng } from './fill'
import { createIdlePolicy } from './idle'
import { createNormalPolicy } from './normal'
import { simulateRound } from './simulate'
import type { AiPolicy, ArenaView } from './types'

function crumb(id: string, x: number, z: number, golden = false): Pellet {
  return { id, x, z, golden }
}

function emptyView(over: Partial<ArenaView> = {}): ArenaView {
  return {
    now: 0,
    dumpT: 0,
    timeLeft: 45,
    pellets: [],
    neckExtend: { 0: 0, 1: 0, 2: 0, 3: 0 },
    chompDown: { 0: false, 1: false, 2: false, 3: false },
    scores: { 0: 0, 1: 0, 2: 0, 3: 0 },
    ...over,
  }
}

function isChompInput(value: ChompInput): void {
  expect(Object.keys(value).sort()).toEqual(['clientTime', 'down', 'seat'])
  expect([0, 1, 2, 3]).toContain(value.seat)
  expect(typeof value.down).toBe('boolean')
  expect(typeof value.clientTime).toBe('number')
}

function createPerfectStandIn(seat: Seat): AiPolicy {
  let down = false
  return {
    seat,
    personality: 'idle',
    tick(world) {
      const want = world.pellets.some(
        (pellet) => pellet.eatenBy === undefined && pelletInChompZone(pellet, seat, 1) && world.dumpT >= 0.2,
      )
      if (want === down) return null
      down = want
      return { seat, down, clientTime: world.now }
    },
  }
}

describe('Practice AI seat map', () => {
  it('locks Easy / Normal / Hungry on RIPSAW / GOLDGRUB / BLOCKMAW', () => {
    expect(PRACTICE_AI_MAP).toEqual({ 1: 'easy', 2: 'normal', 3: 'hungry' })
  })
})

describe('ChompInput schema', () => {
  it('Easy mashes with { seat, down, clientTime }', () => {
    const bot = createEasyPolicy(1, { rng: seededRng(7) })
    const seen: ChompInput[] = []
    for (let i = 0; i < 120; i += 1) {
      const input = bot.tick(emptyView({ now: i * 16 }))
      if (input) seen.push(input)
    }
    expect(seen.length).toBeGreaterThan(2)
    for (const input of seen) {
      expect(input.seat).toBe(1)
      isChompInput(input)
    }
    expect(seen.some((i) => i.down)).toBe(true)
    expect(seen.some((i) => !i.down)).toBe(true)
  })

  it('idle dummies emit nothing', () => {
    const idle = createIdlePolicy(2)
    expect(idle.tick(emptyView({ now: 500, dumpT: 1 }))).toBeNull()
  })
})

describe('round outcomes', () => {
  it('a Hungry bot wins versus idle opponents', () => {
    const botSeat: Seat = 3
    const pellets = [
      crumb('w1', -2.2, 0),
      crumb('w2', -1.8, 0.35),
      crumb('w3', -1.55, -0.4),
      crumb('golden', 0, 0, true),
    ]
    const result = simulateRound({
      pellets,
      policies: [createHungryPolicy(botSeat), ...createIdleFill(botSeat)],
      seconds: 8,
    })
    expect(result.scores[3]).toBeGreaterThan(0)
    expect(result.scores[0]).toBe(0)
    expect(result.scores[1]).toBe(0)
    expect(result.scores[2]).toBe(0)
    expect(result.winner).toBe(3)
    expect(result.scores[3]).toBe(8)
  })

  it('a bot loses versus a perfect human stand-in', () => {
    const pellets = [
      crumb('n1', 0, -2.4),
      crumb('n2', 0.15, -2.0),
      crumb('n3', -0.2, -1.7),
      crumb('n4', 0.1, -2.8),
      crumb('n5', -0.1, -1.4),
      crumb('golden', 0, -2.2, true),
      crumb('w1', -2.1, 0.1),
    ]
    const result = simulateRound({
      pellets,
      policies: [
        createPerfectStandIn(0),
        createIdlePolicy(1),
        createIdlePolicy(2),
        createHungryPolicy(3),
      ],
      seconds: 8,
    })
    expect(result.scores[0]).toBeGreaterThan(result.scores[3])
    expect(result.winner).toBe(0)
    expect(result.scores[3]).toBeGreaterThanOrEqual(0)
  })

  it('Practice fill can post non-zero scores on AI seats', () => {
    const pellets = [
      crumb('east', 2.05, 0.05),
      crumb('south', -0.1, 2.1),
      crumb('west', -2.05, -0.08),
      crumb('golden', 0, 0, true),
    ]
    const result = simulateRound({
      pellets,
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 10,
    })
    expect(result.scores[2]).toBeGreaterThan(0)
    expect(result.scores[3]).toBeGreaterThan(0)
    expect(result.scores[1] + result.scores[2] + result.scores[3]).toBeGreaterThan(0)
  })

  it('Normal chomps the pellet nearest its mouth', () => {
    const bot = createNormalPolicy(1)
    const near = crumb('near', 1.6, 0)
    const far = crumb('far', 3.4, 0)
    const input = bot.tick(
      emptyView({
        now: 200,
        dumpT: 0.5,
        pellets: [far, near],
      }),
    )
    expect(input).toEqual({ seat: 1, down: true, clientTime: 200 })
    isChompInput(input!)
  })
})
