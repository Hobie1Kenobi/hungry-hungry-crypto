import type { Seat } from '@hhc/shared'
import { mix } from './rng'
import type { AiPolicy, ArenaView, PolicyOptions } from './types'

export function createEasyPolicy(seat: Seat, options: PolicyOptions = {}): AiPolicy {
  const rng = options.rng ?? Math.random
  let down = false
  let armed = false
  let nextFlip = 0
  const reaction = mix(rng, 240, 520)
  const landDump = 0.7

  return {
    seat,
    personality: 'easy',
    tick(world: ArenaView) {
      if (world.dumpT < landDump) return null
      if (!armed) {
        armed = true
        nextFlip = world.now + reaction
        return null
      }
      if (world.now < nextFlip) return null
      down = !down
      const hold = mix(rng, 280, 520)
      const gap = mix(rng, 360, 680)
      nextFlip = world.now + (down ? hold : gap + reaction * 0.2)
      return { seat, down, clientTime: world.now }
    },
  }
}
