const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const codeToRoom = new Map<string, string>()
const roomToCode = new Map<string, string>()

export function generateCode(): string {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    let code = ''
    for (let i = 0; i < 5; i += 1) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    if (!codeToRoom.has(code)) return code
  }
  return `X${Date.now().toString(36).slice(-4).toUpperCase()}`
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function registerRoomCode(code: string, roomId: string): void {
  const prev = roomToCode.get(roomId)
  if (prev) codeToRoom.delete(prev)
  codeToRoom.set(code, roomId)
  roomToCode.set(roomId, code)
}

export function lookupRoomId(code: string): string | undefined {
  return codeToRoom.get(normalizeCode(code))
}

export function unregisterRoom(roomId: string): void {
  const code = roomToCode.get(roomId)
  if (code) codeToRoom.delete(code)
  roomToCode.delete(roomId)
}

export function resetCodesForTests(): void {
  codeToRoom.clear()
  roomToCode.clear()
}
