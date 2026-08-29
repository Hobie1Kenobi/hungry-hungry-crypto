import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { useViewStore } from '../store/viewStore'

const look = new Vector3()
const pos = new Vector3()

export const TOY_DIST = 16.6
export const TOY_ELEV = 0.5
export const TOY_AZ = 0.36
export const TOY_FOV = 38
export const TOY_LOOK = { x: 0.06, y: 0.52, z: -0.42 }
const SHAKE_MS = 120

export function toyCameraPosition(dist = TOY_DIST, elev = TOY_ELEV, az = TOY_AZ): [number, number, number] {
  return [
    dist * Math.cos(elev) * Math.sin(az),
    dist * Math.sin(elev),
    dist * Math.cos(elev) * Math.cos(az),
  ]
}

export function ArenaCamera() {
  const camera = useThree((s) => s.camera)
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)
  const lastEatMax = useRef(0)
  const shakeUntil = useRef(0)
  const shakeBorn = useRef(0)
  const playBorn = useRef(0)

  useFrame(({ clock }, dt) => {
    const cam = camera as PerspectiveCamera
    const aspect = width / Math.max(1, height)
    const debug = useViewStore.getState().debugTopDown
    const { ui, dumpT, lastEatAt, pellets, result } = useGameStore.getState()
    const shakeAt = useJuiceStore.getState().shakeAt
    const now = performance.now()

    const origin = useGameStore.getState().matchClockOrigin
    if (origin <= 0) playBorn.current = 0
    if (ui === 'playing' && origin > 0 && playBorn.current === 0) playBorn.current = now
    if (ui !== 'playing' && ui !== 'results') playBorn.current = 0

    const eatMax = Math.max(lastEatAt[0], lastEatAt[1], lastEatAt[2], lastEatAt[3], shakeAt)
    if (eatMax > lastEatMax.current) {
      lastEatMax.current = eatMax
      shakeUntil.current = now + SHAKE_MS
      shakeBorn.current = now
    }

    if (debug) {
      cam.clearViewOffset()
      cam.fov = 42
      pos.set(0, 22.4, 0.02)
      cam.position.lerp(pos, 1 - Math.pow(0.0005, dt))
      look.set(0, 0, 0)
      cam.lookAt(look)
      cam.near = 0.35
      cam.far = 80
      cam.updateProjectionMatrix()
      return
    }

    cam.clearViewOffset()
    const goAge = playBorn.current ? Math.min(1, (now - playBorn.current) / 900) : 1
    const dolly = MathUtils.lerp(1.03, 1, goAge * Math.min(1, dumpT + 0.25))
    const goldenLive = pellets.some((p) => p.golden && p.eatenBy === undefined && dumpT > 0.55)
    const zoom = goldenLive ? 0.985 : 1
    const elev = TOY_ELEV
    const swing = ui === 'results' ? Math.sin(clock.elapsedTime * 0.28) * 0.08 : 0
    const az = TOY_AZ + swing
    const short = height > 0 && height < 860 ? 1.06 : 1
    const tall = height > 0 && aspect < 1.2 ? 1.1 : 1
    const dist = (ui === 'results' ? TOY_DIST + 0.5 : TOY_DIST) * short * tall * dolly * zoom
    const [x, y, z] = toyCameraPosition(dist, elev, az)

    let sx = 0
    let sy = 0
    if (now < shakeUntil.current) {
      const k = (shakeUntil.current - now) / SHAKE_MS
      const age = (now - shakeBorn.current) / 1000
      sx = Math.sin(age * 58) * 0.1 * k
      sy = Math.cos(age * 47) * 0.06 * k
    }

    pos.set(x + sx, y + sy, z)
    if (now < shakeUntil.current || (playBorn.current && now - playBorn.current < 32)) {
      cam.position.copy(pos)
    } else {
      cam.position.lerp(pos, 1 - Math.pow(0.0004, dt))
    }
    look.set(TOY_LOOK.x, TOY_LOOK.y, result ? TOY_LOOK.z - 0.12 : TOY_LOOK.z)
    cam.lookAt(look)
    cam.fov = aspect < 1.1 ? 44 : TOY_FOV
    cam.near = 0.35
    cam.far = 90
    cam.updateProjectionMatrix()
  })

  return null
}
