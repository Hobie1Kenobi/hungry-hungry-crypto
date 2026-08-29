import { create } from 'zustand'
import type { AiPolicy } from '@hhc/ai'
import { createPracticePolicies } from '@hhc/ai'
import type { Address, ChompInput, MatchResult, Pellet, Seat, SeatOccupant } from '@hhc/shared'
import {
  ROUND_SECONDS,
  applyChompInput,
  emptyChomp,
  emptyLastEat,
  emptyNecks,
  emptyPulse,
  emptyScores,
  makeMatchResult,
  planSeats,
  practiceWallClock,
  spawnPellets,
  stepArena,
  stepNeckExtend,
} from '@hhc/shared'
import { useJuiceStore } from '../game/juice'
import { sfxChomp, sfxEat, sfxEnd, sfxHopperDump, sfxJawSnap, sfxSplashSmall, sfxTeethMiss } from '../game/sfx'
import { useWalletStore } from '../wallet/walletStore'

let practicePolicies: AiPolicy[] = []

export type UiPhase = 'lobby' | 'waiting' | 'playing' | 'results'
export type PlayMode = 'practice' | 'online'
export type QueueMode = 'practice' | 'quick' | 'private'

export interface NetFrame {
  dumpT: number
  timeLeft: number
  pellets: Pellet[]
  scores: Record<Seat, number>
  neckExtend: Record<Seat, number>
  chompDown: Record<Seat, boolean>
}

interface GameState {
  ui: UiPhase
  playMode: PlayMode
  queueMode: QueueMode
  localSeat: Seat
  occupants: SeatOccupant[]
  seatAddresses: Partial<Record<Seat, Address>>
  roomCode: string
  waitHint: string
  waitError: string
  startAt: number
  matchId: string
  pellets: Pellet[]
  scores: Record<Seat, number>
  neckExtend: Record<Seat, number>
  chompDown: Record<Seat, boolean>
  chompPulseUntil: Record<Seat, number>
  dumpT: number
  timeLeft: number
  lastEatAt: Record<Seat, number>
  refillCount: number
  lastRefillAt: number
  chompHeld: boolean
  matchClockOrigin: number
  result: MatchResult | null
  netSend: ((input: ChompInput) => void) | null
  netLeave: (() => void) | null
  setChomp: (input: ChompInput) => void
  setChompHeld: (down: boolean) => void
  startPractice: () => void
  markMatchGo: (now?: number) => void
  tick: (dt: number, now?: number) => void
  backToLobby: () => void
  beginWaiting: (opts: { queueMode: 'quick' | 'private'; hint: string; roomCode?: string }) => void
  applyWelcome: (msg: { seat: Seat; roomCode?: string }) => void
  applyLobbySeats: (
    occupants: SeatOccupant[],
    startAt: number,
    roomCode: string,
    addresses?: Partial<Record<Seat, Address>>,
  ) => void
  applyMatchStart: (matchId: string, seats: SeatOccupant[], localSeat: Seat) => void
  applyNetFrame: (frame: NetFrame) => void
  applyMatchEnd: (result: MatchResult) => void
  setWaitError: (message: string) => void
  bindNet: (handlers: { send: (input: ChompInput) => void; leave: () => void }) => void
}

function finishLocal(state: GameState): Pick<GameState, 'ui' | 'result' | 'chompDown' | 'chompHeld'> {
  const wallet = useWalletStore.getState().address
  const addresses: Partial<Record<Seat, Address>> = wallet ? { [state.localSeat]: wallet } : {}
  const result = makeMatchResult(state.matchId, state.scores, addresses)
  sfxEnd()
  return { ui: 'results', result, chompDown: emptyChomp(), chompHeld: false }
}

export const useGameStore = create<GameState>((set, get) => ({
  ui: 'lobby',
  playMode: 'practice',
  queueMode: 'practice',
  localSeat: 0,
  occupants: [],
  seatAddresses: {},
  roomCode: '',
  waitHint: '',
  waitError: '',
  startAt: 0,
  matchId: '',
  pellets: [],
  scores: emptyScores(),
  neckExtend: emptyNecks(),
  chompDown: emptyChomp(),
  chompPulseUntil: emptyPulse(),
  dumpT: 0,
  timeLeft: ROUND_SECONDS,
  lastEatAt: emptyLastEat(),
  refillCount: 0,
  lastRefillAt: 0,
  chompHeld: false,
  matchClockOrigin: 0,
  result: null,
  netSend: null,
  netLeave: null,

  setChomp: (input) => {
    const state = get()
    if (state.ui !== 'playing') return
    const seat = state.playMode === 'online' ? state.localSeat : input.seat
    const origin = state.matchClockOrigin
    const clientTime = origin > 0 ? Math.max(0, input.clientTime - origin) : input.clientTime
    const next: ChompInput = { seat, down: input.down, clientTime }
    if (state.playMode === 'online') state.netSend?.(next)
    set((s) => {
      const applied = applyChompInput(s.chompDown, s.chompPulseUntil, next, clientTime)
      if (!applied) return s
      if (applied.started) sfxChomp()
      else {
        sfxJawSnap()
        if (performance.now() - s.lastEatAt[next.seat] > 280 && next.seat === s.localSeat) sfxTeethMiss()
        useJuiceStore.getState().notifyMiss(next.seat)
      }
      return {
        chompDown: applied.chompDown,
        chompPulseUntil: applied.chompPulseUntil,
      }
    })
  },

  setChompHeld: (down) => {
    const state = get()
    if (state.ui !== 'playing') return
    set({ chompHeld: down })
    get().setChomp({ seat: state.localSeat, down, clientTime: performance.now() })
  },

  startPractice: () => {
    get().netLeave?.()
    practicePolicies = createPracticePolicies()
    set({
      ui: 'playing',
      playMode: 'practice',
      queueMode: 'practice',
      localSeat: 0,
      occupants: planSeats([0]),
      seatAddresses: {},
      roomCode: '',
      waitError: '',
      matchId: `local-${crypto.randomUUID()}`,
      pellets: spawnPellets(),
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      dumpT: 0,
      timeLeft: ROUND_SECONDS,
      lastEatAt: emptyLastEat(),
      refillCount: 0,
      lastRefillAt: 0,
      chompHeld: false,
      matchClockOrigin: 0,
      result: null,
      netSend: null,
      netLeave: null,
    })
    sfxHopperDump()
    useJuiceStore.getState().notifyDump()
  },

  markMatchGo: (now = performance.now()) => {
    const state = get()
    if (state.ui !== 'playing' || state.matchClockOrigin > 0) return
    set({ matchClockOrigin: now, timeLeft: ROUND_SECONDS })
  },

  tick: (dt, now = performance.now()) => {
    const state = get()
    if (state.ui !== 'playing') return
    if (state.playMode === 'practice' && state.matchClockOrigin <= 0) return
    const origin = state.matchClockOrigin
    const clock = origin > 0 ? Math.max(0, now - origin) : now
    const wall = state.playMode === 'practice' && origin > 0 ? practiceWallClock(now, origin, state.timeLeft) : null
    const stepDt = wall ? wall.dt : dt
    if (state.playMode === 'online') {
      const neckExtend = stepNeckExtend(state.neckExtend, state.chompDown, state.chompPulseUntil, clock, stepDt)
      set({ neckExtend })
      return
    }

    let chompDown = state.chompDown
    let chompPulseUntil = state.chompPulseUntil
    const held = applyChompInput(
      chompDown,
      chompPulseUntil,
      { seat: state.localSeat, down: state.chompHeld, clientTime: clock },
      clock,
    )
    if (held) {
      chompDown = held.chompDown
      chompPulseUntil = held.chompPulseUntil
      if (held.started) sfxChomp()
      else {
        sfxJawSnap()
        if (clock - state.lastEatAt[state.localSeat] > 280) sfxTeethMiss()
        useJuiceStore.getState().notifyMiss(state.localSeat)
      }
    }

    const world = {
      now: clock,
      dumpT: state.dumpT,
      timeLeft: wall?.timeLeft ?? state.timeLeft,
      pellets: state.pellets,
      neckExtend: state.neckExtend,
      chompDown,
      scores: state.scores,
    }
    for (const policy of practicePolicies) {
      const input = policy.tick(world)
      if (!input) continue
      const applied = applyChompInput(chompDown, chompPulseUntil, { ...input, clientTime: clock }, clock)
      if (!applied) continue
      chompDown = applied.chompDown
      chompPulseUntil = applied.chompPulseUntil
      world.chompDown = chompDown
      if (applied.started) sfxChomp()
      else useJuiceStore.getState().notifyMiss(input.seat)
    }

    const stepped = stepArena(
      {
        pellets: state.pellets,
        scores: state.scores,
        neckExtend: state.neckExtend,
        chompDown,
        chompPulseUntil,
        dumpT: state.dumpT,
        timeLeft: state.timeLeft,
        lastEatAt: state.lastEatAt,
        refillCount: state.refillCount,
        lastRefillAt: state.lastRefillAt,
      },
      stepDt,
      clock,
    )
    for (const hit of stepped.hits) {
      const pellet = stepped.snapshot.pellets.find((p) => p.id === hit.id)
      if (pellet) {
        sfxEat(pellet.golden)
        useJuiceStore.getState().notifyEat(hit.seat, pellet.x, pellet.z, pellet.golden)
      }
    }
    if (stepped.snapshot.dumpT + 0.2 < state.dumpT) {
      sfxHopperDump()
      sfxSplashSmall()
      useJuiceStore.getState().notifyDump()
    }
    const next: Partial<GameState> = { ...stepped.snapshot }
    if (wall) next.timeLeft = wall.timeLeft
    const ended = stepped.ended || Boolean(wall?.ended)
    if (ended) {
      Object.assign(next, finishLocal({ ...state, ...stepped.snapshot, timeLeft: next.timeLeft ?? stepped.snapshot.timeLeft }))
    }
    set(next)
  },

  backToLobby: () => {
    get().netLeave?.()
    practicePolicies = []
    set({
      ui: 'lobby',
      playMode: 'practice',
      queueMode: 'practice',
      pellets: [],
      result: null,
      occupants: [],
      seatAddresses: {},
      roomCode: '',
      waitHint: '',
      waitError: '',
      startAt: 0,
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      chompHeld: false,
      neckExtend: emptyNecks(),
      netSend: null,
      netLeave: null,
    })
  },

  beginWaiting: ({ queueMode, hint, roomCode = '' }) => {
    get().netLeave?.()
    set({
      ui: 'waiting',
      playMode: 'online',
      queueMode,
      roomCode,
      waitHint: hint,
      waitError: '',
      startAt: 0,
      occupants: [],
      seatAddresses: {},
      result: null,
      localSeat: 0,
    })
  },

  applyWelcome: (msg) => {
    set({
      localSeat: msg.seat,
      roomCode: msg.roomCode || get().roomCode,
    })
  },

  applyLobbySeats: (occupants, startAt, roomCode, addresses) => {
    set({
      occupants,
      startAt,
      roomCode: roomCode || get().roomCode,
      seatAddresses: addresses ?? get().seatAddresses,
    })
  },

  applyMatchStart: (matchId, seats, localSeat) => {
    practicePolicies = []
    set({
      ui: 'playing',
      playMode: 'online',
      matchId,
      occupants: seats,
      localSeat,
      pellets: [],
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: emptyPulse(),
      dumpT: 0,
      timeLeft: ROUND_SECONDS,
      lastEatAt: emptyLastEat(),
      refillCount: 0,
      lastRefillAt: 0,
      chompHeld: false,
      matchClockOrigin: performance.now(),
      result: null,
    })
  },

  applyNetFrame: (frame) => {
    const state = get()
    if (state.ui !== 'playing' || state.playMode !== 'online') return
    const prev = new Map(state.pellets.map((p) => [p.id, p.eatenBy]))
    for (const pellet of frame.pellets) {
      if (pellet.eatenBy !== undefined && prev.get(pellet.id) !== pellet.eatenBy) {
        sfxEat(pellet.golden)
        useJuiceStore.getState().notifyEat(pellet.eatenBy, pellet.x, pellet.z, pellet.golden)
      }
    }
    const local = state.localSeat
    set({
      dumpT: frame.dumpT,
      timeLeft: frame.timeLeft,
      pellets: frame.pellets,
      scores: frame.scores,
      chompDown: { ...frame.chompDown, [local]: state.chompDown[local] },
      neckExtend: { ...frame.neckExtend, [local]: state.neckExtend[local] },
    })
  },

  applyMatchEnd: (result) => {
    sfxEnd()
    set({
      ui: 'results',
      result: { ...result, txHashes: result.txHashes ?? [] },
      chompDown: emptyChomp(),
      chompHeld: false,
    })
  },

  setWaitError: (message) => {
    get().netLeave?.()
    set({
      ui: 'waiting',
      waitError: message,
      netSend: null,
      netLeave: null,
    })
  },

  bindNet: ({ send, leave }) => {
    set({ netSend: send, netLeave: leave })
  },
}))
