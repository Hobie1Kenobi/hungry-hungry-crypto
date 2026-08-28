import { BEASTS, SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { pointerChomp } from './useChompInput'

function seatLabel(seat: (typeof SEATS)[number], localSeat: number, occupants: { seat: number; kind: string; personality?: string }[]): string {
  const occ = occupants.find((o) => o.seat === seat)
  if (seat === localSeat) return 'YOU'
  if (!occ) return seat === 0 ? 'YOU' : ''
  if (occ.kind === 'human') return 'HUMAN'
  return (occ.personality ?? 'AI').toUpperCase()
}

export function Hud() {
  const scores = useGameStore((s) => s.scores)
  const timeLeft = useGameStore((s) => s.timeLeft)
  const dumpT = useGameStore((s) => s.dumpT)
  const localSeat = useGameStore((s) => s.localSeat)
  const occupants = useGameStore((s) => s.occupants)
  const playMode = useGameStore((s) => s.playMode)
  const you = BEASTS[localSeat]

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
                <div key={seat} className={`score-card${seat === localSeat ? ' you' : ''}`}>
                  <div className="name" style={{ color: b.color }}>
                    {b.name}
                    {` · ${seatLabel(seat, localSeat, occupants)}`}
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
                : playMode === 'online'
                  ? `Server-authoritative. You are ${you.name} (seat ${localSeat}). Client predictions are cosmetic.`
                  : `Board live. You are ${you.name}. RIPSAW Easy · GOLDGRUB Normal · BLOCKMAW Hungry.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
