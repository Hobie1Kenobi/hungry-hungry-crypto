import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createThrowawayIssuer,
  envPathAtRepoRoot,
  parseClassicAddress,
  storeIssuerInEnv,
} from '../src/index.ts'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const envPath = envPathAtRepoRoot(repoRoot)

async function main(): Promise<void> {
  const existing = parseClassicAddress(process.env.XRPL_ISSUER_ADDRESS)
  if (existing && process.env.XRPL_ISSUER_SEED) {
    console.info(`[xrpl] issuer already in env address=${existing}`)
    console.info('[xrpl] Phase 4 owns the durable issuer + CRUMB treasury issuance.')
    return
  }

  const { issuer, seed } = await createThrowawayIssuer()
  if (!seed) throw new Error('issuer wallet produced no seed')
  storeIssuerInEnv(envPath, issuer.address, seed)
  console.info(`[xrpl] throwaway Testnet issuer address=${issuer.address}`)
  console.info(`[xrpl] seed stored in ${envPath} only (gitignored). Not printed.`)
  if (issuer.faucet?.hash) {
    console.info(`[xrpl] faucet hash=${issuer.faucet.hash}`)
  }
  if (issuer.defaultRipple) {
    console.info(
      `[xrpl] DefaultRipple hash=${issuer.defaultRipple.hash} ledgerIndex=${issuer.defaultRipple.ledgerIndex ?? 'n/a'} result=${issuer.defaultRipple.result}`,
    )
  }
  console.info('[xrpl] Phase 4 owns the durable issuer + CRUMB treasury issuance. This issuer is throwaway TrustSet demo only.')
  console.info('[xrpl] CRUMB on Testnet has no value.')
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(msg.startsWith('BLOCKED:') ? msg : `BLOCKED: create-testnet-issuer: ${msg}`)
  process.exit(1)
})
