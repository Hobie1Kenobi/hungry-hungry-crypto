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
    <group ref={ref} position={[0, 6.35, 0]} scale={0.78}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.55, 0.22, 1.55]} />
        <meshStandardMaterial color="#6a7e96" metalness={0.48} roughness={0.38} />
      </mesh>
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.05, 0]} castShadow>
        <coneGeometry args={[0.82, 1.15, 4]} />
        <meshStandardMaterial color="#7c90a8" metalness={0.42} roughness={0.4} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.28, 12]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={dumpT < 0.9 ? 1.4 : 0.35}
        />
      </mesh>
    </group>
  )
}
