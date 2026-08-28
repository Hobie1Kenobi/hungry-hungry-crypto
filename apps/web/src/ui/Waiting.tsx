import { BEASTS, SEATS } from '@hhc/shared'
import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

export function Waiting() {
  const waitHint = useGameStore((s) => s.waitHint)
  const waitError = useGameStore((s) => s.waitError)
  const roomCode = useGameStore((s) => s.roomCode)
  const occupants = useGameStore((s) => s.occupants)
  const startAt = useGameStore((s) => s.startAt)
  const localSeat = useGameStore((s) => s.localSeat)
  const seatAddresses = useGameStore((s) => s.seatAddresses)
  const backToLobby = useGameStore((s) => s.backToLobby)
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 250)
    return () => window.clearInterval(id)
  }, [])
  const remaining = startAt > 0 ? Math.max(0, Math.ceil((startAt - Date.now()) / 1000)) : 0

  return (
    <div className="lobby">
      <div className="lobby-card">
        <p className="kicker">HHC · Phase 4 · HungryRoom</p>
        <h1>Table filling</h1>
        <p className="tag">{waitError || waitHint}</p>
        {roomCode ? (
          <p className="room-code">
            Room code <strong>{roomCode}</strong>
          </p>
        ) : null}
        <div className="beast-row">
          {SEATS.map((seat) => {
            const b = BEASTS[seat]
            const occ = occupants.find((o) => o.seat === seat)
            const you = seat === localSeat && occ?.kind === 'human'
            const addr = seatAddresses[seat]
            const label = !occ
              ? '…'
              : occ.kind === 'human'
                ? you
                  ? 'You'
                  : 'Human'
                : `AI ${occ.personality ?? ''}`.trim()
            return (
              <div key={seat} className="beast-chip" style={{ borderColor: b.color }}>
                <strong style={{ color: b.color }}>{b.name}</strong>
                <span>
                  Seat {seat} · {label}
                  {addr ? ` · ${addr.slice(0, 6)}…` : ''}
                </span>
              </div>
            )
          })}
        </div>
        {!waitError && remaining > 0 ? <p className="tag">AI fill in {remaining}s</p> : null}
        <div className="actions">
          <button className="btn" type="button" onClick={backToLobby}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
