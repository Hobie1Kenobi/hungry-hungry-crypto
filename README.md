# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL Testnet is identity and Payment-first settlement: connect a wallet, set a CRUMB TrustLine, bind the classic `r…` address to a Colyseus seat. After `finishMatch` the **server** (never the client) submits CRUMB IOU Payment(s) from the treasury to bound addresses that have a TrustLine.

**CRUMB on Testnet has no value.** This is not money. Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md). Public Testnet log: [`PUBLIC_TESTNET_REPORT.md`](PUBLIC_TESTNET_REPORT.md).

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

Copy `.env.example` to `.env`. Never commit `.env` or seeds.

## Durable Testnet issuer + CRUMB treasury (once)

Phase 3 throwaway issuer `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW` is TrustSet-demo only. Its seed is not available. Create a **new** durable issuer:

```bash
pnpm --filter @hhc/xrpl create-issuer
```

This faucets a Testnet issuer, enables **DefaultRipple**, faucets a server-held treasury, TrustSets CRUMB on the treasury, and issues treasury stock (IOU Payment from issuer → treasury). It prints r-addresses and tx hashes only. Seeds are stored in `.env` as `XRPL_ISSUER_SEED` / `XRPL_TREASURY_SEED` (gitignored). **Never print seeds.**

Then run a 4-seat HungryRoom and settle:

```bash
pnpm --filter server rehearse
```

That script: create-issuer (or reuse) → guest faucet + TrustSet → HungryRoom (1 human bound address + 3 AI, short round) → `settleMatch` submits at least one CRUMB Payment → writes [`deployments/testnet.json`](deployments/testnet.json) and [`PUBLIC_TESTNET_REPORT.md`](PUBLIC_TESTNET_REPORT.md).

If Testnet/faucet is down the script exits `BLOCKED:` with the exact error. Hashes are never invented.

### Connect a wallet and set a TrustLine

1. Open `http://localhost:5173`. The lobby **Wallet** control is live.
2. Pick one path (all Testnet):
   - **Crossmark** — browser extension. Switch Crossmark to XRPL Testnet, connect, then **TrustSet CRUMB**.
   - **Xaman** — opens a TrustSet sign-request link (`xaman.app/detect/…` / xApp deeplink). Use Testnet in Xaman, paste your `r…` address, then refresh.
   - **Guest** — first-time play. **Guest wallet** generates a Testnet account **on the game server**. **Get Test XRP** hits `https://faucet.altnet.rippletest.net/`. Then **TrustSet CRUMB**. The guest seed lives only in server memory / `.env`. It is never written to git and never sent to other clients.
3. The lobby shows your classic r-address. After TrustSet, Quick Match / Private Room bind `Address r…` ↔ Colyseus seat.
4. Practice vs AI still runs locally (no ledger writes). Online eats stay **server-authoritative**. After the round the server pays CRUMB to bound TrustLined addresses.

Explorer: [testnet.xrpl.org](https://testnet.xrpl.org). WebSocket: `wss://s.altnet.rippletest.net:51233` only.

### Practice vs AI (local)

1. Click **Practice vs AI**. This starts a local ~45s round. Empty seats are live AI, not idle dummies.
2. **CHOMP** with Space, click, or tap. You are seat 0, **BYTEBITE** (north, cyan).
3. Opponents use the **same** `ChompInput` as you: `{ seat, down, clientTime }`, piped through `setChomp`.
4. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5.
5. Round ends at ~45s or when the board is empty. Results are local only (`txHashes: []`).

### Quick Match (local Colyseus)

1. Start the server, then the web client. Connect a wallet first if you want CRUMB settlement.
2. Click **Quick Match**. You join room `hungry`. Humans fill seats first.
3. After a short wait, empty seats become Easy / Normal / Hungry AI from `packages/ai`.
4. The **server** decides eats. Client chomp / neck motion is cosmetic prediction.
5. Match start payload is `{ matchId, seats }`. Match end is `MatchResult` with `txHashes` populated only for `tesSUCCESS` CRUMB Payments.

### Private Room (code)

1. Click **Private Room** → **Create room**. Share the 5-character code.
2. A second browser **Join**s with that code (`GET /rooms/:code` then `joinById`).
3. Empty seats still AI-fill after the wait. Same `ChompInput`. Same authoritative eats. Same Payment-first settlement.

```bash
pnpm --filter web build
pnpm --filter @hhc/ai test
pnpm --filter @hhc/xrpl test
pnpm --filter server test
```

Faucet + TrustSet only:

```bash
pnpm --filter @hhc/xrpl live
```

## Smoke: 4-seat fill

`pnpm --filter server test` starts HungryRoom on an ephemeral port, connects one human, fills the other three seats with AI, completes a shortened round, and asserts an unbound match does **not** submit Payments (`txHashes: []`, `xrplSubmitted: false`). It also creates a private room, looks up the code, joins by id, and binds a sample r-address to a seat.

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
- **On-chain this phase:** XRPL Testnet identity, CRUMB TrustSet, treasury issuance, Payment-first `settleMatch` after match end.
- Default network is XRPL **Testnet**:
  - WebSocket `wss://s.altnet.rippletest.net:51233`
  - Faucet `https://faucet.altnet.rippletest.net/`
  - Explorer `https://testnet.xrpl.org`
- The game server holds treasury and guest seeds. The client never does.
- `settleMatch` is server-only. It Payment-first sends CRUMB from the treasury to bound classic r-addresses that have a TrustLine. AI seats with no address skip. `xrplSubmitted` is true only for hashes that landed `tesSUCCESS`. `tec` codes are logged, never faked as success. One settlement after match end — not per pellet.

## Repo

```
apps/web          Playable Vite + React 18 + R3F client
apps/server       Colyseus HungryRoom (room name: hungry) + guest faucet/TrustSet + settleMatch
packages/shared   Seats, pellets, chomp input, match results
packages/xrpl     Testnet config, faucet, TrustSet, issuer, treasury, Payments
packages/ai       Easy / Normal / Hungry fill
assets/           Original art landing zone
deployments/      Public Testnet issuer + hashes (no seeds)
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 4 scope

Durable Testnet issuer, CRUMB treasury stock, Payment-first settlement after HungryRoom `finishMatch`. No Hooks. No EVM sidechain. Trophy NFTs are optional and must not block. No Mainnet.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
