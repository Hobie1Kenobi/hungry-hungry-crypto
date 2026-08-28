import { useEffect, useRef } from 'react'
import type { AiPolicy } from '@hhc/ai'
import { createPracticePolicies } from '@hhc/ai'
import { useGameStore } from '../store/gameStore'
import { arenaView } from '../game/aiFill'

export function RoundClock() {
  const tick = useGameStore((s) => s.tick)
  const setChomp = useGameStore((s) => s.setChomp)
  const ui = useGameStore((s) => s.ui)
  const matchId = useGameStore((s) => s.matchId)
  const playMode = useGameStore((s) => s.playMode)
  const tickRef = useRef(tick)
  const setChompRef = useRef(setChomp)
  const policiesRef = useRef<AiPolicy[]>([])
  tickRef.current = tick
  setChompRef.current = setChomp

  useEffect(() => {
    if (ui !== 'playing' || playMode !== 'practice') {
      policiesRef.current = []
      return
    }
    policiesRef.current = createPracticePolicies()
  }, [ui, matchId, playMode])

  useEffect(() => {
    if (ui !== 'playing') return
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const world = arenaView(now)
      for (const policy of policiesRef.current) {
        const input = policy.tick(world)
        if (input) setChompRef.current(input)
      }
      tickRef.current(dt, now)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ui])

  return null
}
