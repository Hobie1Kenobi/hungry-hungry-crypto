import { useEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { isChompKey } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

const heldKeys = new Set<string>()
let pointerLatched = false

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function syncHeld(): void {
  useGameStore.getState().setChompHeld(pointerLatched || heldKeys.size > 0)
}

function clearAllHolds(): void {
  heldKeys.clear()
  pointerLatched = false
  syncHeld()
}

export function bindChompPointer(event: ReactPointerEvent<HTMLElement>): void {
  event.preventDefault()
  event.stopPropagation()
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch {
    /* capture is best-effort; the latch does not need pointerup */
  }
  pointerLatched = !pointerLatched
  syncHeld()
}

export function releaseChompPointer(event: ReactPointerEvent<HTMLElement>): void {
  event.preventDefault()
  try {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  } catch {
    /* release is best-effort */
  }
}

export function pointerChomp(down: boolean): void {
  pointerLatched = down
  syncHeld()
}

export function useChompInput(): void {
  const setChompHeld = useGameStore((s) => s.setChompHeld)
  const ui = useGameStore((s) => s.ui)
  const localSeat = useGameStore((s) => s.localSeat)

  useEffect(() => {
    if (ui !== 'playing') return

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isChompKey(e.code, e.key) || isTypingTarget(e.target)) return
      e.preventDefault()
      if (e.repeat) return
      heldKeys.add('Space')
      syncHeld()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (!isChompKey(e.code, e.key)) return
      e.preventDefault()
      if (!heldKeys.delete('Space')) return
      syncHeld()
    }
    const onVis = () => {
      if (document.hidden) clearAllHolds()
    }

    const opts: AddEventListenerOptions = { capture: true }
    document.addEventListener('keydown', onKeyDown, opts)
    document.addEventListener('keyup', onKeyUp, opts)
    window.addEventListener('keydown', onKeyDown, opts)
    window.addEventListener('keyup', onKeyUp, opts)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('keydown', onKeyDown, opts)
      document.removeEventListener('keyup', onKeyUp, opts)
      window.removeEventListener('keydown', onKeyDown, opts)
      window.removeEventListener('keyup', onKeyUp, opts)
      document.removeEventListener('visibilitychange', onVis)
      clearAllHolds()
    }
  }, [setChompHeld, ui, localSeat])
}
