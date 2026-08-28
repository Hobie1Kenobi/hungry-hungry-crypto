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

export const DUMP_SECONDS = 1.15

export const EAT_DUMP_THRESHOLD = 0.38

export const NECK_EXTEND_SPEED = 16

export const NECK_RETRACT_SPEED = 7

export const CHOMP_PULSE_MS = 240

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

export function emptyPulse(): Record<Seat, number> {
  return { 0: 0, 1: 0, 2: 0, 3: 0 }
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

export function stepNeckExtend(
  current: Record<Seat, number>,
  chompDown: Record<Seat, boolean>,
  chompPulseUntil: Record<Seat, number>,
  now: number,
  dt: number,
): Record<Seat, number> {
  const neckExtend = { ...current }
  for (const seat of SEATS) {
    const biting = chompDown[seat] || now < chompPulseUntil[seat]
    const target = biting ? 1 : 0
    const speed = biting ? NECK_EXTEND_SPEED : NECK_RETRACT_SPEED
    const cur = neckExtend[seat]
    const next = cur + Math.sign(target - cur) * Math.min(Math.abs(target - cur), dt * speed)
    neckExtend[seat] = Math.max(0, Math.min(1, next))
  }
  return neckExtend
}

export function collectEats(
  pellets: Pellet[],
  neckExtend: Record<Seat, number>,
  dumpT: number,
): { id: string; seat: Seat }[] {
  if (dumpT <= EAT_DUMP_THRESHOLD) return []
  const hits: { id: string; seat: Seat }[] = []
  const claimed = new Set<string>()
  for (const seat of SEATS) {
    const extend = neckExtend[seat]
    for (const pellet of pellets) {
      if (pellet.eatenBy !== undefined || claimed.has(pellet.id)) continue
      if (!pelletInChompZone(pellet, seat, extend)) continue
      claimed.add(pellet.id)
      hits.push({ id: pellet.id, seat })
    }
  }
  return hits
}

export function applyChompInput(
  chompDown: Record<Seat, boolean>,
  chompPulseUntil: Record<Seat, number>,
  input: ChompInput,
  pulseNow: number,
): { chompDown: Record<Seat, boolean>; chompPulseUntil: Record<Seat, number>; started: boolean } | null {
  if (input.down) {
    if (chompDown[input.seat]) return null
    return {
      chompDown: { ...chompDown, [input.seat]: true },
      chompPulseUntil: { ...chompPulseUntil, [input.seat]: 0 },
      started: true,
    }
  }
  if (!chompDown[input.seat]) return null
  return {
    chompDown: { ...chompDown, [input.seat]: false },
    chompPulseUntil: { ...chompPulseUntil, [input.seat]: pulseNow + CHOMP_PULSE_MS },
    started: false,
  }
}

export const ROOM_NAME = 'hungry'

export const TICK_HZ = 20

export const TICK_DT = 1 / TICK_HZ

export const DESYNC_MS = 250

export const QUICK_FILL_MS = 3000

export const PRIVATE_FILL_MS = 5000

export type SeatOccupantKind = 'human' | 'ai'

export type FillPersonality = 'idle' | 'easy' | 'normal' | 'hungry'

export interface SeatOccupant {
  seat: Seat
  kind: SeatOccupantKind
  personality?: FillPersonality
  sessionId?: string
}

export interface MatchStart {
  matchId: string
  seats: SeatOccupant[]
}

export interface ArenaSnapshot {
  pellets: Pellet[]
  scores: Record<Seat, number>
  neckExtend: Record<Seat, number>
  chompDown: Record<Seat, boolean>
  chompPulseUntil: Record<Seat, number>
  dumpT: number
  timeLeft: number
}

export interface StepResult {
  snapshot: ArenaSnapshot
  hits: { id: string; seat: Seat }[]
  ended: boolean
}

export function personalityForEmptySeat(seat: Seat): Exclude<FillPersonality, 'idle'> {
  switch (seat) {
    case 0:
      return 'easy'
    case 1:
      return 'easy'
    case 2:
      return 'normal'
    case 3:
      return 'hungry'
  }
}

export function planSeats(
  humanSeats: readonly Seat[],
  sessionBySeat: Partial<Record<Seat, string>> = {},
): SeatOccupant[] {
  return SEATS.map((seat) => {
    if (humanSeats.includes(seat)) {
      return { seat, kind: 'human', sessionId: sessionBySeat[seat] }
    }
    return { seat, kind: 'ai', personality: personalityForEmptySeat(seat) }
  })
}

export function nextOpenSeat(occupied: ReadonlySet<Seat>): Seat | null {
  for (const seat of SEATS) {
    if (!occupied.has(seat)) return seat
  }
  return null
}

export function makeMatchResult(
  matchId: string,
  scores: Record<Seat, number>,
  addresses: Partial<Record<Seat, Address>> = {},
): MatchResult {
  return {
    matchId,
    scores: { 0: scores[0], 1: scores[1], 2: scores[2], 3: scores[3] },
    addresses: { ...addresses },
    winner: pickWinner(scores),
    txHashes: [],
  }
}

export function clampClientTime(clientTime: number, serverNow: number, skewMs = DESYNC_MS): number {
  if (!Number.isFinite(clientTime)) return serverNow
  if (Math.abs(clientTime - serverNow) > skewMs) return serverNow
  return clientTime
}

export function isChompInputShape(value: unknown): value is ChompInput {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    (o.seat === 0 || o.seat === 1 || o.seat === 2 || o.seat === 3) &&
    typeof o.down === 'boolean' &&
    typeof o.clientTime === 'number'
  )
}

function spawnRand(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

function spawnFarEnough(x: number, z: number, placed: Pellet[], minDist: number): boolean {
  return placed.every((p) => {
    const dx = p.x - x
    const dz = p.z - z
    return dx * dx + dz * dz >= minDist * minDist
  })
}

function spawnPlace(
  rng: () => number,
  placed: Pellet[],
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  minDist: number,
): { x: number; z: number } {
  const inner = POND_HALF * 0.82
  let x = spawnRand(rng, x0, x1)
  let z = spawnRand(rng, z0, z1)
  for (let attempt = 0; attempt < 28; attempt += 1) {
    x = spawnRand(rng, x0, x1)
    z = spawnRand(rng, z0, z1)
    x = Math.max(-inner, Math.min(inner, x))
    z = Math.max(-inner, Math.min(inner, z))
    if (spawnFarEnough(x, z, placed, minDist)) break
  }
  return { x, z }
}

export function spawnPellets(rng: () => number = Math.random): Pellet[] {
  const inner = POND_HALF * 0.82
  const pellets: Pellet[] = []
  const perLane = 4
  const lanes: Array<[number, number, number, number]> = [
    [-1.05, 1.05, -3.05, -0.45],
    [0.45, 3.05, -1.05, 1.05],
    [-1.05, 1.05, 0.45, 3.05],
    [-3.05, -0.45, -1.05, 1.05],
  ]

  let i = 0
  for (const [x0, x1, z0, z1] of lanes) {
    for (let n = 0; n < perLane; n += 1) {
      const { x, z } = spawnPlace(rng, pellets, x0, x1, z0, z1, 0.5)
      pellets.push({ id: `crumb-${i}`, x, z, golden: false })
      i += 1
    }
  }

  for (; i < NORMAL_PELLET_COUNT; i += 1) {
    const { x, z } = spawnPlace(rng, pellets, -inner, inner, -inner, inner, 0.55)
    pellets.push({ id: `crumb-${i}`, x, z, golden: false })
  }

  for (let g = 0; g < GOLDEN_PELLET_COUNT; g += 1) {
    pellets.push({
      id: `crumb-golden-${g}`,
      x: spawnRand(rng, -0.4, 0.4),
      z: spawnRand(rng, -0.4, 0.4),
      golden: true,
    })
  }

  return pellets
}

export function stepArena(state: ArenaSnapshot, dt: number, now: number): StepResult {
  const dumpT = Math.min(1, state.dumpT + dt / DUMP_SECONDS)
  const timeLeft = Math.max(0, state.timeLeft - dt)
  const neckExtend = stepNeckExtend(state.neckExtend, state.chompDown, state.chompPulseUntil, now, dt)

  let pellets = state.pellets
  let scores = state.scores
  const hits = collectEats(pellets, neckExtend, dumpT)
  if (hits.length > 0) {
    pellets = pellets.map((p) => ({ ...p }))
    scores = { ...scores }
    for (const hit of hits) {
      const live = pellets.find((p) => p.id === hit.id)
      if (!live || live.eatenBy !== undefined) continue
      live.eatenBy = hit.seat
      scores[hit.seat] += pelletValue(live)
    }
  }

  const snapshot: ArenaSnapshot = {
    pellets,
    scores,
    neckExtend,
    chompDown: state.chompDown,
    chompPulseUntil: state.chompPulseUntil,
    dumpT,
    timeLeft,
  }
  return {
    snapshot,
    hits,
    ended: timeLeft <= 0 || allPelletsEaten(pellets),
  }
}
