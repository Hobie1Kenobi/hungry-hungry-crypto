import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useChompInput(): void {
  const setChomp = useGameStore((s) => s.setChomp)
  const ui = useGameStore((s) => s.ui)
  const localSeat = useGameStore((s) => s.localSeat)

  useEffect(() => {
    if (ui !== 'playing') return

    const send = (down: boolean) => {
      setChomp({ seat: localSeat, down, clientTime: performance.now() })
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
  }, [setChomp, ui, localSeat])
}

export function pointerChomp(down: boolean): void {
  const { localSeat, setChomp } = useGameStore.getState()
  setChomp({
    seat: localSeat,
    down,
    clientTime: performance.now(),
  })
}
