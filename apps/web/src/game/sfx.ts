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

function noiseBurst(dur: number, gain: number, freq: number, type: BiquadFilterType = 'lowpass'): void {
  const ac = audio()
  if (!ac) return
  const n = Math.max(1, Math.floor(ac.sampleRate * dur))
  const buf = ac.createBuffer(1, n, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < n; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / n)
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(freq, ac.currentTime)
  const amp = ac.createGain()
  amp.gain.setValueAtTime(gain, ac.currentTime)
  amp.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
  src.connect(filter)
  filter.connect(amp)
  amp.connect(ac.destination)
  src.start()
}

export function sfxChompWhoosh(): void {
  noiseBurst(0.14, 0.05, 720, 'bandpass')
  blip(180, 0.12, 0.04, 'sawtooth')
}

export function sfxJawSnap(): void {
  blip(210, 0.07, 0.055, 'square')
  noiseBurst(0.05, 0.03, 1400, 'highpass')
}

export function sfxTeethMiss(): void {
  blip(880, 0.045, 0.035, 'square')
  blip(620, 0.06, 0.025, 'triangle')
}

export function sfxGulp(): void {
  blip(140, 0.11, 0.05, 'sine')
  blip(90, 0.14, 0.03, 'triangle')
}

export function sfxChipClack(): void {
  noiseBurst(0.04, 0.04, 2400, 'highpass')
  blip(520, 0.05, 0.03, 'square')
}

export function sfxSplashSmall(): void {
  noiseBurst(0.1, 0.035, 900, 'bandpass')
  blip(260, 0.08, 0.02, 'sine')
}

export function sfxHopperDump(): void {
  noiseBurst(0.18, 0.045, 420, 'lowpass')
  blip(110, 0.16, 0.04, 'sawtooth')
}

export function sfxGoldenChime(): void {
  blip(660, 0.2, 0.055, 'triangle')
  blip(990, 0.24, 0.04, 'sine')
  blip(1320, 0.18, 0.025, 'sine')
}

export function sfxWinSting(): void {
  blip(330, 0.16, 0.045, 'triangle')
  blip(494, 0.22, 0.04, 'triangle')
  blip(660, 0.32, 0.035, 'sine')
}

export function sfxChomp(): void {
  sfxChompWhoosh()
}

export function sfxEat(golden: boolean): void {
  sfxChipClack()
  sfxGulp()
  if (golden) sfxGoldenChime()
}

export function sfxEnd(): void {
  sfxWinSting()
}
