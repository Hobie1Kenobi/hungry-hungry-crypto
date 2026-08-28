import type { Address } from '@hhc/shared'
import { crumbTrustSetTx } from '@hhc/xrpl'

type CrossmarkSdk = {
  sync?: { isInstalled?: () => boolean }
  methods: {
    signInAndWait: () => Promise<{
      response?: { data?: { address?: string }; address?: string }
    }>
    signAndSubmitAndWait: (tx: unknown) => Promise<{
      response?: {
        data?: {
          resp?: { result?: { hash?: string; engine_result?: string; ledger_index?: number } }
          hash?: string
        }
      }
    }>
  }
  session?: { network?: { name?: string } | string; address?: string }
}

function asAddress(value: string | undefined): Address | null {
  if (!value || !/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(value)) return null
  return value as Address
}

export function crossmarkInjected(): boolean {
  return typeof window !== 'undefined' && Boolean((window as unknown as { crossmark?: unknown }).crossmark)
}

export async function loadCrossmark(): Promise<CrossmarkSdk | null> {
  if (typeof window === 'undefined') return null
  try {
    const mod = (await import('@crossmarkio/sdk')) as { default?: CrossmarkSdk; sdk?: CrossmarkSdk }
    return mod.default ?? mod.sdk ?? null
  } catch {
    return null
  }
}

export async function isCrossmarkAvailable(): Promise<boolean> {
  if (crossmarkInjected()) return true
  const sdk = await loadCrossmark()
  try {
    return Boolean(sdk?.sync?.isInstalled?.())
  } catch {
    return false
  }
}

function refuseMainnet(network: unknown): void {
  const name = typeof network === 'string' ? network : (network as { name?: string } | undefined)?.name
  if (name && /main/i.test(name)) {
    throw new Error('Crossmark is on Mainnet. Switch the wallet to XRPL Testnet. Phase 3 never uses Mainnet.')
  }
}

export async function connectCrossmark(): Promise<Address> {
  const sdk = await loadCrossmark()
  if (!sdk) throw new Error('Crossmark is not installed. Get it at https://crossmark.io then retry.')
  const signIn = await sdk.methods.signInAndWait()
  refuseMainnet(sdk.session?.network)
  const address =
    asAddress(signIn.response?.data?.address) ??
    asAddress(signIn.response?.address) ??
    asAddress(sdk.session?.address)
  if (!address) throw new Error('Crossmark sign-in returned no classic r-address')
  return address
}

export async function trustlineCrossmark(
  address: Address,
  issuer: Address,
  currency: string,
): Promise<{ hash: string; ledgerIndex: number | null; result: string }> {
  const sdk = await loadCrossmark()
  if (!sdk) throw new Error('Crossmark is not installed')
  refuseMainnet(sdk.session?.network)
  const tx = crumbTrustSetTx(address, issuer, { currency })
  const submitted = await sdk.methods.signAndSubmitAndWait(tx)
  const result = submitted.response?.data?.resp?.result
  const hash = result?.hash ?? submitted.response?.data?.hash
  if (!hash) throw new Error('Crossmark submit returned no hash')
  return {
    hash,
    ledgerIndex: result?.ledger_index ?? null,
    result: result?.engine_result ?? 'submitted',
  }
}
