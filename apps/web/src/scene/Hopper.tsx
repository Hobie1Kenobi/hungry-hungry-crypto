import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

export function Hopper() {
  const dumpT = useGameStore((s) => s.dumpT)
  const ui = useGameStore((s) => s.ui)
  const refillCount = useGameStore((s) => s.refillCount)
  const lastRefillAt = useGameStore((s) => s.lastRefillAt)
  const ref = useRef<Group>(null)

  useFrame((_, dt) => {
    if (!ref.current) return
    const refillShake = refillCount > 0 && performance.now() - lastRefillAt < 720
    const phase = refillShake ? performance.now() / 1000 : dumpT
    const shaking = ui === 'playing' && (dumpT < 0.85 || refillShake)
    ref.current.rotation.z = shaking ? Math.sin(phase * 40) * 0.05 : 0
    const pulse = shaking ? 1 + Math.sin(phase * 28) * 0.03 : 1
    ref.current.scale.setScalar(pulse)
    if (!shaking) {
      ref.current.rotation.y += dt * 0.15
    }
  })

  return (
    <group ref={ref} position={[0, 7.15, 0]}>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.16, 16]} />
        <meshStandardMaterial color="#8aa0b8" metalness={0.45} roughness={0.36} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.22, 0.38, 0.95, 16]} />
        <meshStandardMaterial color="#9ab0c6" metalness={0.4} roughness={0.4} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.22, 12]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={dumpT < 0.9 ? 1.4 : 0.35}
        />
      </mesh>
    </group>
  )
}
