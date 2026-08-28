import { create } from 'zustand'
import type { ChompInput, MatchResult, Pellet, Seat } from '@hhc/shared'
import {
  DUMP_SECONDS,
  ROUND_SECONDS,
  allPelletsEaten,
  applyChompInput,
  collectEats,
  emptyChomp,
  emptyNecks,
  emptyPulse,
  emptyScores,
  pelletValue,
  pickWinner,
  stepNeckExtend,
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
  chompPulseUntil: Record<Seat, number>
  dumpT: number
  timeLeft: number
  result: MatchResult | null
  setChomp: (input: ChompInput) => void
  startPractice: () => void
  tick: (dt: number, now?: number) => void
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
  chompPulseUntil: emptyPulse(),
  dumpT: 0,
  timeLeft: ROUND_SECONDS,
  result: null,

  setChomp: (input) => {
    const { ui } = get()
    if (ui !== 'playing') return
    set((s) => {
      const applied = applyChompInput(s.chompDown, s.chompPulseUntil, input, input.clientTime)
      if (!applied) return s
      if (applied.started) sfxChomp()
      return {
        chompDown: applied.chompDown,
        chompPulseUntil: applied.chompPulseUntil,
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
      chompPulseUntil: emptyPulse(),
      dumpT: 0,
      timeLeft: ROUND_SECONDS,
      result: null,
    })
  },

  tick: (dt, now = performance.now()) => {
    const state = get()
    if (state.ui !== 'playing') return

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
        sfxEat(live.golden)
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
      chompPulseUntil: emptyPulse(),
      neckExtend: emptyNecks(),
    })
  },
}))
