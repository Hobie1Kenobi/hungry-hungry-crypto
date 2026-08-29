import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { useViewStore } from '../store/viewStore'
import { RESULT_HERO } from './beasts/vinyl'

const look = new Vector3()
const pos = new Vector3()

export const TOY_POS = { x: 4.72, y: 9.28, z: -10.15 }
export const TOY_LOOK = { x: 0.06, y: 0.92, z: -2.28 }
export const TOY_FOV = 36
const SHAKE_MS = 120

/** Winner parks on this pad so the body sits in the open pond right of the left card. */
export const RESULT_POS = { x: 6.15, y: 5.85, z: -4.55 }

export function toyCameraPosition(): [number, number, number] {
  return [TOY_POS.x, TOY_POS.y, TOY_POS.z]
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
    const { ui, dumpT, lastEatAt, pellets } = useGameStore.getState()
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
      cam.near = 0.45
      cam.far = 80
      cam.updateProjectionMatrix()
      return
    }

    cam.clearViewOffset()
    const goAge = playBorn.current ? Math.min(1, (now - playBorn.current) / 900) : 1
    const dolly = MathUtils.lerp(1.04, 1, goAge * Math.min(1, dumpT + 0.25))
    const goldenLive = pellets.some((p) => p.golden && p.eatenBy === undefined && dumpT > 0.55)
    const zoom = goldenLive ? 0.985 : 1
    const short = height > 0 && height < 600 ? 1.06 : 1
    const tall = height > 0 && aspect < 1.05 ? 1.06 : 1
    const k = short * tall * dolly * zoom

    let sx = 0
    let sy = 0
    if (now < shakeUntil.current) {
      const t = (shakeUntil.current - now) / SHAKE_MS
      const age = (now - shakeBorn.current) / 1000
      sx = Math.sin(age * 58) * 0.08 * t
      sy = Math.cos(age * 47) * 0.05 * t
    }

    const snap = ui === 'results' || (playBorn.current && now - playBorn.current < 32) || now < shakeUntil.current
    if (ui === 'results') {
      const swing = Math.sin(clock.elapsedTime * 0.22) * 0.08
      pos.set(RESULT_POS.x + sx + swing, RESULT_POS.y + sy, RESULT_POS.z)
      look.set(RESULT_HERO.x, RESULT_HERO.y, RESULT_HERO.z)
    } else {
      pos.set(TOY_POS.x + sx, TOY_POS.y * Math.min(k, 1.08) + sy, TOY_POS.z)
      look.set(TOY_LOOK.x, TOY_LOOK.y, TOY_LOOK.z)
    }
    if (snap) {
      cam.position.copy(pos)
    } else {
      cam.position.lerp(pos, 1 - Math.pow(0.0004, dt))
    }
    cam.lookAt(look)
    cam.fov = aspect < 1.1 ? 46 : TOY_FOV
    cam.near = 0.45
    cam.far = 90
    cam.updateProjectionMatrix()
  })

  return null
}
