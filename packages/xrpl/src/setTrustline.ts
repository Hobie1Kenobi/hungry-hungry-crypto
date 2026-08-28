import type { Address } from '@hhc/shared'
import type { SubmittableTransaction, Wallet } from 'xrpl'
import { withTestnet } from './client'
import { autofillSimulateSubmit, type LedgerWriteLog } from './submit'
import { crumbTrustSetTx } from './trustsetTx'
import { CRUMB_NAME, crumbCurrency } from './xrplConfig'

export async function setCrumbTrustline(
  wallet: Wallet,
  issuer: Address,
  options: { currency?: string; limit?: string } = {},
): Promise<LedgerWriteLog> {
  const account = wallet.classicAddress as Address
  const currency = options.currency ?? crumbCurrency(CRUMB_NAME)
  return withTestnet(async (client) => {
    const tx = crumbTrustSetTx(account, issuer, { ...options, currency }) as SubmittableTransaction
    return autofillSimulateSubmit(client, tx, wallet, `TrustSet ${CRUMB_NAME}`)
  })
}
