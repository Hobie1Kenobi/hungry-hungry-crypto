import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { BEASTS } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { visualMouthWorld } from './beasts/vinyl'
import { POND_LIQUID_Y } from './Pond'

function mouthWorld(seat: 0 | 1 | 2 | 3, extend: number): [number, number, number] {
  const { x, y, z } = visualMouthWorld(seat, extend)
  return [x, y, z]
}

function EatTrails() {
  const eats = useJuiceStore((s) => s.eats)
  const necks = useGameStore((s) => s.neckExtend)
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    for (let i = 0; i < group.current.children.length; i += 1) {
      const child = group.current.children[i] as Mesh
      const ev = eats[Math.floor(i / 5)]
      const lane = i % 5
      if (!ev) {
        child.visible = false
        continue
      }
      const t = (now - ev.at) / 980 - lane * 0.07
      if (t <= 0 || t >= 1) {
        child.visible = false
        continue
      }
      const [mx, my, mz] = mouthWorld(ev.seat, necks[ev.seat])
      const k = t * t
      child.visible = true
      child.position.set(ev.x + (mx - ev.x) * k, 0.42 + (my - 0.42) * k + Math.sin(t * Math.PI) * 0.22, ev.z + (mz - ev.z) * k)
      child.scale.setScalar((ev.golden ? 0.78 : 0.6) * (1 - t * 0.72))
    }
  })

  return (
    <group ref={group}>
      {eats.flatMap((ev) =>
        [0, 1, 2, 3, 4].map((lane) => (
          <mesh key={`${ev.id}-${lane}`} visible={false}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial
              color={ev.golden ? '#ffd45a' : '#7fe7ff'}
              transparent
              opacity={0.98}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

const DROP_DIRS = [
  [0.16, 0.22],
  [-0.14, 0.18],
  [0.04, -0.2],
] as const

function Splashes() {
  const splashes = useJuiceStore((s) => s.splashes)
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    for (let i = 0; i < group.current.children.length; i += 1) {
      const burst = group.current.children[i]
      const ev = splashes[i]
      if (!ev) {
        burst.visible = false
        continue
      }
      const t = (now - ev.at) / 480
      if (t >= 1) {
        burst.visible = false
        continue
      }
      burst.visible = true
      burst.position.set(ev.x, POND_LIQUID_Y + 0.02, ev.z)
      const ring = burst.children[0] as Mesh
      const ringS = 0.35 + t * 1.85
      ring.scale.set(ringS, 1, ringS)
      const ringMat = ring.material as { opacity: number }
      ringMat.opacity = 0.62 * (1 - t)
      for (let d = 0; d < DROP_DIRS.length; d += 1) {
        const drop = burst.children[d + 1] as Mesh
        const [dx, dz] = DROP_DIRS[d]
        const up = Math.sin(t * Math.PI) * 0.42
        drop.position.set(dx * t * 1.6, up, dz * t * 1.6)
        drop.scale.setScalar(0.7 * (1 - t * 0.55))
        const dropMat = drop.material as { opacity: number }
        dropMat.opacity = 0.85 * (1 - t)
      }
    }
  })

  return (
    <group ref={group}>
      {splashes.map((ev) => (
        <group key={ev.id} visible={false}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.34, 22]} />
            <meshBasicMaterial
              color="#b8fbff"
              transparent
              opacity={0.55}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {DROP_DIRS.map(([dx, dz]) => (
            <mesh key={`${dx}:${dz}`}>
              <sphereGeometry args={[0.07, 8, 6]} />
              <meshBasicMaterial
                color="#d7ffff"
                transparent
                opacity={0.85}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function ScorePops() {
  const eats = useJuiceStore((s) => s.eats)
  const necks = useGameStore((s) => s.neckExtend)
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    for (let i = 0; i < group.current.children.length; i += 1) {
      const child = group.current.children[i]
      const ev = eats[i]
      if (!ev) {
        child.visible = false
        continue
      }
      const t = (now - ev.at) / 820
      if (t <= 0 || t >= 1) {
        child.visible = false
        continue
      }
      const [mx, my, mz] = mouthWorld(ev.seat, necks[ev.seat])
      child.visible = true
      child.position.set(mx, my + 1.05 + t * 1.45, mz)
      child.scale.setScalar(1.15 + t * 0.35)
    }
  })

  return (
    <group ref={group}>
      {eats.map((ev) => (
        <Billboard key={ev.id} visible={false}>
          <Text
            fontSize={0.72}
            color={ev.golden ? '#ffd45a' : BEASTS[ev.seat].color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.055}
            outlineColor="#041018"
            renderOrder={30}
          >
            {ev.golden ? '+5' : '+1'}
          </Text>
        </Billboard>
      ))}
    </group>
  )
}

export function Fx() {
  return (
    <group>
      <EatTrails />
      <Splashes />
      <ScorePops />
    </group>
  )
}
