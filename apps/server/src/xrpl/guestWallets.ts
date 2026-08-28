import { randomUUID } from 'node:crypto'
import type { Address } from '@hhc/shared'
import { Wallet } from 'xrpl'
import {
  getBalances,
  issuerAddressFromEnv,
  parseClassicAddress,
  requestFaucet,
  setCrumbTrustline,
  type FaucetFundResult,
  type LedgerWriteLog,
  type PrintedBalances,
} from '@hhc/xrpl'

interface GuestRecord {
  sessionId: string
  address: Address
  seed: string
  createdAt: number
}

const guests = new Map<string, GuestRecord>()
const byAddress = new Map<Address, string>()

function toPublic(record: GuestRecord) {
  return {
    sessionId: record.sessionId,
    address: record.address,
    network: 'testnet' as const,
  }
}

export function createGuestSession(): { sessionId: string; address: Address; network: 'testnet' } {
  const wallet = Wallet.generate()
  const seed = wallet.seed
  if (!seed) throw new Error('guest wallet produced no seed')
  const address = wallet.classicAddress as Address
  const sessionId = randomUUID()
  const record: GuestRecord = { sessionId, address, seed, createdAt: Date.now() }
  guests.set(sessionId, record)
  byAddress.set(address, sessionId)
  return toPublic(record)
}

export function getGuest(sessionId: string): GuestRecord | undefined {
  return guests.get(sessionId)
}

export function guestWallet(sessionId: string): Wallet {
  const record = guests.get(sessionId)
  if (!record) throw new Error('unknown guest session')
  return Wallet.fromSeed(record.seed)
}

export async function fundGuest(sessionId: string): Promise<{
  sessionId: string
  address: Address
  fund: FaucetFundResult
}> {
  const record = guests.get(sessionId)
  if (!record) throw new Error('unknown guest session')
  const fund = await requestFaucet(record.address)
  return { sessionId: record.sessionId, address: record.address, fund }
}

export async function trustlineGuest(sessionId: string): Promise<{
  sessionId: string
  address: Address
  trust: LedgerWriteLog
  issuer: Address
}> {
  const record = guests.get(sessionId)
  if (!record) throw new Error('unknown guest session')
  const issuer = issuerAddressFromEnv()
  if (!issuer) {
    throw new Error('XRPL_ISSUER_ADDRESS is not set. Run pnpm --filter @hhc/xrpl create-issuer')
  }
  const trust = await setCrumbTrustline(Wallet.fromSeed(record.seed), issuer)
  return { sessionId: record.sessionId, address: record.address, trust, issuer }
}

export async function balancesGuest(sessionId: string): Promise<PrintedBalances> {
  const record = guests.get(sessionId)
  if (!record) throw new Error('unknown guest session')
  return getBalances(record.address, issuerAddressFromEnv())
}

export function lookupGuestSession(address: string): string | undefined {
  const parsed = parseClassicAddress(address)
  if (!parsed) return undefined
  return byAddress.get(parsed)
}

export function resetGuestsForTests(): void {
  guests.clear()
  byAddress.clear()
}
