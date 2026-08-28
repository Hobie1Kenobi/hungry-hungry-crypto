import type { Address } from '@hhc/shared'
import { dropsToXrp } from 'xrpl'
import { withTestnet } from './client'
import { CRUMB_NAME, crumbCurrency, explorerAccountUrl } from './xrplConfig'

export interface PrintedBalances {
  address: Address
  xrp: string
  crumb: string
  crumbCurrency: string
}

function isAccountMissing(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('actNotFound') || /account not found/i.test(msg)
}

export async function getBalances(
  address: Address,
  issuer: Address | null,
  currency = crumbCurrency(CRUMB_NAME),
): Promise<PrintedBalances> {
  return withTestnet(async (client) => {
    let xrp = '0'
    try {
      const info = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated',
      })
      xrp = String(dropsToXrp(info.result.account_data.Balance))
    } catch (err) {
      if (!isAccountMissing(err)) throw err
    }

    let crumb = '0'
    if (issuer) {
      try {
        const lines = await client.request({
          command: 'account_lines',
          account: address,
          peer: issuer,
          ledger_index: 'validated',
        })
        const line = lines.result.lines.find((l) => l.currency === currency)
        if (line) crumb = line.balance
      } catch (err) {
        if (!isAccountMissing(err)) throw err
      }
    }

    const printed: PrintedBalances = { address, xrp, crumb, crumbCurrency: currency }
    printBalances(printed)
    return printed
  })
}

export function printBalances(balances: PrintedBalances): void {
  console.info(
    `[xrpl] balances address=${balances.address} XRP=${balances.xrp} ${CRUMB_NAME}=${balances.crumb} explorer=${explorerAccountUrl(balances.address)}`,
  )
}

export async function hasCrumbTrustline(
  address: Address,
  issuer: Address,
  currency = crumbCurrency(CRUMB_NAME),
): Promise<boolean> {
  return withTestnet(async (client) => {
    try {
      const lines = await client.request({
        command: 'account_lines',
        account: address,
        peer: issuer,
        ledger_index: 'validated',
      })
      return lines.result.lines.some((l) => l.currency === currency)
    } catch (err) {
      if (isAccountMissing(err)) return false
      throw err
    }
  })
}
