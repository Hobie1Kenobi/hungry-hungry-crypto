import type { Address } from '@hhc/shared'
import type { AccountSet } from 'xrpl'
import { Wallet } from 'xrpl'
import { withTestnet } from './client'
import { defaultRepoEnvPath, envPathAtRepoRoot, upsertEnv } from './envFile'
import { requestFaucet } from './fundWallet'
import { autofillSimulateSubmit, type LedgerWriteLog } from './submit'
import { parseClassicAddress } from './xrplConfig'

export { envPathAtRepoRoot }

const ASF_DEFAULT_RIPPLE = 8

/** Phase 3 TrustSet-demo issuer. Its seed lived on a destroyed VM. Do not reuse. */
export const PHASE3_THROWAWAY_ISSUER = 'rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW' as Address

export interface ThrowawayIssuer {
  address: Address
  defaultRipple?: LedgerWriteLog
  faucet?: { hash?: string }
}

export async function enableDefaultRipple(wallet: Wallet): Promise<LedgerWriteLog> {
  return withTestnet(async (client) => {
    return autofillSimulateSubmit(
      client,
      {
        TransactionType: 'AccountSet',
        Account: wallet.classicAddress,
        SetFlag: ASF_DEFAULT_RIPPLE,
      } as AccountSet,
      wallet,
      'AccountSet DefaultRipple',
    )
  })
}

export async function createThrowawayIssuer(
  envFile = defaultRepoEnvPath(),
): Promise<{ issuer: ThrowawayIssuer; seed: string }> {
  const wallet = Wallet.generate()
  const seed = wallet.seed
  if (!seed) throw new Error('issuer wallet produced no seed')
  const address = wallet.classicAddress as Address
  storeIssuerInEnv(envFile, address, seed)
  const faucet = await requestFaucet(address)
  const defaultRipple = await enableDefaultRipple(wallet)
  return {
    issuer: { address, defaultRipple, faucet: { hash: faucet.hash } },
    seed,
  }
}

export function storeIssuerInEnv(envPath: string, address: Address, seed: string): void {
  upsertEnv(envPath, {
    XRPL_NETWORK: 'testnet',
    XRPL_ISSUER_ADDRESS: address,
    XRPL_ISSUER_SEED: seed,
  })
}

export function loadIssuerSeed(
  env: { [key: string]: string | undefined } = process.env,
): { address: Address; seed: string } | null {
  const address = parseClassicAddress(env.XRPL_ISSUER_ADDRESS)
  const seed = env.XRPL_ISSUER_SEED
  if (!address || !seed) return null
  if (address === PHASE3_THROWAWAY_ISSUER) return null
  return { address, seed }
}

export function isLostPhase3Issuer(address: Address | null | undefined): boolean {
  return address === PHASE3_THROWAWAY_ISSUER
}
