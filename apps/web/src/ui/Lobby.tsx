import { PRACTICE_AI_MAP } from '@hhc/ai'
import { BEASTS, SEATS } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

function seatControl(seat: (typeof SEATS)[number]): string {
  if (seat === 0) return 'You'
  return PRACTICE_AI_MAP[seat]
}

export function Lobby() {
  const startPractice = useGameStore((s) => s.startPractice)

  return (
    <div className="lobby">
      <div className="lobby-card">
        <p className="kicker">HHC · Phase 1 · Testnet first</p>
        <h1>Hungry Hungry Crypto</h1>
        <p className="tag">
          Original 3D arcade. Four crypto mascots chomp liquidity chips on a square pond. Physics stays
          off-chain. XRPL is identity and settlement later — this build submits nothing.
        </p>
        <div className="beast-row">
          {SEATS.map((seat) => {
            const b = BEASTS[seat]
            return (
              <div key={seat} className="beast-chip" style={{ borderColor: b.color }}>
                <strong style={{ color: b.color }}>{b.name}</strong>
                <span>
                  Seat {seat} · {b.side} · {seatControl(seat)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={startPractice}>
            Practice vs AI
            <span className="phase-tag" style={{ color: '#041016' }}>
              Live fill
            </span>
          </button>
          <button className="btn" type="button" disabled>
            Quick Match
            <span className="phase-tag">Phase 2</span>
          </button>
          <button className="btn" type="button" disabled>
            Private Room
            <span className="phase-tag">Phase 2</span>
          </button>
        </div>
        <div className="wallet-stub">
          <span>Wallet / XRPL identity</span>
          <span className="phase-tag">Phase 3</span>
        </div>
        <p className="disclaimer">CRUMB on Testnet has no value. Phase 1 has zero ledger writes.</p>
      </div>
    </div>
  )
}
