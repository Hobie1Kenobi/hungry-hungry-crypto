import { useEffect, useState } from 'react'
import { explorerAccountUrl, explorerTxUrl } from '@hhc/xrpl'
import { useWalletStore } from '../wallet/walletStore'

function shortAddr(address: string): string {
  return `${address.slice(0, 8)}…${address.slice(-6)}`
}

export function WalletPanel() {
  const kind = useWalletStore((s) => s.kind)
  const address = useWalletStore((s) => s.address)
  const trustline = useWalletStore((s) => s.trustline)
  const busy = useWalletStore((s) => s.busy)
  const error = useWalletStore((s) => s.error)
  const status = useWalletStore((s) => s.status)
  const lastTx = useWalletStore((s) => s.lastTx)
  const faucetHash = useWalletStore((s) => s.faucetHash)
  const xamanUrl = useWalletStore((s) => s.xamanUrl)
  const xrp = useWalletStore((s) => s.xrp)
  const crumb = useWalletStore((s) => s.crumb)
  const config = useWalletStore((s) => s.config)
  const loadConfig = useWalletStore((s) => s.loadConfig)
  const connectCrossmark = useWalletStore((s) => s.connectCrossmark)
  const startXaman = useWalletStore((s) => s.startXaman)
  const confirmXamanAddress = useWalletStore((s) => s.confirmXamanAddress)
  const startGuest = useWalletStore((s) => s.startGuest)
  const getTestXrp = useWalletStore((s) => s.getTestXrp)
  const setTrustline = useWalletStore((s) => s.setTrustline)
  const disconnect = useWalletStore((s) => s.disconnect)
  const [xamanAddress, setXamanAddress] = useState('')

  useEffect(() => {
    void loadConfig()
  }, [loadConfig])

  return (
    <div className="wallet-panel">
      <div className="wallet-head">
        <span>Wallet / XRPL identity</span>
        <span className="phase-tag">Testnet</span>
      </div>
      <p className="wallet-copy">
        Connect an r-address, set a CRUMB TrustLine toward the Testnet issuer, then Quick Match / Private Room
        binds that address to your Colyseus seat. Guest seeds stay on the game server — never in git, never sent
        to other clients.
      </p>
      {config && !config.issuer ? (
        <p className="wallet-warn">
          Issuer unset. On the server: <code>pnpm --filter @hhc/xrpl create-issuer</code>
        </p>
      ) : null}
      {address ? (
        <p className="wallet-addr">
          <a href={explorerAccountUrl(address, config?.explorerUrl)} target="_blank" rel="noreferrer">
            {shortAddr(address)}
          </a>
          <span>
            {kind} · {trustline ? 'CRUMB TrustLine set' : 'no TrustLine yet'}
            {xrp ? ` · ${xrp} XRP` : ''}
            {crumb ? ` · ${crumb} CRUMB` : ''}
          </span>
        </p>
      ) : (
        <p className="wallet-copy">No r-address bound this session.</p>
      )}
      <div className="wallet-actions">
        <button className="btn" type="button" disabled={busy} onClick={() => void connectCrossmark()}>
          Crossmark
        </button>
        <button className="btn" type="button" disabled={busy} onClick={() => void startXaman()}>
          Xaman
        </button>
        <button className="btn" type="button" disabled={busy} onClick={() => void startGuest()}>
          Guest wallet
        </button>
      </div>
      {kind === 'guest' ? (
        <button className="btn primary" type="button" disabled={busy} onClick={() => void getTestXrp()}>
          Get Test XRP
        </button>
      ) : null}
      {kind !== 'none' ? (
        <button className="btn primary" type="button" disabled={busy || !config?.issuer} onClick={() => void setTrustline()}>
          TrustSet CRUMB
        </button>
      ) : null}
      {kind === 'xaman' ? (
        <form
          className="join-row"
          onSubmit={(e) => {
            e.preventDefault()
            void confirmXamanAddress(xamanAddress)
          }}
        >
          <input
            value={xamanAddress}
            onChange={(e) => setXamanAddress(e.target.value)}
            placeholder="r… Testnet address"
            aria-label="Xaman r-address"
            autoComplete="off"
          />
          <button className="btn" type="submit" disabled={busy}>
            Save
          </button>
        </form>
      ) : null}
      {xamanUrl ? (
        <p className="wallet-copy">
          Xaman TrustSet (Testnet):{' '}
          <a href={xamanUrl} target="_blank" rel="noreferrer">
            Open sign request
          </a>
        </p>
      ) : null}
      {status ? <p className="wallet-status">{status}</p> : null}
      {error ? <p className="wallet-error">{error}</p> : null}
      {faucetHash ? (
        <p className="wallet-copy">
          Faucet{' '}
          <a href={explorerTxUrl(faucetHash, config?.explorerUrl)} target="_blank" rel="noreferrer">
            {faucetHash.slice(0, 12)}…
          </a>
        </p>
      ) : null}
      {lastTx ? (
        <p className="wallet-copy">
          TrustSet {lastTx.result}{' '}
          <a href={explorerTxUrl(lastTx.hash, config?.explorerUrl)} target="_blank" rel="noreferrer">
            {lastTx.hash.slice(0, 12)}…
          </a>
          {lastTx.ledgerIndex != null ? ` ledger ${lastTx.ledgerIndex}` : ''}
        </p>
      ) : null}
      {kind !== 'none' ? (
        <button className="btn" type="button" disabled={busy} onClick={disconnect}>
          Disconnect
        </button>
      ) : null}
    </div>
  )
}
