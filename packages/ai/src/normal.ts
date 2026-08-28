import type { Seat } from '@hhc/shared'
import { nearestPelletToMouth } from './mouth'
import type { AiPolicy, ArenaView, PolicyOptions } from './types'

const HOLD_MS = 460
const SEARCH_HOLD_MS = 340
const COOLDOWN_MS = 480
const WINDUP_DUMP = 0.7

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
      let want = down

      if (down) {
        const timedOut = world.now >= holdUntil
        want = !timedOut
      } else if (world.now >= coolUntil && canWindup) {
        want = true
      }

      if (want === down) return null
      down = want
      if (down) {
        holdUntil = world.now + (target ? HOLD_MS : SEARCH_HOLD_MS)
      } else {
        coolUntil = world.now + COOLDOWN_MS
        holdUntil = 0
      }
      return { seat, down, clientTime: world.now }
    },
  }
}
