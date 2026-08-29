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

  if (ui === 'lobby') {
    return (
      <div className="app">
        <Lobby />
      </div>
    )
  }

  if (ui === 'waiting') {
    return (
      <div className="app">
        <Waiting />
      </div>
    )
  }

  return (
    <div className="app">
      <RoundClock />
      <ArenaCanvas />
      {ui === 'playing' ? <Hud /> : <Results />}
    </div>
  )
}
