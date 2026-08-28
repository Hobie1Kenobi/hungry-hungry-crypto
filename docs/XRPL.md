# XRPL integration

Hungry Hungry Crypto is **hybrid**. The arena is not a smart contract. The ledger never simulates CHOMP.

## Phase 3

**Identity + TrustLine on XRPL Testnet.** Connect Crossmark, Xaman, or a server-hosted guest wallet. Fund guest dust from the Testnet faucet. Submit a CRUMB TrustSet toward `XRPL_ISSUER_ADDRESS`. Bind the classic `r…` address to a Colyseus seat.

**Not in Phase 3:** match settlement Payments, CRUMB issuance to winners, trophy NFTs, Hooks, EVM sidechain, Mainnet.

`settleMatch` still records `matchId` + 4 address slots + seat map with `xrplSubmitted: false`. `MatchResult.txHashes` stays `[]`.

## Default network: Testnet

| Role      | URL                                      |
| --------- | ---------------------------------------- |
| WebSocket | `wss://s.altnet.rippletest.net:51233`    |
| Faucet    | `https://faucet.altnet.rippletest.net/`  |
| Explorer  | `https://testnet.xrpl.org`               |

Config belongs in `.env` (see `.env.example`). Do not hardcode Mainnet URLs in app code.

**CRUMB on Testnet has no value.**

## Currency

Product name: **CRUMB**. XRPL IOU codes are 3-character ISO or 160-bit hex. `CRUMB` is encoded as `4352554D42000000000000000000000000000000` toward issuer `XRPL_ISSUER_ADDRESS`.

## Writes

Every XRPL write in `packages/xrpl`:

1. `autofill`
2. `simulate` (skipped with the node error if the command is unavailable)
3. `submitAndWait`

Logs **hash**, **ledger index**, and `tesSUCCESS` or `tec` code. Hashes are never invented. If Testnet is down, the helper throws `BLOCKED:` plus the exact RPC/HTTP error.

Guest seeds live in server memory (and optionally `.env`). They are never sent to other clients and never committed.

## Throwaway issuer

If no issuer exists yet:

```bash
pnpm --filter @hhc/xrpl create-issuer
```

This faucets a throwaway Testnet account, sets DefaultRipple, prints the r-address, and stores the seed in `.env` only. **Phase 4 owns the durable issuer and CRUMB treasury issuance.**

## What XRPL is for

- **Identity** — classic `r…` addresses bound to seats.
- **Assets (Phase 3)** — CRUMB TrustLines toward the issuer.
- **Assets (Phase 4)** — CRUMB issued IOU / XLS-20 pellet representations.
- **Receipts / settlement (Phase 4)** — Payment-first. Not this phase.

## What XRPL is not for (v1)

- **No Hooks.** v1 does not depend on XRPL Hooks for match logic or settlement.
- **No EVM sidechain.** v1 does not settle on XRPL EVM sidechain. Classic Testnet (then Mainnet after Launch Gate) only.
- **No client-held treasury.** The game server holds treasury and guest seeds. The browser never receives them. Placeholders in `.env.example` stay empty.

## Address type

Shared `Address` is `` `r${string}` `` — classic XRPL accounts only.

## Phase 3 Testnet log

Real hashes from `pnpm --filter @hhc/xrpl live` against `wss://s.altnet.rippletest.net:51233`. Never invented.

Throwaway issuer: `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW`  
Guest: `r4McfvYaDywCH4157ZXTD2DFJZd6p1hVaq`

| What | Hash | Ledger | Result |
| ---- | ---- | ------ | ------ |
| Issuer faucet | `6A6327085E90F90E40C4750ABA21482F5B144999918B1FBB2AAD6C4AB5ACD0C4` | — | tesSUCCESS |
| AccountSet DefaultRipple | `49D31329D39F8CBB760CD69DC1EDF7CBC60EFB7F2794AE41811C6A3E80E61608` | 20291720 | tesSUCCESS |
| Guest faucet | `4A3E9C804EEAD464724EFCA218C3EC081F3F35943720D8C83ECAEA30264D94BA` | — | tesSUCCESS |
| Guest faucet (lobby) | `11D7626BF19C68DC6EE13F29F75D2713E7181A68254B3AAB41256D6E6359FD13` | — | tesSUCCESS |
| TrustSet CRUMB | `37F37EECCA35F0F367720924228CB7FCC89F8AB21052E3CFE87786115FA31C66` | 20291738 | tesSUCCESS |

## Safety

- Never commit seeds, secret keys, or family seeds.
- Never spend real XRP from this repo.
- Never invent Testnet transaction hashes in docs or UI.
