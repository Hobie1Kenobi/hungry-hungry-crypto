import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useGameStore } from '../store/gameStore'

export function Hopper() {
  const dumpT = useGameStore((s) => s.dumpT)
  const ui = useGameStore((s) => s.ui)
  const ref = useRef<Group>(null)

  useFrame((_, dt) => {
    if (!ref.current) return
    const shaking = ui === 'playing' && dumpT < 0.85
    const phase = dumpT
    ref.current.rotation.z = shaking ? Math.sin(phase * 40) * 0.05 : 0
    const pulse = shaking ? 1 + Math.sin(phase * 28) * 0.03 : 1
    ref.current.scale.setScalar(pulse)
    if (!shaking) {
      ref.current.rotation.y += dt * 0.15
    }
  })

  return (
    <group ref={ref} position={[0, 4.55, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.85, 0.28, 1.85]} />
        <meshStandardMaterial color="#2a3344" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.05, 0]} castShadow>
        <coneGeometry args={[1.05, 1.45, 4]} />
        <meshStandardMaterial color="#3a465c" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.34, 12]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={dumpT < 0.9 ? 1.4 : 0.35}
        />
      </mesh>
    </group>
  )
}
