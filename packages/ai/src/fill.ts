import { SEATS, type Seat } from '@hhc/shared'
import { createEasyPolicy } from './easy'
import { createHungryPolicy } from './hungry'
import { createIdlePolicy } from './idle'
import { createNormalPolicy } from './normal'
import { mulberry32 } from './rng'
import type { AiPolicy, Personality, PolicyOptions } from './types'

export const PRACTICE_AI_MAP: Record<Exclude<Seat, 0>, Personality> = {
  1: 'easy',
  2: 'normal',
  3: 'hungry',
}

export function createPolicy(seat: Seat, personality: Personality, options: PolicyOptions = {}): AiPolicy {
  switch (personality) {
    case 'idle':
      return createIdlePolicy(seat)
    case 'easy':
      return createEasyPolicy(seat, options)
    case 'normal':
      return createNormalPolicy(seat, options)
    case 'hungry':
      return createHungryPolicy(seat, options)
  }
}

export function createPracticePolicies(options: PolicyOptions = {}): AiPolicy[] {
  const rng = options.rng ?? Math.random
  return [
    createEasyPolicy(1, { rng }),
    createNormalPolicy(2, { rng }),
    createHungryPolicy(3, { rng }),
  ]
}

export function createIdleFill(except: Seat): AiPolicy[] {
  return SEATS.filter((seat) => seat !== except).map((seat) => createIdlePolicy(seat))
}

export function seededRng(seed: number): () => number {
  return mulberry32(seed)
}
