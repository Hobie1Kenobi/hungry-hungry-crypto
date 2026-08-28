# apps/server

Authoritative **HungryRoom** (Colyseus). Room name: `hungry`.

Humans fill seats 0–3 first. Empty seats become Easy / Normal / Hungry AI from `packages/ai`. Tick rate is **20 Hz**. The server decides eats. After `finishMatch`, `settleMatch` submits Payment-first CRUMB IOUs from the treasury to bound classic r-addresses that have a TrustLine. AI seats with no address skip. `xrplSubmitted` is true only for `tesSUCCESS` hashes.

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

Join options may include `{ address: 'r…' }`. The room binds that classic address to the Colyseus seat. After the round the server pays CRUMB if a TrustLine exists.

## Match flow

| Mode | Client call |
| ---- | ----------- |
| Quick Match | `joinOrCreate('hungry')` |
| Private Room | `create('hungry', { mode: 'private' })` then share the 5-character `code`. Joiners `GET /rooms/:code` and `joinById(roomId)`. |

Match start payload: `{ matchId, seats }`. Match end: `MatchResult` with `txHashes` set to real `tesSUCCESS` Payment hashes (empty when nobody is bound / TrustLined).

## Issuer + settled match (Testnet)

```bash
pnpm --filter @hhc/xrpl create-issuer
pnpm --filter server rehearse
```

## Smoke (4-seat fill)

```bash
pnpm --filter server test
```

Unit tests cover seat fill, desync clamp, private codes, payout planning, and settleMatch without live XRPL. The smoke script (`tsx src/smoke.ts`) starts HungryRoom, connects one human, fills 3 AI seats, completes a shortened unbound round (`txHashes: []`), then creates a private room and joins by code.
