import { useMemo } from 'react'
import { Color } from 'three'

export function Lights() {
  const cyan = useMemo(() => new Color('#00e5ff'), [])
  const magenta = useMemo(() => new Color('#ff2bd6'), [])
  const chartreuse = useMemo(() => new Color('#b8ff2c'), [])
  const gold = useMemo(() => new Color('#d4af37'), [])

  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight
        castShadow
        position={[6, 14, 8]}
        intensity={1.15}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 6, 0]} intensity={1.4} distance={18} color="#7fd7ff" />
      <pointLight position={[0, 1.4, -6.2]} intensity={1.6} distance={10} color={cyan} />
      <pointLight position={[6.2, 1.4, 0]} intensity={1.6} distance={10} color={magenta} />
      <pointLight position={[0, 1.4, 6.2]} intensity={1.6} distance={10} color={chartreuse} />
      <pointLight position={[-6.2, 1.4, 0]} intensity={1.6} distance={10} color={gold} />
    </>
  )
}
