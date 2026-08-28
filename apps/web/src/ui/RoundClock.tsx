import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function RoundClock() {
  const tick = useGameStore((s) => s.tick)
  const ui = useGameStore((s) => s.ui)
  const tickRef = useRef(tick)
  tickRef.current = tick

  useEffect(() => {
    if (ui !== 'playing') return
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      tickRef.current(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ui])

  return null
}
