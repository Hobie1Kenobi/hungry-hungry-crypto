# Game Design Document — Hungry Hungry Crypto

Status: **Phase 2 locked.** Orchestrator: ATLAS. Owner: Hobie Cunningham.

## Pitch

Four original crypto-mascot beasts sit on the cardinal sides of a square **liquidity pond**. A hopper dumps a burst of XRP-styled chips. Players CHOMP. The hungriest ledger wins the round.

## Hybrid rule (non-negotiable)

Real-time physics and input are **off-chain**. XRPL is identity, assets, receipts, and settlement only. Phase 2 performs **zero** XRPL transactions.

## Players

- 1–4 humans. Empty seats become AI.
- Practice vs AI: **1 local human** at seat 0. Seats 1–3 are Easy / Normal / Hungry fill.
- Quick Match / Private Room: humans fill seats first (0, then 1, …). Remaining seats use `packages/ai`. All seats emit the same `ChompInput`: `{ seat, down, clientTime }`.

## Arena

- Square liquidity pond.
- Hopper above center dumps **20 normal + 1 GOLDEN** pellet (**21** total).
- Pellets are local meshes that look like XRP-branded chips. On-chain later = CRUMB / XLS-20. Phase 1: meshes only, no issuance.

## Beasts (locked)

| Seat | Side  | Name     | Color        | Phase 1 control      |
| ---- | ----- | -------- | ------------ | -------------------- |
| 0    | North | BYTEBITE | cyan         | Local human          |
| 1    | East  | RIPSAW   | magenta      | Easy AI              |
| 2    | South | GOLDGRUB | chartreuse   | Normal AI            |
| 3    | West  | BLOCKMAW | white / gold | Hungry AI            |

Placeholder boxes/capsules are required. Do not block on Blender.

## CHOMP

- Input: Space / click / tap (human) or `packages/ai` policies (fill).
- Same store path: `setChomp({ seat, down, clientTime })`.
- Neck extends toward the pond, jaws open.
- Practice: local eat on overlap. Online: **server-authoritative** eat; client predictions are cosmetic.

## Scoring and round

- Normal pellet = **1**.
- GOLDEN pellet = **5**.
- Round length ~**45 seconds** or until the board is empty.
- Winner = highest score (ties → lowest seat index).
- `MatchResult.txHashes` stays `[]` in Phase 2.

## Modes (lobby)

| Control        | Phase 2                                      |
| -------------- | -------------------------------------------- |
| Practice vs AI | **Live** — local round, AI fill seats 1–3    |
| Quick Match    | **Live** — local Colyseus `hungry` room      |
| Private Room   | **Live** — 5-character code, then AI fill    |
| Wallet         | Stub, labeled Phase 3                        |

## Shared types

Canonical TypeScript lives in `packages/shared` (`Seat`, `Address`, `Pellet`, `ChompInput`, `MatchResult`). Do not change their shapes.

## Phase map

| Phase | Ships                                              |
| ----- | -------------------------------------------------- |
| 0     | Scaffold, docs, playable local placeholder arena   |
| 1     | AI policy for empty seats (`packages/ai`)          |
| 2     | Colyseus HungryRoom (`hungry`), Quick Match, Private Room |
| 3     | Wallet / XRPL identity (Testnet)                   |
| 4     | CRUMB TrustLines, XLS-20, Payment-first settlement |
| Gate  | Mainnet only after Orchestrator Launch Gate        |

Phase 2 stops here. Do not add wallets or XRPL writes.

## Feel

Arcade, readable, slightly mean. Pond reads as a market. Chips read as liquidity. Beasts read as hungry machines, not licensed toys.
