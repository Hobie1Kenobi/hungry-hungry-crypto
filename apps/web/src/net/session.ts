import { Client, type Room } from 'colyseus.js'
import type { ChompInput, MatchResult, MatchStart, Seat, SeatOccupant } from '@hhc/shared'
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

  joined.onMessage('welcome', (msg: { seat: Seat; roomCode?: string; startAt?: number }) => {
    useGameStore.getState().applyWelcome(msg)
    if (msg.startAt) {
      useGameStore.getState().applyLobbySeats(useGameStore.getState().occupants, msg.startAt, msg.roomCode || '')
    }
  })

  joined.onMessage('lobby', (msg: { code?: string; startAt?: number; seats: SeatOccupant[] }) => {
    useGameStore.getState().applyLobbySeats(msg.seats, msg.startAt ?? 0, msg.code || '')
  })

  joined.onMessage('frame', (frame: NetFrame) => {
    useGameStore.getState().applyNetFrame(frame)
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
    if (store.ui === 'waiting' && state.phase === 'lobby') {
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

  joined.send('hello')
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
