# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL is identity, assets, receipts, and settlement only — and **Phase 2 submits zero ledger transactions**.

**CRUMB on Testnet has no value.** Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md).

## How to run server + web

Requires **Node 22+** and [pnpm](https://pnpm.io/). Two terminals:

```bash
pnpm install
pnpm --filter server dev
```

```bash
pnpm --filter web dev
```

- Game server: `ws://localhost:2567` (Colyseus room name: **`hungry`**)
- Client: `http://localhost:5173`

### Practice vs AI (local, Phase 1)

1. Click **Practice vs AI**. This starts a local ~45s round. Empty seats are live AI, not idle dummies.
2. **CHOMP** with Space, click, or tap. You are seat 0, **BYTEBITE** (north, cyan).
3. Opponents use the **same** `ChompInput` as you: `{ seat, down, clientTime }`, piped through `setChomp`.
4. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5.
5. Round ends at ~45s or when the board is empty. Results are local only (`txHashes: []`).

### Quick Match (local Colyseus)

1. Start the server, then the web client.
2. Click **Quick Match**. You join room `hungry`. Humans fill seats first.
3. After a short wait, empty seats become Easy / Normal / Hungry AI from `packages/ai`.
4. The **server** decides eats. Client chomp / neck motion is cosmetic prediction.
5. Match start payload is `{ matchId, seats }`. Match end is `MatchResult` with `txHashes: []`.

### Private Room (code)

1. Click **Private Room** → **Create room**. Share the 5-character code.
2. A second browser **Join**s with that code (`GET /rooms/:code` then `joinById`).
3. Empty seats still AI-fill after the wait. Same `ChompInput`. Same authoritative eats.

Wallet connect remains a stub (Phase 3).

```bash
pnpm --filter web build
pnpm --filter @hhc/ai test
pnpm --filter server test
```

## Smoke: 4-seat fill

`pnpm --filter server test` starts HungryRoom on an ephemeral port, connects one human, fills the other three seats with AI, completes a shortened round, and asserts `MatchResult.txHashes === []` plus a `settleMatch` record (`xrplSubmitted: false`). A second test creates a private room, looks up the code, and joins by id.

## Locked beasts (not animals from any licensed table game)

| Seat | Side  | Name     | Color        |
| ---- | ----- | -------- | ------------ |
| 0    | North | BYTEBITE | cyan         |
| 1    | East  | RIPSAW   | magenta      |
| 2    | South | GOLDGRUB | chartreuse   |
| 3    | West  | BLOCKMAW | white / gold |

Placeholder boxes and capsules are required until original Blender meshes land. See [`docs/asset-brief.md`](docs/asset-brief.md).

## Hybrid architecture

- **Off-chain:** arena physics, chomp input, overlap eats, scoreboard, empty-seat AI, Colyseus HungryRoom.
- **On-chain later (not Phase 2):** XRPL Testnet identity, CRUMB / XLS-20 pellets, Payment-first settlement receipts.
- Default network is XRPL **Testnet**:
  - WebSocket `wss://s.altnet.rippletest.net:51233`
  - Faucet `https://faucet.altnet.rippletest.net/`
- The game server holds any treasury seed. The client never does.
- `settleMatch` is a REST/WS hook stub: it records `matchId` + 4 address slots + seat map and **does not** submit XRPL.

## Repo

```
apps/web          Playable Vite + React 18 + R3F client
apps/server       Colyseus HungryRoom (room name: hungry)
packages/shared   Seats, pellets, chomp input, match results
packages/xrpl     Testnet helpers stub — no writes
packages/ai       Easy / Normal / Hungry fill
assets/           Original art landing zone
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 2 scope

Authoritative Colyseus room, Quick Match, Private Room codes, AI fill for empty seats. No wallets, TrustLines, CRUMB issuance, NFTs, or XRPL submits.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
