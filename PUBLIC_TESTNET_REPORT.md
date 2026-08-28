# Public XRPL Testnet report — Hungry Hungry Crypto Phase 4

Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

**CRUMB on Testnet has no value. This is not money.**

Network: XRPL Testnet only.

| Role | URL |
| ---- | --- |
| WebSocket | `wss://s.altnet.rippletest.net:51233` |
| Faucet | `https://faucet.altnet.rippletest.net/` |
| Explorer | [https://testnet.xrpl.org](https://testnet.xrpl.org) |

## Status

Rehearsal completed against XRPL Testnet. Hashes below are real `tesSUCCESS` / `tec` results. None are invented.

Durable issuer: `rNRohSqpNF6RUgCdvtrXqao1hMRcjK2x5b`

Treasury: `rDYMbqXWZhNRccTbjcWMpHKmT2rUD5ks87`

Guest (bound human seat): `rpHembF8Y3odbbZ3ZQFMn2UoSDMtkc9VGm`

HungryRoom match: `hhc-FHyOpNGKP`

| What | Hash | Ledger | Result |
| ---- | ---- | ------ | ------ |
| Issuer faucet | `C49A9724800E43A3C49A6AEBEE04A1F3CC0962ECAE9B4326794D3E42786205E9` [explorer](https://testnet.xrpl.org/transactions/C49A9724800E43A3C49A6AEBEE04A1F3CC0962ECAE9B4326794D3E42786205E9) | — | tesSUCCESS |
| AccountSet DefaultRipple | `7F20CF1B18D749B08FFC67483B82F57501F337AA228A85C8A4841726CA7251B0` [explorer](https://testnet.xrpl.org/transactions/7F20CF1B18D749B08FFC67483B82F57501F337AA228A85C8A4841726CA7251B0) | 20292068 | tesSUCCESS |
| Treasury faucet | `3B72C0D21E8EDE107961D1F23169BAF3E634F84025BDE86140A502525ECE659A` [explorer](https://testnet.xrpl.org/transactions/3B72C0D21E8EDE107961D1F23169BAF3E634F84025BDE86140A502525ECE659A) | — | tesSUCCESS |
| TrustSet CRUMB treasury | `48F54CE18DD0ACBEB1D11095922E26A6C4E7845D8593F020C74D44906DBC7AF6` [explorer](https://testnet.xrpl.org/transactions/48F54CE18DD0ACBEB1D11095922E26A6C4E7845D8593F020C74D44906DBC7AF6) | 20292070 | tesSUCCESS |
| Issue treasury CRUMB | `DBC605D5642B11E03C2FC1258C98DC275AA2A075798AEDD9B5DAD94B50DCE987` [explorer](https://testnet.xrpl.org/transactions/DBC605D5642B11E03C2FC1258C98DC275AA2A075798AEDD9B5DAD94B50DCE987) | 20292072 | tesSUCCESS |
| Guest faucet | `32B1273BA9E4D21FED865DB8334475CDB0146D844CFF693714BF0EDB0D5F5AC0` [explorer](https://testnet.xrpl.org/transactions/32B1273BA9E4D21FED865DB8334475CDB0146D844CFF693714BF0EDB0D5F5AC0) | — | tesSUCCESS |
| Guest TrustSet CRUMB | `C4F006F0DDFB91D453C18D4AF396F27D04FDF5298888938D1B49AF3083616766` [explorer](https://testnet.xrpl.org/transactions/C4F006F0DDFB91D453C18D4AF396F27D04FDF5298888938D1B49AF3083616766) | 20292089 | tesSUCCESS |
| settleMatch CRUMB Payment dest=rpHembF8Y3odbbZ3ZQFMn2UoSDMtkc9VGm | `C7EF6B98CB3C8981605EA980D8E9D85D5A7544B1173C040B2F8B18CF69120795` [explorer](https://testnet.xrpl.org/transactions/C7EF6B98CB3C8981605EA980D8E9D85D5A7544B1173C040B2F8B18CF69120795) | 20292092 | tesSUCCESS |

Phase 3 throwaway issuer `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW` is TrustSet-demo only. Its seed is not available and was not reused.

Seeds live in `.env` only (`XRPL_ISSUER_SEED`, `XRPL_TREASURY_SEED`). They are never printed here and never committed.

