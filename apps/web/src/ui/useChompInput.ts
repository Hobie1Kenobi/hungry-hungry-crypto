import { useEffect } from 'react'
import { isChompKey } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useChompInput(): void {
  const setChompHeld = useGameStore((s) => s.setChompHeld)
  const ui = useGameStore((s) => s.ui)
  const localSeat = useGameStore((s) => s.localSeat)

  useEffect(() => {
    if (ui !== 'playing') return

    const send = (down: boolean) => {
      setChompHeld(down)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isChompKey(e.code, e.key) || isTypingTarget(e.target)) return
      e.preventDefault()
      send(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (!isChompKey(e.code, e.key) || isTypingTarget(e.target)) return
      e.preventDefault()
      send(false)
    }
    const onBlur = () => send(false)
    const onVis = () => {
      if (document.hidden) send(false)
    }

    const opts: AddEventListenerOptions = { capture: true }
    document.addEventListener('keydown', onKeyDown, opts)
    document.addEventListener('keyup', onKeyUp, opts)
    window.addEventListener('keydown', onKeyDown, opts)
    window.addEventListener('keyup', onKeyUp, opts)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('keydown', onKeyDown, opts)
      document.removeEventListener('keyup', onKeyUp, opts)
      window.removeEventListener('keydown', onKeyDown, opts)
      window.removeEventListener('keyup', onKeyUp, opts)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVis)
      send(false)
    }
  }, [setChompHeld, ui, localSeat])
}

export function pointerChomp(down: boolean): void {
  useGameStore.getState().setChompHeld(down)
}
