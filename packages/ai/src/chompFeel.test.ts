import { describe, expect, it } from 'vitest'
import {
  CHOMP_HALF_WIDTH,
  CHOMP_MOUTH_DEPTH,
  CHOMP_MOUTH_PAD,
  NECK_BASE,
  NECK_EXTRA,
  ROUND_SECONDS,
  applyChompInput,
  collectEats,
  emptyChomp,
  emptyLastEat,
  emptyNecks,
  emptyPulse,
  emptyScores,
  isChompKey,
  livePelletCount,
  pelletInChompZone,
  pelletInLane,
  pickWinner,
  PRACTICE_GO_DUMP_T,
  PRACTICE_MAX_STEP_DT,
  practiceWallClock,
  mouthWorldOnPond,
  spawnPellets,
  stepArena,
  stepNeckExtend,
  visualHeadAlong,
  type ArenaSnapshot,
  type Pellet,
} from '@hhc/shared'
import { createEasyPolicy } from './easy'
import { createHungryPolicy } from './hungry'
import { createIdlePolicy } from './idle'
import { createNormalPolicy } from './normal'
import { createPracticePolicies, seededRng } from './fill'
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

function holdSeat0(): AiPolicy {
  return {
    seat: 0,
    personality: 'idle',
    tick(world) {
      if (world.chompDown[0]) return null
      return { seat: 0, down: true, clientTime: world.now }
    },
  }
}

function aiSum(scores: { 1: number; 2: number; 3: number }): number {
  return scores[1] + scores[2] + scores[3]
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
  it('does not vacuum three north chips on a single tick', () => {
    const nearBeast = crumb('near', 0, -2.5)
    const mid = crumb('mid', 0, -1.4)
    const tip = crumb('tip', 0, 0.85)
    expect(pelletInLane(nearBeast, 0)).toBe(true)
    expect(pelletInLane(mid, 0)).toBe(true)
    expect(pelletInChompZone(tip, 0, 1)).toBe(true)
    expect(pelletInChompZone(tip, 0, 0.14)).toBe(false)

    const hits = collectEats([nearBeast, mid, tip], { 0: 1, 1: 0, 2: 0, 3: 0 }, 1)
    expect(hits).toHaveLength(1)
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

  it('a Space hold during dump still eats after chips land', () => {
    const pellets = [crumb('tip', 0.1, 0.85)]
    const result = simulateRound({
      pellets,
      policies: [holdSeat0()],
      seconds: 3,
    })
    expect(result.maxNeckExtend[0]).toBeGreaterThan(0.85)
    expect(result.scores[0]).toBeGreaterThan(0)
    expect(result.pellets[0]?.eatenBy).toBe(0)
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

  it('Practice AI does not vacuum the pond in the 2s after dump land', () => {
    const pellets = spawnPellets(seededRng(99))
    const policies = () => [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })]
    const atLand = simulateRound({ pellets, policies: policies(), seconds: 2.85 })
    const later = simulateRound({ pellets, policies: policies(), seconds: 8 })
    const aiLand = aiSum(atLand.scores)
    const aiLater = aiSum(later.scores)
    const liveLand = atLand.pellets.filter((p) => p.eatenBy === undefined).length
    expect(aiLand).toBeLessThan(18)
    expect(aiLater).toBeGreaterThan(aiLand)
    expect(liveLand).toBeGreaterThan(10)
    expect(atLand.scores[2]).toBeLessThan(12)
  })

  it('a hopper refill restocks a sparse pond before the round ends', () => {
    const pellets = spawnPellets(seededRng(99))
    const result = simulateRound({
      pellets,
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 45,
    })
    const live = result.pellets.filter((p) => p.eatenBy === undefined).length
    const spawned = result.pellets.length
    expect(result.refillCount).toBeGreaterThan(0)
    expect(spawned).toBeGreaterThan(29)
    expect(live).toBeGreaterThan(0)
  })
})

describe('seat 0 human ChompInput', () => {
  it('holding chomp true extends BYTEBITE neck, eats a north chip, and scores', () => {
    const pellets = [crumb('north', 0.1, -2.5), crumb('mid', -0.15, -1.7)]
    const result = simulateRound({
      pellets,
      policies: [
        {
          seat: 0,
          personality: 'idle',
          tick(world) {
            if (world.dumpT < 0.72) return null
            if (world.chompDown[0]) return null
            return { seat: 0, down: true, clientTime: world.now }
          },
        },
      ],
      seconds: 3,
      nowOffset: 50_000,
    })
    expect(result.maxNeckExtend[0]).toBeGreaterThan(0.85)
    expect(result.scores[0]).toBeGreaterThan(0)
    expect(result.pellets.some((p) => p.eatenBy === 0)).toBe(true)
  })

  it('a continuous seat 0 CHOMP hold scores across a full practice step', () => {
    const pellets = spawnPellets(seededRng(7))
    const result = simulateRound({
      pellets,
      policies: [holdSeat0()],
      seconds: 6,
    })
    expect(result.maxNeckExtend[0]).toBeGreaterThan(0.85)
    expect(result.scores[0]).toBeGreaterThan(0)
    expect(result.pellets.some((p) => p.eatenBy === 0)).toBe(true)
  })

  it('seat 0 at extend=1 overlaps pond chips, including the north field', () => {
    const north = crumb('north-field', 0.1, -2.35)
    const mid = crumb('mid-field', -0.12, -1.18)
    const center = crumb('center', 0.08, 0)
    expect(pelletInChompZone(north, 0, 1)).toBe(true)
    expect(pelletInChompZone(mid, 0, 1)).toBe(true)
    expect(pelletInChompZone(center, 0, 1)).toBe(true)
    const pellets = spawnPellets(seededRng(7))
    expect(pellets.some((p) => pelletInChompZone(p, 0, 1))).toBe(true)
    expect(pellets.some((p) => pelletInChompZone(p, 1, 1))).toBe(true)
    expect(pellets.some((p) => pelletInChompZone(p, 2, 1))).toBe(true)
    expect(pellets.some((p) => pelletInChompZone(p, 3, 1))).toBe(true)
  })

  it('seat 0 at extend=1 overlaps the mid-pond chip cluster, same reach on every seat', () => {
    const cluster = [
      crumb('mid-0', 0, 0),
      crumb('mid-1', 0.42, -0.28),
      crumb('mid-2', -0.36, 0.22),
      crumb('mid-3', 0.12, 0.7),
      crumb('mid-4', -0.18, -0.55),
    ]
    for (const pellet of cluster) {
      expect(pelletInChompZone(pellet, 0, 1)).toBe(true)
    }
    const origin = crumb('origin', 0, 0)
    expect(pelletInChompZone(origin, 0, 1)).toBe(true)
    expect(pelletInChompZone(origin, 1, 1)).toBe(true)
    expect(pelletInChompZone(origin, 2, 1)).toBe(true)
    expect(pelletInChompZone(origin, 3, 1)).toBe(true)
    const spawned = spawnPellets(seededRng(7))
    const midPond = spawned.filter((p) => Math.abs(p.x) < 1.15 && Math.abs(p.z) < 1.15)
    expect(midPond.length).toBeGreaterThan(0)
    expect(midPond.some((p) => pelletInChompZone(p, 0, 1))).toBe(true)
  })

  it('visual head at extend=1 sits in the mid-pond pile on every seat, not at the rail', () => {
    expect(visualHeadAlong(1)).toBeGreaterThan(5)
    const north = mouthWorldOnPond(0, 1)
    const east = mouthWorldOnPond(1, 1)
    const south = mouthWorldOnPond(2, 1)
    const west = mouthWorldOnPond(3, 1)
    expect(Math.abs(north.x)).toBeLessThan(0.4)
    expect(north.z).toBeGreaterThan(-1.6)
    expect(north.z).toBeLessThan(1.8)
    expect(Math.abs(south.x)).toBeLessThan(0.4)
    expect(south.z).toBeLessThan(1.6)
    expect(south.z).toBeGreaterThan(-1.8)
    expect(east.x).toBeGreaterThan(-1.8)
    expect(east.x).toBeLessThan(1.6)
    expect(west.x).toBeLessThan(1.8)
    expect(west.x).toBeGreaterThan(-1.6)
  })

  it('a continuous seat 0 CHOMP hold eats a mid-pond pellet, not only the north rim', () => {
    const pellets = [crumb('mid-pond', 0.08, 0.06), crumb('mid-b', -0.22, -0.12)]
    const result = simulateRound({
      pellets,
      policies: [holdSeat0()],
      seconds: 4,
    })
    expect(result.maxNeckExtend[0]).toBeGreaterThan(0.85)
    expect(result.scores[0]).toBeGreaterThan(0)
    expect(result.pellets.some((p) => p.eatenBy === 0 && Math.abs(p.z) < 0.4)).toBe(true)
  })
})

describe('practice wall clock', () => {
  function blankArena(timeLeft = ROUND_SECONDS): ArenaSnapshot {
    return {
      pellets: spawnPellets(seededRng(3)),
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      lastEatAt: emptyLastEat(),
      refillCount: 0,
      lastRefillAt: 0,
      dumpT: 0,
      timeLeft,
    }
  }

  it('a 45s round ends after 45s of now even when ticks are 2fps', () => {
    const origin = 8_000
    let now = origin
    let snapshot = blankArena()
    for (let i = 0; i < 90; i += 1) {
      now += 500
      const wall = practiceWallClock(now, origin, snapshot.timeLeft)
      const stepped = stepArena(snapshot, wall.dt, now - origin)
      snapshot = { ...stepped.snapshot, timeLeft: wall.timeLeft }
    }
    expect(now - origin).toBe(45_000)
    expect(snapshot.timeLeft).toBe(0)
    expect(practiceWallClock(origin + 45_000, origin).ended).toBe(true)
  })

  it('does not crawl when rAF is starved the way a 0.05 dt cap would', () => {
    const twentyWall = practiceWallClock(20_000, 0, ROUND_SECONDS)
    expect(twentyWall.timeLeft).toBe(25)
    expect(twentyWall.elapsed).toBe(20)
    const starvedLeft = ROUND_SECONDS - 40 * 0.05
    expect(starvedLeft).toBeCloseTo(43, 5)
    expect(twentyWall.timeLeft).toBeLessThan(starvedLeft - 10)
  })

  it('a 10s hitch cannot skip 10s of dump and hopper in one step', () => {
    const hitch = practiceWallClock(10_000, 0, ROUND_SECONDS)
    expect(hitch.timeLeft).toBe(35)
    expect(hitch.elapsed).toBe(10)
    expect(hitch.dt).toBeLessThanOrEqual(PRACTICE_MAX_STEP_DT)
    expect(hitch.dt).toBeLessThan(1)
    const snapshot = blankArena()
    const stepped = stepArena(snapshot, hitch.dt, hitch.elapsed * 1000)
    expect(stepped.snapshot.dumpT).toBeLessThan(0.2)
    expect(stepped.snapshot.refillCount).toBe(0)
  })
})

describe('hopper refill', () => {
  it('fires a new dump wave once live chips drop below the refill line', () => {
    const live = [
      crumb('a', 0.2, -1.2),
      crumb('b', 1.2, 0.1),
      crumb('c', -0.1, 1.3),
      crumb('d', -1.1, 0),
      crumb('g', 0, 0, true),
    ]
    const eaten = Array.from({ length: 16 }, (_, i) => ({
      ...crumb(`gone-${i}`, 0, 0),
      eatenBy: 1 as const,
    }))
    const stepped = stepArena(
      {
        pellets: [...live, ...eaten],
        scores: emptyScores(),
        neckExtend: emptyNecks(),
        chompDown: emptyChomp(),
        chompPulseUntil: emptyPulse(),
        lastEatAt: emptyLastEat(),
        refillCount: 0,
        lastRefillAt: 0,
        dumpT: 1,
        timeLeft: 30,
      },
      1 / 60,
      1200,
    )
    expect(livePelletCount(live)).toBe(5)
    expect(stepped.snapshot.refillCount).toBe(1)
    expect(stepped.snapshot.dumpT).toBe(0)
    expect(stepped.snapshot.pellets.length).toBeGreaterThan(live.length + eaten.length)
    expect(livePelletCount(stepped.snapshot.pellets)).toBeGreaterThan(20)
  })

  it('initial dump covers the pond as a field, not a thin center strip', () => {
    const pellets = spawnPellets(seededRng(99))
    expect(pellets).toHaveLength(29)
    const xs = pellets.map((p) => p.x)
    const zs = pellets.map((p) => p.z)
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(4)
    expect(Math.max(...zs) - Math.min(...zs)).toBeGreaterThan(4)
    expect(pellets.filter((p) => Math.abs(p.x) > 1.4).length).toBeGreaterThan(6)
    expect(pellets.filter((p) => Math.abs(p.z) > 1.4).length).toBeGreaterThan(6)
  })

  it('Practice GO already has dumpT landed and chips on four floor lanes', () => {
    expect(PRACTICE_GO_DUMP_T).toBe(1)
    const pellets = spawnPellets(seededRng(99))
    const north = pellets.filter((p) => pelletInLane(p, 0) && p.z < -1.4)
    const east = pellets.filter((p) => pelletInLane(p, 1) && p.x > 1.4)
    const south = pellets.filter((p) => pelletInLane(p, 2) && p.z > 1.4)
    const west = pellets.filter((p) => pelletInLane(p, 3) && p.x < -1.4)
    expect(north.length).toBeGreaterThan(3)
    expect(east.length).toBeGreaterThan(3)
    expect(south.length).toBeGreaterThan(3)
    expect(west.length).toBeGreaterThan(3)
    const stepped = stepArena(
      {
        pellets,
        scores: emptyScores(),
        neckExtend: emptyNecks(),
        chompDown: emptyChomp(),
        chompPulseUntil: emptyPulse(),
        lastEatAt: emptyLastEat(),
        refillCount: 0,
        lastRefillAt: 0,
        dumpT: PRACTICE_GO_DUMP_T,
        timeLeft: ROUND_SECONDS,
      },
      1 / 60,
      0,
    )
    expect(stepped.snapshot.dumpT).toBe(1)
    expect(livePelletCount(stepped.snapshot.pellets)).toBe(29)
  })

  it('a short hold reaches full neck extend on every seat without changing eat AABBs', () => {
    const down = { 0: true, 1: true, 2: true, 3: true } as const
    const next = stepNeckExtend(emptyNecks(), down, emptyPulse(), 0, 0.16)
    expect(next[0]).toBeGreaterThan(0.95)
    expect(next[1]).toBeCloseTo(next[0])
    expect(next[2]).toBeCloseTo(next[0])
    expect(next[3]).toBeCloseTo(next[0])
    expect(CHOMP_HALF_WIDTH).toBe(1.55)
    expect(CHOMP_MOUTH_DEPTH).toBe(4.35)
    expect(CHOMP_MOUTH_PAD).toBe(0.28)
    expect(NECK_BASE).toBe(0.95)
    expect(NECK_EXTRA).toBe(5.55)
  })

  it('initial dump seeds a lane in front of each mouth, not one center blob', () => {
    const pellets = spawnPellets(seededRng(99))
    const north = pellets.filter((p) => pelletInLane(p, 0) && p.z < -1.4)
    const east = pellets.filter((p) => pelletInLane(p, 1) && p.x > 1.4)
    const south = pellets.filter((p) => pelletInLane(p, 2) && p.z > 1.4)
    const west = pellets.filter((p) => pelletInLane(p, 3) && p.x < -1.4)
    expect(north.length).toBeGreaterThan(3)
    expect(east.length).toBeGreaterThan(3)
    expect(south.length).toBeGreaterThan(3)
    expect(west.length).toBeGreaterThan(3)
    const centerOnly = pellets.filter((p) => Math.abs(p.x) < 0.9 && Math.abs(p.z) < 0.9)
    expect(centerOnly.length).toBeLessThan(10)
    expect(north.some((p) => p.z < -3.1)).toBe(true)
    expect(east.some((p) => p.x > 3.1)).toBe(true)
    expect(south.some((p) => p.z > 3.1)).toBe(true)
    expect(west.some((p) => p.x < -3.1)).toBe(true)
  })

  it('pickWinner on equal 22s returns seat 0', () => {
    expect(pickWinner({ 0: 22, 1: 16, 2: 22, 3: 22 })).toBe(0)
    expect(pickWinner({ 0: 22, 1: 22, 2: 22, 3: 22 })).toBe(0)
    expect(pickWinner({ 0: 21, 1: 22, 2: 22, 3: 16 })).toBe(1)
  })

  it('dump and refill leave chips in four lanes — x/z do not collapse to a center blob', () => {
    const start = spawnPellets(seededRng(99)).map((p) => ({ ...p }))
    let snapshot: ArenaSnapshot = {
      pellets: start.map((p) => ({ ...p })),
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      lastEatAt: emptyLastEat(),
      refillCount: 0,
      lastRefillAt: 0,
      dumpT: 0,
      timeLeft: 30,
    }
    for (let i = 0; i < 90; i += 1) {
      snapshot = stepArena(snapshot, 1 / 60, i * (1000 / 60)).snapshot
    }
    for (const pellet of snapshot.pellets) {
      if (!pellet.id.startsWith('crumb-')) continue
      const born = start.find((p) => p.id === pellet.id)
      if (!born) continue
      expect(pellet.x).toBe(born.x)
      expect(pellet.z).toBe(born.z)
    }
    expect(snapshot.pellets.filter((p) => pelletInLane(p, 0) && p.z < -1.4).length).toBeGreaterThan(3)
    expect(snapshot.pellets.filter((p) => pelletInLane(p, 1) && p.x > 1.4).length).toBeGreaterThan(3)
    expect(snapshot.pellets.filter((p) => pelletInLane(p, 2) && p.z > 1.4).length).toBeGreaterThan(3)
    expect(snapshot.pellets.filter((p) => pelletInLane(p, 3) && p.x < -1.4).length).toBeGreaterThan(3)
    const live = snapshot.pellets.filter((p) => p.eatenBy === undefined)
    expect(live.filter((p) => Math.abs(p.x) < 0.9 && Math.abs(p.z) < 0.9).length).toBeLessThan(10)
  })
})

describe('AI nibble through the round', () => {
  it('Easy / Normal / Hungry keep releasing and scoring after the opening', () => {
    const result = simulateRound({
      pellets: spawnPellets(seededRng(99)),
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 45,
    })
    expect(result.scoresAt[12]).toBeDefined()
    expect(result.scoresAt[22]).toBeDefined()
    expect(result.scoresAt[30]).toBeDefined()
    expect(result.scoresAt[35]).toBeDefined()
    expect(aiSum(result.scoresAt[12]!)).toBeGreaterThan(aiSum(result.scoresAt[8]!))
    expect(aiSum(result.scoresAt[20]!)).toBeGreaterThan(aiSum(result.scoresAt[12]!))
    expect(aiSum(result.scoresAt[35]!)).toBeGreaterThan(aiSum(result.scoresAt[22]!))
    expect(result.chompFlips[1]).toBeGreaterThan(10)
    expect(result.chompFlips[2]).toBeGreaterThan(10)
    expect(result.chompFlips[3]).toBeGreaterThan(10)
    expect(result.chompFlipsAfter22[1]).toBeGreaterThan(0)
    expect(result.chompFlipsAfter22[2]).toBeGreaterThan(0)
    expect(result.chompFlipsAfter22[3]).toBeGreaterThan(0)
    expect(aiSum(result.scoresAt[20]!)).toBeLessThan(90)
    const opening = simulateRound({
      pellets: spawnPellets(seededRng(99)),
      policies: [createIdlePolicy(0), ...createPracticePolicies({ rng: seededRng(11) })],
      seconds: 22,
    })
    expect(opening.refillCount).toBeLessThan(6)
    expect(result.refillCount).toBeGreaterThan(opening.refillCount)
  })

  it('hopper dumpT reset re-arms Easy / Normal / Hungry instead of freezing them', () => {
    const easy = createEasyPolicy(1, { rng: seededRng(3) })
    const normal = createNormalPolicy(2)
    const hungry = createHungryPolicy(3)
    const pellets = [crumb('east', 2.0, 0), crumb('south', 0, 2.0), crumb('west', -2.0, 0)]
    const land = emptyView({ now: 2000, dumpT: 0.95, pellets })
    expect(easy.tick(land) ?? easy.tick({ ...land, now: 2800 })).toMatchObject({ seat: 1, down: true })
    expect(normal.tick(land)).toMatchObject({ seat: 2, down: true })
    expect(hungry.tick(land)).toMatchObject({ seat: 3, down: true })

    const dump = emptyView({ now: 3200, dumpT: 0.2, pellets, chompDown: { 0: false, 1: true, 2: true, 3: true } })
    expect(easy.tick(dump)).toMatchObject({ seat: 1, down: false })
    expect(normal.tick(dump)).toMatchObject({ seat: 2, down: false })
    expect(hungry.tick(dump)).toMatchObject({ seat: 3, down: false })
    expect(easy.tick(dump)).toBeNull()
    expect(normal.tick({ ...dump, now: 4000 })).toBeNull()
    expect(hungry.tick({ ...dump, now: 4000 })).toBeNull()

    const reland = emptyView({ now: 5200, dumpT: 0.95, pellets, chompDown: { 0: false, 1: false, 2: false, 3: false } })
    const later = emptyView({ now: 6200, dumpT: 0.95, pellets, chompDown: { 0: false, 1: false, 2: false, 3: false } })
    const easyAgain = easy.tick(reland) ?? easy.tick(later)
    const normalAgain = normal.tick(reland) ?? normal.tick(later)
    const hungryAgain = hungry.tick(reland) ?? hungry.tick(later)
    expect(easyAgain).toMatchObject({ seat: 1, down: true })
    expect(normalAgain).toMatchObject({ seat: 2, down: true })
    expect(hungryAgain).toMatchObject({ seat: 3, down: true })
  })
})
