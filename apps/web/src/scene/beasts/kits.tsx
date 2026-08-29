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
      <mesh position={[0, 1.22, -0.18]} castShadow>
        <boxGeometry args={[1.55, 1.72, 1.18]} />
        <meshPhysicalMaterial {...vinyl(color)} />
      </mesh>
      <mesh position={[0, 1.28, 0.44]} castShadow>
        <boxGeometry args={[1.28, 1.18, 0.1]} />
        <meshStandardMaterial color="#031018" metalness={0.35} roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.28, 0.5]} castShadow>
        <boxGeometry args={[1.16, 1.04, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.1} metalness={0.08} roughness={0.16} />
      </mesh>
      {[-0.32, -0.1, 0.12, 0.34].map((y) => (
        <mesh key={y} position={[0, 1.28 + y, 0.54]}>
          <boxGeometry args={[1.1, 0.03, 0.02]} />
          <meshStandardMaterial color="#041018" />
        </mesh>
      ))}
      <mesh position={[0, 0.28, -0.08]} castShadow>
        <boxGeometry args={[1.82, 0.32, 1.42]} />
        <meshStandardMaterial {...plate(accent, 0.4)} />
      </mesh>
      {[-0.62, -0.31, 0, 0.31, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.46, 0.18]}>
          <boxGeometry args={[0.24, 0.06, 0.42]} />
          <meshStandardMaterial color="#0b1c24" roughness={0.7} />
        </mesh>
      ))}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 1.18, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.85, 0.22]} />
          <meshStandardMaterial color="#8fd8e6" metalness={0.35} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 2.16, -0.08]} castShadow>
        <boxGeometry args={[0.7, 0.16, 0.36]} />
        <meshStandardMaterial {...plate(accent, 0.45)} />
      </mesh>
    </group>
  )
}

export function RipsawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.62, -0.22]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 0.82, 1.55]} />
        <meshPhysicalMaterial {...vinyl(color)} />
      </mesh>
      <mesh position={[0, 0.95, -0.55]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.82, 0.28, 0.95]} />
        <meshPhysicalMaterial {...vinyl(accent, { metalness: 0.42, roughness: 0.3 })} />
      </mesh>
      <group position={[-0.02, 0.92, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.18, 1.18, 0.14, 36]} />
          <meshStandardMaterial color="#2a0a22" metalness={0.62} roughness={0.22} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.18, 16]} />
          <meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} />
        </mesh>
        {Array.from({ length: 16 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin((i / 16) * Math.PI * 2) * 1.16, 0, Math.cos((i / 16) * Math.PI * 2) * 1.16]}
            rotation={[0, (i / 16) * Math.PI * 2, 0]}
            castShadow
          >
            <coneGeometry args={[0.1, 0.28, 5]} />
            <meshStandardMaterial color={color} metalness={0.62} roughness={0.18} />
          </mesh>
        ))}
      </group>
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, 0.28, -0.12]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.72]} />
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
        [2.55, 0.78, 0.12],
        [2.15, 0.7, -0.62],
        [1.72, 0.62, -1.22],
      ].map(([w, h, z], i) => (
        <group key={i}>
          <mesh position={[0, 0.42, z]} castShadow>
            <boxGeometry args={[w, h, 0.58]} />
            <meshPhysicalMaterial {...vinyl(color)} />
          </mesh>
          <mesh position={[0, 0.42 + h / 2 + 0.03, z]} castShadow>
            <boxGeometry args={[w * 0.92, 0.08, 0.12]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
        </group>
      ))}
      {[-1.05, 1.05].map((x) =>
        [0.12, -0.62, -1.22].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.12, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.2, 10]} />
            <meshStandardMaterial color="#2a320c" roughness={0.72} />
          </mesh>
        )),
      )}
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.72, 0.18]} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.22]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.86} roughness={0.16} />
        </mesh>
      ))}
    </group>
  )
}

export function BlockmawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.82, -0.28]} castShadow>
        <boxGeometry args={[1.72, 1.64, 1.55]} />
        <meshPhysicalMaterial {...vinyl(color, { metalness: 0.34, roughness: 0.22 })} />
      </mesh>
      {[-0.78, 0.78].map((x) =>
        [0.12, 1.52].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.42]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.22]} />
            <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
          </mesh>
        )),
      )}
      <mesh position={[-0.9, 0.82, -0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.58, 0.58, 0.12, 28]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh position={[-0.96, 0.82, -0.12]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.58, 0.08, 10, 24]} />
        <meshStandardMaterial color={accent} metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh position={[-0.86, 0.82, -0.12]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 10]} />
        <meshStandardMaterial color="#2a2414" />
      </mesh>
      <mesh position={[0, 0.82, -0.28]} castShadow>
        <boxGeometry args={[1.78, 0.12, 1.6]} />
        <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
      </mesh>
      {[-0.55, 0, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.22, 0.42]} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.12]} />
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
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.22]} castShadow>
          <boxGeometry args={[0.78, 0.42, 0.78]} />
          <meshStandardMaterial color="#8fd8e6" metalness={0.45} roughness={0.28} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.1]} castShadow>
          <boxGeometry args={[0.52, 1, 0.52]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} castShadow>
              <boxGeometry args={[0.68, 0.68, 0.14]} />
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
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.46, 0.5, 0.36, 6]} />
          <meshStandardMaterial color="#3a102e" metalness={0.55} roughness={0.28} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.1]} castShadow>
          <cylinderGeometry args={[0.32, 0.36, 1, 6]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.26} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 6]} />
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
        <mesh position={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[0.95, 0.55, 0.28]} />
          <meshStandardMaterial color="#6a7a22" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.1]} castShadow>
          <boxGeometry args={[0.72, 1, 0.38]} />
          <meshStandardMaterial color={color} metalness={0.28} roughness={0.38} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} castShadow>
              <boxGeometry args={[0.92, 0.48, 0.12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.24} />
            </mesh>
          ))}
        </group>
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.36]} />
        <meshStandardMaterial color={gold ? '#D4AF37' : '#e8e2d4'} metalness={0.86} roughness={0.16} />
      </mesh>
      <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.1]} castShadow>
        <boxGeometry args={[0.48, 1, 0.48]} />
        <meshStandardMaterial color="#F4F1E8" metalness={0.4} roughness={0.24} />
      </mesh>
      <group ref={ringsRef}>
        {rings.map((i) => (
          <mesh key={i} castShadow>
            <boxGeometry args={[0.62, 0.62, 0.1]} />
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
  const span = 1.55
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : i / (count - 1)
        const x = -span / 2 + t * span
        const gilded = gold && i === Math.floor(count / 2)
        return (
          <group key={i} position={[x, y, 0.22]}>
            <mesh castShadow>
              <boxGeometry args={[0.18, long, 0.18]} />
              <meshPhysicalMaterial
                color={gilded ? '#D4AF37' : '#fff6e8'}
                metalness={gilded ? 0.8 : 0.38}
                roughness={0.06}
                clearcoat={1}
                clearcoatRoughness={0.04}
              />
            </mesh>
            {saw ? (
              <mesh position={[0, y > 0 ? 0.18 : -0.18, 0.08]} rotation={[y > 0 ? -0.5 : 0.5, 0, 0]} castShadow>
                <coneGeometry args={[0.1, 0.26, 5]} />
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
  const wide = seat === 2 ? 1.22 : seat === 0 ? 1.08 : 1
  return (
    <group>
      <mesh position={[0, 0.16, -0.22]} castShadow>
        <boxGeometry args={[2.05 * wide, 0.62, 0.85]} />
        <meshPhysicalMaterial {...vinyl(color, { metalness: seat === 3 ? 0.38 : 0.22 })} />
      </mesh>
      <mesh position={[0, 0.02, 0.48]} castShadow>
        <boxGeometry args={[1.98 * wide, 1.05, 1.22]} />
        <meshStandardMaterial color="#3a0c16" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.02, 0.88]}>
        <boxGeometry args={[1.78 * wide, 0.78, 0.28]} />
        <meshStandardMaterial color="#e25574" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 1.05]}>
        <planeGeometry args={[1.7 * wide, 0.86]} />
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.55} />
      </mesh>
      <group ref={jawsRef} position={[0, 0.02, 0.38]}>
        <mesh position={[0, 0, 0.02]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
        <group position={[0, 0.22, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[2.22 * wide, 0.28, 1.22]} />
            <meshPhysicalMaterial {...vinyl(color)} />
          </mesh>
          <mesh position={[0, -0.2, 0.16]}>
            <boxGeometry args={[1.92 * wide, 0.24, 0.95]} />
            <meshStandardMaterial color="#e25574" roughness={0.96} />
          </mesh>
          <Teeth count={seat === 1 ? 8 : 7} y={-0.42} gold={gold} saw={saw} long={0.52} />
        </group>
        <group position={[0, -0.22, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[2.08 * wide, 0.26, 1.12]} />
            <meshPhysicalMaterial {...vinyl(seat === 3 ? accent : color)} />
          </mesh>
          <mesh position={[0, 0.2, 0.14]}>
            <boxGeometry args={[1.82 * wide, 0.24, 0.88]} />
            <meshStandardMaterial color="#c43b58" roughness={0.96} />
          </mesh>
          <Teeth count={seat === 1 ? 8 : 7} y={0.42} gold={gold} saw={false} long={0.5} />
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
        <mesh position={[0, 0.52, 0.12]} castShadow>
          <boxGeometry args={[1.7, 0.22, 0.55]} />
          <meshStandardMaterial color="#061018" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.52, 0.42]} castShadow>
          <boxGeometry args={[1.48, 0.16, 0.1]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.6}
            metalness={0.12}
            roughness={0.12}
          />
        </mesh>
        <group ref={antL} position={[-0.42, 0.72, -0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
        </group>
        <group ref={antR} position={[0.42, 0.72, -0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial color={accent} metalness={0.5} roughness={0.28} />
          </mesh>
        </group>
      </group>
    )
  }
  if (seat === 1) {
    return (
      <group>
        <mesh position={[0, 0.48, 0.2]} rotation={[0.25, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 24]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            metalness={0.45}
            roughness={0.18}
          />
        </mesh>
        <group ref={antL} position={[-0.38, 0.62, -0.06]} />
        <group ref={antR} position={[0.38, 0.62, -0.06]} />
      </group>
    )
  }
  if (seat === 2) {
    return (
      <group>
        <mesh position={[-1.12, 0.12, 0.08]} castShadow>
          <boxGeometry args={[0.55, 0.48, 0.7]} />
          <meshPhysicalMaterial {...vinyl(color)} />
        </mesh>
        <mesh position={[1.12, 0.12, 0.08]} castShadow>
          <boxGeometry args={[0.55, 0.48, 0.7]} />
          <meshPhysicalMaterial {...vinyl(color)} />
        </mesh>
        <mesh position={[0, 0.42, 0.32]} castShadow>
          <boxGeometry args={[1.15, 0.16, 0.12]} />
          <meshStandardMaterial
            ref={visorRef}
            color={color}
            emissive={color}
            emissiveIntensity={2.2}
            metalness={0.15}
            roughness={0.16}
          />
        </mesh>
        <group ref={antL} position={[-0.7, 0.48, -0.08]} />
        <group ref={antR} position={[0.7, 0.48, -0.08]} />
      </group>
    )
  }
  return (
    <group>
      <mesh position={[0, 0.52, 0.08]} castShadow>
        <boxGeometry args={[1.85, 0.12, 0.85]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.42, 0.42]} castShadow>
        <boxGeometry args={[1.35, 0.14, 0.08]} />
        <meshStandardMaterial
          ref={visorRef}
          color={accent}
          emissive={accent}
          emissiveIntensity={2.4}
          metalness={0.7}
          roughness={0.16}
        />
      </mesh>
      <group ref={antL} position={[-0.55, 0.68, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      </group>
      <group ref={antR} position={[0.55, 0.68, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      </group>
    </group>
  )
}
