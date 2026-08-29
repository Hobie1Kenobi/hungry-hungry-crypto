import { CubeTexture, SRGBColorSpace } from 'three'

export function makeSoftEnv(): CubeTexture {
  const size = 64
  const faces: Array<[string, string]> = [
    ['#e8c49a', '#2a1c22'],
    ['#c8d8f0', '#1c2434'],
    ['#f4e6d0', '#c8b090'],
    ['#1a1218', '#0c0a10'],
    ['#f0c8a0', '#2c2018'],
    ['#8aa0c8', '#1a1824'],
  ]
  const images = faces.map(([top, bottom]) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, size)
      g.addColorStop(0, top)
      g.addColorStop(1, bottom)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
    return canvas
  })
  const texture = new CubeTexture(images)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
