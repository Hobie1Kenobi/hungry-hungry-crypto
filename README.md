# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL is identity, assets, receipts, and settlement only — and **Phase 0 submits zero ledger transactions**.

**CRUMB on Testnet has no value.** Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md).

## How to run (Phase 0)

Requires Node 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm --filter web dev
```

Open `http://localhost:5173`.

1. Click **Practice vs AI** (local round — opponents are idle dummies this phase).
2. **CHOMP** with Space, click, or tap. You are seat 0, **BYTEBITE** (north, cyan).
3. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5.
4. Round ends at ~45s or when the board is empty. Results are local only (`txHashes: []`).

**Quick Match** and **Private Room** are lobby stubs (Phase 2). Wallet connect is a stub (Phase 3).

```bash
pnpm --filter web build
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

- **Off-chain:** arena physics, chomp input, overlap eats, scoreboard.
- **On-chain later (not Phase 0):** XRPL Testnet identity, CRUMB / XLS-20 pellets, Payment-first settlement receipts.
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
packages/ai       Empty-seat AI stub — idle in Phase 0
assets/           Original art landing zone
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 0 scope

Working local arena only. No Colyseus rooms, wallets, TrustLines, CRUMB issuance, or NFTs. Stubs and docs exist so later phases have a home.

This repository is **Phase 0**. Further phases are out of scope until ATLAS says otherwise.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
