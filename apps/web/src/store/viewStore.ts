import { create } from 'zustand'

interface ViewState {
  debugTopDown: boolean
  toggleDebugTopDown: () => void
  setDebugTopDown: (on: boolean) => void
}

export const useViewStore = create<ViewState>((set) => ({
  debugTopDown: false,
  toggleDebugTopDown: () => set((s) => ({ debugTopDown: !s.debugTopDown })),
  setDebugTopDown: (on) => set({ debugTopDown: on }),
}))
