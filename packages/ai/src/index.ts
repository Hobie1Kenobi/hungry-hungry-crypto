import type { ChompInput, Seat } from '@hhc/shared'

export interface IdlePolicy {
  seat: Seat
  kind: 'idle-dummy'
}

export function createIdlePolicy(seat: Seat): IdlePolicy {
  return { seat, kind: 'idle-dummy' }
}

export function tickIdle(_policy: IdlePolicy, _now: number): ChompInput | null {
  return null
}
