# XRPL integration

Hungry Hungry Crypto is **hybrid**. The arena is not a smart contract. The ledger never simulates CHOMP.

## Phase 2

**Zero XRPL transactions.** No `xrpl.js` submits, no Payments, no TrustSet, no NFTokenMint, no escrow. `packages/xrpl` is a Testnet-config stub. `MatchResult.txHashes` is always empty. `settleMatch` records matchId + 4 address slots + seat map only.

## Default network: Testnet

| Role      | URL                                      |
| --------- | ---------------------------------------- |
| WebSocket | `wss://s.altnet.rippletest.net:51233`    |
| Faucet    | `https://faucet.altnet.rippletest.net/`  |

Config belongs in `.env` (see `.env.example`). Do not hardcode Mainnet URLs in app code.

**CRUMB on Testnet has no value.**

## What XRPL is for (later phases)

- **Identity** — classic `r…` addresses bound to seats.
- **Assets** — CRUMB issued IOU / XLS-20 pellet representations.
- **Receipts** — settlement hashes recorded on `MatchResult.txHashes`.
- **Settlement** — **Payment-first**. A match result becomes one or more Payment transactions from the game treasury or between seats as the economy spec lands.

## What XRPL is not for (v1)

- **No Hooks.** v1 does not depend on XRPL Hooks for match logic or settlement.
- **No EVM sidechain.** v1 does not settle on XRPL EVM sidechain. Classic Testnet (then Mainnet after Launch Gate) only.
- **No client-held treasury.** The game server holds the treasury seed. The browser never receives it. Placeholders in `.env.example` stay empty.

## Address type

Shared `Address` is `` `r${string}` `` — classic XRPL accounts only.

## Safety

- Never commit seeds, secret keys, or family seeds.
- Never spend real XRP from this repo.
- Never invent Testnet transaction hashes in docs or UI.
