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
      <mesh position={[0, 0.26, -6.78]} castShadow>
        <boxGeometry args={[1.15, 0.12, 0.36]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, -0.04, -6.98]} castShadow>
        <boxGeometry args={[1.15, 0.42, 0.12]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <Bolt key={`rim${x}`} x={x} y={0.34} z={-6.78} />
      ))}
      {[-0.32, 0.32].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.12, -6.78]} castShadow>
            <cylinderGeometry args={[0.055, 0.06, 1.58, 8]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[x, 1.92, -6.78]} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.14]} />
            <meshStandardMaterial {...gold} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.94, -6.72]} castShadow>
        <boxGeometry args={[0.78, 0.08, 0.16]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  )
}

/** West of the north rim so RIPSAW's saw does not sit inside the chute from the behind-BYTEBITE camera. */
export const HOPPER_SHIFT_X = -1.12
export const HOPPER_MOUTH = { x: HOPPER_SHIFT_X, y: 2.18, z: -6.42 }

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
    <group position={[HOPPER_SHIFT_X, 0, 0]}>
      <RimMount />
      <group ref={bin} position={[0, 2.05, -6.55]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.58, 0.36, 0.46]} />
          <meshPhysicalMaterial color="#5a6d7c" metalness={0.58} roughness={0.3} clearcoat={0.4} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.64, 0.06, 0.5]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.22, 0.22]} castShadow>
          <boxGeometry args={[0.3, 0.16, 0.04]} />
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
        <mesh position={[0, -0.06, 0.1]} rotation={[0.7, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.48, 8]} />
          <meshStandardMaterial color="#8a96a4" metalness={0.72} roughness={0.26} />
        </mesh>
        <mesh position={[0, -0.28, 0.32]} rotation={[1.05, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.4]} />
          <meshStandardMaterial color="#c5ced6" metalness={0.82} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.38, 0.46]} castShadow>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
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
