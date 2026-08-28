import { useEffect } from 'react'
import { HUMAN_SEAT } from '@hhc/shared'
import { useGameStore } from '../store/gameStore'

export function useChompInput(): void {
  const setChomp = useGameStore((s) => s.setChomp)
  const ui = useGameStore((s) => s.ui)

  useEffect(() => {
    if (ui !== 'playing') return

    const send = (down: boolean) => {
      setChomp({ seat: HUMAN_SEAT, down, clientTime: performance.now() })
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      e.preventDefault()
      if (e.repeat) return
      send(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      e.preventDefault()
      send(false)
    }
    const onBlur = () => send(false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      send(false)
    }
  }, [setChomp, ui])
}

export function pointerChomp(down: boolean): void {
  useGameStore.getState().setChomp({
    seat: HUMAN_SEAT,
    down,
    clientTime: performance.now(),
  })
}
