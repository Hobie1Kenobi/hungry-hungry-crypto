# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL Testnet is identity and Payment-first settlement: connect a wallet, set a CRUMB TrustLine, bind the classic `r…` address to a Colyseus seat. After `finishMatch` the **server** (never the client) submits CRUMB IOU Payment(s) from the treasury to bound addresses that have a TrustLine.

**CRUMB on Testnet has no value.** This is not money. Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md). Public Testnet log: [`PUBLIC_TESTNET_REPORT.md`](PUBLIC_TESTNET_REPORT.md).

## How to run server + web

Requires **Node 22+** and [pnpm](https://pnpm.io/). Two terminals:

```bash
pnpm install
pnpm --filter server dev
```

```bash
pnpm --filter web dev
```

- Game server: `ws://localhost:2567` (Colyseus room name: **`hungry`**)
- Client: `http://localhost:5173`

Copy `.env.example` to `.env`. Never commit `.env` or seeds.

## Durable Testnet issuer + CRUMB treasury (once)

Phase 3 throwaway issuer `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW` is TrustSet-demo only. Its seed is not available. Create a **new** durable issuer:

```bash
pnpm --filter @hhc/xrpl create-issuer
```

This faucets a Testnet issuer, enables **DefaultRipple**, faucets a server-held treasury, TrustSets CRUMB on the treasury, and issues treasury stock (IOU Payment from issuer → treasury). It prints r-addresses and tx hashes only. Seeds are stored in `.env` as `XRPL_ISSUER_SEED` / `XRPL_TREASURY_SEED` (gitignored). **Never print seeds.**

Then run a 4-seat HungryRoom and settle:

```bash
pnpm --filter server rehearse
```

That script: create-issuer (or reuse) → guest faucet + TrustSet → HungryRoom (1 human bound address + 3 AI, short round) → `settleMatch` submits at least one CRUMB Payment → writes [`deployments/testnet.json`](deployments/testnet.json) and [`PUBLIC_TESTNET_REPORT.md`](PUBLIC_TESTNET_REPORT.md).

If Testnet/faucet is down the script exits `BLOCKED:` with the exact error. Hashes are never invented.

### Connect a wallet and set a TrustLine

1. Open `http://localhost:5173`. The lobby **Wallet** control is live.
2. Pick one path (all Testnet):
   - **Crossmark** — browser extension. Switch Crossmark to XRPL Testnet, connect, then **TrustSet CRUMB**.
   - **Xaman** — opens a TrustSet sign-request link (`xaman.app/detect/…` / xApp deeplink). Use Testnet in Xaman, paste your `r…` address, then refresh.
   - **Guest** — first-time play. **Guest wallet** generates a Testnet account **on the game server**. **Get Test XRP** hits `https://faucet.altnet.rippletest.net/`. Then **TrustSet CRUMB**. The guest seed lives only in server memory / `.env`. It is never written to git and never sent to other clients.
3. The lobby shows your classic r-address. After TrustSet, Quick Match / Private Room bind `Address r…` ↔ Colyseus seat.
4. Practice vs AI still runs locally (no ledger writes). Online eats stay **server-authoritative**. After the round the server pays CRUMB to bound TrustLined addresses.

Explorer: [testnet.xrpl.org](https://testnet.xrpl.org). WebSocket: `wss://s.altnet.rippletest.net:51233` only.

### Practice vs AI (local)

1. Click **Practice vs AI**. This starts a local ~45s round. Empty seats are live AI, not idle dummies.
2. **CHOMP LATCHED** - tap CHOMP or the pond once; the neck stays out until the next tap. Space is hold-while-down. You are seat 0, **BYTEBITE** (north, cyan). The cyan neck should reach into the pond from the behind-camera view. HOLD/EXT is debug-only (`T` or `?debug=1`).
3. Opponents use the **same** `ChompInput` as you: `{ seat, down, clientTime }`, piped through `setChomp`.
4. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5. Hopper dumps extra waves when the pond thins (still local, no ledger writes).
5. Round ends at ~45s or when the board is empty after the last refill. Results are local only (`txHashes: []`).

### 8-Minute Audit

Cycle 10 composition is proven on a 1280x800 box desktop (lanes, CHOMP pin, camera stays put). Cycle 11 is mid-round machine read.

After PR #8, Practice vs AI fixed BYTEBITE's hold (cyan neck + score 0->22) and the 28+1 pond, but RIPSAW / GOLDGRUB / BLOCKMAW vacuumed early then froze (~43/43/41 from ~22s to the bell) while leftover chips sat in BYTEBITE's near-north lane and hopper waves stopped. This change:

- Keeps seat 0 `chompHeld` + pointer capture. BYTEBITE still extends from behind-camera and can score.
- Hopper refill resets `dumpT` so the new wave must land. Easy / Normal / Hungry release and re-arm after that dump instead of staying stuck past `WINDUP_DUMP`.
- Practice `tick` applies AI `ChompInput` on the same match-elapsed clock as `stepArena`. Hopper still dumps when live chips drop to 16, and also when any lane is empty, through the back half of the 45s (nibble/release + eat cooldown — not an endless vacuum).

**Verify (local, no XRPL):** `pnpm --filter web dev` → Practice vs AI → hold Space or CHOMP. Cyan neck must reach into the pond and BYTEBITE’s score must leave 0. Hopper shakes and dumps again when a lane empties. RIPSAW / GOLDGRUB / BLOCKMAW scores must still move after ~22s. HUD still reads `LOCAL RESULT · NO LEDGER WRITES`.

Arena framing: the 11.2-radius dark cylinder plus shallow camera/fog read as a black oval that hid GOLDGRUB. The table is now a 13.1 square slab under the pond (not a planet disc). No giant floor plane. Camera sits more overhead so the square pond and all four labeled beasts fit; HUD is thinner so it does not cover GOLDGRUB. Hopper is smaller/higher so it is not a black diamond over GOLDGRUB. Tokens are sphere marbles — cyan glass / gold glass — with a generated two-chevron mark (geometry + canvas). Eat AABBs still use sim pellet `x`/`z`. No Rapier. Practice vs AI stays local. No Mainnet.

### Quick Match (local Colyseus)

1. Start the server, then the web client. Connect a wallet first if you want CRUMB settlement.
2. Click **Quick Match**. You join room `hungry`. Humans fill seats first.
3. After a short wait, empty seats become Easy / Normal / Hungry AI from `packages/ai`.
4. The **server** decides eats. Client chomp / neck motion is cosmetic prediction.
5. Match start payload is `{ matchId, seats }`. Match end is `MatchResult` with `txHashes` populated only for `tesSUCCESS` CRUMB Payments.

### Private Room (code)

1. Click **Private Room** → **Create room**. Share the 5-character code.
2. A second browser **Join**s with that code (`GET /rooms/:code` then `joinById`).
3. Empty seats still AI-fill after the wait. Same `ChompInput`. Same authoritative eats. Same Payment-first settlement.

```bash
pnpm --filter web build
pnpm --filter @hhc/ai test
pnpm --filter @hhc/xrpl test
pnpm --filter server test
```

Faucet + TrustSet only:

```bash
pnpm --filter @hhc/xrpl live
```

### Phase 4 Testnet log (real hashes)

Durable issuer: `rNRohSqpNF6RUgCdvtrXqao1hMRcjK2x5b`  
Treasury: `rDYMbqXWZhNRccTbjcWMpHKmT2rUD5ks87`  
Guest (bound human seat): `rpHembF8Y3odbbZ3ZQFMn2UoSDMtkc9VGm`  
HungryRoom match: `hhc-FHyOpNGKP`

Full table: [`PUBLIC_TESTNET_REPORT.md`](PUBLIC_TESTNET_REPORT.md). Explorer: [testnet.xrpl.org](https://testnet.xrpl.org).

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

CRUMB on Testnet has no value. This is not money.

## Smoke: 4-seat fill

`pnpm --filter server test` starts HungryRoom on an ephemeral port, connects one human, fills the other three seats with AI, completes a shortened round, and asserts an unbound match does **not** submit Payments (`txHashes: []`, `xrplSubmitted: false`). It also creates a private room, looks up the code, joins by id, and binds a sample r-address to a seat.

## Locked beasts (not animals from any licensed table game)

| Seat | Side  | Name     | Color        |
| ---- | ----- | -------- | ------------ |
| 0    | North | BYTEBITE | cyan         |
| 1    | East  | RIPSAW   | magenta      |
| 2    | South | GOLDGRUB | chartreuse   |
| 3    | West  | BLOCKMAW | white / gold |

Placeholder boxes and capsules are required until original Blender meshes land. See [`docs/asset-brief.md`](docs/asset-brief.md).

## Hybrid architecture

- **Off-chain:** arena physics, chomp input, overlap eats, scoreboard, empty-seat AI, Colyseus HungryRoom.
- **On-chain this phase:** XRPL Testnet identity, CRUMB TrustSet, treasury issuance, Payment-first `settleMatch` after match end.
- Default network is XRPL **Testnet**:
  - WebSocket `wss://s.altnet.rippletest.net:51233`
  - Faucet `https://faucet.altnet.rippletest.net/`
  - Explorer `https://testnet.xrpl.org`
- The game server holds treasury and guest seeds. The client never does.
- `settleMatch` is server-only. It Payment-first sends CRUMB from the treasury to bound classic r-addresses that have a TrustLine. AI seats with no address skip. `xrplSubmitted` is true only for hashes that landed `tesSUCCESS`. `tec` codes are logged, never faked as success. One settlement after match end — not per pellet.

## Repo

```
apps/web          Playable Vite + React 18 + R3F client
apps/server       Colyseus HungryRoom (room name: hungry) + guest faucet/TrustSet + settleMatch
packages/shared   Seats, pellets, chomp input, match results
packages/xrpl     Testnet config, faucet, TrustSet, issuer, treasury, Payments
packages/ai       Easy / Normal / Hungry fill
assets/           Original art landing zone
deployments/      Public Testnet issuer + hashes (no seeds)
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 4 scope

Durable Testnet issuer, CRUMB treasury stock, Payment-first settlement after HungryRoom `finishMatch`. No Hooks. No EVM sidechain. Trophy NFTs are optional and must not block. No Mainnet.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
