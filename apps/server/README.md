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

## Match flow

| Mode | Client call |
| ---- | ----------- |
| Quick Match | `joinOrCreate('hungry')` |
| Private Room | `create('hungry', { mode: 'private' })` then share the 5-character `code`. Joiners `GET /rooms/:code` and `joinById(roomId)`. |

Match start payload: `{ matchId, seats }`. Match end: `MatchResult` with `txHashes: []`.

## Smoke (4-seat fill)

```bash
pnpm --filter server test
```

Unit tests cover seat fill, desync clamp, private codes, and the settle stub. The smoke script (`tsx src/smoke.ts`) starts HungryRoom, connects one human, fills 3 AI seats, completes a shortened round (`txHashes: []`), then creates a private room and joins by code.
