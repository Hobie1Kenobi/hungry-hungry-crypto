import type { Address } from '@hhc/shared'
import { Wallet } from 'xrpl'
import { withTestnet } from './client'
import { faucetUrlFromEnv } from './xrplConfig'

export interface FaucetFundResult {
  address: Address
  balanceDrops: string
  hash?: string
  amount?: string
}

interface FaucetJson {
  account?: { address?: string; classicAddress?: string }
  amount?: number | string
  balance?: number | string
  hash?: string
  transactionHash?: string
  error?: string
  message?: string
}

function faucetHash(body: FaucetJson): string | undefined {
  if (typeof body.hash === 'string' && body.hash.length > 0) return body.hash
  if (typeof body.transactionHash === 'string' && body.transactionHash.length > 0) return body.transactionHash
  return undefined
}

export async function requestFaucet(
  address: Address,
  faucetUrl = faucetUrlFromEnv(),
): Promise<FaucetFundResult> {
  const endpoint = new URL('accounts', faucetUrl.endsWith('/') ? faucetUrl : `${faucetUrl}/`)
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: address }),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`BLOCKED: faucet ${endpoint.href}: ${msg}`)
  }

  const text = await response.text()
  let body: FaucetJson = {}
  try {
    body = text ? (JSON.parse(text) as FaucetJson) : {}
  } catch {
    throw new Error(`BLOCKED: faucet ${endpoint.href} non-JSON (${response.status}): ${text.slice(0, 300)}`)
  }

  if (!response.ok) {
    const detail = body.error || body.message || text.slice(0, 300)
    throw new Error(`BLOCKED: faucet ${endpoint.href} HTTP ${response.status}: ${detail}`)
  }

  const hash = faucetHash(body)
  if (hash) {
    console.info(`[xrpl] faucet fund address=${address} hash=${hash} result=tesSUCCESS`)
  } else {
    console.info(`[xrpl] faucet fund address=${address} hash=(not in faucet response) result=HTTP_${response.status}`)
  }

  return {
    address,
    balanceDrops: String(body.balance ?? ''),
    hash,
    amount: body.amount !== undefined ? String(body.amount) : undefined,
  }
}

export async function generateAndFundGuest(): Promise<{ wallet: Wallet; fund: FaucetFundResult }> {
  const wallet = Wallet.generate()
  const fund = await requestFaucet(wallet.classicAddress as Address)
  return { wallet, fund }
}

export async function confirmXrpBalance(address: Address): Promise<string> {
  return withTestnet(async (client) => {
    const info = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated',
    })
    return info.result.account_data.Balance
  })
}
