import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import type { PerspectiveCamera } from 'three'
import { SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeSoftEnv } from './arenaEnv'
import { Beast } from './Beast'
import { Hopper } from './Hopper'
import { Lights } from './Lights'
import { PelletChip } from './PelletChip'
import { Pond } from './Pond'
import { Table } from './Table'

const BG = '#3a4e66'

function ArenaCamera() {
  const camera = useThree((s) => s.camera)
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)

  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera
    const aspect = width / Math.max(1, height)
    const halfW = 6.85
    const halfD = 7.55
    const topHud = 0.12
    const botHud = 0.2
    cam.fov = aspect < 1.1 ? 42 : 36
    const vFov = (cam.fov * Math.PI) / 180
    const distH = (2 * halfD * (1 + topHud + botHud)) / (2 * Math.tan(vFov / 2))
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const distW = (2 * halfW) / (2 * Math.tan(hFov / 2))
    const dist = Math.max(distH, distW) * 1.08
    const elev = 0.91
    cam.position.set(0, dist * elev, -dist * Math.sqrt(Math.max(0.0001, 1 - elev * elev)))
    cam.lookAt(0, 0.28, 0.05)
    cam.near = 0.1
    cam.far = 70
    cam.updateProjectionMatrix()
  }, [camera, width, height])

  return null
}

function SoftEnvironment() {
  const scene = useThree((s) => s.scene)
  useLayoutEffect(() => {
    const env = makeSoftEnv()
    scene.environment = env
    scene.environmentIntensity = 0.75
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [scene])
  return null
}

export function ArenaCanvas() {
  const pellets = useGameStore((s) => s.pellets)

  return (
    <div className="canvas-wrap">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 19.5, -5.2], fov: 34, near: 0.1, far: 70 }}
        gl={{ antialias: true }}
      >
        <ArenaCamera />
        <SoftEnvironment />
        <color attach="background" args={[BG]} />
        <Lights />
        <Table />
        <Pond />
        <Hopper />
        {SEATS.map((seat) => (
          <Beast key={seat} seat={seat} />
        ))}
        {pellets.map((pellet) => (
          <PelletChip key={pellet.id} pellet={pellet} />
        ))}
        <ContactShadows position={[0, 0.035, 0]} opacity={0.14} scale={13} blur={1.6} far={4} />
      </Canvas>
    </div>
  )
}
