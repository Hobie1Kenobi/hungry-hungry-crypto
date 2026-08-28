import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function envPathAtRepoRoot(fromDir = process.cwd()): string {
  return resolve(fromDir, '.env')
}

export function defaultRepoEnvPath(): string {
  return envPathAtRepoRoot(resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..'))
}

export function loadDotEnv(envPath = defaultRepoEnvPath()): void {
  try {
    process.loadEnvFile(envPath)
  } catch {
    /* optional */
  }
}

export function upsertEnv(envPath: string, entries: Record<string, string>): void {
  let text = existsSync(envPath) ? readFileSync(envPath, 'utf8') : ''
  if (text.length > 0 && !text.endsWith('\n')) text += '\n'
  for (const [key, value] of Object.entries(entries)) {
    const line = `${key}=${value}`
    const re = new RegExp(`^${key}=.*$`, 'm')
    if (re.test(text)) text = text.replace(re, line)
    else text += `${line}\n`
  }
  writeFileSync(envPath, text, { encoding: 'utf8', mode: 0o600 })
}
