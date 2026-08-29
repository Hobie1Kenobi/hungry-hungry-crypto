import { BackSide } from 'three'

function Marquee() {
  return (
    <group position={[0, 5.35, -9.4]}>
      <mesh castShadow>
        <boxGeometry args={[7.4, 1.05, 0.28]} />
        <meshStandardMaterial color="#1a2430" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0.16]}>
        <boxGeometry args={[6.8, 0.74, 0.06]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0.02, 0.2]}>
        <boxGeometry args={[6.1, 0.46, 0.04]} />
        <meshStandardMaterial color="#041018" />
      </mesh>
      {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
        <mesh key={x} position={[x, 0.48, 0.1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ffe27a" emissive="#ffe27a" emissiveIntensity={2.4} />
        </mesh>
      ))}
    </group>
  )
}

function NorthBackboard() {
  return (
    <group>
      <mesh position={[0, 2.15, -8.55]} receiveShadow castShadow>
        <boxGeometry args={[14.2, 4.4, 0.22]} />
        <meshStandardMaterial color="#3a6d78" metalness={0.18} roughness={0.42} />
      </mesh>
      <mesh position={[0, 4.05, -8.4]} castShadow>
        <boxGeometry args={[10.4, 0.1, 0.08]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.28} />
      </mesh>
    </group>
  )
}

export function Studio() {
  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[32, 32, 20]} />
        <meshBasicMaterial color="#eddcc6" side={BackSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 1.2]} receiveShadow>
        <circleGeometry args={[24, 48]} />
        <meshStandardMaterial color="#e3d2bb" roughness={0.74} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[10.2, 48]} />
        <meshStandardMaterial color="#c9b49a" roughness={0.7} metalness={0.06} />
      </mesh>
      <mesh position={[0, 8.2, -19]} receiveShadow>
        <boxGeometry args={[40, 18, 0.4]} />
        <meshStandardMaterial color="#f3e6d4" roughness={0.58} />
      </mesh>
      <mesh position={[-19.5, 8.2, -4]} receiveShadow>
        <boxGeometry args={[0.4, 18, 32]} />
        <meshStandardMaterial color="#f0d8e4" roughness={0.6} />
      </mesh>
      <mesh position={[19.5, 8.2, -4]} receiveShadow>
        <boxGeometry args={[0.4, 18, 32]} />
        <meshStandardMaterial color="#d7e4ec" roughness={0.6} />
      </mesh>
      <mesh position={[-8.6, 6.8, -10.2]}>
        <boxGeometry args={[2.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#fff6df" emissive="#fff1c8" emissiveIntensity={1.05} />
      </mesh>
      <mesh position={[8.6, 6.8, -10.2]}>
        <boxGeometry args={[2.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#fff6df" emissive="#fff1c8" emissiveIntensity={1.05} />
      </mesh>
      <NorthBackboard />
      <Marquee />
    </group>
  )
}
