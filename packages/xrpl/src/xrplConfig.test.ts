import { describe, expect, it } from 'vitest'
import { asciiToCurrencyHex, crumbCurrency, isClassicAddress, parseClassicAddress, publicXrplConfig } from './xrplConfig'
import { crumbTrustSetTx } from './trustsetTx'

describe('XRPL Testnet config', () => {
  it('exposes Testnet URLs only', () => {
    const cfg = publicXrplConfig({ XRPL_NETWORK: 'testnet' })
    expect(cfg.network).toBe('testnet')
    expect(cfg.wsUrl).toBe('wss://s.altnet.rippletest.net:51233')
    expect(cfg.faucetUrl).toBe('https://faucet.altnet.rippletest.net/')
    expect(cfg.explorerUrl).toBe('https://testnet.xrpl.org')
    expect(cfg.wsUrl.toLowerCase()).not.toContain('mainnet')
    expect(cfg.crumbName).toBe('CRUMB')
    expect(cfg.treasury).toBeNull()
  })

  it('hex-encodes CRUMB because it is not a 3-character ISO code', () => {
    expect(asciiToCurrencyHex('CRUMB')).toBe('4352554D42000000000000000000000000000000')
    expect(crumbCurrency('CRUMB')).toBe('4352554D42000000000000000000000000000000')
    expect(crumbCurrency('CRB')).toBe('CRB')
  })

  it('accepts classic r-addresses only', () => {
    expect(isClassicAddress('rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe')).toBe(true)
    expect(parseClassicAddress('  rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe ')).toBe(
      'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe',
    )
    expect(parseClassicAddress('not-an-address')).toBeNull()
    expect(parseClassicAddress('0xabc')).toBeNull()
  })

  it('builds a CRUMB TrustSet toward the issuer', () => {
    const issuer = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe' as const
    const account = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh' as const
    const tx = crumbTrustSetTx(account, issuer)
    expect(tx.TransactionType).toBe('TrustSet')
    expect(tx.Account).toBe(account)
    expect(tx.LimitAmount.issuer).toBe(issuer)
    expect(tx.LimitAmount.currency).toBe('4352554D42000000000000000000000000000000')
  })
})
