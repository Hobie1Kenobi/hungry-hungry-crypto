import type { ChompInput, Seat } from '@hhc/shared'
import type { AiPolicy } from './types'

export interface IdlePolicy extends AiPolicy {
  personality: 'idle'
}

export function createIdlePolicy(seat: Seat): IdlePolicy {
  return {
    seat,
    personality: 'idle',
    tick: () => null,
  }
}

export function tickIdle(_policy: IdlePolicy, _now: number): ChompInput | null {
  return null
}
