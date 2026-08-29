import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type Ref } from 'react'
import type { Group, Mesh, MeshStandardMaterial, PointLight } from 'three'
import type { Seat } from '@hhc/shared'
import { BEASTS, beastPosition, beastYaw, chompReach } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { Chassis, HeadDressing, MachineMouth } from './beasts/kits'
import { BEAST_NECK_LIFT } from './beasts/vinyl'

const RING_COUNT = 6

function HydraulicNeck({
  pistonRef,
  ringsRef,
  color,
  gold,
}: {
  pistonRef: Ref<Mesh>
  ringsRef: Ref<Group>
  color: string
  gold: boolean
}) {
  const rings = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => i), [])
  const ringColor = gold ? '#D4AF37' : '#e6edf2'
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.5, 0.56, 0.36, 8]} />
        <meshStandardMaterial color={ringColor} metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.52]} castShadow>
        <cylinderGeometry args={[0.44, 0.48, 0.72, 8]} />
        <meshStandardMaterial color="#8b96a2" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh ref={pistonRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.2]} castShadow>
        <cylinderGeometry args={[0.36, 0.38, 1, 10]} />
        <meshStandardMaterial color={color} metalness={0.58} roughness={0.26} />
      </mesh>
      <group ref={ringsRef}>
        {rings.map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.42, 0.075, 8, 16]} />
            <meshStandardMaterial color={ringColor} metalness={0.92} roughness={0.12} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Beast({ seat }: { seat: Seat }) {
  const spec = BEASTS[seat]
  const extend = useGameStore((s) => s.neckExtend[seat])
  const down = useGameStore((s) => s.chompDown[seat])
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
  const jaw = useRef(0.34)
  const visExt = useRef(0)
  const slam = useRef(0)

  const [x, y, z] = beastPosition(seat)
  const yaw = beastYaw(seat)
  const gold = seat === 3

  useFrame((_, dt) => {
    const t = performance.now() / 1000
    if (down && !lastDown.current) {
      anticip.current = 1
      squash.current = 1
      slam.current = 1
    }
    lastDown.current = down
    anticip.current = Math.max(0, anticip.current - dt * 9)
    slam.current = Math.max(0, slam.current - dt * 7)

    if (lastEatAt > lastEat.current) {
      lastEat.current = lastEatAt
      squash.current = 1
      gulp.current = 1
    }
    squash.current = Math.max(0, squash.current - dt * 11)
    gulp.current = Math.max(0, gulp.current - dt * 2.8)

    if (missAt > 0 && performance.now() - missAt < 220) shake.current = 1
    shake.current = Math.max(0, shake.current - dt * 6)

    const winner = ui === 'results' && result?.winner === seat
    const loser = ui === 'results' && result && result.winner !== seat
    const targetJaw = winner ? 0.62 : loser ? 0.12 : down ? Math.min(1, Math.max(extend * 1.2, 0.82)) : 0.34 + extend * 0.1
    jaw.current += (targetJaw - jaw.current) * Math.min(1, dt * (down ? 10 : 14))

    const punch = extend + slam.current * 0.14 - anticip.current * 0.2 + (extend > 0.7 ? Math.sin(extend * Math.PI) * 0.05 : 0)
    visExt.current += (Math.max(0, Math.min(1.08, punch)) - visExt.current) * Math.min(1, dt * 16)

    const breathe = 1 + Math.sin(t * 2.05 + seat) * (down ? 0.01 : 0.028)
    const sq = 1 - squash.current * 0.32
    const gulpS = 1 + gulp.current * 0.14
    const fat = seat === 2 ? 1.04 : 1

    if (rig.current) {
      rig.current.rotation.x = winner ? -0.42 : loser ? 0.4 : squash.current * -0.08
      rig.current.rotation.z = winner ? Math.sin(t * 2.2) * 0.05 : loser ? 0.12 : 0
      rig.current.position.y = winner ? 0.1 : loser ? -0.14 : 0
    }
    if (body.current) {
      body.current.scale.set(fat * gulpS * (1 + squash.current * 0.16), breathe * sq * (loser ? 0.82 : 1), fat * gulpS)
    }
    if (antL.current) antL.current.rotation.z = Math.sin(t * 3.4 + seat) * 0.22
    if (antR.current) antR.current.rotation.z = Math.sin(t * 3.4 + seat + 1.2) * -0.22
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 9) * shake.current * 0.28
      head.current.rotation.z = Math.cos(t * 11) * shake.current * 0.12
      head.current.rotation.x = -0.12 + squash.current * 0.18
    }
    if (visorMat.current) {
      const blink = Math.sin(t * 7.5 + seat * 2.1) > 0.93 ? 0.18 : 1
      visorMat.current.emissiveIntensity = (winner ? 4.2 : down ? 3.4 : 2.4) * blink
    }
    const len = chompReach(visExt.current)
    const barrel = 0.82
    const rod = Math.max(0.28, len - barrel)
    if (piston.current) {
      piston.current.scale.set(1, rod, 1)
      piston.current.position.set(0, 0, barrel + rod / 2)
    }
    if (ringsRef.current) {
      for (let i = 0; i < RING_COUNT; i += 1) {
        const ring = ringsRef.current.children[i]
        if (ring) ring.position.set(0, 0, barrel + ((i + 0.45) / RING_COUNT) * rod)
      }
    }
    if (head.current) head.current.position.set(0, 0.02, len)
    if (jaws.current) {
      const open = jaw.current
      const up = jaws.current.children[1]
      const low = jaws.current.children[2]
      if (up) up.rotation.x = open * 0.92
      if (low) low.rotation.x = -open * 0.82
    }
    if (mouthLight.current) {
      mouthLight.current.intensity = (down ? 3.6 : 1.1) + gulp.current * 4
    }
  })

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.02, -0.18]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.35, 24]} />
        <meshStandardMaterial color={spec.color} transparent opacity={0.18} />
      </mesh>
      <group ref={rig}>
        <group ref={body} position={[0, 0.02, -0.12]}>
          <Chassis seat={seat} />
        </group>
        <group position={[0, BEAST_NECK_LIFT, 0.42]}>
          <HydraulicNeck pistonRef={piston} ringsRef={ringsRef} color={spec.color} gold={gold} />
          <group ref={head} position={[0, 0.02, 1]}>
            <HeadDressing seat={seat} visorRef={visorMat} antL={antL} antR={antR} />
            <MachineMouth jawsRef={jaws} seat={seat} />
            <pointLight ref={mouthLight} position={[0, 0.02, 0.55]} color="#ff6a88" intensity={1.2} distance={2.4} />
          </group>
        </group>
      </group>
      <Billboard position={[0, 2.15, 0]}>
        <Text fontSize={0.22} color={spec.color} anchorX="center" anchorY="middle">
          {you ? `${spec.name}  YOU` : spec.name}
        </Text>
      </Billboard>
    </group>
  )
}
