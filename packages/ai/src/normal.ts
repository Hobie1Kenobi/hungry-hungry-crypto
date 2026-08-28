import type { Seat } from '@hhc/shared'
import { nearestPelletToMouth } from './mouth'
import type { AiPolicy, ArenaView, PolicyOptions } from './types'

const HOLD_MS = 170
const COOLDOWN_MS = 320
const WINDUP_DUMP = 0.22

export function createNormalPolicy(seat: Seat, _options: PolicyOptions = {}): AiPolicy {
  let down = false
  let holdUntil = 0
  let coolUntil = 0

  return {
    seat,
    personality: 'normal',
    tick(world: ArenaView) {
      const target = nearestPelletToMouth(world.pellets, seat)
      const canWindup = world.dumpT >= WINDUP_DUMP
      let want = false

      if (world.now < coolUntil && !down) {
        want = false
      } else if (down && world.now < holdUntil) {
        const stillThere = target !== undefined
        want = stillThere
      } else if (target && canWindup) {
        want = true
      }

      if (want === down) return null
      down = want
      if (down) {
        holdUntil = world.now + HOLD_MS
      } else {
        coolUntil = world.now + COOLDOWN_MS
        holdUntil = 0
      }
      return { seat, down, clientTime: world.now }
    },
  }
}
