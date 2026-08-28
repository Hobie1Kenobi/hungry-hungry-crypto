import type { Pellet, Seat } from '@hhc/shared'
import { DUMP_SECONDS, pelletInChompZone } from '@hhc/shared'
import { clonePellet, dist2, mouthPoint } from './mouth'
import type { AiPolicy, ArenaView, PolicyOptions } from './types'

const LOOK_AHEAD = 0.14
const WINDUP_DUMP = 0.16

interface Track {
  x: number
  z: number
  t: number
}

function easeDump(t: number): number {
  const u = Math.max(0, Math.min(1, t))
  return 1 - (1 - u) * (1 - u)
}

function velocity(prev: Track | undefined, pellet: Pellet, now: number): { vx: number; vz: number } {
  if (!prev || now <= prev.t) return { vx: 0, vz: 0 }
  const dt = (now - prev.t) / 1000
  if (dt < 1 / 240) return { vx: 0, vz: 0 }
  return { vx: (pellet.x - prev.x) / dt, vz: (pellet.z - prev.z) / dt }
}

function predict(pellet: Pellet, dumpT: number, vx: number, vz: number, lookAhead: number): Pellet {
  if (dumpT < 1) {
    const futureDump = Math.min(1, dumpT + lookAhead / DUMP_SECONDS)
    const eased = easeDump(futureDump)
    return clonePellet(pellet, pellet.x * eased, pellet.z * eased)
  }
  return clonePellet(pellet, pellet.x + vx * lookAhead, pellet.z + vz * lookAhead)
}

function reachableSoon(pellet: Pellet, seat: Seat, dumpT: number, vx: number, vz: number): boolean {
  if (pelletInChompZone(pellet, seat, 1)) return true
  const projected = predict(pellet, dumpT, vx, vz, LOOK_AHEAD)
  return pelletInChompZone(projected, seat, 1)
}

export function createHungryPolicy(seat: Seat, _options: PolicyOptions = {}): AiPolicy {
  const tracks = new Map<string, Track>()
  let down = false

  return {
    seat,
    personality: 'hungry',
    tick(world: ArenaView) {
      const mouth = mouthPoint(seat)
      let best: Pellet | undefined
      let bestScore = -Infinity

      for (const pellet of world.pellets) {
        if (pellet.eatenBy !== undefined) continue
        const prev = tracks.get(pellet.id)
        const { vx, vz } = velocity(prev, pellet, world.now)
        tracks.set(pellet.id, { x: pellet.x, z: pellet.z, t: world.now })
        if (!reachableSoon(pellet, seat, world.dumpT, vx, vz)) continue
        const projected = predict(pellet, world.dumpT, vx, vz, LOOK_AHEAD)
        const closeness = 80 - Math.sqrt(dist2(projected.x, projected.z, mouth.x, mouth.z))
        const score = (pellet.golden ? 10_000 : 0) + closeness
        if (score > bestScore) {
          bestScore = score
          best = pellet
        }
      }

      for (const id of [...tracks.keys()]) {
        if (!world.pellets.some((p) => p.id === id)) tracks.delete(id)
      }

      const want = Boolean(best) && world.dumpT >= WINDUP_DUMP
      if (want === down) return null
      down = want
      return { seat, down, clientTime: world.now }
    },
  }
}
