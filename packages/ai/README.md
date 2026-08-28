# @hhc/ai

Empty-seat fill for Hungry Hungry Crypto. Policies emit the same `ChompInput` as a human: `{ seat, down, clientTime }`.

Phase 1 replaces idle dummies with live Easy / Normal / Hungry opponents. Phase 2 runs the same policies on the Colyseus server for empty HungryRoom seats. No wallets or XRPL writes.

## Personalities

| Personality | How it CHOMPS |
| ----------- | ------------- |
| **Easy** | Reaction delay + random mash |
| **Normal** | Pellet nearest its own mouth + cooldown |
| **Hungry** | Waits for chips to land, then nibbles toward GOLDEN with cooldown — same `ChompInput` path, cannot vacuum a lane |

Idle remains available for tests and empty-seat fallbacks.

## Default Practice vs AI map

| Seat | Beast    | Control        |
| ---- | -------- | -------------- |
| 0    | BYTEBITE | Local human    |
| 1    | RIPSAW   | Easy           |
| 2    | GOLDGRUB | Normal         |
| 3    | BLOCKMAW | Hungry         |

## Tests

```bash
pnpm --filter @hhc/ai test
```

A Hungry bot wins a simulated round against idle seats. The same bot loses when seat 0 is a perfect human stand-in that CHOMPS any pellet in its zone.

CRUMB on Testnet has no value.
