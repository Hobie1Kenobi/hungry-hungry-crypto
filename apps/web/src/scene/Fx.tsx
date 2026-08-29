import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { AdditiveBlending, type Group, type Mesh } from 'three'
import { beastPosition, beastYaw, chompReach } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { BEAST_NECK_LIFT } from './beasts/vinyl'

function mouthWorld(seat: 0 | 1 | 2 | 3, extend: number): [number, number, number] {
  const [bx, , bz] = beastPosition(seat)
  const reach = chompReach(extend) + 0.42
  const lift = BEAST_NECK_LIFT
  const yaw = beastYaw(seat)
  const dx = Math.sin(yaw) * reach
  const dz = Math.cos(yaw) * reach
  return [bx + dx, lift, bz + dz]
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
      const ev = eats[Math.floor(i / 3)]
      const lane = i % 3
      if (!ev) {
        child.visible = false
        continue
      }
      const t = (now - ev.at) / 420 - lane * 0.08
      if (t <= 0 || t >= 1) {
        child.visible = false
        continue
      }
      const [mx, my, mz] = mouthWorld(ev.seat, necks[ev.seat])
      const k = t * t
      child.visible = true
      child.position.set(ev.x + (mx - ev.x) * k, 0.42 + (my - 0.42) * k, ev.z + (mz - ev.z) * k)
      child.scale.setScalar((ev.golden ? 0.34 : 0.26) * (1 - t))
    }
  })

  return (
    <group ref={group}>
      {eats.flatMap((ev) =>
        [0, 1, 2].map((lane) => (
          <mesh key={`${ev.id}-${lane}`} visible={false}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial
              color={ev.golden ? '#ffd45a' : '#7fe7ff'}
              transparent
              opacity={0.95}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

function Splashes() {
  const splashes = useJuiceStore((s) => s.splashes)
  const group = useRef<Group>(null)

  useFrame(() => {
    if (!group.current) return
    const now = performance.now()
    for (let i = 0; i < group.current.children.length; i += 1) {
      const child = group.current.children[i] as Mesh
      const ev = splashes[i]
      if (!ev) {
        child.visible = false
        continue
      }
      const t = (now - ev.at) / 420
      if (t >= 1) {
        child.visible = false
        continue
      }
      child.visible = true
      child.position.set(ev.x, -0.04, ev.z)
      const s = 0.2 + t * 1.4
      child.scale.set(s, 1, s)
      const mat = child.material as { opacity: number }
      mat.opacity = 0.45 * (1 - t)
    }
  })

  return (
    <group ref={group}>
      {splashes.map((ev) => (
        <mesh key={ev.id} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.18, 0.28, 20]} />
          <meshBasicMaterial
            color="#8ef2ff"
            transparent
            opacity={0.4}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function Fx() {
  return (
    <group>
      <EatTrails />
      <Splashes />
    </group>
  )
}
