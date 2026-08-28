import type { Address } from '@hhc/shared'
import { CRUMB_NAME, CRUMB_TRUST_LIMIT, crumbCurrency } from './xrplConfig'

export interface CrumbTrustSetTx {
  TransactionType: 'TrustSet'
  Account: Address
  LimitAmount: {
    currency: string
    issuer: Address
    value: string
  }
}

export function crumbTrustSetTx(
  account: Address,
  issuer: Address,
  options: { currency?: string; limit?: string } = {},
): CrumbTrustSetTx {
  return {
    TransactionType: 'TrustSet',
    Account: account,
    LimitAmount: {
      currency: options.currency ?? crumbCurrency(CRUMB_NAME),
      issuer,
      value: options.limit ?? CRUMB_TRUST_LIMIT,
    },
  }
}

export function xamanTrustSetDetectUrl(
  issuer: Address,
  options: { currency?: string; limit?: string } = {},
): string {
  const tx = {
    TransactionType: 'TrustSet',
    LimitAmount: {
      currency: options.currency ?? crumbCurrency(CRUMB_NAME),
      issuer,
      value: options.limit ?? CRUMB_TRUST_LIMIT,
    },
  }
  const hex = [...new TextEncoder().encode(JSON.stringify(tx))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `https://xaman.app/detect/${hex}`
}
