import { Grid } from '@react-three/drei'
import { POND_SIZE } from '@hhc/shared'

export function Table() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[11.2, 11.2, 0.16, 48]} />
        <meshStandardMaterial color="#121722" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[POND_SIZE + 5.4, POND_SIZE + 5.4]} />
        <meshStandardMaterial color="#0b0f18" metalness={0.3} roughness={0.7} />
      </mesh>
      <Grid
        args={[16, 16]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#123044"
        sectionSize={2}
        sectionThickness={1.1}
        sectionColor="#1b4d63"
        fadeDistance={22}
        fadeStrength={1.4}
        position={[0, 0.02, 0]}
      />
    </group>
  )
}
