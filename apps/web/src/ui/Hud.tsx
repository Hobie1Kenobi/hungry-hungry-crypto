import { PRACTICE_AI_MAP } from '@hhc/ai'
import { BEASTS, HUMAN_SEAT, SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { pointerChomp } from './useChompInput'

export function Hud() {
  const scores = useGameStore((s) => s.scores)
  const timeLeft = useGameStore((s) => s.timeLeft)
  const dumpT = useGameStore((s) => s.dumpT)

  return (
    <div className="overlay">
      <button
        type="button"
        className="chomp-catcher"
        aria-label="CHOMP"
        onPointerDown={(e) => {
          e.preventDefault()
          pointerChomp(true)
        }}
        onPointerUp={() => pointerChomp(false)}
        onPointerLeave={() => pointerChomp(false)}
        onPointerCancel={() => pointerChomp(false)}
      />
      <div className="hud">
        <div className="hud-top">
          <div className="scoreboard">
            {SEATS.map((seat) => {
              const b = BEASTS[seat]
              return (
                <div key={seat} className={`score-card${seat === HUMAN_SEAT ? ' you' : ''}`}>
                  <div className="name" style={{ color: b.color }}>
                    {b.name}
                    {seat === 0 ? ' · YOU' : ` · ${PRACTICE_AI_MAP[seat].toUpperCase()}`}
                  </div>
                  <div className="pts">{scores[seat]}</div>
                </div>
              )
            })}
          </div>
          <div className="timer">
            {Math.ceil(timeLeft)}s
            <div style={{ fontSize: 10, color: '#8aa0b8', marginTop: 4 }}>ROUND</div>
          </div>
        </div>
        <div className="hud-bottom">
          <div className="hint">
            <strong>CHOMP</strong> — Space, click, or tap. Neck extends. Jaws eat on overlap.
            <div style={{ marginTop: 6, color: '#8aa0b8' }}>
              {dumpT < 0.9
                ? 'Hopper dumping chips…'
                : 'Board live. You are BYTEBITE (north). RIPSAW Easy · GOLDGRUB Normal · BLOCKMAW Hungry.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
