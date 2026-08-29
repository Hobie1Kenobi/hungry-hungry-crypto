import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Pellet } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeXrpMarkTexture } from './xrpMarkTexture'

const cyanMark = makeXrpMarkTexture('#f4fbff')
const goldMark = makeXrpMarkTexture('#3a2400')

function hashDelay(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 17
  return n * 0.028
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

function ChevronMark({ color, r }: { color: string; r: number }) {
  const arm = r * 0.42
  const thick = r * 0.11
  const rise = r * 0.28
  const gap = r * 0.07
  return (
    <group>
      <mesh position={[-gap - arm * 0.28, 0, rise * 0.45]} rotation={[0, 0.62, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-gap - arm * 0.28, 0, -rise * 0.45]} rotation={[0, -0.62, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[gap + arm * 0.28, 0, rise * 0.45]} rotation={[0, -0.62, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[gap + arm * 0.28, 0, -rise * 0.45]} rotation={[0, 0.62, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const grounded = useRef(false)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.32 : 0.24
  const restY = 0.08 + r
  const mark = pellet.golden ? goldMark : cyanMark
  const ink = pellet.golden ? '#4a3000' : '#eef9ff'
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  if (land >= 1) grounded.current = true
  const drop = easeOut(grounded.current ? 1 : land)
  const y = 4.1 + (restY - 4.1) * drop

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined) return
    const spin = grounded.current ? 0.2 : dumpT * 7 + delay * 16
    group.current.rotation.set(0.12 * (1 - drop), spin, 0)
    group.current.position.set(pellet.x, y, pellet.z)
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 28, 22]} />
        <meshPhysicalMaterial
          color={pellet.golden ? '#f2c24a' : '#8adcff'}
          roughness={0.12}
          metalness={0.08}
          transmission={0.28}
          thickness={0.45}
          ior={1.45}
          transparent
          opacity={0.92}
          attenuationColor={pellet.golden ? '#d4a017' : '#3cb8d6'}
          attenuationDistance={1.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={0.9}
          emissive={pellet.golden ? '#a87810' : '#1a6a80'}
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 0.7, 18, 14]} />
        <meshStandardMaterial
          color={pellet.golden ? '#e8b030' : '#5ed0ee'}
          roughness={0.28}
          metalness={0.1}
          emissive={pellet.golden ? '#c49214' : '#1a88a8'}
          emissiveIntensity={pellet.golden ? 0.55 : 0.4}
        />
      </mesh>
      <group position={[0, r * 0.12, 0]} scale={0.92}>
        <ChevronMark color={ink} r={r} />
      </group>
      <mesh position={[0, r * 0.42, r * 0.18]} rotation={[-0.85, 0, 0]}>
        <circleGeometry args={[r * 0.62, 24]} />
        <meshBasicMaterial map={mark} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
