import { useMemo } from 'react'
import type { Pellet } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

function hashDelay(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 17
  return n * 0.028
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  const y = pellet.eatenBy !== undefined ? -2 : 4.1 + (0.12 - 4.1) * easeOut(land)
  const scale = pellet.eatenBy !== undefined ? 0 : pellet.golden ? 1.55 : 1
  const r = pellet.golden ? 0.32 : 0.2
  const color = pellet.golden ? '#f0c14b' : '#1b242e'
  const rim = pellet.golden ? '#fff3c4' : '#00e5ff'
  const spin = dumpT * 8 + delay * 20

  if (pellet.eatenBy !== undefined) return null

  return (
    <group position={[pellet.x, y, pellet.z]} rotation={[0, spin, 0]} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.08, 6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.65}
          roughness={0.28}
          emissive={pellet.golden ? '#8a6a12' : '#032028'}
          emissiveIntensity={pellet.golden ? 0.7 : 0.25}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[r * 0.72, r * 0.72, 0.02, 6]} />
        <meshStandardMaterial color={rim} emissive={rim} emissiveIntensity={0.35} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[r * 0.95, 0.02, r * 0.18]} />
        <meshStandardMaterial color={pellet.golden ? '#6a4a00' : '#06222a'} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[r * 0.95, 0.02, r * 0.18]} />
        <meshStandardMaterial color={pellet.golden ? '#6a4a00' : '#06222a'} />
      </mesh>
    </group>
  )
}
