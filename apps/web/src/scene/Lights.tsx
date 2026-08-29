import { useMemo } from 'react'
import { Color } from 'three'

export function Lights() {
  const cyan = useMemo(() => new Color('#00e5ff'), [])
  const magenta = useMemo(() => new Color('#ff2bd6'), [])
  const chartreuse = useMemo(() => new Color('#b8ff2c'), [])
  const gold = useMemo(() => new Color('#d4af37'), [])

  return (
    <>
      <ambientLight intensity={0.62} color="#f0e4d4" />
      <hemisphereLight args={['#fff4e6', '#8a6a52', 0.7]} />
      <directionalLight
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
      <directionalLight position={[8, 6, -4]} intensity={0.7} color="#9ad0ff" />
      <spotLight position={[0, 11, 2]} intensity={1.35} angle={0.72} penumbra={0.55} color="#fff7ea" />
      <pointLight position={[0, 2.1, -6.4]} intensity={3.4} distance={9} color={cyan} />
      <pointLight position={[6.4, 2.1, 0]} intensity={3.4} distance={9} color={magenta} />
      <pointLight position={[0, 2.1, 6.4]} intensity={3.6} distance={9} color={chartreuse} />
      <pointLight position={[-6.4, 2.1, 0]} intensity={3.4} distance={9} color={gold} />
    </>
  )
}
