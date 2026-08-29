import type { Ref } from 'react'
import type { Seat } from '@hhc/shared'
import { BEASTS } from '@hhc/shared'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { vinyl } from './vinyl'

const RING_COUNT = 5

function plate(color: string, metal = 0.55) {
  return { color, metalness: metal, roughness: 0.28 }
}

export function BytebiteChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.72, -0.22]} castShadow>
        <boxGeometry args={[0.98, 0.92, 0.62]} />
        <meshPhysicalMaterial {...vinyl(color)} />
      </mesh>
      <mesh position={[0, 0.78, 0.12]} castShadow>
        <boxGeometry args={[0.78, 0.62, 0.08]} />
        <meshStandardMaterial color="#031018" metalness={0.35} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.78, 0.17]} castShadow>
        <boxGeometry args={[0.68, 0.52, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.1} metalness={0.08} roughness={0.16} />
      </mesh>
      {[-0.16, -0.04, 0.08, 0.2].map((y) => (
        <mesh key={y} position={[0, 0.78 + y, 0.2]}>
          <boxGeometry args={[0.64, 0.02, 0.015]} />
          <meshStandardMaterial color="#041018" />
        </mesh>
      ))}
      <mesh position={[0, 0.78, -0.58]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.42, 16]} />
        <meshStandardMaterial color="#0b2430" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.22, 0.06]} castShadow>
        <boxGeometry args={[1.12, 0.16, 0.72]} />
        <meshStandardMaterial {...plate(accent, 0.4)} />
      </mesh>
      {[-0.36, -0.12, 0.12, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.32, 0.18]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
          <meshStandardMaterial color="#0b1c24" roughness={0.7} />
        </mesh>
      ))}
      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 1.22, -0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.38, 8]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.24, 0]} rotation={[0.6, 0, 0]} castShadow>
            <sphereGeometry args={[0.09, 12, 10]} />
            <meshStandardMaterial color={color} metalness={0.35} roughness={0.22} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function RipsawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.38, -0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.92, 16]} />
        <meshPhysicalMaterial {...vinyl(color)} />
      </mesh>
      <mesh position={[0, 0.38, -0.58]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.26, 0.42, 12]} />
        <meshPhysicalMaterial {...vinyl(accent, { metalness: 0.42, roughness: 0.3 })} />
      </mesh>
      <group position={[0, 0.58, -0.08]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.78, 0.78, 0.1, 36]} />
          <meshStandardMaterial color="#2a0a22" metalness={0.62} roughness={0.22} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 16]} />
          <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
        </mesh>
        {Array.from({ length: 16 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin((i / 16) * Math.PI * 2) * 0.76, 0, Math.cos((i / 16) * Math.PI * 2) * 0.76]}
            rotation={[0, (i / 16) * Math.PI * 2, 0]}
            castShadow
          >
            <coneGeometry args={[0.07, 0.2, 5]} />
            <meshStandardMaterial color={color} metalness={0.62} roughness={0.18} />
          </mesh>
        ))}
      </group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.14, -0.08]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.42]} />
          <meshStandardMaterial {...plate(accent, 0.5)} />
        </mesh>
      ))}
    </group>
  )
}

export function GoldgrubChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      {[
        [0.42, 0.08],
        [0.34, -0.42],
        [0.26, -0.86],
      ].map(([r, z], i) => (
        <group key={i}>
          <mesh position={[0, 0.34, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[r, r * 0.92, 0.72 - i * 0.1, 20]} />
            <meshPhysicalMaterial {...vinyl(color)} />
          </mesh>
          <mesh position={[0, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r * 0.92, 0.035, 8, 20]} />
            <meshStandardMaterial color={accent} metalness={0.62} roughness={0.22} />
          </mesh>
        </group>
      ))}
      {[-0.32, 0.32].map((x) =>
        [0.08, -0.42, -0.86].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.1, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 10]} />
            <meshStandardMaterial color="#2a320c" roughness={0.72} />
          </mesh>
        )),
      )}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.52, 0.16]} castShadow>
          <sphereGeometry args={[0.08, 10, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.86} roughness={0.16} />
        </mesh>
      ))}
    </group>
  )
}

export function BlockmawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.52, -0.16]} castShadow>
        <boxGeometry args={[1.02, 1.02, 0.88]} />
        <meshPhysicalMaterial {...vinyl(color, { metalness: 0.34, roughness: 0.22 })} />
      </mesh>
      {[-0.44, 0.44].map((x) =>
        [0.16, 0.9].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.26]} castShadow>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
          </mesh>
        )),
      )}
      <mesh position={[-0.54, 0.52, -0.08]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 28]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh position={[-0.58, 0.52, -0.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.32, 0.05, 10, 24]} />
        <meshStandardMaterial color={accent} metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh position={[-0.52, 0.52, -0.08]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 10]} />
        <meshStandardMaterial color="#2a2414" />
      </mesh>
      <mesh position={[0, 0.52, -0.16]} castShadow>
        <boxGeometry args={[1.06, 0.08, 0.92]} />
        <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
      </mesh>
      {[-0.28, 0, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.26]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.08]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      ))}
    </group>
  )
}

export function Chassis({ seat }: { seat: Seat }) {
  const { color, accent } = BEASTS[seat]
  if (seat === 0) return <BytebiteChassis color={color} accent={accent} />
  if (seat === 1) return <RipsawChassis color={color} accent={accent} />
  if (seat === 2) return <GoldgrubChassis color={color} accent={accent} />
  return <BlockmawChassis color={color} accent={accent} />
}

export function MachineNeck({
  seat,
  pistonRef,
  ringsRef,
  color,
}: {
  seat: Seat
  pistonRef: Ref<Mesh>
  ringsRef: Ref<Group>
  color: string
}) {
  const gold = seat === 3
  const rings = Array.from({ length: RING_COUNT }, (_, i) => i)
  if (seat === 0) {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[0.48, 0.28, 0.48]} />
          <meshStandardMaterial color="#8fd8e6" metalness={0.45} roughness={0.28} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.85]} castShadow>
          <boxGeometry args={[0.32, 1, 0.32]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} castShadow>
              <boxGeometry args={[0.42, 0.42, 0.1]} />
              <meshStandardMaterial color="#d7eef4" metalness={0.55} roughness={0.22} />
            </mesh>
          ))}
        </group>
      </group>
    )
  }
  if (seat === 1) {
    return (
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.14]} castShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.26, 6]} />
          <meshStandardMaterial color="#3a102e" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.85]} castShadow>
          <cylinderGeometry args={[0.2, 0.24, 1, 6]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.26} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.08, 6]} />
              <meshStandardMaterial color="#f3a6e4" metalness={0.6} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>
    )
  }
  if (seat === 2) {
    return (
      <group>
        <mesh position={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[0.62, 0.34, 0.2]} />
          <meshStandardMaterial color="#6a7a22" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.85]} castShadow>
          <boxGeometry args={[0.46, 1, 0.26]} />
          <meshStandardMaterial color={color} metalness={0.28} roughness={0.38} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} castShadow>
              <boxGeometry args={[0.58, 0.32, 0.09]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.24} />
            </mesh>
          ))}
        </group>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0, 0.14]} castShadow>
        <boxGeometry args={[0.44, 0.44, 0.24]} />
        <meshStandardMaterial color={gold ? '#D4AF37' : '#e8e2d4'} metalness={0.86} roughness={0.16} />
      </mesh>
      <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.85]} castShadow>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#F4F1E8" metalness={0.4} roughness={0.24} />
      </mesh>
      <group ref={ringsRef}>
        {rings.map((i) => (
          <mesh key={i} castShadow>
            <boxGeometry args={[0.4, 0.4, 0.08]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.14} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Teeth({
  count,
  y,
  gold,
  saw,
  long,
}: {
  count: number
  y: number
  gold: boolean
  saw: boolean
  long: number
}) {
  const span = 1.05
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : i / (count - 1)
        const x = -span / 2 + t * span
        const gilded = gold && i === Math.floor(count / 2)
        return (
          <group key={i} position={[x, y, 0.16]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, long, 0.12]} />
              <meshPhysicalMaterial
                color={gilded ? '#D4AF37' : '#fff6e8'}
                metalness={gilded ? 0.8 : 0.38}
                roughness={0.06}
                clearcoat={1}
                clearcoatRoughness={0.04}
              />
            </mesh>
            {saw ? (
              <mesh position={[0, y > 0 ? 0.12 : -0.12, 0.06]} rotation={[y > 0 ? -0.5 : 0.5, 0, 0]} castShadow>
                <coneGeometry args={[0.07, 0.18, 5]} />
                <meshStandardMaterial color="#FF2BD6" metalness={0.65} roughness={0.2} />
              </mesh>
            ) : null}
          </group>
        )
      })}
    </group>
  )
}

export function MachineMouth({
  jawsRef,
  seat,
}: {
  jawsRef: Ref<Group>
  seat: Seat
}) {
  const { color, accent } = BEASTS[seat]
  const saw = seat === 1
  const gold = seat === 3 || seat === 2
  const wide = seat === 2 ? 1.12 : seat === 0 ? 1 : 0.92
  return (
    <group>
      <mesh position={[0, 0.1, -0.16]} castShadow>
        <boxGeometry args={[1.35 * wide, 0.4, 0.55]} />
        <meshPhysicalMaterial {...vinyl(color, { metalness: seat === 3 ? 0.38 : 0.22 })} />
      </mesh>
      <mesh position={[0, 0.02, 0.34]} castShadow>
        <boxGeometry args={[1.22 * wide, 0.72, 0.78]} />
        <meshStandardMaterial color="#3a0c16" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.02, 0.62]}>
        <boxGeometry args={[1.08 * wide, 0.52, 0.2]} />
        <meshStandardMaterial color="#e25574" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0.74]}>
        <planeGeometry args={[1.02 * wide, 0.58]} />
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.55} />
      </mesh>
      <group ref={jawsRef} position={[0, 0.02, 0.28]}>
        <mesh position={[0, 0, 0.02]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
        <group position={[0, 0.16, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.48 * wide, 0.18, 0.82]} />
            <meshPhysicalMaterial {...vinyl(color)} />
          </mesh>
          <mesh position={[0, -0.14, 0.12]}>
            <boxGeometry args={[1.28 * wide, 0.16, 0.64]} />
            <meshStandardMaterial color="#e25574" roughness={0.96} />
          </mesh>
          <Teeth count={seat === 1 ? 8 : 7} y={-0.3} gold={gold} saw={saw} long={0.36} />
        </group>
        <group position={[0, -0.16, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.38 * wide, 0.16, 0.76]} />
            <meshPhysicalMaterial {...vinyl(seat === 3 ? accent : color)} />
          </mesh>
          <mesh position={[0, 0.14, 0.1]}>
            <boxGeometry args={[1.2 * wide, 0.16, 0.58]} />
            <meshStandardMaterial color="#c43b58" roughness={0.96} />
          </mesh>
          <Teeth count={seat === 1 ? 8 : 7} y={0.3} gold={gold} saw={false} long={0.34} />
        </group>
      </group>
    </group>
  )
}

export function HeadDressing({
  seat,
  visorRef,
  antL,
  antR,
}: {
  seat: Seat
  visorRef: Ref<MeshStandardMaterial>
  antL: Ref<Group>
  antR: Ref<Group>
}) {
  const { color, accent } = BEASTS[seat]
  if (seat === 0) {
    return (
      <group>
        <mesh position={[0, 0.34, 0.08]} castShadow>
          <boxGeometry args={[1.12, 0.14, 0.38]} />
          <meshStandardMaterial color="#061018" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0.28]} castShadow>
          <boxGeometry args={[0.96, 0.1, 0.07]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.6}
            metalness={0.12}
            roughness={0.12}
          />
        </mesh>
        <group ref={antL} position={[-0.28, 0.48, -0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
        </group>
        <group ref={antR} position={[0.28, 0.48, -0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
        </group>
      </group>
    )
  }
  if (seat === 1) {
    return (
      <group>
        <mesh position={[0, 0.32, 0.14]} rotation={[0.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 24]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            metalness={0.45}
            roughness={0.18}
          />
        </mesh>
        <group ref={antL} position={[-0.26, 0.42, -0.04]} />
        <group ref={antR} position={[0.26, 0.42, -0.04]} />
      </group>
    )
  }
  if (seat === 2) {
    return (
      <group>
        <mesh position={[-0.72, 0.08, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.28, 12]} />
          <meshPhysicalMaterial {...vinyl(color)} />
        </mesh>
        <mesh position={[0.72, 0.08, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.28, 12]} />
          <meshPhysicalMaterial {...vinyl(color)} />
        </mesh>
        <mesh position={[0, 0.28, 0.22]} castShadow>
          <boxGeometry args={[0.78, 0.1, 0.08]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.2}
            metalness={0.15}
            roughness={0.16}
          />
        </mesh>
        <group ref={antL} position={[-0.46, 0.32, -0.06]} />
        <group ref={antR} position={[0.46, 0.32, -0.06]} />
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0.34, 0.06]} castShadow>
        <boxGeometry args={[1.18, 0.08, 0.52]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.28, 0.28]} castShadow>
        <boxGeometry args={[0.86, 0.09, 0.06]} />
        <meshStandardMaterial
          ref={visorRef}
          color={accent}
          emissive={accent}
          emissiveIntensity={2.4}
          metalness={0.7}
          roughness={0.16}
        />
      </mesh>
      <group ref={antL} position={[-0.36, 0.44, -0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.18, 0.07]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      </group>
      <group ref={antR} position={[0.36, 0.44, -0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.18, 0.07]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      </group>
    </group>
  )
}
