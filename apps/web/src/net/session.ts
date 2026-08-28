import { Client, type Room } from 'colyseus.js'
import type { ChompInput, MatchResult, MatchStart, Pellet, Seat, SeatOccupant } from '@hhc/shared'
import { ROOM_NAME } from '@hhc/shared'
import { useGameStore, type NetFrame } from '../store/gameStore'

const DEFAULT_WS = 'ws://localhost:2567'

let client: Client | null = null
let room: Room | null = null

export function gameServerUrl(): string {
  return import.meta.env.VITE_GAME_SERVER_URL || DEFAULT_WS
}

export function gameServerHttpUrl(): string {
  return gameServerUrl().replace(/^ws/i, 'http')
}

function getClient(): Client {
  const url = gameServerUrl()
  if (!client) client = new Client(url)
  return client
}

function occupantsFromState(state: { seats?: Array<{ seat: number; kind: string; personality?: string; sessionId?: string }> }): SeatOccupant[] {
  const seats = state.seats ? [...state.seats] : []
  return seats.map((row) => ({
    seat: row.seat as Seat,
    kind: row.kind === 'human' ? 'human' : 'ai',
    personality: row.personality as SeatOccupant['personality'],
    sessionId: row.sessionId || undefined,
  }))
}

function readFrame(state: {
  dumpT: number
  timeLeft: number
  score0: number
  score1: number
  score2: number
  score3: number
  neck0: number
  neck1: number
  neck2: number
  neck3: number
  chomp0: boolean
  chomp1: boolean
  chomp2: boolean
  chomp3: boolean
  pellets: Array<{ id: string; x: number; z: number; golden: boolean; eatenBy: number }>
}): NetFrame {
  const pellets: Pellet[] = [...state.pellets].map((p) => ({
    id: p.id,
    x: p.x,
    z: p.z,
    golden: p.golden,
    eatenBy: p.eatenBy < 0 ? undefined : (p.eatenBy as Seat),
  }))
  return {
    dumpT: state.dumpT,
    timeLeft: state.timeLeft,
    pellets,
    scores: { 0: state.score0, 1: state.score1, 2: state.score2, 3: state.score3 },
    neckExtend: { 0: state.neck0, 1: state.neck1, 2: state.neck2, 3: state.neck3 },
    chompDown: { 0: state.chomp0, 1: state.chomp1, 2: state.chomp2, 3: state.chomp3 },
  }
}

function explainConnectError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  return `Cannot reach the game server at ${gameServerUrl()}. Start it with: pnpm --filter server dev. ${raw}`
}

function bindRoom(joined: Room): void {
  room = joined
  useGameStore.getState().bindNet({
    send: (input: ChompInput) => {
      joined.send('chomp', input)
    },
    leave: () => {
      try {
        joined.leave()
      } catch {
        /* already left */
      }
      if (room === joined) room = null
    },
  })

  const code = String(joined.state.code ?? '')
  const mine = occupantsFromState(joined.state).find((s) => s.sessionId === joined.sessionId)
  useGameStore.getState().applyWelcome({
    seat: mine?.seat ?? useGameStore.getState().localSeat,
    roomCode: code,
  })
  if (joined.state.startAt) {
    useGameStore.getState().applyLobbySeats(
      occupantsFromState(joined.state),
      joined.state.startAt as number,
      code,
    )
  }

  joined.onMessage('welcome', (msg: { seat: Seat; roomCode?: string }) => {
    useGameStore.getState().applyWelcome(msg)
  })

  joined.onMessage('matchStart', (payload: MatchStart) => {
    const local =
      payload.seats.find((s) => s.sessionId === joined.sessionId)?.seat ??
      useGameStore.getState().localSeat
    useGameStore.getState().applyMatchStart(payload.matchId, payload.seats, local)
  })

  joined.onMessage('matchEnd', (result: MatchResult) => {
    useGameStore.getState().applyMatchEnd(result)
  })

  joined.onStateChange((state) => {
    const store = useGameStore.getState()
    if (state.phase === 'playing' && store.ui === 'playing') {
      store.applyNetFrame(readFrame(state))
    } else if (state.phase === 'lobby') {
      store.applyLobbySeats(
        occupantsFromState(state),
        state.startAt as number,
        (state.code as string) || store.roomCode,
      )
    }
  })

  joined.onError((_code, message) => {
    useGameStore.getState().setWaitError(message || 'Room error')
  })
}

export async function joinQuickMatch(): Promise<void> {
  const store = useGameStore.getState()
  store.beginWaiting({ queueMode: 'quick', hint: 'Quick Match · humans first, then AI fill' })
  try {
    const joined = await getClient().joinOrCreate(ROOM_NAME)
    bindRoom(joined)
  } catch (err) {
    store.setWaitError(explainConnectError(err))
  }
}

export async function createPrivateRoom(): Promise<void> {
  const store = useGameStore.getState()
  store.beginWaiting({ queueMode: 'private', hint: 'Private room · share the code' })
  try {
    const joined = await getClient().create(ROOM_NAME, { mode: 'private' })
    bindRoom(joined)
  } catch (err) {
    store.setWaitError(explainConnectError(err))
  }
}

export async function joinPrivateRoom(code: string): Promise<void> {
  const trimmed = code.trim().toUpperCase()
  const store = useGameStore.getState()
  store.beginWaiting({
    queueMode: 'private',
    hint: 'Joining private room…',
    roomCode: trimmed,
  })
  try {
    const res = await fetch(`${gameServerHttpUrl()}/rooms/${encodeURIComponent(trimmed)}`)
    if (!res.ok) {
      store.setWaitError(`No private room for code ${trimmed}.`)
      return
    }
    const body = (await res.json()) as { roomId: string }
    const joined = await getClient().joinById(body.roomId, { mode: 'private' })
    bindRoom(joined)
  } catch (err) {
    store.setWaitError(explainConnectError(err))
  }
}

export function replayOnline(): void {
  const mode = useGameStore.getState().queueMode
  useGameStore.getState().backToLobby()
  if (mode === 'quick') void joinQuickMatch()
  else if (mode === 'private') void createPrivateRoom()
}
