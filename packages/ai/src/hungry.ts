import type { Pellet, Seat } from '@hhc/shared'
import {
  BEAST_OFFSET,
  NECK_BASE,
  NECK_EXTEND_SPEED,
  NECK_EXTRA,
  pelletInLane,
} from '@hhc/shared'
import { dist2, mouthPoint } from './mouth'
import type { AiPolicy, ArenaView, PolicyOptions } from './types'

const WINDUP_DUMP = 0.7
const MIN_HOLD_MS = 140
const MAX_HOLD_MS = 520
const COOLDOWN_MS = 180

function holdMsFor(pellet: Pellet, seat: Seat): number {
  const origin = BEAST_OFFSET - 0.35
  let along = 0
  switch (seat) {
    case 0:
      along = pellet.z + origin
      break
    case 1:
      along = origin - pellet.x
      break
    case 2:
      along = origin - pellet.z
      break
    case 3:
      along = pellet.x + origin
      break
  }
  const need = Math.max(0, Math.min(1, (along - NECK_BASE) / NECK_EXTRA))
  return Math.max(MIN_HOLD_MS, Math.min(MAX_HOLD_MS, (need / NECK_EXTEND_SPEED) * 1000 + 80))
}

export function createHungryPolicy(seat: Seat, _options: PolicyOptions = {}): AiPolicy {
  let down = false
  let holdUntil = 0
  let coolUntil = 0
  let targetId: string | undefined

  return {
    seat,
    personality: 'hungry',
    tick(world: ArenaView) {
      const mouth = mouthPoint(seat)
      let best: Pellet | undefined
      let bestScore = -Infinity

      for (const pellet of world.pellets) {
        if (pellet.eatenBy !== undefined) continue
        if (!pelletInLane(pellet, seat)) continue
        const closeness = 80 - Math.sqrt(dist2(pellet.x, pellet.z, mouth.x, mouth.z))
        const score = (pellet.golden ? 2.5 : 0) + closeness
        if (score > bestScore) {
          bestScore = score
          best = pellet
        }
      }

      const targetLive =
        targetId === undefined
          ? undefined
          : world.pellets.find((pellet) => pellet.id === targetId && pellet.eatenBy === undefined)

      const canWindup = world.dumpT >= WINDUP_DUMP
      let want = down

      if (down) {
        const eaten = targetId !== undefined && !targetLive
        const timedOut = world.now >= holdUntil
        want = !eaten && !timedOut
      } else if (world.now >= coolUntil && best && canWindup) {
        want = true
      }

      if (want === down) return null
      down = want
      if (down && best) {
        targetId = best.id
        holdUntil = world.now + holdMsFor(best, seat)
      } else {
        coolUntil = world.now + COOLDOWN_MS
        holdUntil = 0
        targetId = undefined
      }
      return { seat, down, clientTime: world.now }
    },
  }
}
