const DEFAULT_WS = 'ws://localhost:2567'

export function gameServerUrl(): string {
  return import.meta.env.VITE_GAME_SERVER_URL || DEFAULT_WS
}

export function gameServerHttpUrl(): string {
  return gameServerUrl().replace(/^ws/i, 'http')
}
