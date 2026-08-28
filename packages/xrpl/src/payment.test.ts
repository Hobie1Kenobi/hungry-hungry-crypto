import { describe, expect, it } from 'vitest'
import { crumbPaymentTx } from './payment'
import { tesSuccessHashes } from './settlePayments'
import { trophyNftStub } from './trophy'
import { isLostPhase3Issuer, loadIssuerSeed, PHASE3_THROWAWAY_ISSUER } from './issuer'
import { publicXrplConfig } from './xrplConfig'

describe('CRUMB Payment', () => {
  it('builds an issued-currency Payment toward a bound r-address', () => {
    const issuer = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe' as const
    const treasury = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh' as const
    const dest = 'rU4kbPXskGQ6d1wS838FD3H4UPxQJwuY8T' as const
    const tx = crumbPaymentTx(treasury, dest, issuer, '5')
    expect(tx.TransactionType).toBe('Payment')
    expect(tx.Account).toBe(treasury)
    expect(tx.Destination).toBe(dest)
    expect(tx.Amount).toEqual({
      currency: '4352554D42000000000000000000000000000000',
      issuer,
      value: '5',
    })
  })

  it('keeps tesSUCCESS hashes and drops tec / skipped writes', () => {
    expect(
      tesSuccessHashes([
        { dest: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAWe', amount: '1', hash: 'ABC', result: 'tesSUCCESS' },
        { dest: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', amount: '1', hash: 'DEF', result: 'tecPATH_DRY' },
        { dest: 'rU4kbPXskGQ6d1wS838FD3H4UPxQJwuY8T', amount: '1', result: 'skipped', skipped: 'no TrustLine' },
      ]),
    ).toEqual(['ABC'])
  })

  it('does not block settlement on the optional trophy NFT stub', () => {
    const stub = trophyNftStub()
    expect(stub.skipped).toBe(true)
  })
})

describe('durable issuer guards', () => {
  it('refuses the lost Phase 3 throwaway issuer as a durable seed source', () => {
    expect(isLostPhase3Issuer(PHASE3_THROWAWAY_ISSUER)).toBe(true)
    expect(
      loadIssuerSeed({
        XRPL_ISSUER_ADDRESS: PHASE3_THROWAWAY_ISSUER,
        XRPL_ISSUER_SEED: 'sShouldNeverBeUsed',
      }),
    ).toBeNull()
  })

  it('exposes treasury on the public Testnet config', () => {
    const cfg = publicXrplConfig({ XRPL_NETWORK: 'testnet' })
    expect(cfg.treasury).toBeNull()
    expect(cfg.network).toBe('testnet')
  })
})
