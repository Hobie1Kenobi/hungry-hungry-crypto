# apps/server

Authoritative **HungryRoom** (Colyseus). Room name: `hungry`.

Humans fill seats 0–3 first. Empty seats become Easy / Normal / Hungry AI from `packages/ai`. Tick rate is **20 Hz**. The server decides eats. `settleMatch` records `matchId`, four address slots, and the seat map — it does **not** submit XRPL.

## Run

From the repo root (Node 22+):

```bash
pnpm install
pnpm --filter server dev
```

Listens on `ws://localhost:2567` (override with `GAME_SERVER_PORT`).

Health: `GET http://localhost:2567/health`  
XRPL config: `GET http://localhost:2567/xrpl/config`  
Guest Testnet wallet: `POST /wallet/guest` then `POST /wallet/guest/fund` and `POST /wallet/guest/trustline` with `sessionId`. The guest seed stays in server memory and is never returned.

Join options may include `{ address: 'r…' }`. The room binds that classic address to the Colyseus seat. `settleMatch` still records addresses and **does not** submit Payments.

## Match flow

| Mode | Client call |
| ---- | ----------- |
| Quick Match | `joinOrCreate('hungry')` |
| Private Room | `create('hungry', { mode: 'private' })` then share the 5-character `code`. Joiners `GET /rooms/:code` and `joinById(roomId)`. |

Match start payload: `{ matchId, seats }`. Match end: `MatchResult` with `txHashes: []` and any bound r-addresses.

## Smoke (4-seat fill)

```bash
pnpm --filter server test
```

Unit tests cover seat fill, desync clamp, private codes, and the settle stub. The smoke script (`tsx src/smoke.ts`) starts HungryRoom, connects one human, fills 3 AI seats, completes a shortened round (`txHashes: []`), then creates a private room and joins by code.
