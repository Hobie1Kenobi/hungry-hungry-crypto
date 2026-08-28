import { Client, type Room } from 'colyseus.js'
import type { Address, ChompInput, MatchResult, MatchStart, Seat, SeatOccupant } from '@hhc/shared'
import { ROOM_NAME } from '@hhc/shared'
import { useGameStore, type NetFrame } from '../store/gameStore'
import { useWalletStore } from '../wallet/walletStore'
import { gameServerHttpUrl, gameServerUrl } from './url'

export { gameServerHttpUrl, gameServerUrl }

let client: Client | null = null
let room: Room | null = null

function joinOpts(extra: Record<string, unknown> = {}): Record<string, unknown> {
  const address = useWalletStore.getState().address
  return address ? { ...extra, address } : extra
}

function sendBoundAddress(joined: Room): void {
  const address = useWalletStore.getState().address
  if (address) joined.send('bindAddress', { address })
}

function getClient(): Client {
  const url = gameServerUrl()
  if (!client) client = new Client(url)
  return client
}

function occupantsFromState(state: {
  seats?: Array<{ seat: number; kind: string; personality?: string; sessionId?: string; address?: string }>
}): SeatOccupant[] {
  const seats = state.seats ? [...state.seats] : []
  return seats.map((row) => ({
    seat: row.seat as Seat,
    kind: row.kind === 'human' ? 'human' : 'ai',
    personality: row.personality as SeatOccupant['personality'],
    sessionId: row.sessionId || undefined,
  }))
}

function addressesFromState(state: {
  seats?: Array<{ seat: number; address?: string }>
}): Partial<Record<Seat, Address>> | undefined {
  const seats = state.seats ? [...state.seats] : []
  const out: Partial<Record<Seat, Address>> = {}
  for (const row of seats) {
    if (row.address && row.address.startsWith('r')) out[row.seat as Seat] = row.address as Address
  }
  return Object.keys(out).length ? out : undefined
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
      addressesFromState(joined.state),
    )
  }

  joined.onMessage(
    'welcome',
    (msg: { seat: Seat; roomCode?: string; startAt?: number; address?: Address | null }) => {
      useGameStore.getState().applyWelcome(msg)
      if (msg.startAt) {
        useGameStore.getState().applyLobbySeats(
          useGameStore.getState().occupants,
          msg.startAt,
          msg.roomCode || '',
          useGameStore.getState().seatAddresses,
        )
      }
    },
  )

  joined.onMessage(
    'lobby',
    (msg: {
      code?: string
      startAt?: number
      seats: SeatOccupant[]
      addresses?: Partial<Record<Seat, Address>>
    }) => {
      useGameStore.getState().applyLobbySeats(msg.seats, msg.startAt ?? 0, msg.code || '', msg.addresses)
    },
  )

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
        addressesFromState(state),
      )
    }
  })

  joined.onError((_code, message) => {
    useGameStore.getState().setWaitError(message || 'Room error')
  })

  joined.send('hello')
  sendBoundAddress(joined)
}

export async function joinQuickMatch(): Promise<void> {
  const store = useGameStore.getState()
  store.beginWaiting({ queueMode: 'quick', hint: 'Quick Match · humans first, then AI fill' })
  try {
    const joined = await getClient().joinOrCreate(ROOM_NAME, joinOpts())
    bindRoom(joined)
  } catch (err) {
    store.setWaitError(explainConnectError(err))
  }
}

export async function createPrivateRoom(): Promise<void> {
  const store = useGameStore.getState()
  store.beginWaiting({ queueMode: 'private', hint: 'Private room · share the code' })
  try {
    const joined = await getClient().create(ROOM_NAME, joinOpts({ mode: 'private' }))
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
    const joined = await getClient().joinById(body.roomId, joinOpts({ mode: 'private' }))
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
