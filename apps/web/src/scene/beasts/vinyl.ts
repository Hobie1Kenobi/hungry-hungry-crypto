import type { Seat } from '@hhc/shared'
import { NECK_VISUAL_ORIGIN, beastPosition, beastYaw } from '@hhc/shared'

export const BEAST_NECK_LIFT = 0.68

/** RIPSAW kit sits south of the NE corner so the saw stays off the hopper. */
export function beastVisualRoot(seat: Seat): [number, number, number] {
  const [x, y, z] = beastPosition(seat)
  if (seat === 1) return [x - 0.72, y, z + 1.55]
  return [x, y, z]
}

/** Visual-only pond-level lifts. Cycle 11 Y-stack is gone - it read as one pile from the toy-ad camera. */
export function beastNeckLift(seat: Seat): number {
  if (seat === 0) return 0.58
  if (seat === 1) return 0.7
  if (seat === 2) return 0.8
  return 0.66
}

/**
 * Visual-only local-Z of the head. Caps the ram so the maw sits over that seat's
 * cardinal-ray chips, not stacked on world 0,0. Sim `visualHeadAlong` / `chompReach` stay.
 */
export const VISUAL_LANE_HEAD_REST = 0.8
export const VISUAL_LANE_HEAD_LATCH = 2.62

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
