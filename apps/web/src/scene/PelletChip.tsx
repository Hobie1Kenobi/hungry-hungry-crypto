import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { Pellet } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { HOPPER_MOUTH } from './Hopper'
import { makeXrpMarkTexture } from './xrpMarkTexture'

const cyanMark = makeXrpMarkTexture('#e7fbff', '#0a3340')
const goldMark = makeXrpMarkTexture('#ffe7a0', '#4a3000')

function hashDelay(id: string): number {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 17
  return n * 0.018
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

function isRefillWave(id: string): boolean {
  return id.startsWith('w')
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const refill = isRefillWave(pellet.id)
  const born = useRef(performance.now())
  const grounded = useRef(!refill)
  const splashed = useRef(!refill)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.4 : 0.3
  const restY = 0.08 + r
  const face = pellet.golden ? '#ffe7a0' : '#e7fbff'
  const ink = pellet.golden ? '#4a3000' : '#0a3340'
  const mark = pellet.golden ? goldMark : cyanMark

  useFrame(() => {
    if (!group.current || pellet.eatenBy !== undefined) return
    const landed = !refill || useGameStore.getState().dumpT >= 0.92 || grounded.current
    if (landed) {
      grounded.current = true
      group.current.position.set(pellet.x, restY, pellet.z)
      group.current.rotation.set(0.12, delay * 4, 0.08)
      return
    }
    const t = Math.max(0, Math.min(1, (performance.now() - born.current) / 1000 / 0.46 - delay))
    const k = easeOut(t)
    const x = HOPPER_MOUTH.x + (pellet.x - HOPPER_MOUTH.x) * k
    const z = HOPPER_MOUTH.z + (pellet.z - HOPPER_MOUTH.z) * k
    const arc = Math.sin(k * Math.PI) * 0.28
    const y = HOPPER_MOUTH.y + (restY - HOPPER_MOUTH.y) * k + arc
    group.current.position.set(x, y, z)
    group.current.rotation.set(0.18 * (1 - k), delay * 10 + k * 3.2, 0.1 * (1 - k))
    if (t >= 1) {
      grounded.current = true
      if (!splashed.current) {
        splashed.current = true
        useJuiceStore.getState().notifySplash(pellet.x, pellet.z)
      }
    }
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, restY, pellet.z]}>
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
