import { create } from 'zustand'
import type { Seat } from '@hhc/shared'

export interface EatJuice {
  id: number
  seat: Seat
  x: number
  z: number
  golden: boolean
  at: number
}

export interface SplashJuice {
  id: number
  x: number
  z: number
  at: number
}

interface JuiceState {
  eats: EatJuice[]
  splashes: SplashJuice[]
  misses: Record<Seat, number>
  dumpAt: number
  shakeAt: number
  popSeq: number
  notifyEat: (seat: Seat, x: number, z: number, golden: boolean) => void
  notifyMiss: (seat: Seat) => void
  notifyDump: () => void
  notifySplash: (x: number, z: number) => void
}

let nextId = 1

export const useJuiceStore = create<JuiceState>((set) => ({
  eats: [],
  splashes: [],
  misses: { 0: 0, 1: 0, 2: 0, 3: 0 },
  dumpAt: 0,
  shakeAt: 0,
  popSeq: 0,
  notifyEat: (seat, x, z, golden) => {
    const at = performance.now()
    set((s) => ({
      eats: [...s.eats.slice(-16), { id: nextId++, seat, x, z, golden, at }],
      splashes: [...s.splashes.slice(-20), { id: nextId++, x, z, at }],
      shakeAt: at,
      popSeq: s.popSeq + 1,
    }))
  },
  notifyMiss: (seat) => {
    set((s) => ({ misses: { ...s.misses, [seat]: performance.now() } }))
  },
  notifyDump: () => {
    const at = performance.now()
    set((s) => ({
      dumpAt: at,
      splashes: [...s.splashes.slice(-20), { id: nextId++, x: 0, z: 0, at }],
    }))
  },
  notifySplash: (x, z) => {
    const at = performance.now()
    set((s) => ({
      splashes: [...s.splashes.slice(-20), { id: nextId++, x, z, at }],
    }))
  },
}))
