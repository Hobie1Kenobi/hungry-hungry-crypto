import { useEffect, useRef, useState } from 'react'
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

function LiveTimer() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last >= 50) {
        last = now
        const t = useGameStore.getState().timeLeft
        if (ref.current) ref.current.textContent = `${Math.max(0, t).toFixed(1)}s`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="timer">
      <span ref={ref}>45.0s</span>
      <div style={{ fontSize: 10, color: '#8aa0b8', marginTop: 4 }}>ROUND</div>
    </div>
  )
}

function LiveScores() {
  const localSeat = useGameStore((s) => s.localSeat)
  const occupants = useGameStore((s) => s.occupants)
  const [scores, setScores] = useState(() => useGameStore.getState().scores)

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last >= 50) {
        last = now
        const next = useGameStore.getState().scores
        setScores((prev) => {
          if (
            prev[0] === next[0] &&
            prev[1] === next[1] &&
            prev[2] === next[2] &&
            prev[3] === next[3]
          ) {
            return prev
          }
          return { ...next }
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
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
  )
}

export function Hud() {
  const dumpT = useGameStore((s) => s.dumpT)
  const localSeat = useGameStore((s) => s.localSeat)
  const playMode = useGameStore((s) => s.playMode)
  const you = BEASTS[localSeat]

  return (
    <div className="overlay">
      <div
        className="chomp-catcher"
        role="presentation"
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
          <LiveScores />
          <LiveTimer />
        </div>
        <div className="hud-bottom">
          <div className="hint">
            <strong>CHOMP</strong> — Space, click, tap, or the CHOMP control. Neck extends. Jaws eat on overlap.
            <div style={{ marginTop: 6, color: '#8aa0b8' }}>
              {dumpT < 0.9
                ? 'Hopper dumping chips…'
                : playMode === 'online'
                  ? `Server-authoritative. You are ${you.name} (seat ${localSeat}). Client predictions are cosmetic.`
                  : `Board live. You are ${you.name}. RIPSAW Easy · GOLDGRUB Normal · BLOCKMAW Hungry.`}
            </div>
          </div>
          <button
            type="button"
            className="chomp-btn"
            aria-label="CHOMP"
            onPointerDown={(e) => {
              e.preventDefault()
              e.currentTarget.blur()
              pointerChomp(true)
            }}
            onPointerUp={() => pointerChomp(false)}
            onPointerLeave={() => pointerChomp(false)}
            onPointerCancel={() => pointerChomp(false)}
          >
            CHOMP
          </button>
        </div>
      </div>
    </div>
  )
}
