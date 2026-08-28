import { DEFAULT_PORT, startServer } from './app'

const port = Number(process.env.GAME_SERVER_PORT ?? DEFAULT_PORT)

const started = await startServer(port)
console.info(`[hhc-server] HungryRoom listening on ${started.port}`)
console.info(`[hhc-server] Colyseus room name: hungry`)
console.info(`[hhc-server] Quick Match: joinOrCreate('hungry')`)
console.info(`[hhc-server] Private Room: create('hungry', { mode: 'private' }) then GET /rooms/:code`)
console.info('[hhc-server] settleMatch stub records matchId + 4 addresses + seat map. No XRPL writes.')
