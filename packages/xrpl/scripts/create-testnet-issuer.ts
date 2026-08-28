import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createDurableIssuer,
  envPathAtRepoRoot,
  loadDotEnv,
  PHASE3_THROWAWAY_ISSUER,
} from '../src/index.ts'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const envPath = envPathAtRepoRoot(repoRoot)

async function main(): Promise<void> {
  loadDotEnv(envPath)

  if (process.env.XRPL_ISSUER_ADDRESS === PHASE3_THROWAWAY_ISSUER) {
    console.info(
      `[xrpl] ignoring lost Phase 3 throwaway issuer ${PHASE3_THROWAWAY_ISSUER} (seed unavailable). Creating a new durable Testnet issuer.`,
    )
    delete process.env.XRPL_ISSUER_ADDRESS
    delete process.env.XRPL_ISSUER_SEED
  }

  const setup = await createDurableIssuer(envPath)
  console.info(`[xrpl] durable Testnet issuer address=${setup.issuer}`)
  console.info(`[xrpl] treasury address=${setup.treasury}`)
  console.info(`[xrpl] seeds stored in ${envPath} only (gitignored). Not printed.`)
  console.info(`[xrpl] reused=${setup.reused}`)
  for (const write of setup.writes) {
    console.info(
      `[xrpl] ${write.what} hash=${write.hash} ledgerIndex=${write.ledgerIndex ?? 'n/a'} result=${write.result}`,
    )
  }
  console.info('[xrpl] CRUMB on Testnet has no value. This is not money.')
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(msg.startsWith('BLOCKED:') ? msg : `BLOCKED: create-testnet-issuer: ${msg}`)
  process.exit(1)
})
