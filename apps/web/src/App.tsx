import { ArenaCanvas } from './scene/ArenaCanvas'
import { Hud } from './ui/Hud'
import { Lobby } from './ui/Lobby'
import { Results } from './ui/Results'
import { RoundClock } from './ui/RoundClock'
import { Waiting } from './ui/Waiting'
import { useEffect } from 'react'
import { useChompInput } from './ui/useChompInput'
import { useGameStore } from './store/gameStore'
import { useViewStore } from './store/viewStore'

export function App() {
  const ui = useGameStore((s) => s.ui)
  useChompInput()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || (e.key !== 't' && e.key !== 'T')) return
      const el = e.target
      if (el instanceof HTMLElement && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (ui !== 'playing' && ui !== 'results') return
      useViewStore.getState().toggleDebugTopDown()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ui])

  return (
    <div className="app">
      <ArenaCanvas />
      {ui === 'playing' || ui === 'results' ? <RoundClock /> : null}
      {ui === 'lobby' ? <Lobby /> : null}
      {ui === 'waiting' ? <Waiting /> : null}
      {ui === 'playing' ? <Hud /> : null}
      {ui === 'results' ? <Results /> : null}
    </div>
  )
}
