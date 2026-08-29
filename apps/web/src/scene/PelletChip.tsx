import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Pellet } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeXrpMarkTexture } from './xrpMarkTexture'

const cyanMark = makeXrpMarkTexture('#06323c')
const goldMark = makeXrpMarkTexture('#4a3200')

function hashDelay(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 17
  return n * 0.028
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const grounded = useRef(false)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.3 : 0.22
  const restY = 0.05 + r
  const mark = pellet.golden ? goldMark : cyanMark
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  if (land >= 1) grounded.current = true
  const drop = easeOut(grounded.current ? 1 : land)
  const y = 4.1 + (restY - 4.1) * drop

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined) return
    const spin = grounded.current ? 0.35 : dumpT * 7 + delay * 16
    group.current.rotation.set(0.18 * (1 - drop), spin, 0.08 * (1 - drop))
    group.current.position.set(pellet.x, y, pellet.z)
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 24, 20]} />
        <meshPhysicalMaterial
          color={pellet.golden ? '#f2c24a' : '#7ad4ff'}
          roughness={0.08}
          metalness={0.06}
          transmission={0.72}
          thickness={0.55}
          ior={1.48}
          transparent
          opacity={0.94}
          attenuationColor={pellet.golden ? '#d4a017' : '#3cb8d6'}
          attenuationDistance={0.7}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 0.62, 16, 14]} />
        <meshStandardMaterial
          color={pellet.golden ? '#e8b030' : '#4ec8e8'}
          roughness={0.22}
          metalness={0.12}
          emissive={pellet.golden ? '#c49214' : '#147a99'}
          emissiveIntensity={pellet.golden ? 0.45 : 0.32}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, r * 0.22, 0]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <circleGeometry args={[r * 0.62, 24]} />
        <meshBasicMaterial map={mark} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
