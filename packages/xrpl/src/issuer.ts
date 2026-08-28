import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Address } from '@hhc/shared'
import type { AccountSet } from 'xrpl'
import { Wallet } from 'xrpl'
import { withTestnet } from './client'
import { requestFaucet } from './fundWallet'
import { autofillSimulateSubmit, type LedgerWriteLog } from './submit'
import { parseClassicAddress } from './xrplConfig'

const ASF_DEFAULT_RIPPLE = 8

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

export async function createThrowawayIssuer(envFile = defaultEnvPath()): Promise<{ issuer: ThrowawayIssuer; seed: string }> {
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

function upsertEnv(envPath: string, entries: Record<string, string>): void {
  let text = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
  if (text.length > 0 && !text.endsWith('\n')) text += '\n'
  for (const [key, value] of Object.entries(entries)) {
    const line = `${key}=${value}`
    const re = new RegExp(`^${key}=.*$`, 'm')
    if (re.test(text)) text = text.replace(re, line)
    else text += `${line}\n`
  }
  writeFileSync(envPath, text, { encoding: 'utf8', mode: 0o600 })
}

export function storeIssuerInEnv(
  envPath: string,
  address: Address,
  seed: string,
): void {
  upsertEnv(envPath, {
    XRPL_NETWORK: 'testnet',
    XRPL_ISSUER_ADDRESS: address,
    XRPL_ISSUER_SEED: seed,
  })
}

export function envPathAtRepoRoot(fromDir = process.cwd()): string {
  return resolve(fromDir, '.env')
}

function defaultEnvPath(): string {
  return envPathAtRepoRoot(resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..'))
}

export function loadIssuerSeed(env: { [key: string]: string | undefined } = process.env): { address: Address; seed: string } | null {
  const address = parseClassicAddress(env.XRPL_ISSUER_ADDRESS)
  const seed = env.XRPL_ISSUER_SEED
  if (!address || !seed) return null
  return { address, seed }
}
