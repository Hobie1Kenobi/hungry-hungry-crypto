import { POND_SIZE } from '@hhc/shared'

export function Pond() {
  const inner = POND_SIZE - 0.4
  const rim = 0.22
  const wall = POND_SIZE / 2 + 0.05

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[inner, inner]} />
        <meshStandardMaterial
          color="#0a3d4c"
          roughness={0.28}
          metalness={0.12}
          transparent
          opacity={0.94}
          emissive="#06303a"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0.16, -wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.28, rim]} />
        <meshStandardMaterial color="#1a2433" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.16, wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.28, rim]} />
        <meshStandardMaterial color="#1a2433" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[-wall, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.28, POND_SIZE + rim]} />
        <meshStandardMaterial color="#1a2433" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[wall, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.28, POND_SIZE + rim]} />
        <meshStandardMaterial color="#1a2433" metalness={0.4} roughness={0.45} />
      </mesh>
    </group>
  )
}
