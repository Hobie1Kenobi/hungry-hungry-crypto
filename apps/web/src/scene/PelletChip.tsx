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

function XrpChevrons({ ink, r }: { ink: string; r: number }) {
  const arm = r * 0.72
  const thick = r * 0.16
  const rise = r * 0.34
  const gap = r * 0.08
  return (
    <group>
      <mesh position={[-gap - arm * 0.3, thick * 0.55, rise * 0.42]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[-gap - arm * 0.3, thick * 0.55, -rise * 0.42]} rotation={[0, -0.7, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[gap + arm * 0.3, thick * 0.55, rise * 0.42]} rotation={[0, -0.7, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[gap + arm * 0.3, thick * 0.55, -rise * 0.42]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[arm, thick, thick]} />
        <meshStandardMaterial color={ink} emissive={ink} emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

export function PelletChip({ pellet }: { pellet: Pellet }) {
  const dumpT = useGameStore((s) => s.dumpT)
  const delay = useMemo(() => hashDelay(pellet.id), [pellet.id])
  const grounded = useRef(false)
  const group = useRef<Group>(null)
  const r = pellet.golden ? 0.36 : 0.27
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
      group.current.rotation.set(0.16 * (1 - drop), dumpT * 5 + delay * 12, 0)
    } else {
      group.current.rotation.set(0, 0.15, 0)
    }
  })

  if (pellet.eatenBy !== undefined) return null

  return (
    <group ref={group} position={[pellet.x, y, pellet.z]}>
      <mesh castShadow>
        <sphereGeometry args={[r, 28, 22]} />
        <meshPhysicalMaterial
          color={pellet.golden ? '#f0c14b' : '#4ec8e8'}
          roughness={0.18}
          metalness={0.1}
          transparent
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.14}
          envMapIntensity={0.8}
          emissive={pellet.golden ? '#c49214' : '#127a92'}
          emissiveIntensity={pellet.golden ? 0.32 : 0.26}
        />
      </mesh>
      <group position={[0, r * 0.42, r * 0.22]} rotation={[-0.85, 0, 0]}>
        <mesh>
          <circleGeometry args={[r * 0.72, 28]} />
          <meshStandardMaterial map={mark} color={face} roughness={0.28} metalness={0.05} />
        </mesh>
        <XrpChevrons ink={ink} r={r * 0.82} />
      </group>
    </group>
  )
}
