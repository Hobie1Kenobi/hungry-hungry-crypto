import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function RoundClock() {
  const tick = useGameStore((s) => s.tick)
  const setChomp = useGameStore((s) => s.setChomp)
  const ui = useGameStore((s) => s.ui)
  const tickRef = useRef(tick)
  const setChompRef = useRef(setChomp)
  tickRef.current = tick
  setChompRef.current = setChomp

  useEffect(() => {
    if (ui !== 'playing') return
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const raw = Math.max(0, (now - last) / 1000)
      last = now
      const s = useGameStore.getState()
      const dt = s.playMode === 'practice' ? raw : Math.min(0.05, raw)
      if (s.playMode === 'practice') {
        setChompRef.current({ seat: s.localSeat, down: s.chompHeld, clientTime: now })
      }
      tickRef.current(dt, now)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ui])

  return null
}
