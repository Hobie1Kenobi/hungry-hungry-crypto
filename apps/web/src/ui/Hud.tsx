import { useEffect, useRef, useState } from 'react'
import { BEASTS, SEATS, SCORE_GOLDEN, SCORE_NORMAL } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { useViewStore } from '../store/viewStore'
import { bindChompPointer, releaseChompPointer } from './useChompInput'

interface Pop {
  id: number
  seat: (typeof SEATS)[number]
  text: string
  color: string
}

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
      <div className="timer-sub">ROUND</div>
    </div>
  )
}

function LiveScores() {
  const localSeat = useGameStore((s) => s.localSeat)
  const occupants = useGameStore((s) => s.occupants)
  const [scores, setScores] = useState(() => useGameStore.getState().scores)
  const [pops, setPops] = useState<Pop[]>([])
  const prev = useRef(scores)
  const popId = useRef(0)

  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last >= 50) {
        last = now
        const next = useGameStore.getState().scores
        setScores((curr) => {
          if (curr[0] === next[0] && curr[1] === next[1] && curr[2] === next[2] && curr[3] === next[3]) {
            return curr
          }
          const born: Pop[] = []
          for (const seat of SEATS) {
            const delta = next[seat] - prev.current[seat]
            if (delta > 0) {
              popId.current += 1
              born.push({
                id: popId.current,
                seat,
                text: `+${delta === SCORE_GOLDEN ? SCORE_GOLDEN : delta === SCORE_NORMAL ? SCORE_NORMAL : delta}`,
                color: BEASTS[seat].color,
              })
            }
          }
          prev.current = { ...next }
          if (born.length) {
            setPops((p) => [...p.slice(-10), ...born])
            window.setTimeout(() => {
              setPops((p) => p.filter((x) => !born.some((b) => b.id === x.id)))
            }, 700)
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
            {pops
              .filter((p) => p.seat === seat)
              .map((p) => (
                <span key={p.id} className="score-pop" style={{ color: p.color }}>
                  {p.text}
                </span>
              ))}
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
  const pellets = useGameStore((s) => s.pellets)
  const refillCount = useGameStore((s) => s.refillCount)
  const chompHeld = useGameStore((s) => s.chompHeld)
  const debugTopDown = useViewStore((s) => s.debugTopDown)
  const toggleDebug = useViewStore((s) => s.toggleDebugTopDown)
  const you = BEASTS[localSeat]
  const live = pellets.filter((p) => p.eatenBy === undefined).length

  return (
    <div className="overlay">
      <div
        className="chomp-catcher"
        role="presentation"
        onPointerDown={bindChompPointer}
        onPointerUp={releaseChompPointer}
        onPointerCancel={releaseChompPointer}
      />
      <div className="hud">
        <div className="hud-top">
          <LiveScores />
          <div className="hud-top-right">
            {playMode === 'practice' ? <div className="ledger-banner">LOCAL · NO LEDGER WRITES</div> : null}
            <LiveTimer />
            <button type="button" className={`cam-toggle${debugTopDown ? ' on' : ''}`} onClick={toggleDebug}>
              {debugTopDown ? 'CAM DEBUG' : 'CAM TOY'}
              <span>T</span>
            </button>
          </div>
        </div>
        <div className="hud-bottom">
          <div className="hint">
            <strong>CHOMP</strong> — Space, click, tap, or the CHOMP control. Neck extends. Jaws eat on overlap.
            <div className="hint-sub">
              {dumpT < 0.9
                ? 'Hopper dumping chips — hold CHOMP, neck reaches in.'
                : playMode === 'online'
                  ? `Server-authoritative. You are ${you.name} (seat ${localSeat}). Client predictions are cosmetic.`
                  : `Board live · ${live} chips${refillCount ? ` · hopper x${refillCount}` : ''}. You are ${you.name}. Hold CHOMP to reach. RIPSAW Easy · GOLDGRUB Normal · BLOCKMAW Hungry.`}
            </div>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className={`chomp-btn${chompHeld ? ' held' : ''}`}
            aria-label="CHOMP"
            aria-pressed={chompHeld}
            onPointerDown={bindChompPointer}
            onPointerUp={releaseChompPointer}
            onPointerCancel={releaseChompPointer}
          >
            CHOMP
          </button>
        </div>
      </div>
    </div>
  )
}
