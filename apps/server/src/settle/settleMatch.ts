import type { Address, MatchResult, Seat, SeatOccupant } from '@hhc/shared'
import { SEATS } from '@hhc/shared'

export interface SettlementRecord {
  matchId: string
  addresses: Record<Seat, Address | null>
  seatMap: SeatOccupant[]
  recordedAt: number
  xrplSubmitted: false
  txHashes: []
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

export function settleMatch(result: MatchResult, seats: SeatOccupant[]): SettlementRecord {
  const record: SettlementRecord = {
    matchId: result.matchId,
    addresses: fourAddresses(result.addresses),
    seatMap: SEATS.map((seat) => seats.find((s) => s.seat === seat) ?? { seat, kind: 'ai' }),
    recordedAt: Date.now(),
    xrplSubmitted: false,
    txHashes: [],
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
