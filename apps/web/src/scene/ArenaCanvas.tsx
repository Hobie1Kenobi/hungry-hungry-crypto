import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import { SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { Beast } from './Beast'
import { Hopper } from './Hopper'
import { Lights } from './Lights'
import { PelletChip } from './PelletChip'
import { Pond } from './Pond'
import { Table } from './Table'

function LookAtPond() {
  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => {
    camera.lookAt(0, 0.18, 0.55)
  }, [camera])
  return null
}

export function ArenaCanvas() {
  const pellets = useGameStore((s) => s.pellets)

  return (
    <div className="canvas-wrap">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 13.4, -11.8], fov: 40, near: 0.1, far: 90 }}
        gl={{ antialias: true }}
      >
        <LookAtPond />
        <color attach="background" args={['#07090f']} />
        <fog attach="fog" args={['#07090f', 28, 52]} />
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
        <ContactShadows position={[0, 0.03, 0]} opacity={0.45} scale={18} blur={2.4} far={8} />
      </Canvas>
    </div>
  )
}
