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

const RING_COUNT = 5

function bodyGeometry() {
  const pts = [
    new Vector2(0.08, 0.0),
    new Vector2(0.58, 0.05),
    new Vector2(0.86, 0.22),
    new Vector2(0.94, 0.52),
    new Vector2(0.82, 0.84),
    new Vector2(0.52, 1.08),
    new Vector2(0.28, 1.2),
    new Vector2(0.0, 1.24),
  ]
  return new LatheGeometry(pts, 32)
}

function vinyl(color: string, extra?: { metalness?: number; roughness?: number; emissive?: string; emissiveIntensity?: number }) {
  return {
    color,
    metalness: extra?.metalness ?? 0.22,
    roughness: extra?.roughness ?? 0.26,
    clearcoat: 0.88,
    clearcoatRoughness: 0.16,
    sheen: 0.5,
    sheenColor: color,
    emissive: extra?.emissive ?? '#000000',
    emissiveIntensity: extra?.emissiveIntensity ?? 0,
  }
}

function Head({
  jawsRef,
  visorRef,
  antL,
  antR,
  color,
  accent,
  saw,
  gold,
  tallAnt,
}: {
  jawsRef: Ref<Group>
  visorRef: Ref<MeshStandardMaterial>
  antL: Ref<Group>
  antR: Ref<Group>
  color: string
  accent: string
  saw: boolean
  gold: boolean
  tallAnt: number
}) {
  const teeth = [-0.42, -0.25, -0.08, 0.08, 0.25, 0.42]
  return (
    <group>
      <RoundedBox args={[1.05, 0.72, 0.78]} radius={0.12} smoothness={4} position={[0, 0.08, -0.12]} castShadow>
        <meshPhysicalMaterial {...vinyl(color)} />
      </RoundedBox>
      <RoundedBox args={[0.86, 0.28, 0.22]} radius={0.05} smoothness={3} position={[0, 0.2, 0.22]} castShadow>
        <meshPhysicalMaterial color="#070b10" metalness={0.45} roughness={0.28} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0.34]} castShadow>
        <boxGeometry args={[0.74, 0.2, 0.08]} />
        <meshStandardMaterial
          ref={visorRef}
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          metalness={0.15}
          roughness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.2, 0.38]}>
        <planeGeometry args={[0.92, 0.34]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={antL} position={[-0.26, 0.5, -0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.5 * tallAnt, 8]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.3 * tallAnt, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      </group>
      <group ref={antR} position={[0.26, 0.5, -0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.5 * tallAnt, 8]} />
          <meshStandardMaterial color={accent} metalness={0.6} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.3 * tallAnt, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      </group>
      {gold ? (
        <mesh position={[0, 0.42, -0.12]}>
          <boxGeometry args={[0.9, 0.05, 0.55]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.18} />
        </mesh>
      ) : null}
      <group ref={jawsRef} position={[0, -0.02, 0.28]}>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.95, 0.38, 0.55]} />
          <meshStandardMaterial color="#1a0a0e" roughness={0.88} />
        </mesh>
        <group position={[0, 0.16, 0.08]}>
          <RoundedBox args={[1.28, 0.26, 0.92]} radius={0.07} smoothness={3} castShadow>
            <meshPhysicalMaterial {...vinyl(color)} />
          </RoundedBox>
          <mesh position={[0, -0.14, 0.14]}>
            <boxGeometry args={[1.08, 0.2, 0.7]} />
            <meshStandardMaterial color="#c43b58" roughness={0.95} />
          </mesh>
          {teeth.map((tx) => (
            <mesh key={`u${tx}`} position={[tx, -0.32, 0.22]} castShadow>
              <boxGeometry args={[0.13, 0.28, 0.13]} />
              <meshPhysicalMaterial color="#fff8ec" metalness={0.45} roughness={0.08} clearcoat={1} />
            </mesh>
          ))}
          {saw
            ? teeth.map((tx) => (
                <mesh key={`s${tx}`} position={[tx, 0.18, 0.36]} rotation={[0.45, 0, 0]} castShadow>
                  <coneGeometry args={[0.08, 0.2, 5]} />
                  <meshStandardMaterial color={accent} metalness={0.65} roughness={0.24} />
                </mesh>
              ))
            : null}
        </group>
        <group position={[0, -0.16, 0.08]}>
          <RoundedBox args={[1.2, 0.24, 0.86]} radius={0.06} smoothness={3} castShadow>
            <meshPhysicalMaterial {...vinyl(color)} />
          </RoundedBox>
          <mesh position={[0, 0.14, 0.14]}>
            <boxGeometry args={[1.04, 0.2, 0.66]} />
            <meshStandardMaterial color="#c43b58" roughness={0.95} />
          </mesh>
          {teeth.map((tx) => (
            <mesh key={`l${tx}`} position={[tx, 0.32, 0.2]} castShadow>
              <boxGeometry args={[0.12, 0.26, 0.12]} />
              <meshPhysicalMaterial color="#fff8ec" metalness={0.45} roughness={0.08} clearcoat={1} />
            </mesh>
          ))}
        </group>
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
  const fat = seat === 2 ? 1.18 : seat === 3 ? 1.08 : seat === 1 ? 0.96 : 1
  const tallAnt = seat === 0 ? 1.28 : seat === 2 ? 0.86 : 1
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

    const targetJaw = down ? Math.min(1, Math.max(extend * 1.25, 0.72)) : 0.22 + extend * 0.12
    jaw.current += (targetJaw - jaw.current) * Math.min(1, dt * (down ? 9 : 16))

    const slam = extend + (extend > 0.75 ? Math.sin(extend * Math.PI) * 0.03 : 0) - anticip.current * 0.12
    visExt.current += (Math.max(0, Math.min(1.05, slam)) - visExt.current) * Math.min(1, dt * 14)

    const winner = ui === 'results' && result?.winner === seat
    const loser = ui === 'results' && result && result.winner !== seat
    const breathe = 1 + Math.sin(t * 2.05 + seat) * (down ? 0.01 : 0.03)
    const sq = 1 - squash.current * 0.18
    const gulpS = 1 + gulp.current * 0.08

    if (body.current) {
      body.current.scale.set(fat * gulpS * (1 + squash.current * 0.1), breathe * sq * (loser ? 0.86 : 1), fat * gulpS)
      body.current.rotation.x = winner ? -0.28 : loser ? 0.32 : 0
    }
    if (antL.current) antL.current.rotation.z = Math.sin(t * 3.4 + seat) * 0.2
    if (antR.current) antR.current.rotation.z = Math.sin(t * 3.4 + seat + 1.2) * -0.2
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 9) * shake.current * 0.28
      head.current.rotation.z = Math.cos(t * 11) * shake.current * 0.12
    }
    if (visorMat.current) {
      const blink = Math.sin(t * 7.5 + seat * 2.1) > 0.93 ? 0.18 : 1
      visorMat.current.emissiveIntensity = (winner ? 3.6 : 2.3) * blink
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
    if (head.current) head.current.position.set(0, 0.02, len)
    if (jaws.current) {
      const open = jaw.current
      const up = jaws.current.children[1]
      const low = jaws.current.children[2]
      if (up) up.rotation.x = open * 0.95
      if (low) low.rotation.x = -open * 0.85
    }
  })

  const rings = useMemo(() => Array.from({ length: RING_COUNT }, (_, i) => i), [])

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.02, -0.12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.28, 24]} />
        <meshStandardMaterial color={spec.color} transparent opacity={0.2} />
      </mesh>
      <group ref={body} position={[0, 0.02, -0.22]} scale={[fat, 1, fat]}>
        <mesh geometry={geo} castShadow>
          <meshPhysicalMaterial {...vinyl(spec.color)} />
        </mesh>
        <RoundedBox args={[1.42, 0.38, 0.82]} radius={0.08} smoothness={3} position={[0, 0.58, 0.06]} castShadow>
          <meshPhysicalMaterial {...vinyl(spec.accent, { metalness: 0.4, roughness: 0.32 })} />
        </RoundedBox>
        <RoundedBox args={[0.52, 0.28, 0.58]} radius={0.06} smoothness={3} position={[-0.58, 0.22, 0.18]} castShadow>
          <meshStandardMaterial color={spec.accent} roughness={0.62} />
        </RoundedBox>
        <RoundedBox args={[0.52, 0.28, 0.58]} radius={0.06} smoothness={3} position={[0.58, 0.22, 0.18]} castShadow>
          <meshStandardMaterial color={spec.accent} roughness={0.62} />
        </RoundedBox>
        <mesh position={[0, 0.78, 0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.34, 0.07, 10, 22]} />
          <meshStandardMaterial color={gold ? '#D4AF37' : '#d7dee6'} metalness={0.9} roughness={0.16} />
        </mesh>
      </group>
      <group position={[0, 0.78, 0.28]}>
        <mesh ref={tube} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.32, 1, 14]} />
          <meshStandardMaterial color={spec.color} metalness={0.55} roughness={0.28} />
        </mesh>
        <group ref={ringsRef}>
          {rings.map((i) => (
            <mesh key={i} position={[0, 0, (i + 0.5) / RING_COUNT]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.34, 0.055, 8, 18]} />
              <meshStandardMaterial color={gold ? '#D4AF37' : '#e4eaef'} metalness={0.92} roughness={0.12} />
            </mesh>
          ))}
        </group>
        <group ref={head} position={[0, 0.02, 1]}>
          <Head
            jawsRef={jaws}
            visorRef={visorMat}
            antL={antL}
            antR={antR}
            color={spec.color}
            accent={spec.accent}
            saw={saw}
            gold={gold}
            tallAnt={tallAnt}
          />
        </group>
      </group>
      <Billboard position={[0, 2.05, 0]}>
        <Text fontSize={0.22} color={spec.color} anchorX="center" anchorY="middle">
          {you ? `${spec.name}  YOU` : spec.name}
        </Text>
      </Billboard>
    </group>
  )
}
