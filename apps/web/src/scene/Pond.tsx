import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Mesh } from 'three'
import { POND_SIZE } from '@hhc/shared'
import { makeCausticTexture, makeHexTexture } from './pondTextures'

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
          color="#0a3c48"
          roughness={0.14}
          metalness={0.22}
          transparent
          opacity={0.94}
          emissive="#063038"
          emissiveIntensity={0.35}
          envMapIntensity={1.05}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.085, 0]}>
        <planeGeometry args={[inner, inner]} />
        <meshBasicMaterial map={hex} transparent opacity={0.72} />
      </mesh>
      <mesh ref={shimmer} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[inner * 0.92, inner * 0.92]} />
        <meshBasicMaterial
          map={caustic}
          transparent
          opacity={0.32}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {[0, Math.PI / 2].map((yaw, i) => (
        <mesh key={`lane-glow-${i}`} rotation={[-Math.PI / 2, yaw, 0]} position={[0, -0.076, 0]}>
          <planeGeometry args={[1.78, inner * 0.94]} />
          <meshBasicMaterial
            color="#1ee0f2"
            transparent
            opacity={0.38}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      {[0, Math.PI / 2].map((yaw, i) => (
        <mesh key={`lane-core-${i}`} rotation={[-Math.PI / 2, yaw, 0]} position={[0, -0.072, 0]}>
          <planeGeometry args={[0.58, inner * 0.94]} />
          <meshBasicMaterial
            color="#8cfff8"
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <circleGeometry args={[0.62, 28]} />
        <meshBasicMaterial
          color="#b8fff6"
          transparent
          opacity={0.46}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
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
