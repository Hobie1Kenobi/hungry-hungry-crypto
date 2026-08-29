export const BEAST_NECK_LIFT = 0.82

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
