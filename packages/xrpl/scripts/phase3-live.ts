import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Wallet } from 'xrpl'
import {
  createDurableIssuer,
  envPathAtRepoRoot,
  getBalances,
  loadDotEnv,
  parseClassicAddress,
  PHASE3_THROWAWAY_ISSUER,
  requestFaucet,
  setCrumbTrustline,
} from '../src/index.ts'

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')
const envPath = envPathAtRepoRoot(repoRoot)

async function main(): Promise<void> {
  loadDotEnv(envPath)

  if (process.env.XRPL_ISSUER_ADDRESS === PHASE3_THROWAWAY_ISSUER) {
    delete process.env.XRPL_ISSUER_ADDRESS
    delete process.env.XRPL_ISSUER_SEED
  }

  const setup = await createDurableIssuer(envPath)
  const issuerAddress = parseClassicAddress(setup.issuer)
  if (!issuerAddress) throw new Error('issuer address missing')
  console.info(`[xrpl] durable issuer ${issuerAddress}`)
  console.info(`[xrpl] treasury ${setup.treasury}`)
  for (const write of setup.writes) {
    console.info(
      `[xrpl] ${write.what} hash=${write.hash} ledgerIndex=${write.ledgerIndex ?? 'n/a'} result=${write.result}`,
    )
  }

  const guest = Wallet.generate()
  const address = guest.classicAddress
  console.info(`[xrpl] guest address=${address} (seed held in this process only, not printed)`)
  const fund = await requestFaucet(address as `r${string}`)
  if (fund.hash) console.info(`[xrpl] faucet hash=${fund.hash}`)
  const trust = await setCrumbTrustline(guest, issuerAddress)
  await getBalances(address as `r${string}`, issuerAddress)
  console.info(`[xrpl] TrustSet hash=${trust.hash} ledgerIndex=${trust.ledgerIndex ?? 'n/a'} result=${trust.result}`)
  console.info('[xrpl] CRUMB on Testnet has no value. This is not money.')
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(msg.startsWith('BLOCKED:') ? msg : `BLOCKED: phase3-live: ${msg}`)
  process.exit(1)
})
