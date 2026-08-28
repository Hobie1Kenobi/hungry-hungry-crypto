import type { Pellet, Seat } from '@hhc/shared'
import {
  ROUND_SECONDS,
  applyChompInput,
  emptyChomp,
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
}

export interface SimulateResult {
  scores: Record<Seat, number>
  winner: Seat
  pellets: Pellet[]
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

export function simulateRound(options: SimulateOptions): SimulateResult {
  const dt = options.dt ?? 1 / 60
  const seconds = options.seconds ?? ROUND_SECONDS
  let snapshot = {
    pellets: options.pellets.map((p) => ({ ...p })),
    scores: emptyScores(),
    neckExtend: emptyNecks(),
    chompDown: emptyChomp(),
    chompPulseUntil: emptyPulse(),
    dumpT: 0,
    timeLeft: seconds,
  }
  let now = 0

  const steps = Math.ceil(seconds / dt)
  for (let i = 0; i < steps; i += 1) {
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
      snapshot = {
        ...snapshot,
        chompDown: applied.chompDown,
        chompPulseUntil: applied.chompPulseUntil,
      }
    }

    const stepped = stepArena(snapshot, dt, now)
    snapshot = stepped.snapshot
    now += dt * 1000
    if (stepped.ended) break
  }

  return { scores: snapshot.scores, winner: pickWinner(snapshot.scores), pellets: snapshot.pellets }
}
