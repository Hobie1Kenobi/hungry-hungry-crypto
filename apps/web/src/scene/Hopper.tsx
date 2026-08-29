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
        x: (i % 5) * 0.07 - 0.14,
        z: Math.floor(i / 5) * 0.08 + 0.22,
        phase: i * 0.55,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    for (let i = 0; i < seeds.length; i += 1) {
      const mesh = refs.current[i]
      if (!mesh) continue
      const live = dumping ? 1 : 0
      const bounce = (Math.sin(t * 20 + seeds[i].phase) + 1) * 0.5
      mesh.position.set(seeds[i].x, -0.18 - bounce * 0.42, seeds[i].z + bounce * 0.18)
      mesh.scale.setScalar(live * (0.45 + bounce * 0.9))
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
          position={[s.x, -0.16, s.z]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffe27a" blending={AdditiveBlending} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  )
}

function Bolt({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.045, 0.045, 0.07, 6]} />
      <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.18} />
    </mesh>
  )
}

function RimMount() {
  const steel = { color: '#6d7884', metalness: 0.78, roughness: 0.24 }
  const gold = { color: '#d4af37', metalness: 0.82, roughness: 0.22 }
  return (
    <group>
      <mesh position={[0, 0.26, -6.62]} castShadow>
        <boxGeometry args={[1.48, 0.14, 0.48]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, -0.06, -6.88]} castShadow>
        <boxGeometry args={[1.48, 0.5, 0.14]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <Bolt key={`rim${x}`} x={x} y={0.35} z={-6.62} />
      ))}
      {[-0.42, 0.42].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.08, -6.58]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 1.48, 8]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[x, 1.84, -6.58]} castShadow>
            <boxGeometry args={[0.18, 0.1, 0.18]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.86, -6.5]} castShadow>
        <boxGeometry args={[1.02, 0.1, 0.2]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  )
}

export function Hopper() {
  const dumpT = useGameStore((s) => s.dumpT)
  const ui = useGameStore((s) => s.ui)
  const refillCount = useGameStore((s) => s.refillCount)
  const lastRefillAt = useGameStore((s) => s.lastRefillAt)
  const dumpAt = useJuiceStore((s) => s.dumpAt)
  const bin = useRef<Group>(null)

  useFrame(() => {
    if (!bin.current) return
    const refillShake = refillCount > 0 && performance.now() - lastRefillAt < 720
    const juiceShake = performance.now() - dumpAt < 400
    const phase = refillShake || juiceShake ? performance.now() / 1000 : dumpT
    const shaking = ui === 'playing' && (dumpT < 0.85 || refillShake || juiceShake)
    bin.current.rotation.z = shaking ? Math.sin(phase * 36) * 0.05 : 0
    const pulse = shaking ? 1 + Math.sin(phase * 24) * 0.025 : 1
    bin.current.scale.setScalar(pulse)
  })

  const dumping = ui === 'playing' && dumpT < 0.88

  return (
    <group>
      <RimMount />
      <group ref={bin} position={[0, 2.05, -6.05]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.72, 0.48, 0.58]} />
          <meshPhysicalMaterial color="#5a6d7c" metalness={0.58} roughness={0.3} clearcoat={0.4} />
        </mesh>
        <mesh position={[0, 0.54, 0]} castShadow>
          <boxGeometry args={[0.8, 0.07, 0.64]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.3, 0.28]} castShadow>
          <boxGeometry args={[0.38, 0.22, 0.05]} />
          <meshPhysicalMaterial
            color="#7fe9ff"
            emissive="#2ad4e8"
            emissiveIntensity={0.55}
            metalness={0.08}
            roughness={0.1}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh position={[0, -0.08, 0.08]} rotation={[0.62, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.16, 0.62, 8]} />
          <meshStandardMaterial color="#8a96a4" metalness={0.72} roughness={0.26} />
        </mesh>
        <mesh position={[0, -0.38, 0.38]} rotation={[0.95, 0, 0]} castShadow>
          <boxGeometry args={[0.28, 0.06, 0.55]} />
          <meshStandardMaterial color="#c5ced6" metalness={0.82} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.52, 0.58]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.16]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={dumping ? 2.4 : 0.35}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <Sparks dumping={dumping} />
        {dumping ? <pointLight position={[0, -0.4, 0.5]} intensity={2.4} distance={3.2} color="#ffe27a" /> : null}
      </group>
    </group>
  )
}
