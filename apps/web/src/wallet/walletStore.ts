import { create } from 'zustand'
import type { Address } from '@hhc/shared'
import type { XrplPublicConfig } from '@hhc/xrpl'
import { createGuest, fetchBalances, fetchXrplConfig, fundGuest, trustlineGuest } from './api'
import { connectCrossmark, isCrossmarkAvailable, trustlineCrossmark } from './crossmark'
import { xamanDeeplink } from './xaman'
import type { LedgerTxInfo, WalletKind } from './types'

const GUEST_KEY = 'hhc.guestSession'
const KIND_KEY = 'hhc.walletKind'
const ADDR_KEY = 'hhc.walletAddress'

interface WalletState {
  kind: WalletKind
  address: Address | null
  guestSessionId: string | null
  trustline: boolean
  busy: boolean
  error: string
  status: string
  lastTx: LedgerTxInfo | null
  faucetHash: string | null
  xamanUrl: string | null
  xrp: string
  crumb: string
  config: XrplPublicConfig | null
  loadConfig: () => Promise<void>
  connectCrossmark: () => Promise<void>
  startXaman: () => Promise<void>
  confirmXamanAddress: (address: string) => Promise<void>
  startGuest: () => Promise<void>
  getTestXrp: () => Promise<void>
  setTrustline: () => Promise<void>
  disconnect: () => void
}

function persist(kind: WalletKind, address: Address | null, guestSessionId: string | null): void {
  try {
    if (kind === 'none' || !address) {
      sessionStorage.removeItem(KIND_KEY)
      sessionStorage.removeItem(ADDR_KEY)
      sessionStorage.removeItem(GUEST_KEY)
      return
    }
    sessionStorage.setItem(KIND_KEY, kind)
    sessionStorage.setItem(ADDR_KEY, address)
    if (guestSessionId) sessionStorage.setItem(GUEST_KEY, guestSessionId)
    else sessionStorage.removeItem(GUEST_KEY)
  } catch {
    /* private mode */
  }
}

function restore(): Pick<WalletState, 'kind' | 'address' | 'guestSessionId'> {
  try {
    const kind = (sessionStorage.getItem(KIND_KEY) as WalletKind | null) ?? 'none'
    const address = (sessionStorage.getItem(ADDR_KEY) as Address | null) ?? null
    const guestSessionId = sessionStorage.getItem(GUEST_KEY)
    if (kind === 'none' || !address) return { kind: 'none', address: null, guestSessionId: null }
    return { kind, address, guestSessionId }
  } catch {
    return { kind: 'none', address: null, guestSessionId: null }
  }
}

export const useWalletStore = create<WalletState>((set, get) => ({
  ...restore(),
  trustline: false,
  busy: false,
  error: '',
  status: '',
  lastTx: null,
  faucetHash: null,
  xamanUrl: null,
  xrp: '',
  crumb: '',
  config: null,

  loadConfig: async () => {
    try {
      const config = await fetchXrplConfig()
      set({ config, error: '' })
      const address = get().address
      if (address) {
        const bal = await fetchBalances(address)
        set({ xrp: bal.xrp, crumb: bal.crumb, trustline: bal.trustline })
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) })
    }
  },

  connectCrossmark: async () => {
    set({ busy: true, error: '', status: 'Opening Crossmark…' })
    try {
      const installed = await isCrossmarkAvailable()
      if (!installed) throw new Error('Crossmark extension not detected. Install Crossmark and set it to Testnet.')
      const address = await connectCrossmark()
      persist('crossmark', address, null)
      set({ kind: 'crossmark', address, guestSessionId: null, status: 'Connected. Set the CRUMB TrustLine next.', busy: false })
      const bal = await fetchBalances(address)
      set({ xrp: bal.xrp, crumb: bal.crumb, trustline: bal.trustline })
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  startXaman: async () => {
    set({ busy: true, error: '' })
    try {
      const config = get().config ?? (await fetchXrplConfig())
      if (!config.issuer) throw new Error('Issuer not configured. Run pnpm --filter @hhc/xrpl create-issuer on the server.')
      const url = xamanDeeplink(config.issuer, config.crumbCurrency)
      set({
        kind: 'xaman',
        config,
        xamanUrl: url,
        busy: false,
        status: 'Open the Xaman link (Testnet), then paste your r-address.',
      })
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  confirmXamanAddress: async (raw) => {
    set({ busy: true, error: '' })
    try {
      const trimmed = raw.trim()
      if (!/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(trimmed)) throw new Error('Paste a classic Testnet r-address')
      const address = trimmed as Address
      persist('xaman', address, null)
      const bal = await fetchBalances(address)
      set({
        kind: 'xaman',
        address,
        guestSessionId: null,
        xrp: bal.xrp,
        crumb: bal.crumb,
        trustline: bal.trustline,
        busy: false,
        status: bal.trustline
          ? 'CRUMB TrustLine found. Ready to bind this r-address to a seat.'
          : 'Address saved. Open Xaman to sign TrustSet, then Refresh.',
      })
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  startGuest: async () => {
    set({ busy: true, error: '', status: 'Creating a Testnet guest wallet on the server…' })
    try {
      const guest = await createGuest()
      persist('guest', guest.address, guest.sessionId)
      set({
        kind: 'guest',
        address: guest.address,
        guestSessionId: guest.sessionId,
        trustline: false,
        busy: false,
        status: 'Guest r-address ready. Get Test XRP, then set the CRUMB TrustLine.',
      })
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  getTestXrp: async () => {
    const { kind, guestSessionId } = get()
    if (kind !== 'guest' || !guestSessionId) {
      set({ error: 'Get Test XRP is for the guest wallet path.' })
      return
    }
    set({ busy: true, error: '', status: 'Requesting Testnet faucet dust…' })
    try {
      const funded = await fundGuest(guestSessionId)
      set({
        faucetHash: funded.faucetHash,
        busy: false,
        status: funded.faucetHash
          ? `Faucet hash ${funded.faucetHash}`
          : 'Faucet funded (hash not in faucet response).',
      })
      let bal = await fetchBalances(funded.address)
      if (bal.xrp === '0') {
        await new Promise((r) => setTimeout(r, 1500))
        bal = await fetchBalances(funded.address)
      }
      set({ xrp: bal.xrp, crumb: bal.crumb })
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  setTrustline: async () => {
    const state = get()
    const config = state.config ?? (await fetchXrplConfig())
    if (!config.issuer) {
      set({ error: 'Issuer not configured. Run pnpm --filter @hhc/xrpl create-issuer.' })
      return
    }
    set({ busy: true, error: '', status: 'Submitting CRUMB TrustSet…', config })
    try {
      if (state.kind === 'guest' && state.guestSessionId) {
        const trust = await trustlineGuest(state.guestSessionId)
        set({
          lastTx: { hash: trust.hash, ledgerIndex: trust.ledgerIndex, result: trust.result },
          trustline: true,
          busy: false,
          status: `TrustSet ${trust.result} hash=${trust.hash}`,
        })
        return
      }
      if (state.kind === 'crossmark' && state.address) {
        const trust = await trustlineCrossmark(state.address, config.issuer, config.crumbCurrency)
        set({
          lastTx: trust,
          trustline: true,
          busy: false,
          status: `TrustSet ${trust.result} hash=${trust.hash}`,
        })
        return
      }
      if (state.kind === 'xaman' && state.address) {
        const url = xamanDeeplink(config.issuer, config.crumbCurrency)
        set({ xamanUrl: url, busy: false, status: 'Sign TrustSet in Xaman, then Refresh balances.' })
        const bal = await fetchBalances(state.address)
        set({ xrp: bal.xrp, crumb: bal.crumb, trustline: bal.trustline })
        return
      }
      throw new Error('Connect a wallet first')
    } catch (err) {
      set({ busy: false, error: err instanceof Error ? err.message : String(err) })
    }
  },

  disconnect: () => {
    persist('none', null, null)
    set({
      kind: 'none',
      address: null,
      guestSessionId: null,
      trustline: false,
      lastTx: null,
      faucetHash: null,
      xamanUrl: null,
      xrp: '',
      crumb: '',
      status: '',
      error: '',
      busy: false,
    })
  },
}))
