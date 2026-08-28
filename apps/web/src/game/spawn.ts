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

function place(placed: Pellet[], x0: number, x1: number, z0: number, z1: number, minDist: number): { x: number; z: number } {
  const inner = POND_HALF * 0.82
  let x = rand(x0, x1)
  let z = rand(z0, z1)
  for (let attempt = 0; attempt < 28; attempt += 1) {
    x = rand(x0, x1)
    z = rand(z0, z1)
    x = Math.max(-inner, Math.min(inner, x))
    z = Math.max(-inner, Math.min(inner, z))
    if (farEnough(x, z, placed, minDist)) break
  }
  return { x, z }
}

export function spawnPellets(): Pellet[] {
  const inner = POND_HALF * 0.82
  const pellets: Pellet[] = []
  const perLane = 4
  const lanes: Array<[number, number, number, number]> = [
    [-1.05, 1.05, -3.05, -0.45],
    [0.45, 3.05, -1.05, 1.05],
    [-1.05, 1.05, 0.45, 3.05],
    [-3.05, -0.45, -1.05, 1.05],
  ]

  let i = 0
  for (const [x0, x1, z0, z1] of lanes) {
    for (let n = 0; n < perLane; n += 1) {
      const { x, z } = place(pellets, x0, x1, z0, z1, 0.5)
      pellets.push({ id: `crumb-${i}`, x, z, golden: false })
      i += 1
    }
  }

  for (; i < NORMAL_PELLET_COUNT; i += 1) {
    const { x, z } = place(pellets, -inner, inner, -inner, inner, 0.55)
    pellets.push({ id: `crumb-${i}`, x, z, golden: false })
  }

  for (let g = 0; g < GOLDEN_PELLET_COUNT; g += 1) {
    pellets.push({
      id: `crumb-golden-${g}`,
      x: rand(-0.4, 0.4),
      z: rand(-0.4, 0.4),
      golden: true,
    })
  }

  return pellets
}
