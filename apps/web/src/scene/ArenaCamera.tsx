import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { useJuiceStore } from '../game/juice'
import { useGameStore } from '../store/gameStore'
import { useViewStore } from '../store/viewStore'

const look = new Vector3()
const target = new Vector3()

export function ArenaCamera() {
  const camera = useThree((s) => s.camera)
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)
  const lastEatMax = useRef(0)
  const shakeUntil = useRef(0)
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
      shakeUntil.current = now + 120
    }

    if (debug) {
      cam.fov = 40
      target.set(0, 21.5, 0.02)
      cam.position.lerp(target, 1 - Math.pow(0.0005, dt))
      look.set(0, 0, 0)
      cam.lookAt(look)
      cam.near = 0.1
      cam.far = 80
      cam.updateProjectionMatrix()
      return
    }

    const goAge = playBorn.current ? Math.min(1, (now - playBorn.current) / 900) : 0
    const dolly = MathUtils.lerp(1.12, 1, goAge * Math.min(1, dumpT + 0.25))
    const goldenLive = pellets.some((p) => p.golden && p.eatenBy === undefined && dumpT > 0.55)
    const zoom = goldenLive ? 0.93 : 1
    const elev = 0.58
    let az = 0.62
    if (ui === 'results') az += clock.elapsedTime * 0.1
    const dist = 15.6 * dolly * zoom
    const x = dist * Math.cos(elev) * Math.sin(az)
    const y = dist * Math.sin(elev)
    const z = dist * Math.cos(elev) * Math.cos(az)

    let sx = 0
    let sy = 0
    if (now < shakeUntil.current) {
      const k = (shakeUntil.current - now) / 120
      sx = (Math.random() - 0.5) * 0.18 * k
      sy = (Math.random() - 0.5) * 0.12 * k
    }

    target.set(x + sx, y + sy, z)
    cam.position.lerp(target, 1 - Math.pow(0.0008, dt))
    look.set(0, 0.32, result ? 0 : 0.2)
    cam.lookAt(look)
    cam.fov = aspect < 1.1 ? 38 : 33
    cam.near = 0.1
    cam.far = 80
    cam.updateProjectionMatrix()
  })

  return null
}
