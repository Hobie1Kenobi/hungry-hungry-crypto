import { BEASTS, SEATS } from '@hhc/shared'
import { replayOnline } from '../net/session'
import { useGameStore } from '../store/gameStore'

export function Results() {
  const result = useGameStore((s) => s.result)
  const playMode = useGameStore((s) => s.playMode)
  const startPractice = useGameStore((s) => s.startPractice)
  const backToLobby = useGameStore((s) => s.backToLobby)

  if (!result) return null
  const champ = BEASTS[result.winner]
  const ranked = [...SEATS].sort((a, b) => result.scores[b] - result.scores[a])
  const hashes = result.txHashes.length === 0 ? '[]' : JSON.stringify(result.txHashes)

  return (
    <div className="overlay">
      <div className="results">
        <div className="results-card">
          <p className="kicker">{playMode === 'online' ? 'HungryRoom result · identity only' : 'Local result · identity only'}</p>
          <h2 style={{ color: champ.color }}>{champ.name} wins</h2>
          <p className="tag" style={{ marginTop: 0 }}>
            Match {result.matchId}
          </p>
          <ol>
            {ranked.map((seat) => (
              <li key={seat}>
                <span style={{ color: BEASTS[seat].color }}>
                  {BEASTS[seat].name}
                  {seat === result.winner ? ' ★' : ''}
                </span>
                <strong>{result.scores[seat]}</strong>
              </li>
            ))}
          </ol>
          <p className="receipts">
            Seat identity:{' '}
            {SEATS.map((seat) => result.addresses[seat])
              .filter(Boolean)
              .join(' · ') || 'none bound'}
            . Settlement receipts stay empty this phase. txHashes: {hashes}. CRUMB on Testnet has no value.
          </p>
          <div className="actions" style={{ marginTop: 18 }}>
            <button
              className="btn primary"
              type="button"
              onClick={() => {
                if (playMode === 'online') replayOnline()
                else startPractice()
              }}
            >
              Play again
            </button>
            <button className="btn" type="button" onClick={backToLobby}>
              Back to lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
