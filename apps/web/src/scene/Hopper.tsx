import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'

function Sparks({ dumping }: { dumping: boolean }) {
  const refs = useRef<Array<Mesh | null>>([])
  const seeds = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: (i % 7) * 0.11 - 0.33,
        z: Math.floor(i / 7) * 0.16 - 0.08,
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
      mesh.position.set(seeds[i].x, -0.12 - bounce * 0.72, seeds[i].z)
      mesh.scale.setScalar(live * (0.55 + bounce * 1.1))
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
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color="#ffe27a" blending={AdditiveBlending} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  )
}

function Bolt({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.07, 0.1, 6]} />
      <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.18} />
    </mesh>
  )
}

function Gantry() {
  const steel = { color: '#6d7884', metalness: 0.78, roughness: 0.24 }
  const gold = { color: '#d4af37', metalness: 0.82, roughness: 0.22 }
  return (
    <group>
      <mesh position={[0, 0.32, -6.55]} castShadow>
        <boxGeometry args={[3.9, 0.26, 1.45]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, -0.12, -7.08]} castShadow>
        <boxGeometry args={[3.9, 0.86, 0.28]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, -0.12, -6.12]} castShadow>
        <boxGeometry args={[3.9, 0.86, 0.22]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {[-1.55, -0.52, 0.52, 1.55].map((x) => (
        <Bolt key={`t${x}`} x={x} y={0.48} z={-6.55} />
      ))}
      {[-1.55, -0.52, 0.52, 1.55].map((x) => (
        <Bolt key={`o${x}`} x={x} y={0.18} z={-7.14} />
      ))}
      {[-1.28, 1.28].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.55, -6.55]} castShadow>
            <boxGeometry args={[0.42, 4.35, 0.42]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[x, 4.78, -6.55]} castShadow>
            <boxGeometry args={[0.62, 0.22, 0.62]} />
            <meshStandardMaterial {...gold} />
          </mesh>
          <Bolt x={x} y={0.5} z={-6.22} />
        </group>
      ))}
      <mesh position={[0, 4.82, -6.55]} castShadow>
        <boxGeometry args={[3.0, 0.28, 0.48]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 5.05, -3.2]} castShadow>
        <boxGeometry args={[0.4, 0.26, 6.7]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, 3.55, -4.55]} rotation={[0.38, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.22, 3.7]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, 5.02, -0.08]} castShadow>
        <boxGeometry args={[1.4, 0.24, 0.9]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 4.55, 0]} castShadow>
          <boxGeometry args={[0.14, 0.86, 0.14]} />
          <meshStandardMaterial color="#8a94a0" metalness={0.8} roughness={0.22} />
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
      <Gantry />
      <group ref={bin} position={[0, 3.85, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[1.45, 0.78, 1.22]} />
          <meshPhysicalMaterial color="#5a6d7c" metalness={0.58} roughness={0.3} clearcoat={0.4} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[1.55, 0.1, 1.32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.72, 0.58]} castShadow>
          <boxGeometry args={[0.78, 0.48, 0.07]} />
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
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.42, 0.46, 0.42]} />
          <meshStandardMaterial color="#8a96a4" metalness={0.72} roughness={0.26} />
        </mesh>
        {[-0.38, -0.12, 0.14, 0.38].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.36, 0.08, 0.36]} />
            <meshStandardMaterial color="#c5ced6" metalness={0.88} roughness={0.18} />
          </mesh>
        ))}
        <mesh position={[0, -0.55, 0]} castShadow>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={dumping ? 2.4 : 0.35}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <Sparks dumping={dumping} />
        {dumping ? <pointLight position={[0, -0.4, 0]} intensity={3.4} distance={5} color="#ffe27a" /> : null}
      </group>
    </group>
  )
}
