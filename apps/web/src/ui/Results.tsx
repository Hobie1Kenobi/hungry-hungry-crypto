import { BEASTS, SEATS } from '@hhc/shared'
import { explorerTxUrl } from '@hhc/xrpl'
import { replayOnline } from '../net/session'
import { useGameStore } from '../store/gameStore'
import { useWalletStore } from '../wallet/walletStore'

export function Results() {
  const result = useGameStore((s) => s.result)
  const playMode = useGameStore((s) => s.playMode)
  const startPractice = useGameStore((s) => s.startPractice)
  const backToLobby = useGameStore((s) => s.backToLobby)
  const explorer = useWalletStore((s) => s.config?.explorerUrl)

  if (!result) return null
  const champ = BEASTS[result.winner]
  const ranked = [...SEATS].sort((a, b) => result.scores[b] - result.scores[a])
  const hashes = result.txHashes

  return (
    <div className="overlay">
      <div className="results">
        <div className="results-card">
          <p className="kicker">{playMode === 'online' ? 'HungryRoom result · Testnet settlement' : 'Local result · no ledger writes'}</p>
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
