# Launch

Orchestrator: **ATLAS**. Owner: Hobie Cunningham.

## Testnet first

All development, QA, and public previews use XRPL Testnet:

- `wss://s.altnet.rippletest.net:51233`
- `https://faucet.altnet.rippletest.net/`

CRUMB on Testnet has no value.

## Orchestrator Launch Gate

**Mainnet is forbidden until ATLAS issues a Launch Gate.** No client, server, or script in this repository may submit Mainnet transactions before that gate. Phase 3 cannot reach Mainnet.

When (and only when) the gate is signed off, operators may consider a Mainnet WebSocket. Left commented on purpose:

```
# Future Mainnet WS — do not uncomment without Orchestrator Launch Gate
# wss://xrplcluster.com
```

## Gate checklist (future)

- [ ] Original IP review (`docs/LEGAL.md`)
- [ ] No secrets in git
- [ ] Testnet soak: identity, CRUMB issuance, Payment-first settlement
- [ ] Treasury seed only on the game server
- [ ] Economy: CRUMB has a disclosed Mainnet policy (Testnet remains worthless)
- [ ] ATLAS Launch Gate recorded

## Phase 3 exit

`pnpm install` works. `pnpm --filter web build` succeeds. `pnpm --filter @hhc/ai test`, `pnpm --filter @hhc/xrpl test`, and `pnpm --filter server test` pass. HungryRoom (`hungry`) fills 4 seats (humans first, then AI). Wallet connect + CRUMB TrustSet work on Testnet. r-address binds to a Colyseus seat. No settlement Payments, no Mainnet. **Stop after Phase 3.**
