import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Pellet } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeXrpMarkTexture } from './xrpMarkTexture'

const cyanMark = makeXrpMarkTexture('#e7fbff', '#0a3340')
const goldMark = makeXrpMarkTexture('#ffe7a0', '#4a3000')

function hashDelay(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 17
  return n * 0.028
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

function XrpFace({ r, face, ink, map }: { r: number; face: string; ink: string; map: ReturnType<typeof makeXrpMarkTexture> }) {
  return (
    <group position={[0, r * 0.52, 0]} rotation={[-0.35, 0, 0]}>
      <mesh>
        <circleGeometry args={[r * 0.86, 28]} />
        <meshStandardMaterial map={map} color={face} roughness={0.3} metalness={0.04} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, r * 0.06, 0]}>
        <boxGeometry args={[r * 1.15, r * 0.14, r * 0.2]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]} position={[0, r * 0.06, 0]}>
        <boxGeometry args={[r * 1.15, r * 0.14, r * 0.2]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const grounded = useRef(false)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.4 : 0.3
  const restY = 0.08 + r
  const face = pellet.golden ? '#ffe7a0' : '#e7fbff'
  const ink = pellet.golden ? '#4a3000' : '#0a3340'
  const mark = pellet.golden ? goldMark : cyanMark
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  if (land >= 1) grounded.current = true
  const drop = easeOut(grounded.current ? 1 : land)
  const y = 4.1 + (restY - 4.1) * drop

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined) return
    group.current.position.set(pellet.x, y, pellet.z)
    if (!grounded.current) {
      group.current.rotation.set(0.14 * (1 - drop), dumpT * 4 + delay * 10, 0)
    } else {
      group.current.rotation.set(0, 0, 0)
    }
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 28, 22]} />
        <meshPhysicalMaterial
          color={pellet.golden ? '#f0c14b' : '#3ec4e6'}
          roughness={0.16}
          metalness={0.1}
          transparent
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.14}
          envMapIntensity={0.8}
          emissive={pellet.golden ? '#c49214' : '#127a92'}
          emissiveIntensity={pellet.golden ? 0.34 : 0.28}
        />
      </mesh>
      <XrpFace r={r} face={face} ink={ink} map={mark} />
    </group>
  )
}
