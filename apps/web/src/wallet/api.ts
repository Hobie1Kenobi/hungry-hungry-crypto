import type { Address } from '@hhc/shared'
import type { XrplPublicConfig } from '@hhc/xrpl'
import { gameServerHttpUrl } from '../net/url'

export async function fetchXrplConfig(): Promise<XrplPublicConfig> {
  const res = await fetch(`${gameServerHttpUrl()}/xrpl/config`)
  if (!res.ok) throw new Error(`Cannot load XRPL config (${res.status}). Is the game server running?`)
  return (await res.json()) as XrplPublicConfig
}

export async function fetchBalances(address: Address): Promise<{
  address: Address
  xrp: string
  crumb: string
  trustline: boolean
  issuer: Address | null
}> {
  const res = await fetch(`${gameServerHttpUrl()}/xrpl/balances/${encodeURIComponent(address)}`)
  const body = (await res.json()) as {
    address?: Address
    xrp?: string
    crumb?: string
    trustline?: boolean
    issuer?: Address | null
    error?: string
  }
  if (!res.ok) throw new Error(body.error || `balances failed (${res.status})`)
  return {
    address: body.address ?? address,
    xrp: body.xrp ?? '0',
    crumb: body.crumb ?? '0',
    trustline: Boolean(body.trustline),
    issuer: body.issuer ?? null,
  }
}

export async function createGuest(): Promise<{ sessionId: string; address: Address }> {
  const res = await fetch(`${gameServerHttpUrl()}/wallet/guest`, { method: 'POST' })
  const body = (await res.json()) as { sessionId?: string; address?: Address; error?: string }
  if (!res.ok || !body.sessionId || !body.address) throw new Error(body.error || 'guest create failed')
  return { sessionId: body.sessionId, address: body.address }
}

export async function fundGuest(sessionId: string): Promise<{ address: Address; faucetHash: string | null }> {
  const res = await fetch(`${gameServerHttpUrl()}/wallet/guest/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hhc-guest': sessionId },
    body: JSON.stringify({ sessionId }),
  })
  const body = (await res.json()) as { address?: Address; faucetHash?: string | null; error?: string }
  if (!res.ok || !body.address) throw new Error(body.error || 'Get Test XRP failed')
  return { address: body.address, faucetHash: body.faucetHash ?? null }
}

export async function trustlineGuest(sessionId: string): Promise<{
  address: Address
  hash: string
  ledgerIndex: number | null
  result: string
}> {
  const res = await fetch(`${gameServerHttpUrl()}/wallet/guest/trustline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hhc-guest': sessionId },
    body: JSON.stringify({ sessionId }),
  })
  const body = (await res.json()) as {
    address?: Address
    hash?: string
    ledgerIndex?: number | null
    result?: string
    error?: string
  }
  if (!res.ok || !body.address || !body.hash || !body.result) throw new Error(body.error || 'TrustSet failed')
  return {
    address: body.address,
    hash: body.hash,
    ledgerIndex: body.ledgerIndex ?? null,
    result: body.result,
  }
}
