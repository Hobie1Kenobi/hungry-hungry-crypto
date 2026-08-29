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
  [0.28, 0.34],
  [-0.26, 0.3],
  [0.12, -0.32],
  [-0.3, -0.16],
] as const

const SPLASH_POOL = 10
const SPLASH_MS = 1100

function Splashes() {
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    const events = useJuiceStore.getState().splashes
    for (let i = 0; i < SPLASH_POOL; i += 1) {
      const burst = group.current.children[i]
      const ev = events[events.length - 1 - i]
      if (!ev) {
        burst.visible = false
        continue
      }
      const t = (now - ev.at) / SPLASH_MS
      if (t < 0 || t >= 1) {
        burst.visible = false
        continue
      }
      burst.visible = true
      burst.position.set(ev.x, POND_LIQUID_Y + 0.06, ev.z)
      const flash = burst.children[0] as Mesh
      flash.scale.setScalar(0.9 + t * 1.4)
      const flashMat = flash.material as { opacity: number }
      flashMat.opacity = t < 0.45 ? 0.85 * (1 - t / 0.45) : 0
      const ring = burst.children[1] as Mesh
      ring.scale.set(1 + t * 3.6, 1, 1 + t * 3.6)
      const ringMat = ring.material as { opacity: number }
      ringMat.opacity = 0.95 * (1 - t)
      const inner = burst.children[2] as Mesh
      inner.scale.set(0.55 + t * 2.2, 1, 0.55 + t * 2.2)
      const innerMat = inner.material as { opacity: number }
      innerMat.opacity = 0.85 * (1 - t)
      for (let d = 0; d < DROP_DIRS.length; d += 1) {
        const drop = burst.children[d + 3] as Mesh
        const [dx, dz] = DROP_DIRS[d]
        drop.position.set(dx * t * 2.4, Math.sin(t * Math.PI) * 0.85, dz * t * 2.4)
        drop.scale.setScalar(1.2 * (1 - t * 0.45))
        const dropMat = drop.material as { opacity: number }
        dropMat.opacity = 0.98 * (1 - t)
      }
    }
  })

  return (
    <group ref={group}>
      {Array.from({ length: SPLASH_POOL }, (_, i) => (
        <group key={i} visible={false}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={11}>
            <circleGeometry args={[0.7, 20]} />
            <meshBasicMaterial
              color="#f5ffff"
              transparent
              opacity={0.85}
              blending={AdditiveBlending}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={12}>
            <ringGeometry args={[0.28, 0.5, 24]} />
            <meshBasicMaterial
              color="#e8ffff"
              transparent
              opacity={0.9}
              blending={AdditiveBlending}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={12}>
            <ringGeometry args={[0.1, 0.24, 20]} />
            <meshBasicMaterial
              color="#9ef2ff"
              transparent
              opacity={0.8}
              blending={AdditiveBlending}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
          {DROP_DIRS.map(([dx, dz]) => (
            <mesh key={`${dx}:${dz}`} renderOrder={13}>
              <sphereGeometry args={[0.12, 8, 6]} />
              <meshBasicMaterial
                color="#f4ffff"
                transparent
                opacity={0.98}
                blending={AdditiveBlending}
                depthWrite={false}
                depthTest={false}
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
