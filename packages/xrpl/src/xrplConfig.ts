import type { Address } from '@hhc/shared'

export type EnvMap = { [key: string]: string | undefined }

export const XRPL_NETWORK = 'testnet' as const

export const XRPL_TESTNET_WS = 'wss://s.altnet.rippletest.net:51233'

export const XRPL_TESTNET_FAUCET = 'https://faucet.altnet.rippletest.net/'

export const XRPL_TESTNET_EXPLORER = 'https://testnet.xrpl.org'

export const CRUMB_NAME = 'CRUMB'

export const CRUMB_TRUST_LIMIT = '1000000000'

export const CLASSIC_ADDRESS_RE = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/

export function assertTestnetOnly(network: string = XRPL_NETWORK): void {
  if (network !== 'testnet') {
    throw new Error(`Hungry Hungry Crypto Phase 3 allows XRPL Testnet only (got ${network})`)
  }
}

export function assertNoMainnetUrl(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('xrplcluster.com') || lower.includes('s1.ripple.com') || lower.includes('s2.ripple.com')) {
    throw new Error(`Mainnet XRPL URL is forbidden until Orchestrator Launch Gate: ${url}`)
  }
  if (lower.includes('mainnet')) {
    throw new Error(`Mainnet XRPL URL is forbidden until Orchestrator Launch Gate: ${url}`)
  }
  return url
}

export function wsUrlFromEnv(env: EnvMap = process.env): string {
  assertTestnetOnly(env.XRPL_NETWORK || XRPL_NETWORK)
  return assertNoMainnetUrl(env.XRPL_WS_URL || XRPL_TESTNET_WS)
}

export function faucetUrlFromEnv(env: EnvMap = process.env): string {
  assertTestnetOnly(env.XRPL_NETWORK || XRPL_NETWORK)
  return assertNoMainnetUrl(env.XRPL_FAUCET_URL || XRPL_TESTNET_FAUCET)
}

export function explorerUrlFromEnv(env: EnvMap = process.env): string {
  return env.XRPL_EXPLORER_URL || XRPL_TESTNET_EXPLORER
}

export function isClassicAddress(value: unknown): value is Address {
  return typeof value === 'string' && CLASSIC_ADDRESS_RE.test(value)
}

export function parseClassicAddress(value: unknown): Address | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return isClassicAddress(trimmed) ? trimmed : null
}

export function asciiToCurrencyHex(code: string): string {
  const bytes = Array.from(new TextEncoder().encode(code))
  if (bytes.length > 20) {
    throw new Error(`currency code too long: ${code}`)
  }
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hex.toUpperCase().padEnd(40, '0')
}

export function crumbCurrency(raw: string = CRUMB_NAME): string {
  const code = raw.trim() || CRUMB_NAME
  if (code.length === 3) return code
  if (/^[0-9A-Fa-f]{40}$/.test(code)) return code.toUpperCase()
  return asciiToCurrencyHex(code)
}

export function crumbCurrencyFromEnv(env: EnvMap = process.env): string {
  return crumbCurrency(env.XRPL_CRUMB_CURRENCY || CRUMB_NAME)
}

export function issuerAddressFromEnv(env: EnvMap = process.env): Address | null {
  return parseClassicAddress(env.XRPL_ISSUER_ADDRESS)
}

export function explorerTxUrl(hash: string, explorer = XRPL_TESTNET_EXPLORER): string {
  return `${explorer.replace(/\/$/, '')}/transactions/${hash}`
}

export function explorerAccountUrl(address: Address, explorer = XRPL_TESTNET_EXPLORER): string {
  return `${explorer.replace(/\/$/, '')}/accounts/${address}`
}

export interface XrplPublicConfig {
  network: typeof XRPL_NETWORK
  wsUrl: string
  faucetUrl: string
  explorerUrl: string
  issuer: Address | null
  crumbName: typeof CRUMB_NAME
  crumbCurrency: string
  trustLimit: typeof CRUMB_TRUST_LIMIT
}

export function publicXrplConfig(env: EnvMap = process.env): XrplPublicConfig {
  assertTestnetOnly(env.XRPL_NETWORK || XRPL_NETWORK)
  return {
    network: XRPL_NETWORK,
    wsUrl: wsUrlFromEnv(env),
    faucetUrl: faucetUrlFromEnv(env),
    explorerUrl: explorerUrlFromEnv(env),
    issuer: issuerAddressFromEnv(env),
    crumbName: CRUMB_NAME,
    crumbCurrency: crumbCurrencyFromEnv(env),
    trustLimit: CRUMB_TRUST_LIMIT,
  }
}
