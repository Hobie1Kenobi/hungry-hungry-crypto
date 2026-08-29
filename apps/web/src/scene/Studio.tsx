import { BackSide } from 'three'

function Cabinet() {
  const enamel = { color: '#1c2833', metalness: 0.28, roughness: 0.42 }
  const teal = { color: '#2f5d68', metalness: 0.2, roughness: 0.4 }
  const gold = { color: '#d4af37', metalness: 0.82, roughness: 0.22 }
  return (
    <group>
      <mesh position={[0, 1.15, -8.35]} receiveShadow castShadow>
        <boxGeometry args={[15.2, 3.6, 0.55]} />
        <meshStandardMaterial {...teal} />
      </mesh>
      <mesh position={[0, 3.08, -8.18]} castShadow>
        <boxGeometry args={[15.4, 0.16, 0.72]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 3.72, -8.28]} castShadow>
        <boxGeometry args={[12.4, 1.05, 0.42]} />
        <meshStandardMaterial color="#121820" metalness={0.32} roughness={0.38} />
      </mesh>
      <mesh position={[0, 3.74, -8.04]}>
        <boxGeometry args={[11.4, 0.72, 0.08]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.35} />
      </mesh>
      <mesh position={[0, 3.74, -8.0]}>
        <boxGeometry args={[10.4, 0.46, 0.05]} />
        <meshStandardMaterial color="#041018" />
      </mesh>
      {[-4.6, -2.3, 0, 2.3, 4.6].map((x) => (
        <mesh key={x} position={[x, 4.28, -8.08]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ffe27a" emissive="#ffe27a" emissiveIntensity={2.2} />
        </mesh>
      ))}
      <mesh position={[-7.55, 1.05, -6.4]} receiveShadow castShadow>
        <boxGeometry args={[0.42, 3.4, 4.2]} />
        <meshStandardMaterial {...enamel} />
      </mesh>
      <mesh position={[7.55, 1.05, -6.4]} receiveShadow castShadow>
        <boxGeometry args={[0.42, 3.4, 4.2]} />
        <meshStandardMaterial {...enamel} />
      </mesh>
      <mesh position={[0, -1.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[14.6, 1.15, 14.6]} />
        <meshStandardMaterial color="#162028" metalness={0.22} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.72, 6.55]} castShadow>
        <boxGeometry args={[3.2, 0.7, 0.18]} />
        <meshStandardMaterial color="#0e141a" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.72, 6.66]}>
        <boxGeometry args={[1.1, 0.22, 0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export function Studio() {
  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[36, 32, 20]} />
        <meshBasicMaterial color="#c9b49a" side={BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 2.4]} receiveShadow>
        <circleGeometry args={[28, 48]} />
        <meshStandardMaterial color="#b89f82" roughness={0.82} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]} receiveShadow>
        <circleGeometry args={[12.4, 48]} />
        <meshStandardMaterial color="#8a735c" roughness={0.76} metalness={0.06} />
      </mesh>
      <mesh position={[0, 7.4, -16.5]} receiveShadow>
        <boxGeometry args={[42, 16, 0.5]} />
        <meshStandardMaterial color="#d8c4aa" roughness={0.62} />
      </mesh>
      <mesh position={[-17.8, 7.4, -2]} receiveShadow>
        <boxGeometry args={[0.5, 16, 30]} />
        <meshStandardMaterial color="#c9a8b4" roughness={0.64} />
      </mesh>
      <mesh position={[17.8, 7.4, -2]} receiveShadow>
        <boxGeometry args={[0.5, 16, 30]} />
        <meshStandardMaterial color="#a9c0cc" roughness={0.64} />
      </mesh>
      <mesh position={[0, 15.2, -7]} receiveShadow>
        <boxGeometry args={[38, 0.4, 26]} />
        <meshStandardMaterial color="#c4b09a" roughness={0.72} />
      </mesh>
      <Cabinet />
    </group>
  )
}
