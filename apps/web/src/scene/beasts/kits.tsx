import { RoundedBox } from '@react-three/drei'
import type { Ref } from 'react'
import type { Seat } from '@hhc/shared'
import { BEASTS } from '@hhc/shared'
import type { Group, MeshStandardMaterial } from 'three'
import { vinyl } from './vinyl'

function plate(color: string, metal = 0.55) {
  return { color, metalness: metal, roughness: 0.28 }
}

export function BytebiteChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <RoundedBox args={[2.05, 1.18, 1.62]} radius={0.07} smoothness={3} position={[0, 0.58, -0.42]} castShadow>
        <meshPhysicalMaterial {...vinyl(color)} />
      </RoundedBox>
      <RoundedBox args={[1.72, 0.62, 0.12]} radius={0.04} smoothness={3} position={[0, 0.82, -1.18]} castShadow>
        <meshStandardMaterial color="#061018" metalness={0.4} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.82, -1.1]} castShadow>
        <boxGeometry args={[1.52, 0.48, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} metalness={0.12} roughness={0.18} />
      </mesh>
      {[-0.28, 0, 0.28].map((y) => (
        <mesh key={y} position={[0, 0.82 + y * 0.22, -1.06]}>
          <boxGeometry args={[1.46, 0.025, 0.02]} />
          <meshStandardMaterial color="#041016" />
        </mesh>
      ))}
      <RoundedBox args={[1.86, 0.16, 0.72]} radius={0.04} smoothness={3} position={[0, 1.12, -0.18]} castShadow>
        <meshStandardMaterial {...plate(accent, 0.35)} />
      </RoundedBox>
      {[-0.62, -0.31, 0, 0.31, 0.62].map((x) =>
        [-0.16, 0.08].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 1.22, z - 0.12]}>
            <boxGeometry args={[0.22, 0.05, 0.14]} />
            <meshStandardMaterial color="#0b1c24" roughness={0.7} />
          </mesh>
        )),
      )}
      {[-0.92, 0.92].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.52, -0.22]} castShadow>
            <boxGeometry args={[0.18, 0.42, 0.55]} />
            <meshStandardMaterial {...plate(accent, 0.4)} />
          </mesh>
          <mesh position={[x * 1.08, 0.62, -0.08]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
      {[-0.7, -0.35, 0, 0.35, 0.7].map((y) => (
        <mesh key={y} position={[-0.98, 0.55 + y * 0.12, -0.55]}>
          <boxGeometry args={[0.08, 0.04, 0.42]} />
          <meshStandardMaterial color="#0a1820" />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.28, 8]} />
        <meshStandardMaterial color="#cfd6de" metalness={0.88} roughness={0.16} />
      </mesh>
    </group>
  )
}

export function RipsawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.48, -0.28]} rotation={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[1.72, 0.92, 1.85]} />
        <meshPhysicalMaterial {...vinyl(color)} />
      </mesh>
      <mesh position={[0, 0.92, -0.55]} rotation={[0.42, 0, 0]} castShadow>
        <boxGeometry args={[1.48, 0.38, 1.15]} />
        <meshPhysicalMaterial {...vinyl(accent, { metalness: 0.4, roughness: 0.32 })} />
      </mesh>
      {[-0.88, 0.88].map((x) => (
        <group key={x} position={[x, 0.72, -0.28]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.1, 28]} />
            <meshStandardMaterial color="#2a0a22" metalness={0.55} roughness={0.28} />
          </mesh>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh
              key={i}
              position={[Math.sin((i / 8) * Math.PI * 2) * 0.62, 0, Math.cos((i / 8) * Math.PI * 2) * 0.62]}
              rotation={[0, (i / 8) * Math.PI * 2, 0]}
              castShadow
            >
              <coneGeometry args={[0.08, 0.2, 5]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.22} />
            </mesh>
          ))}
        </group>
      ))}
      {[-0.46, -0.15, 0.15, 0.46].map((x) => (
        <mesh key={x} position={[x, 1.12, 0.08]} rotation={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.42]} />
          <meshStandardMaterial color={accent} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.86, 0.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.46, 0.3, 8]} />
        <meshStandardMaterial color="#d7dee6" metalness={0.9} roughness={0.14} />
      </mesh>
    </group>
  )
}

export function GoldgrubChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <RoundedBox args={[2.28, 1.02, 0.92]} radius={0.22} smoothness={4} position={[0, 0.52, 0.06]} castShadow>
        <meshPhysicalMaterial {...vinyl(color)} />
      </RoundedBox>
      <RoundedBox args={[2.42, 1.12, 0.95]} radius={0.24} smoothness={4} position={[0, 0.5, -0.58]} castShadow>
        <meshPhysicalMaterial {...vinyl(color)} />
      </RoundedBox>
      <RoundedBox args={[2.12, 0.98, 0.86]} radius={0.22} smoothness={4} position={[0, 0.46, -1.18]} castShadow>
        <meshPhysicalMaterial {...vinyl(color)} />
      </RoundedBox>
      {[-0.08, 0.52, 1.05].map((z, i) => (
        <mesh key={z} position={[0, 1.02, -z]} castShadow>
          <boxGeometry args={[2.05 - i * 0.08, 0.08, 0.1]} />
          <meshStandardMaterial color={accent} metalness={0.45} roughness={0.32} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((x) =>
        [0.05, -0.55, -1.12].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.18, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.22, 10]} />
            <meshStandardMaterial color="#2a320c" roughness={0.7} />
          </mesh>
        )),
      )}
      {[
        [-0.7, 0.78, -0.52],
        [0.7, 0.78, -0.52],
        [-0.55, 0.72, -1.12],
        [0.55, 0.72, -1.12],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, 0.82, 0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.5, 0.32, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.86} roughness={0.16} />
      </mesh>
    </group>
  )
}

export function BlockmawChassis({ color, accent }: { color: string; accent: string }) {
  return (
    <group>
      <RoundedBox args={[1.92, 1.32, 1.68]} radius={0.06} smoothness={3} position={[0, 0.66, -0.38]} castShadow>
        <meshPhysicalMaterial {...vinyl(color, { metalness: 0.32, roughness: 0.24 })} />
      </RoundedBox>
      <mesh position={[0, 0.66, -0.38]} castShadow>
        <boxGeometry args={[1.98, 0.14, 1.74]} />
        <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
      </mesh>
      <mesh position={[0, 1.12, -0.38]} castShadow>
        <boxGeometry args={[1.98, 0.1, 1.74]} />
        <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.66, -1.18]} castShadow>
        <boxGeometry args={[0.14, 1.28, 1.68]} />
        <meshStandardMaterial color={accent} metalness={0.86} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.92, -1.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.22, 0.045, 10, 20]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh position={[0, 0.92, -1.18]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 10]} />
        <meshStandardMaterial color="#2a2414" />
      </mesh>
      {[-0.7, -0.35, 0, 0.35, 0.7].map((x) =>
        [0.28, 1.04].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, -1.2]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color={accent} metalness={0.85} roughness={0.2} />
          </mesh>
        )),
      )}
      {[
        [-0.88, 1.22, 0.28],
        [0.88, 1.22, 0.28],
        [-0.88, 0.18, 0.28],
        [0.88, 0.18, 0.28],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.22]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.16} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.46, 0.3, 8]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.14} />
      </mesh>
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

function Teeth({
  count,
  y,
  gold,
  saw,
}: {
  count: number
  y: number
  gold: boolean
  saw: boolean
}) {
  const span = 1.42
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0 : i / (count - 1)
        const x = -span / 2 + t * span
        const gilded = gold && i === Math.floor(count / 2)
        return (
          <group key={i} position={[x, y, 0.28]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.34, 0.16]} />
              <meshPhysicalMaterial
                color={gilded ? '#D4AF37' : '#fff6e8'}
                metalness={gilded ? 0.8 : 0.42}
                roughness={0.07}
                clearcoat={1}
                clearcoatRoughness={0.04}
              />
            </mesh>
            {saw ? (
              <mesh position={[0, y > 0 ? 0.22 : -0.22, 0.06]} rotation={[y > 0 ? -0.4 : 0.4, 0, 0]} castShadow>
                <coneGeometry args={[0.09, 0.22, 5]} />
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
  const wide = seat === 2 ? 1.12 : 1
  return (
    <group>
      <RoundedBox args={[2.05 * wide, 0.62, 1.22]} radius={0.1} smoothness={4} position={[0, 0.12, -0.18]} castShadow>
        <meshPhysicalMaterial {...vinyl(color, { metalness: seat === 3 ? 0.38 : 0.22 })} />
      </RoundedBox>
      <mesh position={[0, 0.02, 0.22]}>
        <boxGeometry args={[1.72 * wide, 0.62, 0.85]} />
        <meshStandardMaterial color="#14080c" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.02, 0.48]}>
        <planeGeometry args={[1.55 * wide, 0.5]} />
        <meshBasicMaterial color="#3a1020" transparent opacity={0.55} />
      </mesh>
      <group ref={jawsRef} position={[0, 0.02, 0.32]}>
        <mesh position={[0, 0, 0.02]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
        <group position={[0, 0.2, 0.02]}>
          <RoundedBox args={[2.15 * wide, 0.32, 1.18]} radius={0.08} smoothness={3} castShadow>
            <meshPhysicalMaterial {...vinyl(color)} />
          </RoundedBox>
          <mesh position={[0, -0.18, 0.18]}>
            <boxGeometry args={[1.82 * wide, 0.2, 0.88]} />
            <meshStandardMaterial color="#d44562" roughness={0.96} />
          </mesh>
          <Teeth count={7} y={-0.38} gold={gold} saw={saw} />
        </group>
        <group position={[0, -0.2, 0.02]}>
          <RoundedBox args={[2.02 * wide, 0.3, 1.1]} radius={0.08} smoothness={3} castShadow>
            <meshPhysicalMaterial {...vinyl(seat === 3 ? accent : color)} />
          </RoundedBox>
          <mesh position={[0, 0.18, 0.16]}>
            <boxGeometry args={[1.74 * wide, 0.2, 0.82]} />
            <meshStandardMaterial color="#c43b58" roughness={0.96} />
          </mesh>
          <Teeth count={7} y={0.38} gold={gold} saw={false} />
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
  const tall = seat === 0 ? 1.32 : seat === 2 ? 0.78 : 1
  const spread = seat === 2 ? 0.42 : 0.3
  return (
    <group>
      <RoundedBox args={[1.55, 0.28, 0.22]} radius={0.05} smoothness={3} position={[0, 0.38, 0.28]} castShadow>
        <meshStandardMaterial color="#070b10" metalness={0.45} roughness={0.26} />
      </RoundedBox>
      <mesh position={[0, 0.38, 0.4]} castShadow>
        <boxGeometry args={[1.38, 0.18, 0.08]} />
        <meshStandardMaterial
          ref={visorRef}
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          metalness={0.15}
          roughness={0.12}
        />
      </mesh>
      {seat === 1 ? (
        <mesh position={[0, 0.52, 0.18]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.24} />
        </mesh>
      ) : null}
      {seat === 3 ? (
        <mesh position={[0, 0.48, -0.08]} castShadow>
          <boxGeometry args={[1.7, 0.08, 0.7]} />
          <meshStandardMaterial color={accent} metalness={0.88} roughness={0.14} />
        </mesh>
      ) : null}
      {seat === 0 ? (
        <mesh position={[0, 0.56, -0.08]} castShadow>
          <boxGeometry args={[0.55, 0.12, 0.28]} />
          <meshStandardMaterial color={accent} metalness={0.4} roughness={0.32} />
        </mesh>
      ) : null}
      {seat === 2 ? (
        <>
          <RoundedBox args={[0.62, 0.42, 0.55]} radius={0.12} smoothness={3} position={[-0.95, 0.08, 0.05]} castShadow>
            <meshPhysicalMaterial {...vinyl(color)} />
          </RoundedBox>
          <RoundedBox args={[0.62, 0.42, 0.55]} radius={0.12} smoothness={3} position={[0.95, 0.08, 0.05]} castShadow>
            <meshPhysicalMaterial {...vinyl(color)} />
          </RoundedBox>
        </>
      ) : null}
      <group ref={antL} position={[-spread, 0.58, -0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.52 * tall, 8]} />
          <meshStandardMaterial color={accent} metalness={0.62} roughness={0.26} />
        </mesh>
        <mesh position={[0, 0.32 * tall, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.1} />
        </mesh>
      </group>
      <group ref={antR} position={[spread, 0.58, -0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.52 * tall, 8]} />
          <meshStandardMaterial color={accent} metalness={0.62} roughness={0.26} />
        </mesh>
        <mesh position={[0, 0.32 * tall, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.1} />
        </mesh>
      </group>
    </group>
  )
}
