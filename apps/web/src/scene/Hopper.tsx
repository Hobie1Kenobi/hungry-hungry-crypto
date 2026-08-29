import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'

function Sparks({ dumping }: { dumping: boolean }) {
  const refs = useRef<Array<Mesh | null>>([])
  const seeds = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        x: (i % 5) * 0.12 - 0.24,
        z: Math.floor(i / 5) * 0.16 - 0.08,
        phase: i * 0.7,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    for (let i = 0; i < seeds.length; i += 1) {
      const mesh = refs.current[i]
      if (!mesh) continue
      const live = dumping ? 1 : 0
      const bounce = (Math.sin(t * 18 + seeds[i].phase) + 1) * 0.5
      mesh.position.set(seeds[i].x, -0.15 - bounce * 0.55, seeds[i].z)
      mesh.scale.setScalar(live * (0.4 + bounce * 0.8))
      mesh.visible = live > 0
    }
  })

  return (
    <group>
      {seeds.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          position={[s.x, -0.2, s.z]}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffe27a" blending={AdditiveBlending} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export function Hopper() {
  const dumpT = useGameStore((s) => s.dumpT)
  const ui = useGameStore((s) => s.ui)
  const refillCount = useGameStore((s) => s.refillCount)
  const lastRefillAt = useGameStore((s) => s.lastRefillAt)
  const dumpAt = useJuiceStore((s) => s.dumpAt)
  const ref = useRef<Group>(null)

  useFrame((_, dt) => {
    if (!ref.current) return
    const refillShake = refillCount > 0 && performance.now() - lastRefillAt < 720
    const juiceShake = performance.now() - dumpAt < 400
    const phase = refillShake || juiceShake ? performance.now() / 1000 : dumpT
    const shaking = ui === 'playing' && (dumpT < 0.85 || refillShake || juiceShake)
    ref.current.rotation.z = shaking ? Math.sin(phase * 36) * 0.04 : 0
    const pulse = shaking ? 1 + Math.sin(phase * 24) * 0.02 : 1
    ref.current.scale.setScalar(pulse)
    if (!shaking) ref.current.rotation.y += dt * 0.04
  })

  const dumping = ui === 'playing' && dumpT < 0.88

  return (
    <group ref={ref} position={[0, 3.85, 0]}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.35, 0.72, 1.15]} />
        <meshPhysicalMaterial color="#3a4654" metalness={0.62} roughness={0.32} clearcoat={0.35} />
      </mesh>
      <mesh position={[0, 0.72, 0.52]} castShadow>
        <boxGeometry args={[0.72, 0.42, 0.06]} />
        <meshPhysicalMaterial
          color="#7ad7e6"
          metalness={0.1}
          roughness={0.12}
          transparent
          opacity={0.35}
          transmission={0.4}
        />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.48, 0.42, 8]} />
        <meshStandardMaterial color="#2c3642" metalness={0.7} roughness={0.28} />
      </mesh>
      {[-0.38, -0.12, 0.14, 0.38].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.035, 8, 16]} />
          <meshStandardMaterial color="#c5ced6" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.28, 10]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={dumping ? 1.8 : 0.35}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.55, 0.16, 0.55]} />
        <meshStandardMaterial color="#8a94a0" metalness={0.75} roughness={0.24} />
      </mesh>
      <mesh position={[0.7, 0.55, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#6a7480" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.7, 0.55, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.12, 0.9, 0.12]} />
        <meshStandardMaterial color="#6a7480" metalness={0.7} roughness={0.3} />
      </mesh>
      <Sparks dumping={dumping} />
      {dumping ? <pointLight position={[0, -0.4, 0]} intensity={2.4} distance={4} color="#ffe27a" /> : null}
    </group>
  )
}
