import { create } from 'zustand'
import type { ChompInput, MatchResult, Pellet, Seat } from '@hhc/shared'
import {
  HUMAN_SEAT,
  ROUND_SECONDS,
  SEATS,
  allPelletsEaten,
  emptyChomp,
  emptyNecks,
  emptyScores,
  pelletInChompZone,
  pelletValue,
  pickWinner,
} from '@hhc/shared'
import { sfxChomp, sfxEat, sfxEnd } from '../game/sfx'
import { spawnPellets } from '../game/spawn'

export type UiPhase = 'lobby' | 'playing' | 'results'

interface GameState {
  ui: UiPhase
  matchId: string
  pellets: Pellet[]
  scores: Record<Seat, number>
  neckExtend: Record<Seat, number>
  chompDown: Record<Seat, boolean>
  chompPulseUntil: number
  dumpT: number
  timeLeft: number
  result: MatchResult | null
  setChomp: (input: ChompInput) => void
  startPractice: () => void
  tick: (dt: number) => void
  backToLobby: () => void
}

function newMatchId(): string {
  return `local-${crypto.randomUUID()}`
}

function finish(state: GameState): Pick<GameState, 'ui' | 'result' | 'chompDown'> {
  const winner = pickWinner(state.scores)
  const result: MatchResult = {
    matchId: state.matchId,
    scores: { ...state.scores },
    addresses: {},
    winner,
    txHashes: [],
  }
  sfxEnd()
  return { ui: 'results', result, chompDown: emptyChomp() }
}

export const useGameStore = create<GameState>((set, get) => ({
  ui: 'lobby',
  matchId: '',
  pellets: [],
  scores: emptyScores(),
  neckExtend: emptyNecks(),
  chompDown: emptyChomp(),
  chompPulseUntil: 0,
  dumpT: 0,
  timeLeft: ROUND_SECONDS,
  result: null,

  setChomp: (input) => {
    const { ui } = get()
    if (ui !== 'playing' || input.seat !== HUMAN_SEAT) return
    set((s) => {
      if (input.down) {
        if (s.chompDown[input.seat]) return s
        sfxChomp()
        return {
          chompDown: { ...s.chompDown, [input.seat]: true },
          chompPulseUntil: 0,
        }
      }
      return {
        chompDown: { ...s.chompDown, [input.seat]: false },
        chompPulseUntil: performance.now() + 240,
      }
    })
  },

  startPractice: () => {
    set({
      ui: 'playing',
      matchId: newMatchId(),
      pellets: spawnPellets(),
      scores: emptyScores(),
      neckExtend: emptyNecks(),
      chompDown: emptyChomp(),
      chompPulseUntil: 0,
      dumpT: 0,
      timeLeft: ROUND_SECONDS,
      result: null,
    })
  },

  tick: (dt) => {
    const state = get()
    if (state.ui !== 'playing') return

    const dumpT = Math.min(1, state.dumpT + dt / 1.15)
    const timeLeft = Math.max(0, state.timeLeft - dt)
    const pulsing = performance.now() < state.chompPulseUntil
    const neckExtend = { ...state.neckExtend }
    for (const seat of SEATS) {
      const biting = state.chompDown[seat] || (seat === HUMAN_SEAT && pulsing)
      const target = biting ? 1 : 0
      const speed = biting ? 16 : 7
      const cur = neckExtend[seat]
      const next = cur + Math.sign(target - cur) * Math.min(Math.abs(target - cur), dt * speed)
      neckExtend[seat] = Math.max(0, Math.min(1, next))
    }

    let pellets = state.pellets
    let scores = state.scores
    let ate = false

    if (dumpT > 0.38) {
      for (const seat of SEATS) {
        const extend = neckExtend[seat]
        if (extend < 0.18) continue
        for (const pellet of pellets) {
          if (pellet.eatenBy !== undefined) continue
          if (!pelletInChompZone(pellet, seat, extend)) continue
          if (!ate) {
            pellets = pellets.map((p) => ({ ...p }))
            scores = { ...scores }
            ate = true
          }
          const live = pellets.find((p) => p.id === pellet.id)
          if (!live || live.eatenBy !== undefined) continue
          live.eatenBy = seat
          scores[seat] += pelletValue(live)
          sfxEat(live.golden)
        }
      }
    }

    const next: Partial<GameState> = { dumpT, timeLeft, neckExtend, pellets, scores }
    if (timeLeft <= 0 || allPelletsEaten(pellets)) {
      Object.assign(next, finish({ ...state, scores, pellets, matchId: state.matchId }))
    }
    set(next)
  },

  backToLobby: () => {
    set({
      ui: 'lobby',
      pellets: [],
      result: null,
      chompDown: emptyChomp(),
      chompPulseUntil: 0,
      neckExtend: emptyNecks(),
    })
  },
}))
