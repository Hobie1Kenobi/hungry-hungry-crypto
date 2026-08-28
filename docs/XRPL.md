# XRPL integration

Hungry Hungry Crypto is **hybrid**. The arena is not a smart contract. The ledger never simulates CHOMP.

## Phase 4

**Durable Testnet issuer + CRUMB treasury + Payment-first settlement.** After HungryRoom `finishMatch`, the **server** (never the client) submits CRUMB IOU Payment(s) from the treasury to bound classic `r…` addresses that have a TrustLine. AI seats with no address skip. `MatchResult.txHashes` is filled only with hashes that landed `tesSUCCESS`. `tec` codes are logged and are never recorded as success. One settlement after match end — not per pellet eat.

**Not in Phase 4:** Hooks, EVM sidechain, Mainnet. Trophy NFTs are an optional stub and must not block settlement.

**CRUMB on Testnet has no value. This is not money.**

Public hashes: [`PUBLIC_TESTNET_REPORT.md`](../PUBLIC_TESTNET_REPORT.md) and [`deployments/testnet.json`](../deployments/testnet.json).

## Default network: Testnet

| Role      | URL                                      |
| --------- | ---------------------------------------- |
| WebSocket | `wss://s.altnet.rippletest.net:51233`    |
| Faucet    | `https://faucet.altnet.rippletest.net/`  |
| Explorer  | `https://testnet.xrpl.org`               |

Config belongs in `.env` (see `.env.example`). Do not hardcode Mainnet URLs in app code.

## Currency

Product name: **CRUMB**. XRPL IOU codes are 3-character ISO or 160-bit hex. `CRUMB` is encoded as `4352554D42000000000000000000000000000000` toward issuer `XRPL_ISSUER_ADDRESS`.

## Writes

Every XRPL write in `packages/xrpl`:

1. `autofill`
2. `simulate` (skipped with the node error if the command is unavailable)
3. `submitAndWait`

Logs **hash**, **ledger index**, and `tesSUCCESS` or `tec` code. Hashes are never invented. If Testnet is down, the helper throws `BLOCKED:` plus the exact RPC/HTTP error.

Guest / issuer / treasury seeds live in server memory (and `.env`). They are never sent to other clients and never committed.

## Durable issuer + treasury

```bash
pnpm --filter @hhc/xrpl create-issuer
```

Creates a **new** Testnet issuer (faucet), enables DefaultRipple, faucets a treasury account, TrustSets CRUMB on the treasury, and issues treasury stock (issuer → treasury Payment). Prints r-addresses and hashes only.

Phase 3 throwaway issuer `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW` is TrustSet-demo only. Its seed lived on a destroyed cloud VM and is **not** reused.

Then:

```bash
pnpm --filter server rehearse
```

Guest faucet + TrustSet toward the new issuer, a 4-seat HungryRoom (1 human bound address + 3 AI), then `settleMatch` CRUMB Payment(s).

## What XRPL is for

- **Identity** — classic `r…` addresses bound to seats.
- **Assets** — CRUMB TrustLines toward the issuer; treasury stock issued as IOUs.
- **Receipts / settlement** — Payment-first CRUMB from treasury to bound TrustLined addresses after match end.

## What XRPL is not for (v1)

- **No Hooks.** v1 does not depend on XRPL Hooks for match logic or settlement.
- **No EVM sidechain.** v1 does not settle on XRPL EVM sidechain. Classic Testnet (then Mainnet after Launch Gate) only.
- **No client-held treasury.** The game server holds treasury and guest seeds. The browser never receives them. Placeholders in `.env.example` stay empty.

## Address type

Shared `Address` is `` `r${string}` `` — classic XRPL accounts only.

## Safety

- Never commit seeds, secret keys, or family seeds.
- Never spend real XRP from this repo.
- Never invent Testnet transaction hashes in docs or UI.
- Never Payment on every pellet eat.

## Phase 4 Testnet log

Real hashes from `pnpm --filter server rehearse` against `wss://s.altnet.rippletest.net:51233`. Never invented.

Durable issuer: `rNRohSqpNF6RUgCdvtrXqao1hMRcjK2x5b`  
Treasury: `rDYMbqXWZhNRccTbjcWMpHKmT2rUD5ks87`  
Guest: `rpHembF8Y3odbbZ3ZQFMn2UoSDMtkc9VGm`

| What | Hash | Ledger | Result |
| ---- | ---- | ------ | ------ |
| Issuer faucet | `C49A9724800E43A3C49A6AEBEE04A1F3CC0962ECAE9B4326794D3E42786205E9` | — | tesSUCCESS |
| AccountSet DefaultRipple | `7F20CF1B18D749B08FFC67483B82F57501F337AA228A85C8A4841726CA7251B0` | 20292068 | tesSUCCESS |
| Treasury faucet | `3B72C0D21E8EDE107961D1F23169BAF3E634F84025BDE86140A502525ECE659A` | — | tesSUCCESS |
| TrustSet CRUMB treasury | `48F54CE18DD0ACBEB1D11095922E26A6C4E7845D8593F020C74D44906DBC7AF6` | 20292070 | tesSUCCESS |
| Issue treasury CRUMB | `DBC605D5642B11E03C2FC1258C98DC275AA2A075798AEDD9B5DAD94B50DCE987` | 20292072 | tesSUCCESS |
| Guest faucet | `32B1273BA9E4D21FED865DB8334475CDB0146D844CFF693714BF0EDB0D5F5AC0` | — | tesSUCCESS |
| Guest TrustSet CRUMB | `C4F006F0DDFB91D453C18D4AF396F27D04FDF5298888938D1B49AF3083616766` | 20292089 | tesSUCCESS |
| settleMatch CRUMB Payment | `C7EF6B98CB3C8981605EA980D8E9D85D5A7544B1173C040B2F8B18CF69120795` | 20292092 | tesSUCCESS |

