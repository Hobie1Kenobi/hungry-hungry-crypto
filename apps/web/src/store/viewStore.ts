import { create } from 'zustand'

function queryDebugFlag(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return new URLSearchParams(window.location.search).get('debug') === '1'
  } catch {
    return false
  }
}

interface ViewState {
  debugTopDown: boolean
  debugQuery: boolean
  toggleDebugTopDown: () => void
  setDebugTopDown: (on: boolean) => void
}

export function showPracticeDebugChrome(state: Pick<ViewState, 'debugTopDown' | 'debugQuery'>): boolean {
  return state.debugTopDown || state.debugQuery
}

export const useViewStore = create<ViewState>((set) => ({
  debugTopDown: false,
  debugQuery: queryDebugFlag(),
  toggleDebugTopDown: () => set((s) => ({ debugTopDown: !s.debugTopDown })),
  setDebugTopDown: (on) => set({ debugTopDown: on }),
}))
