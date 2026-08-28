import { Billboard, Text } from '@react-three/drei'
import type { Seat } from '@hhc/shared'
import { BEASTS, beastPosition, beastYaw, chompReach } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

function Jaws({ open, color, accent, scale = 1 }: { open: number; color: string; accent: string; scale?: number }) {
  const angle = open * 0.55
  return (
    <group scale={scale}>
      <group rotation={[angle, 0, 0]} position={[0, 0.12, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.22, 0.16, 0.78]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0.38, -0.12, 0.18]} castShadow>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[-0.38, -0.12, 0.18]} castShadow>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
      <group rotation={[-angle, 0, 0]} position={[0, -0.12, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.18, 0.14, 0.74]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.42} />
        </mesh>
        <mesh position={[0.36, 0.11, 0.2]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[-0.36, 0.11, 0.2]} castShadow>
          <boxGeometry args={[0.1, 0.12, 0.1]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
    </group>
  )
}

export function Beast({ seat }: { seat: Seat }) {
  const spec = BEASTS[seat]
  const extend = useGameStore((s) => s.neckExtend[seat])
  const you = useGameStore((s) => s.localSeat === seat)
  const [x, y, z] = beastPosition(seat)
  const yaw = beastYaw(seat)
  const neckLen = chompReach(extend)
  const squat = 1 - extend * 0.08
  const fromBehind = seat === 0
  const pitch = 0.05
  const lift = fromBehind ? 0.78 : 0.62
  const side = 0
  const neckW = fromBehind ? 0.58 : 0.42
  const neckH = fromBehind ? 0.4 : 0.3

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.02, -0.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.05, 24]} />
        <meshStandardMaterial color={spec.color} transparent opacity={0.18} />
      </mesh>
      <group position={[0, 0.55 * squat, -0.15]} scale={[1, squat, 1]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.48, 0.55, 6, 12]} />
          <meshStandardMaterial color={spec.color} metalness={0.28} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.22, 0.12]} castShadow>
          <boxGeometry args={[0.72, 0.18, 0.28]} />
          <meshStandardMaterial
            color="#0b1018"
            emissive={spec.color}
            emissiveIntensity={0.55}
          />
        </mesh>
        <mesh position={[-0.18, 0.58, -0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 8]} />
          <meshStandardMaterial color={spec.accent} />
        </mesh>
        <mesh position={[0.18, 0.58, -0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.42, 8]} />
          <meshStandardMaterial color={spec.accent} />
        </mesh>
        <mesh position={[-0.18, 0.8, -0.05]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.18, 0.8, -0.05]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[-0.38, -0.42, 0.18]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.42]} />
          <meshStandardMaterial color={spec.accent} />
        </mesh>
        <mesh position={[0.38, -0.42, 0.18]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.42]} />
          <meshStandardMaterial color={spec.accent} />
        </mesh>
      </group>
      <group position={[side, lift, 0.28]} rotation={[pitch, 0, 0]}>
        <mesh position={[0, 0, neckLen / 2]} castShadow>
          <boxGeometry args={[neckW, neckH, neckLen]} />
          <meshStandardMaterial
            color={spec.color}
            metalness={0.4}
            roughness={0.32}
            emissive={spec.color}
            emissiveIntensity={fromBehind ? 0.7 + extend * 0.9 : 0.12}
          />
        </mesh>
        <group position={[0, 0, neckLen]}>
          <Jaws open={extend} color={spec.color} accent={spec.accent} scale={fromBehind ? 1.18 : 1} />
        </group>
      </group>
      <Billboard position={[0, 1.72, 0]}>
        <Text fontSize={0.26} color={spec.color} anchorX="center" anchorY="middle">
          {you ? `${spec.name}  YOU` : spec.name}
        </Text>
      </Billboard>
    </group>
  )
}
