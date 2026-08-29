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

function ArenaCamera() {
  const camera = useThree((s) => s.camera)
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)

  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera
    const aspect = width / Math.max(1, height)
    cam.fov = aspect < 1.05 ? 40 : 34
    cam.near = 0.1
    cam.far = 80
    cam.position.set(0, 28.2, -4.6)
    cam.lookAt(0, 0.2, 0.85)
    cam.updateProjectionMatrix()
  }, [camera, width, height])

  return null
}

function SoftEnvironment() {
  const scene = useThree((s) => s.scene)
  useLayoutEffect(() => {
    const env = makeSoftEnv()
    scene.environment = env
    scene.environmentIntensity = 0.7
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
        camera={{ position: [0, 28.2, -4.6], fov: 34, near: 0.1, far: 80 }}
        gl={{ antialias: true }}
      >
        <ArenaCamera />
        <SoftEnvironment />
        <color attach="background" args={['#1c2738']} />
        <fog attach="fog" args={['#1c2738', 58, 88]} />
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
        <ContactShadows position={[0, 0.035, 0]} opacity={0.16} scale={13} blur={1.8} far={4.5} />
      </Canvas>
    </div>
  )
}
