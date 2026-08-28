# Game Design Document — Hungry Hungry Crypto

Status: **Phase 0 locked.** Orchestrator: ATLAS. Owner: Hobie Cunningham.

## Pitch

Four original crypto-mascot beasts sit on the cardinal sides of a square **liquidity pond**. A hopper dumps a burst of XRP-styled chips. Players CHOMP. The hungriest ledger wins the round.

## Hybrid rule (non-negotiable)

Real-time physics and input are **off-chain**. XRPL is identity, assets, receipts, and settlement only. Phase 0 performs **zero** XRPL transactions.

## Players

- 1–4 humans. Empty seats become AI in a later phase.
- Phase 0: **1 local human** at seat 0. Seats 1–3 are idle dummy opponents.

## Arena

- Square liquidity pond.
- Hopper above center dumps **20 normal + 1 GOLDEN** pellet (**21** total).
- Pellets are local meshes that look like XRP-branded chips. On-chain later = CRUMB / XLS-20. Phase 0: meshes only, no issuance.

## Beasts (locked)

| Seat | Side  | Name     | Color        | Phase 0 control      |
| ---- | ----- | -------- | ------------ | -------------------- |
| 0    | North | BYTEBITE | cyan         | Local human          |
| 1    | East  | RIPSAW   | magenta      | Idle dummy           |
| 2    | South | GOLDGRUB | chartreuse   | Idle dummy           |
| 3    | West  | BLOCKMAW | white / gold | Idle dummy           |

Placeholder boxes/capsules are required. Do not block Phase 0 on Blender.

## CHOMP

- Input: Space / click / tap.
- Neck extends toward the pond, jaws open.
- Local eat on overlap with a pellet. No server authority in Phase 0.

## Scoring and round

- Normal pellet = **1**.
- GOLDEN pellet = **5**.
- Round length ~**45 seconds** or until the board is empty.
- Winner = highest score (ties → lowest seat index).
- `MatchResult.txHashes` stays `[]` in Phase 0.

## Modes (lobby)

| Control        | Phase 0                         |
| -------------- | ------------------------------- |
| Practice vs AI | **Live** — starts a local round |
| Quick Match    | Stub, labeled Phase 2           |
| Private Room   | Stub, labeled Phase 2           |
| Wallet         | Stub, labeled Phase 3           |

## Shared types

Canonical TypeScript lives in `packages/shared` (`Seat`, `Address`, `Pellet`, `ChompInput`, `MatchResult`).

## Phase map

| Phase | Ships                                              |
| ----- | -------------------------------------------------- |
| 0     | Scaffold, docs, playable local placeholder arena   |
| 1     | AI policy for empty seats (`packages/ai`)          |
| 2     | Colyseus rooms, Quick Match, Private Room          |
| 3     | Wallet / XRPL identity (Testnet)                   |
| 4     | CRUMB TrustLines, XLS-20, Payment-first settlement |
| Gate  | Mainnet only after Orchestrator Launch Gate        |

Phase 0 stops here.

## Feel

Arcade, readable, slightly mean. Pond reads as a market. Chips read as liquidity. Beasts read as hungry machines, not licensed toys.
