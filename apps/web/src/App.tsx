import { ArenaCanvas } from './scene/ArenaCanvas'
import { Hud } from './ui/Hud'
import { Lobby } from './ui/Lobby'
import { Results } from './ui/Results'
import { RoundClock } from './ui/RoundClock'
import { useChompInput } from './ui/useChompInput'
import { useGameStore } from './store/gameStore'

export function App() {
  const ui = useGameStore((s) => s.ui)
  useChompInput()

  if (ui === 'lobby') {
    return (
      <div className="app">
        <Lobby />
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
