import { CanvasTexture, SRGBColorSpace } from 'three'

function drawChevronMark(ctx: CanvasRenderingContext2D, size: number, fill: string, stroke: string): void {
  ctx.clearRect(0, 0, size, size)
  const cx = size * 0.5
  const cy = size * 0.5
  const rad = size * 0.46
  ctx.beginPath()
  ctx.arc(cx, cy, rad, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()

  const arm = size * 0.26
  const rise = size * 0.2
  const gap = size * 0.05
  ctx.lineWidth = size * 0.1
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
  ctx.miterLimit = 2.4
  ctx.strokeStyle = stroke

  ctx.beginPath()
  ctx.moveTo(cx - gap, cy - rise)
  ctx.lineTo(cx - gap - arm, cy)
  ctx.lineTo(cx - gap, cy + rise)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(cx + gap, cy - rise)
  ctx.lineTo(cx + gap + arm, cy)
  ctx.lineTo(cx + gap, cy + rise)
  ctx.stroke()
}

export function makeXrpMarkTexture(fill: string, stroke: string): CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) drawChevronMark(ctx, size, fill, stroke)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
