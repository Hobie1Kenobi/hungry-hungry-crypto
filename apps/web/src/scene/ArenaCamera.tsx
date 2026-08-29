import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { useViewStore } from '../store/viewStore'

const look = new Vector3()
const pos = new Vector3()

const TOY_DIST = 22.6
const TOY_ELEV = 0.73
const TOY_AZ = 0.64
const SHAKE_MS = 120

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

    if (ui === 'playing' && playBorn.current === 0) playBorn.current = now
    if (ui !== 'playing' && ui !== 'results') playBorn.current = 0

    const eatMax = Math.max(lastEatAt[0], lastEatAt[1], lastEatAt[2], lastEatAt[3], shakeAt)
    if (eatMax > lastEatMax.current) {
      lastEatMax.current = eatMax
      shakeUntil.current = now + SHAKE_MS
      shakeBorn.current = now
    }

    if (debug) {
      cam.fov = 40
      pos.set(0, 21.5, 0.02)
      cam.position.lerp(pos, 1 - Math.pow(0.0005, dt))
      look.set(0, 0, 0)
      cam.lookAt(look)
      cam.near = 0.1
      cam.far = 80
      cam.updateProjectionMatrix()
      return
    }

    const goAge = playBorn.current ? Math.min(1, (now - playBorn.current) / 900) : 1
    const dolly = MathUtils.lerp(1.05, 1, goAge * Math.min(1, dumpT + 0.25))
    const goldenLive = pellets.some((p) => p.golden && p.eatenBy === undefined && dumpT > 0.55)
    const zoom = goldenLive ? 0.985 : 1
    const elev = TOY_ELEV
    const swing = ui === 'results' ? Math.sin(clock.elapsedTime * 0.35) * 0.2 : 0
    const az = TOY_AZ + swing
    const dist = (ui === 'results' ? TOY_DIST + 1.1 : TOY_DIST) * dolly * zoom
    const x = dist * Math.cos(elev) * Math.sin(az)
    const y = dist * Math.sin(elev)
    const z = dist * Math.cos(elev) * Math.cos(az)

    let sx = 0
    let sy = 0
    if (now < shakeUntil.current) {
      const k = (shakeUntil.current - now) / SHAKE_MS
      const age = (now - shakeBorn.current) / 1000
      sx = Math.sin(age * 58) * 0.13 * k
      sy = Math.cos(age * 47) * 0.08 * k
    }

    pos.set(x + sx, y + sy, z)
    if (now < shakeUntil.current) {
      cam.position.copy(pos)
    } else {
      cam.position.lerp(pos, 1 - Math.pow(0.0004, dt))
    }
    look.set(ui === 'results' ? 0 : -0.55, 0.06, result ? 0 : 0.72)
    cam.lookAt(look)
    cam.fov = aspect < 1.1 ? 42 : 40
    cam.near = 0.1
    cam.far = 90
    cam.updateProjectionMatrix()
  })

  return null
}
