import { loadRepoEnv } from './env'
import { DEFAULT_PORT, startServer } from './app'
import { issuerAddressFromEnv } from '@hhc/xrpl'

loadRepoEnv()

const port = Number(process.env.GAME_SERVER_PORT ?? DEFAULT_PORT)

const started = await startServer(port)
console.info(`[hhc-server] HungryRoom listening on ${started.port}`)
console.info(`[hhc-server] Colyseus room name: hungry`)
console.info(`[hhc-server] Quick Match: joinOrCreate('hungry')`)
console.info(`[hhc-server] Private Room: create('hungry', { mode: 'private' }) then GET /rooms/:code`)
console.info('[hhc-server] Phase 3: wallet identity + CRUMB TrustSet on Testnet. settleMatch still submits nothing.')
const issuer = issuerAddressFromEnv()
console.info(`[hhc-server] XRPL issuer ${issuer ?? '(unset — run pnpm --filter @hhc/xrpl create-issuer)'}`)
