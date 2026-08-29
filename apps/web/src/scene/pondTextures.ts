import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

export function makeHexTexture(): CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#03141a'
    ctx.fillRect(0, 0, size, size)
    const r = 18
    const h = r * Math.sqrt(3)
    ctx.strokeStyle = 'rgba(0, 180, 190, 0.22)'
    ctx.lineWidth = 1.2
    for (let row = -1; row < size / h + 2; row += 1) {
      for (let col = -1; col < size / (r * 1.5) + 2; col += 1) {
        const cx = col * r * 1.5
        const cy = row * h + (col % 2 === 0 ? 0 : h * 0.5)
        ctx.beginPath()
        for (let i = 0; i < 6; i += 1) {
          const a = (Math.PI / 3) * i
          const x = cx + Math.cos(a) * r
          const y = cy + Math.sin(a) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
    }
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.repeat.set(3.2, 3.2)
  tex.needsUpdate = true
  return tex
}

export function makeCausticTexture(): CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 37) % size
      const y = (i * 53) % size
      const g = ctx.createRadialGradient(x, y, 2, x, y, 18)
      g.addColorStop(0, 'rgba(80, 220, 230, 0.55)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.repeat.set(2.4, 2.4)
  tex.needsUpdate = true
  return tex
}
