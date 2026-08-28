export const XRPL_TESTNET_WS = 'wss://s.altnet.rippletest.net:51233'

export const XRPL_TESTNET_FAUCET = 'https://faucet.altnet.rippletest.net/'

export const XRPL_NETWORK = 'testnet' as const

export function assertPhase0NoLedgerWrites(): void {
  if (XRPL_NETWORK !== 'testnet') {
    throw new Error('Phase 0 allows Testnet config only')
  }
}

export function submitDisabled(): never {
  throw new Error('Phase 2: XRPL submits are disabled. Identity/assets/receipts/settlement ship later.')
}
