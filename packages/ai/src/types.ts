import type { ChompInput, Pellet, Seat } from '@hhc/shared'

export type Personality = 'idle' | 'easy' | 'normal' | 'hungry'

export interface ArenaView {
  now: number
  dumpT: number
  timeLeft: number
  pellets: readonly Pellet[]
  neckExtend: Record<Seat, number>
  chompDown: Record<Seat, boolean>
  scores: Record<Seat, number>
}

export interface PolicyOptions {
  rng?: () => number
}

export interface AiPolicy {
  readonly seat: Seat
  readonly personality: Personality
  tick(world: ArenaView): ChompInput | null
}
