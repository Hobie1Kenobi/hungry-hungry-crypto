import type { Pellet, Seat } from '@hhc/shared'
import {
  DUMP_SECONDS,
  ROUND_SECONDS,
  allPelletsEaten,
  applyChompInput,
  collectEats,
  emptyChomp,
  emptyNecks,
  emptyPulse,
  emptyScores,
  pelletValue,
  pickWinner,
  stepNeckExtend,
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
  let pellets = options.pellets.map((p) => ({ ...p }))
  let scores = emptyScores()
  let neckExtend = emptyNecks()
  let chompDown = emptyChomp()
  let chompPulseUntil = emptyPulse()
  let dumpT = 0
  let timeLeft = seconds
  let now = 0

  const steps = Math.ceil(seconds / dt)
  for (let i = 0; i < steps; i += 1) {
    const world = view(now, dumpT, timeLeft, pellets, neckExtend, chompDown, scores)
    for (const policy of options.policies) {
      const input = policy.tick(world)
      if (!input) continue
      const applied = applyChompInput(chompDown, chompPulseUntil, input, now)
      if (!applied) continue
      chompDown = applied.chompDown
      chompPulseUntil = applied.chompPulseUntil
    }

    dumpT = Math.min(1, dumpT + dt / DUMP_SECONDS)
    timeLeft = Math.max(0, timeLeft - dt)
    neckExtend = stepNeckExtend(neckExtend, chompDown, chompPulseUntil, now, dt)

    const hits = collectEats(pellets, neckExtend, dumpT)
    if (hits.length > 0) {
      pellets = pellets.map((p) => ({ ...p }))
      scores = { ...scores }
      for (const hit of hits) {
        const live = pellets.find((p) => p.id === hit.id)
        if (!live || live.eatenBy !== undefined) continue
        live.eatenBy = hit.seat
        scores[hit.seat] += pelletValue(live)
      }
    }

    now += dt * 1000
    if (timeLeft <= 0 || allPelletsEaten(pellets)) break
  }

  return { scores, winner: pickWinner(scores), pellets }
}
