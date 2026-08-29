import { Grid } from '@react-three/drei'

const TABLE = 13.1
const TOP = 12.4

export function Table() {
  return (
    <group>
      <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[TABLE, 0.28, TABLE]} />
        <meshStandardMaterial color="#4a6078" metalness={0.32} roughness={0.46} />
      </mesh>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[TOP + 0.28, 0.06, TOP + 0.28]} />
        <meshStandardMaterial color="#7a90a8" metalness={0.36} roughness={0.34} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[TOP, TOP]} />
        <meshStandardMaterial color="#33485c" metalness={0.14} roughness={0.58} />
      </mesh>
      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor="#4a7e96"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#62a0b8"
        fadeDistance={13}
        fadeStrength={0.9}
        position={[0, 0.04, 0]}
      />
    </group>
  )
}
