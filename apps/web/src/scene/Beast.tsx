import { Billboard, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type Ref } from 'react'
import {
  AdditiveBlending,
  LatheGeometry,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  Vector2,
} from 'three'
import type { Seat } from '@hhc/shared'
import { BEASTS, beastPosition, beastYaw, chompReach } from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'

const RING_COUNT = 6

function bodyGeometry() {
  const pts = [
    new Vector2(0.05, 0.0),
    new Vector2(0.46, 0.04),
    new Vector2(0.72, 0.2),
    new Vector2(0.8, 0.48),
    new Vector2(0.7, 0.78),
    new Vector2(0.46, 1.0),
    new Vector2(0.26, 1.12),
    new Vector2(0.0, 1.16),
  ]
  return new LatheGeometry(pts, 28)
}

function vinyl(color: string, extra?: { metalness?: number; roughness?: number; emissive?: string; emissiveIntensity?: number }) {
  return {
    color,
    metalness: extra?.metalness ?? 0.18,
    roughness: extra?.roughness ?? 0.28,
    clearcoat: 0.82,
    clearcoatRoughness: 0.18,
    sheen: 0.45,
    sheenColor: color,
    emissive: extra?.emissive ?? '#000000',
    emissiveIntensity: extra?.emissiveIntensity ?? 0,
  }
}

function Mouth({
  jawsRef,
  color,
  accent,
  saw,
  gold,
}: {
  jawsRef: Ref<Group>
  color: string
  accent: string
  saw: boolean
  gold: boolean
}) {
  const teeth = [-0.38, -0.22, -0.08, 0.08, 0.22, 0.38]
  return (
    <group ref={jawsRef}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.86, 0.28, 0.42]} />
        <meshStandardMaterial color="#14080c" roughness={0.85} />
      </mesh>
      <group position={[0, 0.12, 0.04]}>
        <RoundedBox args={[1.18, 0.2, 0.82]} radius={0.06} smoothness={3} castShadow>
          <meshPhysicalMaterial {...vinyl(color)} />
        </RoundedBox>
        <mesh position={[0, -0.08, 0.08]}>
          <boxGeometry args={[0.92, 0.1, 0.5]} />
          <meshStandardMaterial color="#6a2434" roughness={0.92} />
        </mesh>
        {teeth.map((x) => (
          <mesh key={`u${x}`} position={[x, -0.16, 0.16]} castShadow>
            <boxGeometry args={[0.1, 0.16, 0.1]} />
            <meshPhysicalMaterial color="#f6f3ea" metalness={0.35} roughness={0.12} clearcoat={0.9} />
          </mesh>
        ))}
        {saw
          ? teeth.map((x) => (
              <mesh key={`s${x}`} position={[x, 0.14, 0.28]} rotation={[0.4, 0, 0]} castShadow>
                <coneGeometry args={[0.07, 0.16, 5]} />
                <meshStandardMaterial color={accent} metalness={0.6} roughness={0.28} />
              </mesh>
            ))
          : null}
        {gold ? (
          <mesh position={[0, 0.12, 0.05]}>
            <boxGeometry args={[1.0, 0.04, 0.62]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.22} />
          </mesh>
        ) : null}
      </group>
      <group position={[0, -0.12, 0.04]}>
        <RoundedBox args={[1.12, 0.18, 0.78]} radius={0.055} smoothness={3} castShadow>
          <meshPhysicalMaterial {...vinyl(color)} />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.1]}>
          <boxGeometry args={[0.88, 0.1, 0.48]} />
          <meshStandardMaterial color="#6a2434" roughness={0.92} />
        </mesh>
        {teeth.map((x) => (
          <mesh key={`l${x}`} position={[x, 0.16, 0.14]} castShadow>
            <boxGeometry args={[0.09, 0.14, 0.09]} />
            <meshPhysicalMaterial color="#f6f3ea" metalness={0.35} roughness={0.12} clearcoat={0.9} />
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

  const body = useRef<Group>(null)
  const neck = useRef<Group>(null)
  const tube = useRef<Mesh>(null)
  const ringsRef = useRef<Group>(null)
  const head = useRef<Group>(null)
  const jaws = useRef<Group>(null)
  const antL = useRef<Group>(null)
  const antR = useRef<Group>(null)
  const visorMat = useRef<MeshStandardMaterial>(null)
  const lastDown = useRef(false)
  const lastEat = useRef(0)
  const anticip = useRef(0)
  const squash = useRef(0)
  const gulp = useRef(0)
  const shake = useRef(0)
  const jaw = useRef(0)
  const visExt = useRef(0)

  const [x, y, z] = beastPosition(seat)
  const yaw = beastYaw(seat)
  const geo = useMemo(() => bodyGeometry(), [])
  const fat = seat === 2 ? 1.16 : seat === 3 ? 1.06 : 1
  const tallAnt = seat === 0 ? 1.22 : 1
  const saw = seat === 1
  const gold = seat === 3

  useFrame((_, dt) => {
    const t = performance.now() / 1000
    if (down && !lastDown.current) anticip.current = 1
    lastDown.current = down
    anticip.current = Math.max(0, anticip.current - dt * 10)

    if (lastEatAt > lastEat.current) {
      lastEat.current = lastEatAt
      squash.current = 1
      gulp.current = 1
    }
    squash.current = Math.max(0, squash.current - dt * 16)
    gulp.current = Math.max(0, gulp.current - dt * 3.2)

    if (missAt > 0 && performance.now() - missAt < 220) shake.current = 1
    shake.current = Math.max(0, shake.current - dt * 6)

    const targetJaw = down ? Math.min(1, Math.max(extend * 1.25, 0.35)) : extend * 0.18
    jaw.current += (targetJaw - jaw.current) * Math.min(1, dt * (down ? 10 : 18))

    const slam = extend + (extend > 0.75 ? Math.sin(extend * Math.PI) * 0.035 : 0) - anticip.current * 0.14
    visExt.current += (Math.max(0, Math.min(1.06, slam)) - visExt.current) * Math.min(1, dt * 14)

    const winner = ui === 'results' && result?.winner === seat
    const loser = ui === 'results' && result && result.winner !== seat
    const breathe = 1 + Math.sin(t * 2.05 + seat) * (down ? 0.01 : 0.028)
    const sq = 1 - squash.current * 0.18
    const gulpS = 1 + gulp.current * 0.08

    if (body.current) {
      body.current.scale.set(fat * gulpS * (1 + squash.current * 0.1), breathe * sq * (loser ? 0.86 : 1), fat * gulpS)
      body.current.rotation.x = winner ? -0.28 : loser ? 0.32 : 0
    }
    if (antL.current) antL.current.rotation.z = Math.sin(t * 3.4 + seat) * 0.18
    if (antR.current) antR.current.rotation.z = Math.sin(t * 3.4 + seat + 1.2) * -0.18
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 9) * shake.current * 0.28
      head.current.rotation.z = Math.cos(t * 11) * shake.current * 0.12
    }
    if (visorMat.current) {
      const blink = Math.sin(t * 7.5 + seat * 2.1) > 0.93 ? 0.15 : 1
      visorMat.current.emissiveIntensity = (winner ? 3.4 : 1.7) * blink
    }
    const len = chompReach(visExt.current)
    if (tube.current) {
      tube.current.scale.set(1, len, 1)
      tube.current.position.set(0, 0, len / 2)
    }
    if (ringsRef.current) {
      for (let i = 0; i < RING_COUNT; i += 1) {
        const ring = ringsRef.current.children[i]
        if (ring) ring.position.set(0, 0, ((i + 0.5) / RING_COUNT) * len)
      }
    }
    if (head.current) head.current.position.set(0, 0, len)
    if (jaws.current) {
      const open = jaw.current
      const up = jaws.current.children[1]
      const low = jaws.current.children[2]
      if (up) up.rotation.x = open * 0.72
      if (low) low.rotation.x = -open * 0.72
    }
  })

  const rings = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => i), [])

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.02, -0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.15, 24]} />
        <meshStandardMaterial color={spec.color} transparent opacity={0.16} />
      </mesh>
      <group ref={body} position={[0, 0.02, -0.18]} scale={[fat, 1, fat]}>
        <mesh geometry={geo} castShadow>
          <meshPhysicalMaterial {...vinyl(spec.color)} />
        </mesh>
        <RoundedBox args={[1.15, 0.32, 0.7]} radius={0.08} smoothness={3} position={[0, 0.62, 0.08]} castShadow>
          <meshPhysicalMaterial {...vinyl(spec.accent, { metalness: 0.35, roughness: 0.34 })} />
        </RoundedBox>
        <mesh position={[0, 0.78, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.28, 0.055, 10, 20]} />
          <meshStandardMaterial color={gold ? '#D4AF37' : '#c5ced8'} metalness={0.86} roughness={0.2} />
        </mesh>
        <RoundedBox args={[0.78, 0.22, 0.36]} radius={0.05} smoothness={3} position={[0, 0.92, 0.1]} castShadow>
          <meshPhysicalMaterial color="#0b1018" metalness={0.4} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.98, 0.22]} castShadow>
          <boxGeometry args={[0.62, 0.14, 0.08]} />
          <meshStandardMaterial
            ref={visorMat}
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={1.7}
            metalness={0.2}
            roughness={0.18}
          />
        </mesh>
        <mesh position={[0, 0.98, 0.26]}>
          <planeGeometry args={[0.78, 0.28]} />
          <meshBasicMaterial
            color={spec.color}
            transparent
            opacity={0.35}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <group ref={antL} position={[-0.2, 1.12, -0.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.42 * tallAnt, 8]} />
            <meshStandardMaterial color={spec.accent} metalness={0.55} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.26 * tallAnt, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.6} />
          </mesh>
        </group>
        <group ref={antR} position={[0.2, 1.12, -0.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.42 * tallAnt, 8]} />
            <meshStandardMaterial color={spec.accent} metalness={0.55} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.26 * tallAnt, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={1.6} />
          </mesh>
        </group>
        <RoundedBox args={[0.34, 0.2, 0.46]} radius={0.05} smoothness={3} position={[-0.42, 0.12, 0.22]} castShadow>
          <meshStandardMaterial color={spec.accent} roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.34, 0.2, 0.46]} radius={0.05} smoothness={3} position={[0.42, 0.12, 0.22]} castShadow>
          <meshStandardMaterial color={spec.accent} roughness={0.7} />
        </RoundedBox>
      </group>
      <group ref={neck} position={[0, 0.72, 0.32]}>
        <mesh ref={tube} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 1, 12]} />
          <meshStandardMaterial color={spec.color} metalness={0.45} roughness={0.32} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} position={[0, 0, (i + 0.5) / RING_COUNT]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.2, 0.038, 8, 16]} />
              <meshStandardMaterial color={gold ? '#D4AF37' : '#d0d6de'} metalness={0.88} roughness={0.16} />
            </mesh>
          ))}
        </group>
        <group ref={head} position={[0, 0, 1]}>
          <Mouth jawsRef={jaws} color={spec.color} accent={spec.accent} saw={saw} gold={gold} />
        </group>
      </group>
      <Billboard position={[0, 1.86, 0]}>
        <Text fontSize={0.22} color={spec.color} anchorX="center" anchorY="middle">
          {you ? `${spec.name}  YOU` : spec.name}
        </Text>
      </Billboard>
    </group>
  )
}
