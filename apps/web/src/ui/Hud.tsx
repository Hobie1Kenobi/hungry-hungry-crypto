import { useEffect, useRef, useState } from 'react'
import { BEASTS, ROUND_SECONDS, SEATS, SCORE_GOLDEN, SCORE_NORMAL } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'
import { showPracticeDebugChrome, useViewStore } from '../store/viewStore'
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

function HoldDebug() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const s = useGameStore.getState()
      if (ref.current) {
        const hold = s.chompHeld ? 'on' : 'off'
        ref.current.textContent = `HOLD ${hold}  EXT ${s.neckExtend[0].toFixed(2)}`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="hold-debug" ref={ref}>
      HOLD off  EXT 0.00
    </div>
  )
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
              <span>{b.name}</span>
              <em>{seatLabel(seat, localSeat, occupants)}</em>
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

function HintCard() {
  const dumpT = useGameStore((s) => s.dumpT)
  const localSeat = useGameStore((s) => s.localSeat)
  const playMode = useGameStore((s) => s.playMode)
  const pellets = useGameStore((s) => s.pellets)
  const refillCount = useGameStore((s) => s.refillCount)
  const chompHeld = useGameStore((s) => s.chompHeld)
  const timeLeft = useGameStore((s) => s.timeLeft)
  const [latchedOnce, setLatchedOnce] = useState(false)
  const you = BEASTS[localSeat]
  const live = pellets.filter((p) => p.eatenBy === undefined).length

  useEffect(() => {
    if (chompHeld) setLatchedOnce(true)
  }, [chompHeld])

  const hide = latchedOnce || timeLeft <= ROUND_SECONDS - 2
  if (hide) return null

  return (
    <div className="hint">
      <strong>CHOMP LATCHED</strong> - tap CHOMP or the pond once. Neck stays out until the next tap. Space is
      hold-while-down.
      <div className="hint-sub">
        {dumpT < 0.9
          ? 'Hopper dumping chips — tap once, neck stays in the lanes.'
          : playMode === 'online'
            ? `Server-authoritative. You are ${you.name} (seat ${localSeat}). Client predictions are cosmetic.`
            : `Board live · ${live} chips${refillCount ? ` · hopper x${refillCount}` : ''}. You are ${you.name}. Tap CHOMP to latch.`}
      </div>
    </div>
  )
}

export function Hud() {
  const chompHeld = useGameStore((s) => s.chompHeld)
  const playMode = useGameStore((s) => s.playMode)
  const debugTopDown = useViewStore((s) => s.debugTopDown)
  const debugQuery = useViewStore((s) => s.debugQuery)
  const toggleDebug = useViewStore((s) => s.toggleDebugTopDown)
  const debugChrome = showPracticeDebugChrome({ debugTopDown, debugQuery })

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
            {debugChrome && playMode === 'practice' ? <HoldDebug /> : null}
            <LiveTimer />
            {debugChrome ? (
              <button type="button" className={`cam-toggle${debugTopDown ? ' on' : ''}`} onClick={toggleDebug}>
                {debugTopDown ? 'CAM DEBUG' : 'CAM TOY'}
                <span>T</span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="hud-bottom">
          <HintCard />
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
            <span className="chomp-latch">{chompHeld ? 'LATCHED' : 'TAP ONCE'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
