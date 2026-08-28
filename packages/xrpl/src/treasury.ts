import type { Address } from '@hhc/shared'
import { Wallet } from 'xrpl'
import { withTestnet } from './client'
import { defaultRepoEnvPath, upsertEnv } from './envFile'
import { requestFaucet } from './fundWallet'
import { enableDefaultRipple, loadIssuerSeed, storeIssuerInEnv } from './issuer'
import { submitCrumbPayment } from './payment'
import { setCrumbTrustline } from './setTrustline'
import { type LedgerWriteLog } from './submit'
import { CRUMB_NAME, CRUMB_TREASURY_STOCK, treasuryAddressFromEnv } from './xrplConfig'

export interface NamedWrite {
  what: string
  hash: string
  ledgerIndex: number | undefined
  result: string
}

export interface DurableIssuerSetup {
  issuer: Address
  treasury: Address
  reused: boolean
  writes: NamedWrite[]
}

export function loadTreasurySeed(
  env: { [key: string]: string | undefined } = process.env,
): { address: Address; seed: string } | null {
  const seed = env.XRPL_TREASURY_SEED
  if (!seed) return null
  const fromEnv = treasuryAddressFromEnv(env)
  try {
    const wallet = Wallet.fromSeed(seed)
    const address = wallet.classicAddress as Address
    if (fromEnv && fromEnv !== address) return null
    return { address, seed }
  } catch {
    return null
  }
}

export function loadSettlementWallet(
  env: { [key: string]: string | undefined } = process.env,
): { wallet: Wallet; issuer: Address; treasury: Address } | null {
  const issuer = loadIssuerSeed(env)
  if (!issuer) return null
  const treasury = loadTreasurySeed(env)
  const source = treasury ?? issuer
  return {
    wallet: Wallet.fromSeed(source.seed),
    issuer: issuer.address,
    treasury: source.address,
  }
}

export function storeTreasuryInEnv(envPath: string, address: Address, seed: string): void {
  upsertEnv(envPath, {
    XRPL_TREASURY_ADDRESS: address,
    XRPL_TREASURY_SEED: seed,
  })
}

function named(what: string, log: LedgerWriteLog, extraHash?: string): NamedWrite {
  return {
    what,
    hash: log.hash || extraHash || '',
    ledgerIndex: log.ledgerIndex,
    result: log.result,
  }
}

function recordFaucet(what: string, hash: string | undefined): NamedWrite | null {
  if (!hash) return null
  return { what, hash, ledgerIndex: undefined, result: 'tesSUCCESS' }
}

export async function issueTreasuryStock(
  issuerWallet: Wallet,
  treasury: Address,
  value = CRUMB_TREASURY_STOCK,
): Promise<LedgerWriteLog> {
  return withTestnet(async (client) => {
    return submitCrumbPayment(
      client,
      issuerWallet,
      treasury,
      issuerWallet.classicAddress as Address,
      value,
      `Issue treasury ${CRUMB_NAME}`,
    )
  })
}

async function fundGenerated(
  label: string,
): Promise<{ wallet: Wallet; seed: string; address: Address; faucetHash?: string }> {
  const wallet = Wallet.generate()
  const seed = wallet.seed
  if (!seed) throw new Error(`${label} wallet produced no seed`)
  const address = wallet.classicAddress as Address
  const fund = await requestFaucet(address)
  return { wallet, seed, address, faucetHash: fund.hash }
}

export async function createDurableIssuer(envFile = defaultRepoEnvPath()): Promise<DurableIssuerSetup> {
  const writes: NamedWrite[] = []
  const existingIssuer = loadIssuerSeed(process.env)
  const existingTreasury = loadTreasurySeed(process.env)

  if (existingIssuer && existingTreasury) {
    const issuerWallet = Wallet.fromSeed(existingIssuer.seed)
    const ripple = await enableDefaultRipple(issuerWallet)
    writes.push(named('AccountSet DefaultRipple', ripple))
    const treasuryWallet = Wallet.fromSeed(existingTreasury.seed)
    const trust = await setCrumbTrustline(treasuryWallet, existingIssuer.address)
    writes.push(named(`TrustSet ${CRUMB_NAME} treasury`, trust))
    const stock = await issueTreasuryStock(issuerWallet, existingTreasury.address)
    writes.push(named(`Issue treasury ${CRUMB_NAME}`, stock))
    return {
      issuer: existingIssuer.address,
      treasury: existingTreasury.address,
      reused: true,
      writes,
    }
  }

  const issuerFunded = existingIssuer
    ? {
        wallet: Wallet.fromSeed(existingIssuer.seed),
        seed: existingIssuer.seed,
        address: existingIssuer.address,
        faucetHash: undefined as string | undefined,
      }
    : await fundGenerated('issuer')

  storeIssuerInEnv(envFile, issuerFunded.address, issuerFunded.seed)
  process.env.XRPL_ISSUER_ADDRESS = issuerFunded.address
  process.env.XRPL_ISSUER_SEED = issuerFunded.seed

  const issuerFaucet = recordFaucet('Issuer faucet', issuerFunded.faucetHash)
  if (issuerFaucet) writes.push(issuerFaucet)

  const ripple = await enableDefaultRipple(issuerFunded.wallet)
  writes.push(named('AccountSet DefaultRipple', ripple))

  const treasuryFunded = existingTreasury
    ? {
        wallet: Wallet.fromSeed(existingTreasury.seed),
        seed: existingTreasury.seed,
        address: existingTreasury.address,
        faucetHash: undefined as string | undefined,
      }
    : await fundGenerated('treasury')

  storeTreasuryInEnv(envFile, treasuryFunded.address, treasuryFunded.seed)
  process.env.XRPL_TREASURY_ADDRESS = treasuryFunded.address
  process.env.XRPL_TREASURY_SEED = treasuryFunded.seed

  const treasuryFaucet = recordFaucet('Treasury faucet', treasuryFunded.faucetHash)
  if (treasuryFaucet) writes.push(treasuryFaucet)

  const trust = await setCrumbTrustline(treasuryFunded.wallet, issuerFunded.address)
  writes.push(named(`TrustSet ${CRUMB_NAME} treasury`, trust))

  const stock = await issueTreasuryStock(issuerFunded.wallet, treasuryFunded.address)
  writes.push(named(`Issue treasury ${CRUMB_NAME}`, stock))

  return {
    issuer: issuerFunded.address,
    treasury: treasuryFunded.address,
    reused: Boolean(existingIssuer && existingTreasury),
    writes,
  }
}
