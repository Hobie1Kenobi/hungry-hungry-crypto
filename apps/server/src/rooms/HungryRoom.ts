import { type Client, Room } from 'colyseus'
import type { AiPolicy } from '@hhc/ai'
import { createPolicy } from '@hhc/ai'
import type {
  ArenaSnapshot,
  ChompInput,
  MatchResult,
  MatchStart,
  Seat,
  SeatOccupant,
} from '@hhc/shared'
import {
  PRIVATE_FILL_MS,
  QUICK_FILL_MS,
  ROUND_SECONDS,
  TICK_DT,
  TICK_HZ,
  applyChompInput,
  clampClientTime,
  emptyChomp,
  emptyNecks,
  emptyPulse,
  emptyScores,
  isChompInputShape,
    makeMatchResult,
    nextOpenSeat,
    personalityForEmptySeat,
    planSeats,
    spawnPellets,
    stepArena,
} from '@hhc/shared'
import { HungryState, PelletState, SeatState } from './schema'
import { generateCode, registerRoomCode, unregisterRoom } from './codes'
import { settleMatch } from '../settle/settleMatch'

export interface HungryRoomOptions {
  mode?: 'quick' | 'private'
  code?: string
  fillMs?: number
  roundSeconds?: number
}

function allowTestOptions(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.HHC_ALLOW_SHORT_ROUNDS === '1'
}

export class HungryRoom extends Room<HungryState> {
  maxClients = 4
  autoDispose = true

  private sim: ArenaSnapshot | null = null
  private policies: AiPolicy[] = []
  private occupants: SeatOccupant[] = []
  private sessionSeat = new Map<string, Seat>()
  private started = false
  private finished = false
  private fillTimer: ReturnType<Room['clock']['setTimeout']> | null = null
  private fillMs = QUICK_FILL_MS
  private roundSeconds = ROUND_SECONDS
  private mode: 'quick' | 'private' = 'quick'
  private simNow = 0
  private tickAcc = 0
  private code = ''

  onCreate(options: HungryRoomOptions = {}): void {
    this.setState(new HungryState())
    this.mode = options.mode === 'private' ? 'private' : 'quick'
    this.state.mode = this.mode
    this.state.phase = 'lobby'
    this.state.timeLeft = ROUND_SECONDS

    if (this.mode === 'private') {
      this.code = (options.code ?? generateCode()).toUpperCase()
      this.state.code = this.code
      this.setPrivate(true)
    }

    this.fillMs = this.mode === 'private' ? PRIVATE_FILL_MS : QUICK_FILL_MS
    this.roundSeconds = ROUND_SECONDS
    if (allowTestOptions()) {
      if (typeof options.fillMs === 'number' && options.fillMs >= 0) this.fillMs = options.fillMs
      if (typeof options.roundSeconds === 'number' && options.roundSeconds > 0) {
        this.roundSeconds = Math.min(ROUND_SECONDS, options.roundSeconds)
      }
    }

    this.setMetadata({ mode: this.mode, code: this.code || undefined })
    this.onMessage('chomp', (client, payload) => this.onChomp(client, payload))
    this.setSimulationInterval((dt) => this.onSim(dt), 1000 / TICK_HZ)
  }

  onAuth(_client: Client, _options: HungryRoomOptions): boolean {
    return !this.started && this.sessionSeat.size < this.maxClients
  }

  onJoin(client: Client): void {
    if (this.mode === 'private' && this.code) {
      registerRoomCode(this.code, this.roomId)
    }
    const occupied = new Set(this.sessionSeat.values())
    const seat = nextOpenSeat(occupied)
    if (seat === null) {
      throw new Error('room full')
    }
    this.sessionSeat.set(client.sessionId, seat)
    this.syncSeatSchema()
    client.send('welcome', { seat, roomCode: this.code, roomId: this.roomId })

    if (this.sessionSeat.size === 1) {
      this.state.startAt = Date.now() + this.fillMs
      this.fillTimer = this.clock.setTimeout(() => {
        void this.beginMatch()
      }, Math.max(50, this.fillMs))
    }
    if (this.sessionSeat.size >= 4) {
      void this.beginMatch()
    }
  }

  async onLeave(client: Client): Promise<void> {
    const seat = this.sessionSeat.get(client.sessionId)
    this.sessionSeat.delete(client.sessionId)
    if (!this.started) {
      this.syncSeatSchema()
      if (this.sessionSeat.size === 0 && this.fillTimer) {
        this.fillTimer.clear()
        this.fillTimer = null
        this.state.startAt = 0
      }
      return
    }
    if (this.finished || seat === undefined) return
    this.convertSeatToAi(seat)
  }

  onDispose(): void {
    unregisterRoom(this.roomId)
  }

  private onChomp(client: Client, payload: unknown): void {
    if (!this.started || this.finished || !this.sim) return
    const seat = this.sessionSeat.get(client.sessionId)
    if (seat === undefined) return
    if (!isChompInputShape(payload)) return
    if (payload.seat !== seat) return
    const input: ChompInput = {
      seat,
      down: payload.down,
      clientTime: clampClientTime(payload.clientTime, this.simNow),
    }
    const applied = applyChompInput(this.sim.chompDown, this.sim.chompPulseUntil, input, this.simNow)
    if (!applied) return
    this.sim.chompDown = applied.chompDown
    this.sim.chompPulseUntil = applied.chompPulseUntil
  }

  private async beginMatch(): Promise<void> {
    if (this.started) return
    if (this.sessionSeat.size === 0) return
    this.started = true
    if (this.fillTimer) {
      this.fillTimer.clear()
      this.fillTimer = null
    }
    this.lock()

    const sessionBySeat: Partial<Record<Seat, string>> = {}
    for (const [sessionId, seat] of this.sessionSeat) {
      sessionBySeat[seat] = sessionId
    }
    const humanSeats = [...this.sessionSeat.values()].sort() as Seat[]
    this.occupants = planSeats(humanSeats, sessionBySeat)
    this.policies = this.occupants
      .filter((o) => o.kind === 'ai')
      .map((o) => createPolicy(o.seat, o.personality ?? 'easy'))

    const matchId = `hhc-${this.roomId}`
    this.simNow = 0
    this.tickAcc = 0
    this.sim = {
      pellets: spawnPellets(),
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      dumpT: 0,
      timeLeft: this.roundSeconds,
    }

    this.state.matchId = matchId
    this.state.phase = 'playing'
    this.state.timeLeft = this.roundSeconds
    this.state.dumpT = 0
    this.syncSeatSchema()
    this.syncPellets(true)
    this.syncSim()

    const payload: MatchStart = { matchId, seats: this.occupants }
    this.broadcast('matchStart', payload)
  }

  private convertSeatToAi(seat: Seat): void {
    const idx = this.occupants.findIndex((o) => o.seat === seat)
    if (idx < 0) return
    if (this.occupants[idx].kind === 'ai') return
    const personality = personalityForEmptySeat(seat)
    this.occupants[idx] = { seat, kind: 'ai', personality }
    this.policies = this.policies.filter((p) => p.seat !== seat)
    this.policies.push(createPolicy(seat, personality))
    this.syncSeatSchema()
  }

  private onSim(dtMs: number): void {
    if (!this.started || this.finished || !this.sim) return
    this.tickAcc += dtMs / 1000
    while (this.tickAcc >= TICK_DT) {
      this.tickAcc -= TICK_DT
      this.fixedTick()
    }
  }

  private fixedTick(): void {
    if (!this.sim || this.finished) return
    const world = {
      now: this.simNow,
      dumpT: this.sim.dumpT,
      timeLeft: this.sim.timeLeft,
      pellets: this.sim.pellets,
      neckExtend: this.sim.neckExtend,
      chompDown: this.sim.chompDown,
      scores: this.sim.scores,
    }
    for (const policy of this.policies) {
      const input = policy.tick(world)
      if (!input) continue
      const applied = applyChompInput(this.sim.chompDown, this.sim.chompPulseUntil, input, this.simNow)
      if (!applied) continue
      this.sim.chompDown = applied.chompDown
      this.sim.chompPulseUntil = applied.chompPulseUntil
    }

    const stepped = stepArena(this.sim, TICK_DT, this.simNow)
    this.sim = stepped.snapshot
    this.simNow += TICK_DT * 1000
    this.syncSim()
    this.syncPellets(false)
    if (stepped.ended) this.finishMatch()
  }

  private finishMatch(): void {
    if (this.finished || !this.sim) return
    this.finished = true
    const result: MatchResult = makeMatchResult(this.state.matchId, this.sim.scores, {})
    settleMatch(result, this.occupants)
    this.state.phase = 'results'
    this.broadcast('matchEnd', result)
  }

  private syncSeatSchema(): void {
    const planned = this.started
      ? this.occupants
      : planSeats([...this.sessionSeat.values()] as Seat[], Object.fromEntries(
          [...this.sessionSeat.entries()].map(([sessionId, seat]) => [seat, sessionId]),
        ) as Partial<Record<Seat, string>>)

    this.state.seats.clear()
    for (const occupant of planned) {
      const row = new SeatState()
      row.seat = occupant.seat
      row.kind = occupant.kind
      row.personality = occupant.personality ?? ''
      row.sessionId = occupant.sessionId ?? ''
      this.state.seats.push(row)
    }
  }

  private syncPellets(reset: boolean): void {
    if (!this.sim) return
    if (reset || this.state.pellets.length !== this.sim.pellets.length) {
      this.state.pellets.clear()
      for (const pellet of this.sim.pellets) {
        const row = new PelletState()
        row.id = pellet.id
        row.x = pellet.x
        row.z = pellet.z
        row.golden = pellet.golden
        row.eatenBy = pellet.eatenBy === undefined ? -1 : pellet.eatenBy
        this.state.pellets.push(row)
      }
      return
    }
    for (let i = 0; i < this.sim.pellets.length; i += 1) {
      const src = this.sim.pellets[i]
      const dst = this.state.pellets[i]
      if (!dst) continue
      const eaten = src.eatenBy === undefined ? -1 : src.eatenBy
      if (dst.eatenBy !== eaten) dst.eatenBy = eaten
    }
  }

  private syncSim(): void {
    if (!this.sim) return
    this.state.timeLeft = this.sim.timeLeft
    this.state.dumpT = this.sim.dumpT
    this.state.score0 = this.sim.scores[0]
    this.state.score1 = this.sim.scores[1]
    this.state.score2 = this.sim.scores[2]
    this.state.score3 = this.sim.scores[3]
    this.state.neck0 = this.sim.neckExtend[0]
    this.state.neck1 = this.sim.neckExtend[1]
    this.state.neck2 = this.sim.neckExtend[2]
    this.state.neck3 = this.sim.neckExtend[3]
    this.state.chomp0 = this.sim.chompDown[0]
    this.state.chomp1 = this.sim.chompDown[1]
    this.state.chomp2 = this.sim.chompDown[2]
    this.state.chomp3 = this.sim.chompDown[3]
  }
}
