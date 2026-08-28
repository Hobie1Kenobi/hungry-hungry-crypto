import type { Address } from '@hhc/shared'
import type { Client, Payment, SubmittableTransaction, Wallet } from 'xrpl'
import { autofillSimulateSubmit, type LedgerWriteLog } from './submit'
import { CRUMB_NAME, crumbCurrency } from './xrplConfig'

export function crumbPaymentTx(
  account: Address,
  destination: Address,
  issuer: Address,
  value: string,
  currency = crumbCurrency(CRUMB_NAME),
): Payment {
  return {
    TransactionType: 'Payment',
    Account: account,
    Destination: destination,
    Amount: {
      currency,
      issuer,
      value,
    },
  }
}

export async function submitCrumbPayment(
  client: Client,
  wallet: Wallet,
  destination: Address,
  issuer: Address,
  value: string,
  label = `Payment ${CRUMB_NAME}`,
): Promise<LedgerWriteLog> {
  const account = wallet.classicAddress as Address
  const tx = crumbPaymentTx(account, destination, issuer, value) as SubmittableTransaction
  return autofillSimulateSubmit(client, tx, wallet, `${label} dest=${destination} value=${value}`)
}
