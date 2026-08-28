import { BEASTS, SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

export function Results() {
  const result = useGameStore((s) => s.result)
  const startPractice = useGameStore((s) => s.startPractice)
  const backToLobby = useGameStore((s) => s.backToLobby)

  if (!result) return null
  const champ = BEASTS[result.winner]
  const ranked = [...SEATS].sort((a, b) => result.scores[b] - result.scores[a])

  return (
    <div className="overlay">
      <div className="results">
        <div className="results-card">
          <p className="kicker">Local result · no ledger</p>
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
            On-chain receipts: none. txHashes: [] — Phase 0 submits zero XRPL transactions. CRUMB on
            Testnet has no value.
          </p>
          <div className="actions" style={{ marginTop: 18 }}>
            <button className="btn primary" type="button" onClick={startPractice}>
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
