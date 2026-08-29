import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import { SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeSoftEnv } from './arenaEnv'
import { ArenaCamera } from './ArenaCamera'
import { Beast } from './Beast'
import { Fx } from './Fx'
import { Hopper } from './Hopper'
import { Lights } from './Lights'
import { PelletChip } from './PelletChip'
import { Pond } from './Pond'
import { Studio } from './Studio'
import { Table } from './Table'

const BG = '#eddcc6'

function SoftEnvironment() {
  const scene = useThree((s) => s.scene)
  useLayoutEffect(() => {
    const env = makeSoftEnv()
    scene.environment = env
    scene.environmentIntensity = 0.85
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
        camera={{ position: [4.8, 6.4, 10.4], fov: 34, near: 0.1, far: 90 }}
        gl={{ antialias: true }}
      >
        <ArenaCamera />
        <SoftEnvironment />
        <color attach="background" args={[BG]} />
        <Lights />
        <Studio />
        <Table />
        <Pond />
        <Hopper />
        {SEATS.map((seat) => (
          <Beast key={seat} seat={seat} />
        ))}
        {pellets.map((pellet) => (
          <PelletChip key={pellet.id} pellet={pellet} />
        ))}
        <Fx />
        <ContactShadows position={[0, -0.52, 0]} opacity={0.32} scale={16} blur={2.1} far={6} />
      </Canvas>
    </div>
  )
}
