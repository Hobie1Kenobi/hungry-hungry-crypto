import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Mesh } from 'three'
import { BEASTS, POND_SIZE, type Seat } from '@hhc/shared'
import { makeCausticTexture, makeHexTexture } from './pondTextures'

function LaneGutter({
  seat,
  length,
  mid,
}: {
  seat: Seat
  length: number
  mid: number
}) {
  const spec = BEASTS[seat]
  const yaw = seat === 0 ? 0 : seat === 1 ? -Math.PI / 2 : seat === 2 ? Math.PI : Math.PI / 2
  const rail = { color: spec.color, emissive: spec.color, emissiveIntensity: 2.15, metalness: 0.38, roughness: 0.24 }
  const bed = { color: spec.accent, emissive: spec.color, emissiveIntensity: 0.55, metalness: 0.22, roughness: 0.38 }
  const lip = 0.7
  return (
    <group rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.04, mid]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.1, length]} />
        <meshStandardMaterial {...bed} />
      </mesh>
      {[-lip, lip].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.22, mid]} castShadow>
            <boxGeometry args={[0.24, 0.4, length]} />
            <meshStandardMaterial {...rail} />
          </mesh>
          <mesh position={[x, 0.44, mid]} castShadow>
            <boxGeometry args={[0.3, 0.08, length]} />
            <meshStandardMaterial color="#f4fff8" emissive={spec.color} emissiveIntensity={1.6} metalness={0.55} roughness={0.18} />
          </mesh>
        </group>
      ))}
      {[-1.2, -0.4, 0.4, 1.2].map((z) => (
        <mesh key={z} position={[0, 0.14, mid + z]} castShadow>
          <boxGeometry args={[1.28, 0.12, 0.18]} />
          <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.35} metalness={0.48} roughness={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function RaisedCross() {
  const run = 3.28
  const mid = -2.22
  return (
    <group>
      <LaneGutter seat={0} length={run} mid={mid} />
      <LaneGutter seat={1} length={run} mid={mid} />
      <LaneGutter seat={2} length={run} mid={mid} />
      <LaneGutter seat={3} length={run} mid={mid} />
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.18, 16]} />
        <meshStandardMaterial color="#d7e8c8" emissive="#8a9a40" emissiveIntensity={0.7} metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.12, 14]} />
        <meshStandardMaterial color="#fff6c8" emissive="#ffe27a" emissiveIntensity={1.1} metalness={0.4} roughness={0.22} />
      </mesh>
    </group>
  )
}

export function Pond() {
  const inner = POND_SIZE - 0.18
  const rim = 0.28
  const wall = POND_SIZE / 2 + 0.02
  const hex = useMemo(() => makeHexTexture(), [])
  const caustic = useMemo(() => makeCausticTexture(), [])
  const shimmer = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!shimmer.current) return
    const t = clock.elapsedTime
    shimmer.current.position.x = Math.sin(t * 0.35) * 0.12
    shimmer.current.position.z = Math.cos(t * 0.28) * 0.12
    const mat = shimmer.current.material as { opacity: number }
    mat.opacity = 0.16 + Math.sin(t * 1.7) * 0.05
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[inner, inner]} />
        <meshPhysicalMaterial
          color="#041820"
          roughness={0.18}
          metalness={0.28}
          transparent
          opacity={0.96}
          emissive="#021014"
          emissiveIntensity={0.28}
          envMapIntensity={1.05}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.085, 0]}>
        <planeGeometry args={[inner, inner]} />
        <meshBasicMaterial map={hex} transparent opacity={0.55} />
      </mesh>
      <mesh ref={shimmer} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[inner * 0.92, inner * 0.92]} />
        <meshBasicMaterial
          map={caustic}
          transparent
          opacity={0.22}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <RaisedCross />
      <mesh position={[0, -0.02, -wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.16, rim]} />
        <meshStandardMaterial color="#0a161c" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.26, rim]} />
        <meshStandardMaterial color="#0a161c" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[-wall, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.26, POND_SIZE + rim]} />
        <meshStandardMaterial color="#0a161c" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[wall, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.26, POND_SIZE + rim]} />
        <meshStandardMaterial color="#0a161c" metalness={0.45} roughness={0.4} />
      </mesh>
    </group>
  )
}
