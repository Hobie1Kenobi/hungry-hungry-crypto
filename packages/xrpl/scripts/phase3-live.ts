import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Wallet } from 'xrpl'
import {
  createThrowawayIssuer,
  enableDefaultRipple,
  envPathAtRepoRoot,
  getBalances,
  loadIssuerSeed,
  parseClassicAddress,
  requestFaucet,
  setCrumbTrustline,
  storeIssuerInEnv,
} from '../src/index.ts'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const envPath = envPathAtRepoRoot(repoRoot)

function loadDotEnv(): void {
  try {
    process.loadEnvFile(envPath)
  } catch {
    /* optional */
  }
}

async function main(): Promise<void> {
  loadDotEnv()

  let issuerAddress = parseClassicAddress(process.env.XRPL_ISSUER_ADDRESS)
  let loaded = loadIssuerSeed(process.env)
  if (!issuerAddress || !loaded) {
    const created = await createThrowawayIssuer(envPath)
    storeIssuerInEnv(envPath, created.issuer.address, created.seed)
    process.env.XRPL_ISSUER_ADDRESS = created.issuer.address
    process.env.XRPL_ISSUER_SEED = created.seed
    issuerAddress = created.issuer.address
    loaded = { address: created.issuer.address, seed: created.seed }
    console.info(`[xrpl] created throwaway issuer ${issuerAddress}`)
  } else {
    console.info(`[xrpl] using issuer ${issuerAddress}`)
    const issuerWallet = Wallet.fromSeed(loaded.seed)
    const ripple = await enableDefaultRipple(issuerWallet)
    console.info(
      `[xrpl] DefaultRipple hash=${ripple.hash} ledgerIndex=${ripple.ledgerIndex ?? 'n/a'} result=${ripple.result}`,
    )
  }

  if (!issuerAddress) throw new Error('issuer address missing')

  const guest = Wallet.generate()
  const address = guest.classicAddress
  console.info(`[xrpl] guest address=${address} (seed held in this process only, not printed)`)
  const fund = await requestFaucet(address as `r${string}`)
  if (fund.hash) console.info(`[xrpl] faucet hash=${fund.hash}`)
  const trust = await setCrumbTrustline(guest, issuerAddress)
  await getBalances(address as `r${string}`, issuerAddress)
  console.info(`[xrpl] TrustSet hash=${trust.hash} ledgerIndex=${trust.ledgerIndex ?? 'n/a'} result=${trust.result}`)
  console.info('[xrpl] CRUMB on Testnet has no value. Phase 4 owns durable issuer + treasury issuance.')
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(msg.startsWith('BLOCKED:') ? msg : `BLOCKED: phase3-live: ${msg}`)
  process.exit(1)
})
