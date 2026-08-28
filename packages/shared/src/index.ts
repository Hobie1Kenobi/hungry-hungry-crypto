export type Seat = 0 | 1 | 2 | 3

export type Address = `r${string}`

export interface Pellet {
  id: string
  x: number
  z: number
  golden: boolean
  eatenBy?: Seat
}

export interface ChompInput {
  seat: Seat
  down: boolean
  clientTime: number
}

export interface MatchResult {
  matchId: string
  scores: Record<Seat, number>
  addresses: Partial<Record<Seat, Address>>
  winner: Seat
  txHashes: string[]
}

export const SEATS: Seat[] = [0, 1, 2, 3]

export const HUMAN_SEAT: Seat = 0

export const ROUND_SECONDS = 45

export const NORMAL_PELLET_COUNT = 20

export const GOLDEN_PELLET_COUNT = 1

export const TOTAL_PELLETS = NORMAL_PELLET_COUNT + GOLDEN_PELLET_COUNT

export const SCORE_NORMAL = 1

export const SCORE_GOLDEN = 5

export const POND_SIZE = 8

export const POND_HALF = POND_SIZE / 2

export const BEAST_OFFSET = 5.2

export const CHOMP_HALF_WIDTH = 1.28

export const NECK_BASE = 0.95

export const NECK_EXTRA = 4.85

export type Cardinal = 'north' | 'east' | 'south' | 'west'

export interface BeastSpec {
  seat: Seat
  name: string
  side: Cardinal
  color: string
  accent: string
}

export const BEASTS: Record<Seat, BeastSpec> = {
  0: { seat: 0, name: 'BYTEBITE', side: 'north', color: '#00E5FF', accent: '#007A88' },
  1: { seat: 1, name: 'RIPSAW', side: 'east', color: '#FF2BD6', accent: '#7A1470' },
  2: { seat: 2, name: 'GOLDGRUB', side: 'south', color: '#B8FF2C', accent: '#4A6B12' },
  3: { seat: 3, name: 'BLOCKMAW', side: 'west', color: '#F4F1E8', accent: '#D4AF37' },
}

export function emptyScores(): Record<Seat, number> {
  return { 0: 0, 1: 0, 2: 0, 3: 0 }
}

export function emptyNecks(): Record<Seat, number> {
  return { 0: 0, 1: 0, 2: 0, 3: 0 }
}

export function emptyChomp(): Record<Seat, boolean> {
  return { 0: false, 1: false, 2: false, 3: false }
}

export function pelletValue(pellet: Pellet): number {
  return pellet.golden ? SCORE_GOLDEN : SCORE_NORMAL
}

export function pickWinner(scores: Record<Seat, number>): Seat {
  let winner: Seat = 0
  let best = -1
  for (const seat of SEATS) {
    if (scores[seat] > best) {
      best = scores[seat]
      winner = seat
    }
  }
  return winner
}

export function allPelletsEaten(pellets: Pellet[]): boolean {
  return pellets.length > 0 && pellets.every((p) => p.eatenBy !== undefined)
}

export function beastYaw(seat: Seat): number {
  switch (seat) {
    case 0:
      return 0
    case 1:
      return Math.PI / 2
    case 2:
      return Math.PI
    case 3:
      return -Math.PI / 2
  }
}

export function beastPosition(seat: Seat): [number, number, number] {
  switch (seat) {
    case 0:
      return [0, 0, -BEAST_OFFSET]
    case 1:
      return [BEAST_OFFSET, 0, 0]
    case 2:
      return [0, 0, BEAST_OFFSET]
    case 3:
      return [-BEAST_OFFSET, 0, 0]
  }
}

export function chompReach(extend: number): number {
  return NECK_BASE + extend * NECK_EXTRA
}

export function pelletInChompZone(pellet: Pellet, seat: Seat, extend: number): boolean {
  if (pellet.eatenBy !== undefined || extend < 0.18) return false
  const reach = chompReach(extend)
  const w = CHOMP_HALF_WIDTH
  const origin = BEAST_OFFSET - 0.35
  switch (seat) {
    case 0:
      return Math.abs(pellet.x) <= w && pellet.z >= -origin && pellet.z <= -origin + reach
    case 1:
      return Math.abs(pellet.z) <= w && pellet.x <= origin && pellet.x >= origin - reach
    case 2:
      return Math.abs(pellet.x) <= w && pellet.z <= origin && pellet.z >= origin - reach
    case 3:
      return Math.abs(pellet.z) <= w && pellet.x >= -origin && pellet.x <= -origin + reach
  }
}
