import { BackSide } from 'three'

function Marquee() {
  return (
    <group position={[0, 5.15, -8.15]}>
      <mesh castShadow>
        <boxGeometry args={[8.6, 1.15, 0.42]} />
        <meshStandardMaterial color="#141820" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0.24]}>
        <boxGeometry args={[8.1, 0.82, 0.08]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.02, 0.29]}>
        <boxGeometry args={[7.4, 0.55, 0.04]} />
        <meshStandardMaterial color="#041018" />
      </mesh>
      {[-3.6, -1.8, 0, 1.8, 3.6].map((x) => (
        <mesh key={x} position={[x, 0.52, 0.12]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#ffe27a" emissive="#ffe27a" emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  )
}

function CabinetShell() {
  const enamel = { color: '#24364a', metalness: 0.28, roughness: 0.38 }
  return (
    <group>
      <mesh position={[0, 1.55, -8.05]} receiveShadow castShadow>
        <boxGeometry args={[16.4, 3.4, 0.36]} />
        <meshStandardMaterial {...enamel} />
      </mesh>
      <mesh position={[-8.15, 1.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.36, 3.4, 16.4]} />
        <meshStandardMaterial color="#1b2a3a" metalness={0.26} roughness={0.4} />
      </mesh>
      <mesh position={[8.15, 1.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.36, 3.4, 16.4]} />
        <meshStandardMaterial color="#2a1c28" metalness={0.26} roughness={0.4} />
      </mesh>
      {[-6.4, 6.4].map((x) => (
        <mesh key={x} position={[x, 6.35, -1.2]} receiveShadow>
          <boxGeometry args={[3.2, 0.14, 14]} />
          <meshStandardMaterial color="#1a222c" metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
      {[-4.6, 0, 4.6].map((x) => (
        <mesh key={x} position={[x, 6.42, -2.4]}>
          <boxGeometry args={[3.2, 0.08, 1.05]} />
          <meshStandardMaterial color="#fff4dd" emissive="#fff1c8" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function Studio() {
  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[28, 32, 20]} />
        <meshBasicMaterial color="#c9b7a2" side={BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 2.4]} receiveShadow>
        <circleGeometry args={[22, 48]} />
        <meshStandardMaterial color="#d8c6b0" roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh position={[0, 6.8, -18]} receiveShadow>
        <boxGeometry args={[36, 16, 0.4]} />
        <meshStandardMaterial color="#e6d7c4" roughness={0.62} />
      </mesh>
      <mesh position={[-18, 6.8, 0]} receiveShadow>
        <boxGeometry args={[0.4, 16, 36]} />
        <meshStandardMaterial color="#d5c4d0" roughness={0.64} />
      </mesh>
      <mesh position={[18, 6.8, 0]} receiveShadow>
        <boxGeometry args={[0.4, 16, 36]} />
        <meshStandardMaterial color="#c8d4dc" roughness={0.64} />
      </mesh>
      <CabinetShell />
      <Marquee />
    </group>
  )
}
