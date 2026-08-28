import type { Pellet, Seat } from '@hhc/shared'
import {
  ROUND_SECONDS,
  SEATS,
  applyChompInput,
  emptyChomp,
  emptyLastEat,
  emptyNecks,
  emptyPulse,
  emptyScores,
  pickWinner,
  stepArena,
} from '@hhc/shared'
import type { AiPolicy, ArenaView } from './types'

export interface SimulateOptions {
  pellets: Pellet[]
  policies: AiPolicy[]
  seconds?: number
  dt?: number
  nowOffset?: number
}

export interface SimulateResult {
  scores: Record<Seat, number>
  winner: Seat
  pellets: Pellet[]
  maxNeckExtend: Record<Seat, number>
  refillCount: number
  chompFlips: Record<Seat, number>
  scoresAt: Record<number, Record<Seat, number>>
}

function view(
  now: number,
  dumpT: number,
  timeLeft: number,
  pellets: Pellet[],
  neckExtend: Record<Seat, number>,
  chompDown: Record<Seat, boolean>,
  scores: Record<Seat, number>,
): ArenaView {
  return { now, dumpT, timeLeft, pellets, neckExtend, chompDown, scores }
}

function copyScores(scores: Record<Seat, number>): Record<Seat, number> {
  return { 0: scores[0], 1: scores[1], 2: scores[2], 3: scores[3] }
}

export function simulateRound(options: SimulateOptions): SimulateResult {
  const dt = options.dt ?? 1 / 60
  const seconds = options.seconds ?? ROUND_SECONDS
  const nowOffset = options.nowOffset ?? 0
  let snapshot = {
    pellets: options.pellets.map((p) => ({ ...p })),
    scores: emptyScores(),
    neckExtend: emptyNecks(),
    chompDown: emptyChomp(),
    chompPulseUntil: emptyPulse(),
    lastEatAt: emptyLastEat(),
    refillCount: 0,
    lastRefillAt: 0,
    dumpT: 0,
    timeLeft: seconds,
  }
  let now = nowOffset
  const maxNeckExtend = emptyNecks()
  const chompFlips: Record<Seat, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }
  const scoresAt: Record<number, Record<Seat, number>> = {}
  const sampleMarks = [8, 12, 20, 30, 40]
  let sampleIdx = 0

  const steps = Math.ceil(seconds / dt)
  for (let i = 0; i < steps; i += 1) {
    const elapsed = now - nowOffset
    const world = view(
      now,
      snapshot.dumpT,
      snapshot.timeLeft,
      snapshot.pellets,
      snapshot.neckExtend,
      snapshot.chompDown,
      snapshot.scores,
    )
    for (const policy of options.policies) {
      const input = policy.tick(world)
      if (!input) continue
      const applied = applyChompInput(snapshot.chompDown, snapshot.chompPulseUntil, input, now)
      if (!applied) continue
      chompFlips[input.seat] += 1
      snapshot = {
        ...snapshot,
        chompDown: applied.chompDown,
        chompPulseUntil: applied.chompPulseUntil,
      }
    }

    const stepped = stepArena(snapshot, dt, now)
    snapshot = stepped.snapshot
    for (const seat of SEATS) {
      if (snapshot.neckExtend[seat] > maxNeckExtend[seat]) maxNeckExtend[seat] = snapshot.neckExtend[seat]
    }
    const tSec = (elapsed + dt * 1000) / 1000
    while (sampleIdx < sampleMarks.length && tSec >= sampleMarks[sampleIdx]) {
      scoresAt[sampleMarks[sampleIdx]] = copyScores(snapshot.scores)
      sampleIdx += 1
    }
    now += dt * 1000
    if (stepped.ended) break
  }

  return {
    scores: snapshot.scores,
    winner: pickWinner(snapshot.scores),
    pellets: snapshot.pellets,
    maxNeckExtend,
    refillCount: snapshot.refillCount,
    chompFlips,
    scoresAt,
  }
}
