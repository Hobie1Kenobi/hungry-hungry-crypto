import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Preload } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { practiceGoReady, PRACTICE_GO_MIN_CALLS, PRACTICE_GO_MIN_TRIANGLES, SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { makeSoftEnv } from './arenaEnv'
import { ArenaCamera, TOY_FOV, toyCameraPosition } from './ArenaCamera'
import { Beast } from './Beast'
import { ArenaBloom, composerPresented } from './bloom'
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

function GoOnFirstFrame() {
  const gl = useThree((s) => s.gl)
  const size = useThree((s) => s.size)
  const playingPresents = useRef(0)
  const dropLobbyStats = useRef(true)

  useFrame(() => {
    const s = useGameStore.getState()
    if (s.ui !== 'playing') {
      playingPresents.current = 0
      dropLobbyStats.current = true
      return
    }
    if (s.matchClockOrigin > 0) return
    if (dropLobbyStats.current) {
      dropLobbyStats.current = false
      return
    }
    if (!composerPresented()) return
    const drawingW = gl.domElement.width
    const drawingH = gl.domElement.height
    const calls = gl.info.render.calls
    const triangles = gl.info.render.triangles
    const sizeOk = size.width >= 8 && size.height >= 8
    const bufferOk = drawingW >= 8 && drawingH >= 8
    if (sizeOk && bufferOk && calls >= PRACTICE_GO_MIN_CALLS && triangles >= PRACTICE_GO_MIN_TRIANGLES) {
      playingPresents.current += 1
    }
    if (
      practiceGoReady({
        ui: s.ui,
        matchClockOrigin: s.matchClockOrigin,
        playingPresents: playingPresents.current,
        sizeW: size.width,
        sizeH: size.height,
        drawingBufferW: drawingW,
        drawingBufferH: drawingH,
        renderCalls: calls,
        triangles,
      })
    ) {
      s.markMatchGo()
    }
  })
  return null
}

export function ArenaCanvas() {
  const pellets = useGameStore((s) => s.pellets)

  return (
    <div className="canvas-wrap">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: toyCameraPosition(), fov: TOY_FOV, near: 0.45, far: 90 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(BG, 1)
        }}
      >
        <ArenaBloom>
          <GoOnFirstFrame />
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
          <Preload all />
        </ArenaBloom>
      </Canvas>
    </div>
  )
}
