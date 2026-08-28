# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL is identity, assets, receipts, and settlement only — and **Phase 1 submits zero ledger transactions**.

**CRUMB on Testnet has no value.** Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md).

## How to run Practice vs AI (live opponents)

Requires Node 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm --filter web dev
```

Open `http://localhost:5173`.

1. Click **Practice vs AI**. This starts a local ~45s round. Empty seats are live AI, not idle dummies.
2. **CHOMP** with Space, click, or tap. You are seat 0, **BYTEBITE** (north, cyan).
3. Opponents use the **same** `ChompInput` as you: `{ seat, down, clientTime }`, piped through `setChomp`.
4. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5. AI seats can and should post non-zero scores.
5. Round ends at ~45s or when the board is empty. Results are local only (`txHashes: []`).

Default fill:

| Seat | Beast    | Control |
| ---- | -------- | ------- |
| 0    | BYTEBITE | You     |
| 1    | RIPSAW   | Easy (reaction delay + random mash) |
| 2    | GOLDGRUB | Normal (nearest pellet to own mouth + cooldown) |
| 3    | BLOCKMAW | Hungry (dump/land path-predict, contests GOLDEN) |

**Quick Match** and **Private Room** are lobby stubs (Phase 2). Wallet connect is a stub (Phase 3).

```bash
pnpm --filter web build
pnpm --filter @hhc/ai test
```

## Locked beasts (not animals from any licensed table game)

| Seat | Side  | Name     | Color        |
| ---- | ----- | -------- | ------------ |
| 0    | North | BYTEBITE | cyan         |
| 1    | East  | RIPSAW   | magenta      |
| 2    | South | GOLDGRUB | chartreuse   |
| 3    | West  | BLOCKMAW | white / gold |

Placeholder boxes and capsules are required until original Blender meshes land. See [`docs/asset-brief.md`](docs/asset-brief.md).

## Hybrid architecture

- **Off-chain:** arena physics, chomp input, overlap eats, scoreboard, empty-seat AI.
- **On-chain later (not Phase 1):** XRPL Testnet identity, CRUMB / XLS-20 pellets, Payment-first settlement receipts.
- Default network is XRPL **Testnet**:
  - WebSocket `wss://s.altnet.rippletest.net:51233`
  - Faucet `https://faucet.altnet.rippletest.net/`
- The game server holds any treasury seed. The client never does.

## Repo

```
apps/web          Playable Vite + React 18 + R3F client
apps/server       Phase 2 room stub (no Colyseus yet)
packages/shared   Seats, pellets, chomp input, match results
packages/xrpl     Testnet helpers stub — no writes
packages/ai       Easy / Normal / Hungry fill
assets/           Original art landing zone
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 1 scope

Live local Practice vs AI. No Colyseus rooms, wallets, TrustLines, CRUMB issuance, or NFTs. Stubs and docs exist so later phases have a home.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
