import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function repoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
}

export function loadRepoEnv(): void {
  const candidates = [resolve(repoRoot(), '.env'), resolve(process.cwd(), '.env')]
  for (const file of candidates) {
    if (!existsSync(file)) continue
    try {
      process.loadEnvFile(file)
      return
    } catch {
      /* ignore malformed */
    }
  }
}
