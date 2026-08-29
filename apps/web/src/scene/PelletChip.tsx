import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Pellet } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
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
    <group position={[0, r + 0.04, 0]} rotation={[-0.28, 0, 0]}>
      <mesh>
        <circleGeometry args={[r * 0.9, 28]} />
        <meshStandardMaterial
          map={map}
          color={face}
          roughness={0.3}
          metalness={0.04}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0.035, 0]}>
        <boxGeometry args={[r * 1.25, 0.055, r * 0.22]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.15} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]} position={[0, 0.035, 0]}>
        <boxGeometry args={[r * 1.25, 0.055, r * 0.22]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const grounded = useRef(false)
  const splashed = useRef(false)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.4 : 0.3
  const restY = 0.08 + r
  const face = pellet.golden ? '#ffe7a0' : '#e7fbff'
  const ink = pellet.golden ? '#4a3000' : '#0a3340'
  const mark = pellet.golden ? goldMark : cyanMark
  const land = Math.max(0, Math.min(1, (dumpT - delay) / 0.32))
  if (land >= 1) grounded.current = true
  const drop = easeOut(grounded.current ? 1 : land)
  const y = 3.55 + (restY - 3.55) * drop

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined) return
    if (land >= 1 && !splashed.current) {
      splashed.current = true
      useJuiceStore.getState().notifySplash(pellet.x, pellet.z)
    }
    group.current.position.set(pellet.x, y, pellet.z)
    if (!grounded.current) {
      group.current.rotation.set(0.14 * (1 - drop), dumpT * 4 + delay * 10, 0)
    } else {
      group.current.rotation.set(0.12, delay * 4 + dumpT * 0.4, 0.08)
    }
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 28, 22]} />
        <meshPhysicalMaterial
          color={pellet.golden ? '#f0c14b' : '#3ec4e6'}
          roughness={0.18}
          metalness={0.12}
          clearcoat={0.9}
          clearcoatRoughness={0.16}
          envMapIntensity={0.75}
          emissive={pellet.golden ? '#c49214' : '#127a92'}
          emissiveIntensity={pellet.golden ? 1.15 : 0.28}
        />
      </mesh>
      <XrpFace r={r} face={face} ink={ink} map={mark} />
      {pellet.golden ? <pointLight intensity={2.2} distance={3.8} color="#ffcc55" /> : null}
    </group>
  )
}
