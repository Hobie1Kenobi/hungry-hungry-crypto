import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { BEASTS, POND_SIZE, type Seat } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { makeCausticTexture, makeHexTexture } from './pondTextures'

/** Liquid surface height. CROSS beds sit at 0.04, proud of this. */
export const POND_LIQUID_Y = -0.05

const WELL_Y = -0.4
const DISH_INNER = POND_SIZE - 0.22
const RIPPLE_MS = 900

function LaneGutter({
  seat,
  length,
  mid,
}: {
  seat: Seat
  length: number
  mid: number
}) {
  const spec = BEASTS[seat]
  const yaw = seat === 0 ? 0 : seat === 1 ? -Math.PI / 2 : seat === 2 ? Math.PI : Math.PI / 2
  const rail = { color: spec.color, emissive: spec.color, emissiveIntensity: 2.15, metalness: 0.38, roughness: 0.24 }
  const bed = { color: spec.accent, emissive: spec.color, emissiveIntensity: 0.55, metalness: 0.22, roughness: 0.38 }
  const lip = 0.7
  return (
    <group rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.04, mid]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.1, length]} />
        <meshStandardMaterial {...bed} />
      </mesh>
      {[-lip, lip].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.22, mid]} castShadow>
            <boxGeometry args={[0.24, 0.4, length]} />
            <meshStandardMaterial {...rail} />
          </mesh>
          <mesh position={[x, 0.44, mid]} castShadow>
            <boxGeometry args={[0.3, 0.08, length]} />
            <meshStandardMaterial color="#f4fff8" emissive={spec.color} emissiveIntensity={1.6} metalness={0.55} roughness={0.18} />
          </mesh>
        </group>
      ))}
      {[-1.2, -0.4, 0.4, 1.2].map((z) => (
        <mesh key={z} position={[0, 0.14, mid + z]} castShadow>
          <boxGeometry args={[1.28, 0.12, 0.18]} />
          <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.35} metalness={0.48} roughness={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function RaisedCross() {
  const run = 3.28
  const mid = -2.22
  return (
    <group>
      <LaneGutter seat={0} length={run} mid={mid} />
      <LaneGutter seat={1} length={run} mid={mid} />
      <LaneGutter seat={2} length={run} mid={mid} />
      <LaneGutter seat={3} length={run} mid={mid} />
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.18, 16]} />
        <meshStandardMaterial color="#d7e8c8" emissive="#8a9a40" emissiveIntensity={0.7} metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.12, 14]} />
        <meshStandardMaterial color="#fff6c8" emissive="#ffe27a" emissiveIntensity={1.1} metalness={0.4} roughness={0.22} />
      </mesh>
    </group>
  )
}

function DishWell() {
  const wallH = POND_LIQUID_Y - WELL_Y + 0.08
  const wallY = (POND_LIQUID_Y + WELL_Y) / 2
  const half = DISH_INNER / 2
  const slope = 0.32
  const lining = { color: '#0a1418', metalness: 0.42, roughness: 0.48 }
  return (
    <group>
      <mesh position={[0, WELL_Y, 0]} receiveShadow>
        <boxGeometry args={[DISH_INNER - 0.55, 0.08, DISH_INNER - 0.55]} />
        <meshStandardMaterial color="#00050a" metalness={0.18} roughness={0.72} />
      </mesh>
      <mesh position={[0, wallY, half - 0.12]} rotation={[-slope, 0, 0]} receiveShadow>
        <boxGeometry args={[DISH_INNER, wallH, 0.26]} />
        <meshStandardMaterial {...lining} />
      </mesh>
      <mesh position={[0, wallY, -half + 0.12]} rotation={[slope, 0, 0]} receiveShadow>
        <boxGeometry args={[DISH_INNER, wallH, 0.26]} />
        <meshStandardMaterial {...lining} />
      </mesh>
      <mesh position={[half - 0.12, wallY, 0]} rotation={[0, 0, slope]} receiveShadow>
        <boxGeometry args={[0.26, wallH, DISH_INNER]} />
        <meshStandardMaterial {...lining} />
      </mesh>
      <mesh position={[-half + 0.12, wallY, 0]} rotation={[0, 0, -slope]} receiveShadow>
        <boxGeometry args={[0.26, wallH, DISH_INNER]} />
        <meshStandardMaterial {...lining} />
      </mesh>
    </group>
  )
}

function DishLip() {
  const rim = 0.34
  const wall = POND_SIZE / 2 + 0.02
  const inner = POND_SIZE / 2 - 0.1
  const steel = { color: '#0a161c', metalness: 0.5, roughness: 0.36 }
  const well = { color: '#3a4a52', metalness: 0.34, roughness: 0.48 }
  return (
    <group>
      <mesh position={[0, 0.08, -wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.28, rim]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, 0.08, wall]} castShadow receiveShadow>
        <boxGeometry args={[POND_SIZE + rim, 0.28, rim]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-wall, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.28, POND_SIZE + rim]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[wall, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[rim, 0.28, POND_SIZE + rim]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0, 0.1, inner]} receiveShadow>
        <boxGeometry args={[POND_SIZE - 0.28, 0.36, 0.16]} />
        <meshStandardMaterial {...well} />
      </mesh>
      <mesh position={[0, 0.1, -inner]} receiveShadow>
        <boxGeometry args={[POND_SIZE - 0.28, 0.36, 0.16]} />
        <meshStandardMaterial {...well} />
      </mesh>
      <mesh position={[inner, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.16, 0.36, POND_SIZE - 0.28]} />
        <meshStandardMaterial {...well} />
      </mesh>
      <mesh position={[-inner, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.16, 0.36, POND_SIZE - 0.28]} />
        <meshStandardMaterial {...well} />
      </mesh>
      <mesh position={[0, 0.2, -wall]} castShadow>
        <boxGeometry args={[POND_SIZE + rim + 0.08, 0.07, rim + 0.08]} />
        <meshStandardMaterial color="#c5d0d6" metalness={0.72} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.2, wall]} castShadow>
        <boxGeometry args={[POND_SIZE + rim + 0.08, 0.07, rim + 0.08]} />
        <meshStandardMaterial color="#c5d0d6" metalness={0.72} roughness={0.22} />
      </mesh>
      <mesh position={[-wall, 0.2, 0]} castShadow>
        <boxGeometry args={[rim + 0.08, 0.07, POND_SIZE + rim + 0.08]} />
        <meshStandardMaterial color="#c5d0d6" metalness={0.72} roughness={0.22} />
      </mesh>
      <mesh position={[wall, 0.2, 0]} castShadow>
        <boxGeometry args={[rim + 0.08, 0.07, POND_SIZE + rim + 0.08]} />
        <meshStandardMaterial color="#c5d0d6" metalness={0.72} roughness={0.22} />
      </mesh>
    </group>
  )
}

function LiquidRipples() {
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    const events = useJuiceStore.getState().splashes
    for (let i = 0; i < group.current.children.length; i += 1) {
      const mesh = group.current.children[i] as Mesh
      const ev = events[events.length - 1 - i]
      if (!ev) {
        mesh.visible = false
        continue
      }
      const t = (now - ev.at) / RIPPLE_MS
      if (t < 0 || t >= 1) {
        mesh.visible = false
        continue
      }
      mesh.visible = true
      mesh.position.set(ev.x, POND_LIQUID_Y + 0.02, ev.z)
      const s = 0.55 + t * 3.2
      mesh.scale.set(s, 1, s)
      const mat = mesh.material as { opacity: number }
      mat.opacity = 0.7 * (1 - t)
    }
  })

  return (
    <group ref={group}>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10} visible={false}>
          <ringGeometry args={[0.2, 0.48, 28]} />
          <meshBasicMaterial
            color="#9ef6ff"
            transparent
            opacity={0.7}
            blending={AdditiveBlending}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function Pond() {
  const hex = useMemo(() => makeHexTexture(), [])
  const caustic = useMemo(() => makeCausticTexture(), [])
  const shimmer = useRef<Mesh>(null)
  const liquid = DISH_INNER - 0.12

  useFrame(({ clock }) => {
    if (!shimmer.current) return
    const t = clock.elapsedTime
    shimmer.current.position.x = Math.sin(t * 0.35) * 0.12
    shimmer.current.position.z = Math.cos(t * 0.28) * 0.12
    const mat = shimmer.current.material as { opacity: number }
    mat.opacity = 0.1 + Math.sin(t * 1.7) * 0.035
  })

  return (
    <group>
      <DishWell />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, POND_LIQUID_Y, 0]} receiveShadow>
        <planeGeometry args={[liquid, liquid]} />
        <meshPhysicalMaterial
          color="#01070c"
          roughness={0.12}
          metalness={0.22}
          transparent
          opacity={0.9}
          emissive="#000408"
          emissiveIntensity={0.16}
          envMapIntensity={0.85}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, POND_LIQUID_Y + 0.008, 0]}>
        <planeGeometry args={[liquid, liquid]} />
        <meshBasicMaterial map={hex} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh ref={shimmer} rotation={[-Math.PI / 2, 0, 0]} position={[0, POND_LIQUID_Y + 0.016, 0]}>
        <planeGeometry args={[liquid * 0.92, liquid * 0.92]} />
        <meshBasicMaterial
          map={caustic}
          transparent
          opacity={0.14}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <LiquidRipples />
      <RaisedCross />
      <DishLip />
    </group>
  )
}
