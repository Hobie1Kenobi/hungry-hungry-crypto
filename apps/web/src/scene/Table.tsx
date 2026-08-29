import { Grid } from '@react-three/drei'

const TABLE = 13.1
const TOP = 12.4

export function Table() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial color="#141b28" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[TABLE, 0.28, TABLE]} />
        <meshStandardMaterial color="#3a4d66" metalness={0.38} roughness={0.48} />
      </mesh>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[TOP + 0.28, 0.06, TOP + 0.28]} />
        <meshStandardMaterial color="#5a6f88" metalness={0.42} roughness={0.38} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[TOP, TOP]} />
        <meshStandardMaterial color="#2a3a4e" metalness={0.18} roughness={0.62} />
      </mesh>
      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor="#3a6a82"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#4d8aa4"
        fadeDistance={14}
        fadeStrength={1.1}
        position={[0, 0.04, 0]}
      />
    </group>
  )
}
