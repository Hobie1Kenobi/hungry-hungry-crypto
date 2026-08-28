import { describe, expect, it } from 'vitest'
import {
  applyChompInput,
  collectEats,
  emptyChomp,
  emptyNecks,
  emptyPulse,
  isChompKey,
  pelletInChompZone,
  pelletInLane,
  spawnPellets,
  type Pellet,
} from '@hhc/shared'
import { createEasyPolicy } from './easy'
import { createHungryPolicy } from './hungry'
import { createIdlePolicy } from './idle'
import { createPracticePolicies, seededRng } from './fill'
import { simulateRound } from './simulate'
import type { ArenaView } from './types'

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

describe('Space CHOMP wiring', () => {
  it('treats Space keydown/keyup as a ChompInput edge', () => {
    expect(isChompKey('Space', ' ')).toBe(true)
    expect(isChompKey('Space', 'Spacebar')).toBe(true)
    expect(isChompKey('KeyA', 'a')).toBe(false)
    const down = applyChompInput(emptyChomp(), emptyPulse(), { seat: 0, down: true, clientTime: 10 }, 10)
    expect(down?.started).toBe(true)
    expect(down?.chompDown[0]).toBe(true)
    const up = applyChompInput(down!.chompDown, down!.chompPulseUntil, { seat: 0, down: false, clientTime: 20 }, 20)
    expect(up?.chompDown[0]).toBe(false)
    expect(up?.chompPulseUntil[0]).toBeGreaterThan(20)
  })
})

describe('jaw-local eats', () => {
  it('does not treat the whole north lane as the BYTEBITE mouth', () => {
    const nearBeast = crumb('near', 0, -2.5)
    const mid = crumb('mid', 0, -1.4)
    const tip = crumb('tip', 0, 0.85)
    expect(pelletInLane(nearBeast, 0)).toBe(true)
    expect(pelletInLane(mid, 0)).toBe(true)
    expect(pelletInChompZone(nearBeast, 0, 1)).toBe(false)
    expect(pelletInChompZone(mid, 0, 1)).toBe(false)
    expect(pelletInChompZone(tip, 0, 1)).toBe(true)

    const hits = collectEats([nearBeast, mid, tip], { 0: 1, 1: 0, 2: 0, 3: 0 }, 1)
    expect(hits.map((h) => h.id)).toEqual(['tip'])
  })

  it('ignores eats until chips have landed', () => {
    const tip = crumb('tip', 0, 0.85)
    const fullNorth = { ...emptyNecks(), 0: 1 }
    expect(collectEats([tip], fullNorth, 0.3)).toEqual([])
    expect(collectEats([tip], fullNorth, 0.8)).toEqual([{ id: 'tip', seat: 0 }])
  })
})

describe('AI chomp timing', () => {
  it('Hungry and Easy stay quiet during the dump', () => {
    const pellets = [crumb('west', -2.2, 0)]
    const hungry = createHungryPolicy(3)
    const easy = createEasyPolicy(1, { rng: seededRng(3) })
    const dump = emptyView({ now: 80, dumpT: 0.2, pellets })
    expect(hungry.tick(dump)).toBeNull()
    expect(easy.tick(dump)).toBeNull()
  })

  it('BYTEBITE can eat a north-lane chip with a short ChompInput hold', () => {
    const pellets = [crumb('north', 0.1, -2.5)]
    const result = simulateRound({
      pellets,
      policies: [
        {
          seat: 0,
          personality: 'idle',
          tick(world) {
            if (world.dumpT < 0.72) return null
            if (world.now < 900 && !world.chompDown[0]) {
              return { seat: 0, down: true, clientTime: world.now }
            }
            if (world.now >= 1200 && world.chompDown[0]) {
              return { seat: 0, down: false, clientTime: world.now }
            }
            return null
          },
        },
      ],
      seconds: 3,
    })
    expect(result.scores[0]).toBeGreaterThan(0)
    expect(result.pellets[0]?.eatenBy).toBe(0)
  })

  it('Practice AI scores accrue after landing, not on the first half-second', () => {
    const pellets = spawnPellets(seededRng(99))
    const early = simulateRound({
      pellets,
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 0.55,
    })
    const later = simulateRound({
      pellets,
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 8,
    })
    const earlyAi = early.scores[1] + early.scores[2] + early.scores[3]
    const laterAi = later.scores[1] + later.scores[2] + later.scores[3]
    expect(earlyAi).toBe(0)
    expect(laterAi).toBeGreaterThan(earlyAi)
    expect(later.scores[1] === 15 && later.scores[2] === 2 && later.scores[3] === 3).toBe(false)
  })
})
