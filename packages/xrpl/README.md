# @hhc/xrpl

XRPL **Testnet** helpers for Hungry Hungry Crypto Phase 3. Identity and TrustLines only. **No Payments, no CRUMB issuance to winners, no NFTs.**

| Role | URL |
| ---- | --- |
| WebSocket | `wss://s.altnet.rippletest.net:51233` |
| Faucet | `https://faucet.altnet.rippletest.net/` |
| Explorer | `https://testnet.xrpl.org` |

Currency on ledger is **CRUMB**. XRPL IOU codes are 3-character ISO or 160-bit hex; `CRUMB` is hex-encoded as `4352554D42000000000000000000000000000000`. Toward issuer `XRPL_ISSUER_ADDRESS`.

Every write: **autofill → simulate (if the node supports it) → submitAndWait**. Logs hash, ledger index, and `tesSUCCESS` / `tec` code. Hashes are never invented. If Testnet is unreachable, the helper throws `BLOCKED:` plus the exact RPC/HTTP error.

Guest / throwaway issuer seeds stay in process memory or `.env`. They are never imported by the web client and never broadcast to other Colyseus seats.

Phase 4 owns the durable issuer and CRUMB treasury issuance. A throwaway issuer created here is for TrustSet demos only.

```bash
pnpm --filter @hhc/xrpl test
pnpm --filter @hhc/xrpl create-issuer
pnpm --filter @hhc/xrpl live
```
