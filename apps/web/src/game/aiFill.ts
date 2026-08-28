import type { ArenaView } from '@hhc/ai'
import { useGameStore } from '../store/gameStore'

export function arenaView(now: number): ArenaView {
  const s = useGameStore.getState()
  return {
    now,
    dumpT: s.dumpT,
    timeLeft: s.timeLeft,
    pellets: s.pellets,
    neckExtend: s.neckExtend,
    chompDown: s.chompDown,
    scores: s.scores,
  }
}
