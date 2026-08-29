import { useMemo } from 'react'
import { Color } from 'three'
import { registerBloomLight } from './bloom'

export function Lights() {
  const cyan = useMemo(() => new Color('#00e5ff'), [])
  const magenta = useMemo(() => new Color('#ff2bd6'), [])
  const chartreuse = useMemo(() => new Color('#b8ff2c'), [])
  const gold = useMemo(() => new Color('#d4af37'), [])

  return (
    <>
      <ambientLight ref={registerBloomLight} intensity={0.78} color="#f6ead8" />
      <hemisphereLight ref={registerBloomLight} args={['#fff7ea', '#b08968', 0.85]} />
      <directionalLight
        ref={registerBloomLight}
        castShadow
        position={[-3.2, 14, 8.5]}
        intensity={2.15}
        color="#ffe8c8"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight ref={registerBloomLight} position={[8, 6, -4]} intensity={0.7} color="#9ad0ff" />
      <spotLight ref={registerBloomLight} position={[0, 11, 2]} intensity={1.35} angle={0.72} penumbra={0.55} color="#fff7ea" />
      <pointLight ref={registerBloomLight} position={[0, 2.1, -6.4]} intensity={3.4} distance={9} color={cyan} />
      <pointLight ref={registerBloomLight} position={[6.4, 2.1, 0]} intensity={3.4} distance={9} color={magenta} />
      <pointLight ref={registerBloomLight} position={[0, 2.1, 6.4]} intensity={3.6} distance={9} color={chartreuse} />
      <pointLight ref={registerBloomLight} position={[-6.4, 2.1, 0]} intensity={3.4} distance={9} color={gold} />
    </>
  )
}
