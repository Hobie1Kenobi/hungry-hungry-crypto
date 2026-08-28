import type { Address } from '@hhc/shared'
import type { XrplPublicConfig } from '@hhc/xrpl'

export type WalletKind = 'none' | 'crossmark' | 'xaman' | 'guest'

export interface LedgerTxInfo {
  hash: string
  ledgerIndex: number | null
  result: string
}

export interface WalletSnapshot {
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
  config: XrplPublicConfig | null
}
