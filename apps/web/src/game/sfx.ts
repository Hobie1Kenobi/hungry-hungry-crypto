let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(freq: number, dur: number, gain = 0.07, type: OscillatorType = 'square'): void {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.45), ac.currentTime + dur)
  amp.gain.setValueAtTime(gain, ac.currentTime)
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
  osc.connect(amp)
  amp.connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + dur)
}

export function sfxChomp(): void {
  blip(150, 0.11, 0.05, 'square')
}

export function sfxEat(golden: boolean): void {
  if (golden) {
    blip(660, 0.18, 0.06, 'triangle')
    blip(990, 0.22, 0.04, 'sine')
  } else {
    blip(420, 0.09, 0.05, 'triangle')
  }
}

export function sfxEnd(): void {
  blip(220, 0.28, 0.05, 'sawtooth')
}
