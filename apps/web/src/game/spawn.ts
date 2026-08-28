import type { Pellet } from '@hhc/shared'
import { GOLDEN_PELLET_COUNT, NORMAL_PELLET_COUNT, POND_HALF } from '@hhc/shared'

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function farEnough(x: number, z: number, placed: Pellet[], minDist: number): boolean {
  return placed.every((p) => {
    const dx = p.x - x
    const dz = p.z - z
    return dx * dx + dz * dz >= minDist * minDist
  })
}

export function spawnPellets(): Pellet[] {
  const inner = POND_HALF * 0.82
  const pellets: Pellet[] = []

  for (let i = 0; i < NORMAL_PELLET_COUNT; i += 1) {
    let x = 0
    let z = 0
    for (let attempt = 0; attempt < 24; attempt += 1) {
      x = rand(-inner, inner)
      z = rand(-inner, inner)
      if (farEnough(x, z, pellets, 0.55)) break
    }
    pellets.push({ id: `crumb-${i}`, x, z, golden: false })
  }

  for (let g = 0; g < GOLDEN_PELLET_COUNT; g += 1) {
    pellets.push({
      id: `crumb-golden-${g}`,
      x: rand(-0.55, 0.55),
      z: rand(-0.55, 0.55),
      golden: true,
    })
  }

  return pellets
}
