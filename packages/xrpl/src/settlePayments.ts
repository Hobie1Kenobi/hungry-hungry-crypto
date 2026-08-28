import type { Address } from '@hhc/shared'
import type { Wallet } from 'xrpl'
import { hasCrumbTrustlineOnClient } from './balances'
import { withTestnet } from './client'
import { submitCrumbPayment } from './payment'
import type { LedgerWriteLog } from './submit'
import { CRUMB_NAME } from './xrplConfig'

export interface CrumbPayout {
  dest: Address
  amount: string
  label?: string
}

export interface CrumbPayoutWrite {
  dest: Address
  amount: string
  hash?: string
  ledgerIndex?: number
  result: string
  skipped?: string
}

export async function submitCrumbPayouts(
  wallet: Wallet,
  issuer: Address,
  payouts: CrumbPayout[],
): Promise<CrumbPayoutWrite[]> {
  if (payouts.length === 0) return []
  return withTestnet(async (client) => {
    const writes: CrumbPayoutWrite[] = []
    for (const payout of payouts) {
      const trusted = await hasCrumbTrustlineOnClient(client, payout.dest, issuer)
      if (!trusted) {
        const skipped = `no ${CRUMB_NAME} TrustLine`
        console.info(`[xrpl] skip Payment dest=${payout.dest} reason=${skipped}`)
        writes.push({ dest: payout.dest, amount: payout.amount, result: 'skipped', skipped })
        continue
      }
      try {
        const log: LedgerWriteLog = await submitCrumbPayment(
          client,
          wallet,
          payout.dest,
          issuer,
          payout.amount,
          payout.label ?? `settleMatch ${CRUMB_NAME}`,
        )
        if (log.result !== 'tesSUCCESS') {
          console.info(
            `[xrpl] settleMatch tec dest=${payout.dest} hash=${log.hash} ledgerIndex=${log.ledgerIndex ?? 'n/a'} result=${log.result}`,
          )
        }
        writes.push({
          dest: payout.dest,
          amount: payout.amount,
          hash: log.hash,
          ledgerIndex: log.ledgerIndex,
          result: log.result,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.info(`[xrpl] settleMatch Payment dest=${payout.dest} ${msg}`)
        writes.push({
          dest: payout.dest,
          amount: payout.amount,
          result: msg.startsWith('BLOCKED:') ? msg : `BLOCKED: ${msg}`,
        })
      }
    }
    return writes
  })
}

export function tesSuccessHashes(writes: CrumbPayoutWrite[]): string[] {
  return writes.filter((w) => w.result === 'tesSUCCESS' && w.hash).map((w) => w.hash as string)
}
