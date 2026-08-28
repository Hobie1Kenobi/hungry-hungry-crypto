import type { Address } from '@hhc/shared'
import { xamanTrustSetDetectUrl } from '@hhc/xrpl'

export function isXamanXapp(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return Boolean(params.get('xAppToken') || params.get('xAppStyle'))
}

export function xamanDeeplink(issuer: Address, currency: string): string {
  return xamanTrustSetDetectUrl(issuer, { currency })
}

export function xamanAppLink(issuer: Address, currency: string): string {
  return xamanDeeplink(issuer, currency).replace('https://xaman.app/', 'xumm://xumm.app/')
}
