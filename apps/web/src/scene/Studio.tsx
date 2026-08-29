import { BackSide } from 'three'

export function Studio() {
  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[36, 32, 20]} />
        <meshBasicMaterial color="#161018" side={BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#1c1418" roughness={0.88} metalness={0.08} />
      </mesh>
      <mesh position={[0, 6.4, -15.5]} receiveShadow>
        <boxGeometry args={[28, 14, 0.4]} />
        <meshStandardMaterial color="#2a1c18" roughness={0.7} />
      </mesh>
      <mesh position={[-15.2, 6.4, 0]} receiveShadow>
        <boxGeometry args={[0.4, 14, 28]} />
        <meshStandardMaterial color="#1a2230" roughness={0.72} />
      </mesh>
      <mesh position={[15.2, 6.4, 0]} receiveShadow>
        <boxGeometry args={[0.4, 14, 28]} />
        <meshStandardMaterial color="#241820" roughness={0.7} />
      </mesh>
    </group>
  )
}
