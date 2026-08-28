import type { Address, MatchResult, Seat, SeatOccupant } from '@hhc/shared'
import { SEATS } from '@hhc/shared'
import {
  CRUMB_NAME,
  CRUMB_PAYOUT_FLOOR,
  loadSettlementWallet,
  submitCrumbPayouts,
  tesSuccessHashes,
  trophyNftStub,
  type CrumbPayout,
  type CrumbPayoutWrite,
} from '@hhc/xrpl'

export interface PlannedPayout {
  seat: Seat
  dest: Address
  amount: string
}

export interface SettlementRecord {
  matchId: string
  addresses: Record<Seat, Address | null>
  seatMap: SeatOccupant[]
  recordedAt: number
  xrplSubmitted: boolean
  txHashes: string[]
  writes: CrumbPayoutWrite[]
}

const records: SettlementRecord[] = []

function fourAddresses(partial: Partial<Record<Seat, Address>>): Record<Seat, Address | null> {
  return {
    0: partial[0] ?? null,
    1: partial[1] ?? null,
    2: partial[2] ?? null,
    3: partial[3] ?? null,
  }
}

export function crumbAmountForScore(score: number): string {
  const n = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0
  return String(n + Number(CRUMB_PAYOUT_FLOOR))
}

export function planPayouts(result: MatchResult): PlannedPayout[] {
  const planned: PlannedPayout[] = []
  for (const seat of SEATS) {
    const dest = result.addresses[seat]
    if (!dest) continue
    planned.push({ seat, dest, amount: crumbAmountForScore(result.scores[seat] ?? 0) })
  }
  return planned
}

export function settlementLiveEnabled(
  env: { [key: string]: string | undefined } = process.env,
): boolean {
  if (env.HHC_SETTLE_LIVE === '0') return false
  if (env.NODE_ENV === 'test' && env.HHC_SETTLE_LIVE !== '1') return false
  return loadSettlementWallet(env) !== null
}

export async function settleMatch(result: MatchResult, seats: SeatOccupant[]): Promise<SettlementRecord> {
  void trophyNftStub()
  const addresses = fourAddresses(result.addresses)
  const planned = planPayouts(result)
  let writes: CrumbPayoutWrite[] = []
  let txHashes: string[] = []
  let xrplSubmitted = false

  if (planned.length > 0 && settlementLiveEnabled()) {
    const loaded = loadSettlementWallet()
    if (loaded) {
      const payouts: CrumbPayout[] = planned.map((p) => ({
        dest: p.dest,
        amount: p.amount,
        label: `settleMatch ${CRUMB_NAME} seat=${p.seat}`,
      }))
      writes = await submitCrumbPayouts(loaded.wallet, loaded.issuer, payouts)
      txHashes = tesSuccessHashes(writes)
      xrplSubmitted = txHashes.length > 0
      result.txHashes = txHashes
    }
  } else if (planned.length > 0) {
    for (const p of planned) {
      writes.push({
        dest: p.dest,
        amount: p.amount,
        result: 'skipped',
        skipped: 'settlement wallet not configured or live submits disabled',
      })
    }
  }

  const record: SettlementRecord = {
    matchId: result.matchId,
    addresses,
    seatMap: SEATS.map((seat) => seats.find((s) => s.seat === seat) ?? { seat, kind: 'ai' }),
    recordedAt: Date.now(),
    xrplSubmitted,
    txHashes,
    writes,
  }
  records.push(record)
  return record
}

export function getSettlement(matchId: string): SettlementRecord | undefined {
  for (let i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].matchId === matchId) return records[i]
  }
  return undefined
}

export function listSettlements(): SettlementRecord[] {
  return [...records]
}

export function resetSettlementsForTests(): void {
  records.length = 0
}
