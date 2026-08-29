import { CubeTexture, SRGBColorSpace } from 'three'

export function makeSoftEnv(): CubeTexture {
  const size = 64
  const faces: Array<[string, string]> = [
    ['#7eb4d0', '#243044'],
    ['#6ea4c2', '#1c2836'],
    ['#d8e8f4', '#9ab8cc'],
    ['#243044', '#141b28'],
    ['#74aac8', '#203040'],
    ['#5e92b0', '#1a2634'],
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
