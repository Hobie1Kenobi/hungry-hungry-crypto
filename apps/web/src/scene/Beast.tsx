import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh, MeshStandardMaterial, PointLight } from 'three'
import type { Seat } from '@hhc/shared'
import { BEASTS, beastPosition, beastYaw, NECK_VISUAL_ORIGIN, visualHeadAlong } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { Chassis, HeadDressing, MachineMouth, MachineNeck } from './beasts/kits'
import { BEAST_NECK_LIFT } from './beasts/vinyl'

const RING_COUNT = 5

export function Beast({ seat }: { seat: Seat }) {
  const spec = BEASTS[seat]
  const lastEatAt = useGameStore((s) => s.lastEatAt[seat])
  const ui = useGameStore((s) => s.ui)
  const result = useGameStore((s) => s.result)
  const you = useGameStore((s) => s.localSeat === seat)
  const missAt = useJuiceStore((s) => s.misses[seat])

  const rig = useRef<Group>(null)
  const body = useRef<Group>(null)
  const piston = useRef<Mesh>(null)
  const ringsRef = useRef<Group>(null)
  const head = useRef<Group>(null)
  const label = useRef<Group>(null)
  const jaws = useRef<Group>(null)
  const antL = useRef<Group>(null)
  const antR = useRef<Group>(null)
  const visorMat = useRef<MeshStandardMaterial>(null)
  const mouthLight = useRef<PointLight>(null)
  const lastDown = useRef(false)
  const lastEat = useRef(0)
  const anticip = useRef(0)
  const squash = useRef(0)
  const gulp = useRef(0)
  const shake = useRef(0)
  const jaw = useRef(0.48)
  const visExt = useRef(0)
  const slam = useRef(0)

  const [x, y, z] = beastPosition(seat)
  const yaw = beastYaw(seat)

  useFrame((_, dt) => {
    const snap = useGameStore.getState()
    const extend = snap.neckExtend[seat]
    const down = snap.chompDown[seat]
    const t = performance.now() / 1000
    if (down && !lastDown.current) {
      anticip.current = 1
      squash.current = 1
      slam.current = 1
    }
    lastDown.current = down
    anticip.current = Math.max(0, anticip.current - dt * 10)
    slam.current = Math.max(0, slam.current - dt * 8)

    if (lastEatAt > lastEat.current) {
      lastEat.current = lastEatAt
      squash.current = 1
      gulp.current = 1
    }
    squash.current = Math.max(0, squash.current - dt * 12)
    gulp.current = Math.max(0, gulp.current - dt * 2.6)

    if (missAt > 0 && performance.now() - missAt < 220) shake.current = 1
    shake.current = Math.max(0, shake.current - dt * 6)

    const winner = ui === 'results' && result?.winner === seat
    const loser = ui === 'results' && result && result.winner !== seat
    const restJaw = 0.88
    const targetJaw = winner ? 1 : loser ? 0.2 : down ? 1 : restJaw
    jaw.current += (targetJaw - jaw.current) * Math.min(1, dt * (down ? 14 : 16))

    const punch = down ? extend + slam.current * 0.28 - anticip.current * 0.1 : extend
    const want = Math.max(0, Math.min(1.08, punch))
    visExt.current += (want - visExt.current) * Math.min(1, dt * (down ? 52 : 28))
    if (Math.abs(want - visExt.current) < 0.004) visExt.current = want

    const breathe = 1 + Math.sin(t * 2.05 + seat) * (down ? 0.01 : 0.03)
    const sq = 1 - squash.current * 0.48
    const gulpS = 1 + gulp.current * 0.2
    const fat = seat === 2 ? 1.02 : 1

    if (rig.current) {
      rig.current.rotation.x = winner ? -0.86 : loser ? 0.72 : squash.current * -0.28
      rig.current.rotation.z = winner ? Math.sin(t * 2.8) * 0.16 : loser ? 0.28 : slam.current * 0.08
      rig.current.position.y = winner ? 0.34 : loser ? -0.34 : slam.current * 0.14
    }
    if (body.current) {
      body.current.scale.set(fat * gulpS * (1 + squash.current * 0.26), breathe * sq * (loser ? 0.74 : 1), fat * gulpS)
    }
    if (antL.current) antL.current.rotation.z = Math.sin(t * 3.4 + seat) * 0.22
    if (antR.current) antR.current.rotation.z = Math.sin(t * 3.4 + seat + 1.2) * -0.22
    if (head.current) {
      const camYaw = seat === 2 ? -0.62 : seat === 3 ? 0.38 : seat === 1 ? -0.2 : 0.18
      head.current.rotation.y = camYaw + Math.sin(t * 9) * shake.current * 0.28
      head.current.rotation.z = Math.cos(t * 11) * shake.current * 0.12
      head.current.rotation.x = -0.08 - (1 - visExt.current) * 0.14 + squash.current * 0.12
    }
    if (visorMat.current) {
      const blink = Math.sin(t * 7.5 + seat * 2.1) > 0.93 ? 0.18 : 1
      visorMat.current.emissiveIntensity = (winner ? 4.4 : down ? 3.6 : 2.5) * blink
    }
    const headZ = visualHeadAlong(visExt.current)
    const barrel = 0.55
    const rod = Math.max(0.34, headZ - barrel)
    if (piston.current) {
      piston.current.scale.set(1, rod, 1)
      piston.current.position.set(0, 0, barrel + rod / 2)
    }
    if (ringsRef.current) {
      for (let i = 0; i < RING_COUNT; i += 1) {
        const ring = ringsRef.current.children[i]
        if (ring) ring.position.set(0, 0, barrel + ((i + 0.35) / RING_COUNT) * rod)
      }
    }
    if (head.current) head.current.position.set(0, 0.04, headZ)
    if (label.current) label.current.position.set(0, 1.22, headZ)
    if (jaws.current) {
      const open = jaw.current
      const up = jaws.current.children[1]
      const low = jaws.current.children[2]
      if (up) up.rotation.x = open * 1.08
      if (low) low.rotation.x = -open * 1.02
    }
    if (mouthLight.current) {
      mouthLight.current.intensity = (down ? 5.4 : 3.1) + gulp.current * 6
    }
  })

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.02, -0.12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.82, 24]} />
        <meshStandardMaterial color={spec.color} transparent opacity={0.2} />
      </mesh>
      <group ref={rig}>
        <group ref={body} position={[0, 0.02, seat === 2 ? 0.08 : -0.18]}>
          <Chassis seat={seat} />
        </group>
        <group position={[0, BEAST_NECK_LIFT, NECK_VISUAL_ORIGIN]}>
          <MachineNeck seat={seat} pistonRef={piston} ringsRef={ringsRef} color={spec.color} />
          <group ref={head} position={[0, 0.04, 1]} scale={1.28}>
            <HeadDressing seat={seat} visorRef={visorMat} antL={antL} antR={antR} />
            <MachineMouth jawsRef={jaws} seat={seat} />
            <pointLight ref={mouthLight} position={[0, 0.04, 0.62]} color="#ff6a88" intensity={3.2} distance={2.8} />
          </group>
          <Billboard ref={label} position={[0, 1.22, 1]}>
            <Text
              fontSize={0.22}
              color={spec.color}
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.022}
              outlineColor="#041018"
              maxWidth={3.4}
              lineHeight={1.15}
            >
              {you ? `${spec.name}\nYOU` : spec.name}
            </Text>
          </Billboard>
        </group>
      </group>
    </group>
  )
}
