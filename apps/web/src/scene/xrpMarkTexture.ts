import { CanvasTexture, SRGBColorSpace } from 'three'

function drawChevronMark(ctx: CanvasRenderingContext2D, size: number, stroke: string): void {
  ctx.clearRect(0, 0, size, size)
  const cx = size * 0.5
  const cy = size * 0.5
  const arm = size * 0.28
  const rise = size * 0.22
  const gap = size * 0.055

  ctx.lineWidth = size * 0.085
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

export function makeXrpMarkTexture(stroke: string): CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) drawChevronMark(ctx, size, stroke)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
