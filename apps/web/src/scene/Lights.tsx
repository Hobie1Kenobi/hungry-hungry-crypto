import { useMemo } from 'react'
import { Color } from 'three'

export function Lights() {
  const cyan = useMemo(() => new Color('#00e5ff'), [])
  const magenta = useMemo(() => new Color('#ff2bd6'), [])
  const chartreuse = useMemo(() => new Color('#b8ff2c'), [])
  const gold = useMemo(() => new Color('#d4af37'), [])

  return (
    <>
      <ambientLight intensity={0.32} color="#3a3040" />
      <hemisphereLight args={['#c8dcff', '#3a2218', 0.55]} />
      <directionalLight
        castShadow
        position={[-3.2, 14, 8.5]}
        intensity={1.85}
        color="#ffe0b8"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[8, 6, -4]} intensity={0.55} color="#8ec8ff" />
      <spotLight position={[0, 11, 0]} intensity={1.1} angle={0.7} penumbra={0.55} color="#fff4e6" />
      <pointLight position={[0, 2.1, -6.4]} intensity={3.2} distance={9} color={cyan} />
      <pointLight position={[6.4, 2.1, 0]} intensity={3.2} distance={9} color={magenta} />
      <pointLight position={[0, 2.1, 6.4]} intensity={3.4} distance={9} color={chartreuse} />
      <pointLight position={[-6.4, 2.1, 0]} intensity={3.2} distance={9} color={gold} />
    </>
  )
}
