import { PRACTICE_AI_MAP } from '@hhc/ai'
import { BEASTS, SEATS } from '@hhc/shared'
import { useState } from 'react'
import { createPrivateRoom, joinPrivateRoom, joinQuickMatch } from '../net/session'
import { useGameStore } from '../store/gameStore'

function seatControl(seat: (typeof SEATS)[number]): string {
  if (seat === 0) return 'You (practice) / first human online'
  return PRACTICE_AI_MAP[seat]
}

export function Lobby() {
  const startPractice = useGameStore((s) => s.startPractice)
  const [privateOpen, setPrivateOpen] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  return (
    <div className="lobby">
      <div className="lobby-card">
        <p className="kicker">HHC · Phase 2 · Testnet first</p>
        <h1>Hungry Hungry Crypto</h1>
        <p className="tag">
          Original 3D arcade. Four crypto mascots chomp liquidity chips on a square pond. Physics stays
          off-chain. The Colyseus room is authoritative for Quick Match and Private Room. This build
          submits nothing to XRPL.
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
              Local
            </span>
          </button>
          <button className="btn" type="button" onClick={() => void joinQuickMatch()}>
            Quick Match
            <span className="phase-tag">Local Colyseus</span>
          </button>
          <button className="btn" type="button" onClick={() => setPrivateOpen((v) => !v)}>
            Private Room
            <span className="phase-tag">Code</span>
          </button>
        </div>
        {privateOpen ? (
          <div className="private-panel">
            <button className="btn primary" type="button" onClick={() => void createPrivateRoom()}>
              Create room
            </button>
            <form
              className="join-row"
              onSubmit={(e) => {
                e.preventDefault()
                if (joinCode.trim()) void joinPrivateRoom(joinCode)
              }}
            >
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="CODE"
                maxLength={8}
                aria-label="Private room code"
                autoCapitalize="characters"
                autoComplete="off"
              />
              <button className="btn" type="submit">
                Join
              </button>
            </form>
          </div>
        ) : null}
        <div className="wallet-stub">
          <span>Wallet / XRPL identity</span>
          <span className="phase-tag">Phase 3</span>
        </div>
        <p className="disclaimer">CRUMB on Testnet has no value. Phase 2 has zero ledger writes.</p>
      </div>
    </div>
  )
}
