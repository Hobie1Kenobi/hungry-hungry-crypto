import type { Seat } from '@hhc/shared'
import { NECK_VISUAL_ORIGIN, beastPosition, beastYaw } from '@hhc/shared'

export const BEAST_NECK_LIFT = 0.68

/** Winner parks in the open pond, right of the left results card. */
export const RESULT_HERO = { x: 2.15, y: 0.72, z: 1.35 }

/** Look left of the hero so the body sits in the open right pond, not under the card. */
export const RESULT_LOOK = { x: 0.35, y: 0.68, z: 0.85 }

/** RIPSAW stays on the east cardinal. BYTEBITE sits a hair toward the pond so the barrel is not on the clip. */
export function beastVisualRoot(seat: Seat): [number, number, number] {
  const [x, y, z] = beastPosition(seat)
  if (seat === 0) return [x, y, z + 0.62]
  if (seat === 1) return [x - 0.12, y, z + 0.18]
  return [x, y, z]
}

export function beastNeckLift(seat: Seat): number {
  if (seat === 0) return 0.78
  if (seat === 1) return 0.7
  if (seat === 2) return 0.76
  return 0.68
}

/**
 * Visual-only local-Z of the head. Cycle 12's 2.28 cap plus NECK_VISUAL_ORIGIN
 * still parked four maws ~2.5 from world origin - a knot from the toy-ad camera.
 * Latch 0.94 sits over the outer cardinal rays (3.82 / 3.05), short of center.
 * Sim `visualHeadAlong` / `chompReach` stay long enough to eat mid-pond.
 */
export const VISUAL_LANE_HEAD_REST = 0.62
export const VISUAL_LANE_HEAD_LATCH = 0.94

export function visualLaneHeadAlong(extend: number): number {
  const t = Math.max(0, Math.min(1, extend))
  return VISUAL_LANE_HEAD_REST + (VISUAL_LANE_HEAD_LATCH - VISUAL_LANE_HEAD_REST) * t
}

export function visualMouthWorld(seat: Seat, extend: number): { x: number; y: number; z: number } {
  const [bx, , bz] = beastVisualRoot(seat)
  const yaw = beastYaw(seat)
  const along = NECK_VISUAL_ORIGIN + visualLaneHeadAlong(extend)
  return {
    x: bx + Math.sin(yaw) * along,
    y: beastNeckLift(seat) + 0.12,
    z: bz + Math.cos(yaw) * along,
  }
}

export function vinyl(
  color: string,
  extra?: { metalness?: number; roughness?: number; emissive?: string; emissiveIntensity?: number },
) {
  return {
    color,
    metalness: extra?.metalness ?? 0.24,
    roughness: extra?.roughness ?? 0.28,
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
    sheen: 0.55,
    sheenColor: color,
    emissive: extra?.emissive ?? '#000000',
    emissiveIntensity: extra?.emissiveIntensity ?? 0,
  }
}
