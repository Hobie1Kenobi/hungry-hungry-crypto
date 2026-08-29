import { POND_SIZE } from '@hhc/shared'

const TABLE = 13.4
const APRON = 12.6
const PLAY = 10.2
const HOLE = POND_SIZE + 0.2

function SlabMat({
  color,
  metalness,
  roughness,
  physical,
}: {
  color: string
  metalness: number
  roughness: number
  physical?: boolean
}) {
  return physical ? (
    <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={0.7} clearcoatRoughness={0.24} />
  ) : (
    <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
  )
}

function CutoutSlab({
  size,
  hole,
  y,
  height,
  color,
  metalness,
  roughness,
  physical,
}: {
  size: number
  hole: number
  y: number
  height: number
  color: string
  metalness: number
  roughness: number
  physical?: boolean
}) {
  const band = (size - hole) / 2
  const mid = hole / 2 + band / 2
  const faces: Array<[number, number, number, number, number]> = [
    [0, mid, size, height, band],
    [0, -mid, size, height, band],
    [mid, 0, band, height, hole],
    [-mid, 0, band, height, hole],
  ]
  return (
    <group>
      {faces.map(([x, z, w, h, d]) => (
        <mesh key={`${x}:${z}`} position={[x, y, z]} receiveShadow castShadow>
          <boxGeometry args={[w, h, d]} />
          <SlabMat color={color} metalness={metalness} roughness={roughness} physical={physical} />
        </mesh>
      ))}
    </group>
  )
}

function Rivets() {
  const spots: Array<[number, number, number]> = []
  const y = 0.22
  const inset = TABLE / 2 - 0.22
  for (let i = -5; i <= 5; i += 1) {
    const t = (i / 5) * inset
    spots.push([t, y, -inset], [t, y, inset], [-inset, y, t], [inset, y, t])
  }
  return (
    <group>
      {spots.map(([x, yy, z], i) => (
        <mesh key={i} position={[x, yy, z]} castShadow>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#c9d2dc" metalness={0.82} roughness={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function RubberFeet() {
  const s = TABLE / 2 - 0.55
  const feet: Array<[number, number]> = [
    [-s, -s],
    [s, -s],
    [-s, s],
    [s, s],
  ]
  return (
    <group>
      {feet.map(([x, z], i) => (
        <group key={i} position={[x, -0.58, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.36, 0.22, 16]} />
            <meshStandardMaterial color="#1a1214" roughness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SideStripe({ color, pos, rot }: { color: string; pos: [number, number, number]; rot: [number, number, number] }) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <boxGeometry args={[3.4, 0.18, 0.08]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} metalness={0.2} roughness={0.4} />
    </mesh>
  )
}

export function Table() {
  return (
    <group>
      <CutoutSlab size={TABLE} hole={HOLE} y={-0.28} height={0.62} color="#2a3d52" metalness={0.3} roughness={0.32} physical />
      <CutoutSlab size={APRON} hole={HOLE} y={0.06} height={0.1} color="#145864" metalness={0.38} roughness={0.3} physical />
      <CutoutSlab size={PLAY} hole={HOLE} y={0.14} height={0.08} color="#102028" metalness={0.2} roughness={0.55} />
      <mesh position={[0, -0.12, -TABLE / 2 - 0.06]} castShadow>
        <boxGeometry args={[TABLE + 0.2, 0.85, 0.22]} />
        <meshPhysicalMaterial color="#243140" metalness={0.3} roughness={0.38} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, -0.12, TABLE / 2 + 0.06]} castShadow>
        <boxGeometry args={[TABLE + 0.2, 0.85, 0.22]} />
        <meshPhysicalMaterial color="#243140" metalness={0.3} roughness={0.38} clearcoat={0.5} />
      </mesh>
      <mesh position={[-TABLE / 2 - 0.06, -0.12, 0]} castShadow>
        <boxGeometry args={[0.22, 0.85, TABLE]} />
        <meshPhysicalMaterial color="#243140" metalness={0.3} roughness={0.38} clearcoat={0.5} />
      </mesh>
      <mesh position={[TABLE / 2 + 0.06, -0.12, 0]} castShadow>
        <boxGeometry args={[0.22, 0.85, TABLE]} />
        <meshPhysicalMaterial color="#243140" metalness={0.3} roughness={0.38} clearcoat={0.5} />
      </mesh>
      <SideStripe color="#00E5FF" pos={[0, 0.28, -TABLE / 2 - 0.02]} rot={[0, 0, 0]} />
      <SideStripe color="#B8FF2C" pos={[0, 0.28, TABLE / 2 + 0.02]} rot={[0, 0, 0]} />
      <SideStripe color="#FF2BD6" pos={[TABLE / 2 + 0.02, 0.28, 0]} rot={[0, Math.PI / 2, 0]} />
      <SideStripe color="#D4AF37" pos={[-TABLE / 2 - 0.02, 0.28, 0]} rot={[0, Math.PI / 2, 0]} />
      <Rivets />
      <RubberFeet />
    </group>
  )
}
