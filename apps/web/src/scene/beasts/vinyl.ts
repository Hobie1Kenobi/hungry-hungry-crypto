import type { Seat } from '@hhc/shared'

export const BEAST_NECK_LIFT = 0.92

/** Visual-only Y stack so four mid-pond rams sit on separate planes. */
export const BEAST_NECK_STACK: Record<Seat, number> = {
  0: 0.32,
  1: 1.55,
  2: 2.38,
  3: 0.96,
}

export function beastNeckLift(seat: Seat): number {
  return BEAST_NECK_STACK[seat]
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
