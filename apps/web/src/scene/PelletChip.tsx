import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
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
  const refill = pellet.id.startsWith('w')
  const born = useRef(performance.now())
  const group = useRef<Group>(null)
  const scale = pellet.eatenBy !== undefined ? 0 : pellet.golden ? 1.4 : 1
  const r = pellet.golden ? 0.44 : 0.36
  const color = pellet.golden ? '#f0c14b' : '#7ad4ff'
  const rim = pellet.golden ? '#fff3c4' : '#e9fbff'
  const spin = dumpT * 8 + delay * 20
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  const y = refill ? 4.1 : 4.1 + (0.18 - 4.1) * easeOut(land)

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined || !refill) return
    const t = Math.max(0, Math.min(1, (performance.now() - born.current) / 420))
    group.current.position.set(pellet.x, 4.1 + (0.18 - 4.1) * easeOut(t), pellet.z)
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]} rotation={[0, spin, 0]} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r, 0.1, 6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.22}
          emissive={pellet.golden ? '#c49214' : '#147a99'}
          emissiveIntensity={pellet.golden ? 1.2 : 1.05}
        />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[r * 0.72, r * 0.72, 0.02, 6]} />
        <meshStandardMaterial color={rim} emissive={rim} emissiveIntensity={0.75} metalness={0.4} roughness={0.35} />
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
