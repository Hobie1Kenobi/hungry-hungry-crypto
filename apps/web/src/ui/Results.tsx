import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { BEASTS, SEATS } from '@hhc/shared'
import { explorerTxUrl } from '@hhc/xrpl'
import { replayOnline } from '../net/session'
import { useGameStore } from '../store/gameStore'
import { useWalletStore } from '../wallet/walletStore'

function shortMatchId(id: string): string {
  if (id.length <= 16) return id
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

function WinnerPortrait({ seat }: { seat: (typeof SEATS)[number] }) {
  const b = BEASTS[seat]
  return (
    <div className="winner-portrait" style={{ borderColor: b.color, boxShadow: `0 0 28px ${b.color}55` }}>
      <div className="portrait-ant" style={{ background: b.color }} />
      <div className="portrait-ant right" style={{ background: b.color }} />
      <div className="portrait-body" style={{ background: b.color }}>
        <div className="portrait-visor" />
        <div className="portrait-snout" style={{ background: b.accent }} />
      </div>
      <div className="portrait-name" style={{ color: b.color }}>
        {b.name}
      </div>
    </div>
  )
}

function useResultsArmed(): boolean {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    let live = true
    const arm = () => {
      if (live) setArmed(true)
    }
    const fallback = window.setTimeout(arm, 180)
    const onUp = () => {
      window.clearTimeout(fallback)
      arm()
    }
    window.addEventListener('pointerup', onUp, true)
    window.addEventListener('pointercancel', onUp, true)
    return () => {
      live = false
      window.clearTimeout(fallback)
      window.removeEventListener('pointerup', onUp, true)
      window.removeEventListener('pointercancel', onUp, true)
    }
  }, [])

  return armed
}

export function Results() {
  const result = useGameStore((s) => s.result)
  const playMode = useGameStore((s) => s.playMode)
  const startPractice = useGameStore((s) => s.startPractice)
  const backToLobby = useGameStore((s) => s.backToLobby)
  const explorer = useWalletStore((s) => s.config?.explorerUrl)
  const armed = useResultsArmed()
  const consumed = useRef(false)

  if (!result) return null
  const champ = BEASTS[result.winner]
  const ranked = [...SEATS].sort((a, b) => result.scores[b] - result.scores[a])
  const hashes = result.txHashes
  const topScore = result.scores[result.winner]
  const tiedSeats = SEATS.filter((seat) => result.scores[seat] === topScore)
  const isTie = tiedSeats.length > 1

  const guard = (event: ReactPointerEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => {
    if (!armed) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    event.preventDefault()
    event.stopPropagation()
    return true
  }

  const goLobby = (event: ReactPointerEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => {
    if (!guard(event) || consumed.current) return
    consumed.current = true
    backToLobby()
  }

  const goReplay = (event: ReactPointerEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => {
    if (!guard(event) || consumed.current) return
    consumed.current = true
    if (playMode === 'online') replayOnline()
    else startPractice()
  }

  return (
    <div className="overlay results-overlay">
      <div className="results">
        <div className="results-card">
          <p className="kicker">
            {playMode === 'online' ? 'HungryRoom result · Testnet settlement' : 'LOCAL RESULT · NO LEDGER WRITES'}
          </p>
          <div className="results-hero">
            <WinnerPortrait seat={result.winner} />
            <div className="results-hero-copy">
              <h2 style={{ color: champ.color }}>
                {isTie ? `TIE · ${champ.name} wins it` : `${champ.name} wins`}
              </h2>
              <p className="results-match">
                {isTie
                  ? `${tiedSeats.length} beasts share ${topScore}. First highest seat keeps the star. ${shortMatchId(result.matchId)}`
                  : shortMatchId(result.matchId)}
              </p>
              <div className="score-burst" style={{ color: champ.color }}>
                {result.scores[result.winner]}
              </div>
            </div>
          </div>
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
            .
            {hashes.length === 0 ? (
              <> No CRUMB Payment hashes this round.</>
            ) : (
              <>
                {' '}
                CRUMB Payments:{' '}
                {hashes.map((hash, i) => (
                  <span key={hash}>
                    {i > 0 ? ' · ' : ''}
                    <a href={explorer ? explorerTxUrl(hash, explorer) : explorerTxUrl(hash)} target="_blank" rel="noreferrer">
                      {hash.slice(0, 12)}…
                    </a>
                  </span>
                ))}
                .
              </>
            )}{' '}
            CRUMB on Testnet has no value.
          </p>
          <div className="actions results-actions" style={{ marginTop: 14 }}>
            <button
              className="btn primary"
              type="button"
              aria-label="Replay"
              disabled={!armed}
              onPointerDown={goReplay}
              onClick={goReplay}
            >
              Replay
            </button>
            <button
              className="btn"
              type="button"
              aria-label="Lobby"
              disabled={!armed}
              onPointerDown={goLobby}
              onClick={goLobby}
            >
              Lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
