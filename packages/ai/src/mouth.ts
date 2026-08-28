import type { Pellet, Seat } from '@hhc/shared'
import { BEAST_OFFSET, pelletInLane } from '@hhc/shared'

export function mouthPoint(seat: Seat): { x: number; z: number } {
  const origin = BEAST_OFFSET - 0.35
  switch (seat) {
    case 0:
      return { x: 0, z: -origin }
    case 1:
      return { x: origin, z: 0 }
    case 2:
      return { x: 0, z: origin }
    case 3:
      return { x: -origin, z: 0 }
  }
}

export function dist2(ax: number, az: number, bx: number, bz: number): number {
  const dx = ax - bx
  const dz = az - bz
  return dx * dx + dz * dz
}

export function nearestPelletToMouth(pellets: readonly Pellet[], seat: Seat): Pellet | undefined {
  const mouth = mouthPoint(seat)
  let best: Pellet | undefined
  let bestD = Infinity
  for (const pellet of pellets) {
    if (pellet.eatenBy !== undefined) continue
    if (!pelletInLane(pellet, seat)) continue
    const d = dist2(pellet.x, pellet.z, mouth.x, mouth.z)
    if (d < bestD) {
      bestD = d
      best = pellet
    }
  }
  return best
}

export function clonePellet(pellet: Pellet, x: number, z: number): Pellet {
  return { id: pellet.id, x, z, golden: pellet.golden, eatenBy: pellet.eatenBy }
}
