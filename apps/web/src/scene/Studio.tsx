import { BackSide } from 'three'

function Marquee() {
  return (
    <group position={[0, 4.85, -7.95]}>
      <mesh castShadow>
        <boxGeometry args={[9.2, 1.28, 0.46]} />
        <meshStandardMaterial color="#1a2430" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0.26]}>
        <boxGeometry args={[8.6, 0.92, 0.08]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0.02, 0.32]}>
        <boxGeometry args={[7.8, 0.58, 0.04]} />
        <meshStandardMaterial color="#041018" />
      </mesh>
      {[-3.8, -1.9, 0, 1.9, 3.8].map((x) => (
        <mesh key={x} position={[x, 0.58, 0.14]}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#ffe27a" emissive="#ffe27a" emissiveIntensity={2.6} />
        </mesh>
      ))}
    </group>
  )
}

function CabinetShell() {
  return (
    <group>
      <mesh position={[0, 1.7, -7.85]} receiveShadow castShadow>
        <boxGeometry args={[16.8, 3.6, 0.32]} />
        <meshStandardMaterial color="#3a6d78" metalness={0.18} roughness={0.42} />
      </mesh>
      <mesh position={[-8.05, 1.7, -0.4]} receiveShadow castShadow>
        <boxGeometry args={[0.32, 3.6, 15.2]} />
        <meshStandardMaterial color="#e6d2b8" metalness={0.08} roughness={0.55} />
      </mesh>
      <mesh position={[8.05, 1.7, -0.4]} receiveShadow castShadow>
        <boxGeometry args={[0.32, 3.6, 15.2]} />
        <meshStandardMaterial color="#e8c6d4" metalness={0.08} roughness={0.55} />
      </mesh>
      <mesh position={[-8.02, 2.4, -0.4]} castShadow>
        <boxGeometry args={[0.08, 0.22, 12]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[8.02, 2.4, -0.4]} castShadow>
        <boxGeometry args={[0.08, 0.22, 12]} />
        <meshStandardMaterial color="#FF2BD6" emissive="#FF2BD6" emissiveIntensity={0.28} />
      </mesh>
      {[-5.4, 0, 5.4].map((x) => (
        <mesh key={x} position={[x, 5.85, -2.2]}>
          <boxGeometry args={[3.4, 0.1, 1.2]} />
          <meshStandardMaterial color="#fff6df" emissive="#fff1c8" emissiveIntensity={1.15} />
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
        <meshBasicMaterial color="#eddcc6" side={BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 1.6]} receiveShadow>
        <circleGeometry args={[22, 48]} />
        <meshStandardMaterial color="#e3d2bb" roughness={0.74} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[9.4, 48]} />
        <meshStandardMaterial color="#c9b49a" roughness={0.7} metalness={0.06} />
      </mesh>
      <mesh position={[0, 7.2, -17]} receiveShadow>
        <boxGeometry args={[36, 16, 0.4]} />
        <meshStandardMaterial color="#f3e6d4" roughness={0.58} />
      </mesh>
      <mesh position={[-17.4, 7.2, 0]} receiveShadow>
        <boxGeometry args={[0.4, 16, 36]} />
        <meshStandardMaterial color="#f0d8e4" roughness={0.6} />
      </mesh>
      <mesh position={[17.4, 7.2, 0]} receiveShadow>
        <boxGeometry args={[0.4, 16, 36]} />
        <meshStandardMaterial color="#d7e4ec" roughness={0.6} />
      </mesh>
      <CabinetShell />
      <Marquee />
    </group>
  )
}
