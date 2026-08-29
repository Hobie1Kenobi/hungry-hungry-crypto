import { useMemo } from 'react'
import { Color } from 'three'

export function Lights() {
  const cyan = useMemo(() => new Color('#00e5ff'), [])
  const magenta = useMemo(() => new Color('#ff2bd6'), [])
  const chartreuse = useMemo(() => new Color('#b8ff2c'), [])
  const gold = useMemo(() => new Color('#d4af37'), [])

  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#c4e4ff', '#1a2430', 0.58]} />
      <directionalLight
        castShadow
        position={[4, 16, -6]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 5.2, 0]} intensity={2.2} distance={16} color="#c8eeff" />
      <pointLight position={[0, 1.4, -6.2]} intensity={1.7} distance={10} color={cyan} />
      <pointLight position={[6.2, 1.4, 0]} intensity={1.7} distance={10} color={magenta} />
      <pointLight position={[0, 1.4, 6.2]} intensity={1.85} distance={11} color={chartreuse} />
      <pointLight position={[-6.2, 1.4, 0]} intensity={1.7} distance={10} color={gold} />
    </>
  )
}
