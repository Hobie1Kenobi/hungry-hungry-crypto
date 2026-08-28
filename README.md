# Hungry Hungry Crypto

Original 3D arcade. Orchestrator: **ATLAS**. Owner: **Hobie Cunningham**.

Four original crypto-mascot beasts chomp XRP-styled chips on a square liquidity pond. Real-time physics and input run **off-chain**. XRPL Testnet is identity: connect a wallet, set a CRUMB TrustLine, bind the classic `r…` address to a Colyseus seat. **Phase 3 does not settle matches, issue CRUMB to winners, or mint trophy NFTs.**

**CRUMB on Testnet has no value.** Do not treat Testnet balances, TrustLines, or issued tokens as money.

Brand and IP rules: [`docs/LEGAL.md`](docs/LEGAL.md).

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

### Testnet issuer (once)

CRUMB TrustSet needs an issuer r-address. If you do not have one yet:

```bash
pnpm --filter @hhc/xrpl create-issuer
```

This faucets a **throwaway** Testnet account, enables DefaultRipple, prints the r-address, and stores the seed in `.env` only. **Phase 4 owns the durable issuer and CRUMB treasury issuance.** This throwaway is for TrustSet demos.

### Connect a wallet and set a TrustLine

1. Open `http://localhost:5173`. The lobby **Wallet** control is live.
2. Pick one path (all Testnet):
   - **Crossmark** — browser extension. Switch Crossmark to XRPL Testnet, connect, then **TrustSet CRUMB**.
   - **Xaman** — opens a TrustSet sign-request link (`xaman.app/detect/…` / xApp deeplink). Use Testnet in Xaman, paste your `r…` address, then refresh.
   - **Guest** — first-time play. **Guest wallet** generates a Testnet account **on the game server**. **Get Test XRP** hits `https://faucet.altnet.rippletest.net/`. Then **TrustSet CRUMB**. The guest seed lives only in server memory / `.env`. It is never written to git and never sent to other clients.
3. The lobby shows your classic r-address. After TrustSet, Quick Match / Private Room bind `Address r…` ↔ Colyseus seat.
4. Practice vs AI still runs locally. Online eats stay **server-authoritative**.

Explorer: [testnet.xrpl.org](https://testnet.xrpl.org). WebSocket: `wss://s.altnet.rippletest.net:51233` only.

### Practice vs AI (local)

1. Click **Practice vs AI**. This starts a local ~45s round. Empty seats are live AI, not idle dummies.
2. **CHOMP** with Space, click, or tap. You are seat 0, **BYTEBITE** (north, cyan).
3. Opponents use the **same** `ChompInput` as you: `{ seat, down, clientTime }`, piped through `setChomp`.
4. Eat chips that overlap your jaws. Normal = 1, GOLDEN = 5.
5. Round ends at ~45s or when the board is empty. Results are local only (`txHashes: []`).

### Quick Match (local Colyseus)

1. Start the server, then the web client. Connect a wallet first if you want the r-address on your seat.
2. Click **Quick Match**. You join room `hungry`. Humans fill seats first.
3. After a short wait, empty seats become Easy / Normal / Hungry AI from `packages/ai`.
4. The **server** decides eats. Client chomp / neck motion is cosmetic prediction.
5. Match start payload is `{ matchId, seats }`. Match end is `MatchResult` with `txHashes: []` and any bound addresses.

### Private Room (code)

1. Click **Private Room** → **Create room**. Share the 5-character code.
2. A second browser **Join**s with that code (`GET /rooms/:code` then `joinById`).
3. Empty seats still AI-fill after the wait. Same `ChompInput`. Same authoritative eats.

```bash
pnpm --filter web build
pnpm --filter @hhc/ai test
pnpm --filter @hhc/xrpl test
pnpm --filter server test
```

Live faucet + TrustSet (prints real hashes or `BLOCKED:` plus the RPC error):

```bash
pnpm --filter @hhc/xrpl live
```

### Phase 3 Testnet log (real hashes)

Throwaway TrustSet demo issuer (not the Phase 4 durable issuer): `rDQ8Wdf5511AGtZmv6njtt5xh9af5LAMcW`

| What | Hash | Ledger | Result |
| ---- | ---- | ------ | ------ |
| Issuer faucet | `6A6327085E90F90E40C4750ABA21482F5B144999918B1FBB2AAD6C4AB5ACD0C4` | — | tesSUCCESS |
| AccountSet DefaultRipple | `49D31329D39F8CBB760CD69DC1EDF7CBC60EFB7F2794AE41811C6A3E80E61608` | 20291720 | tesSUCCESS |
| Guest faucet | `4A3E9C804EEAD464724EFCA218C3EC081F3F35943720D8C83ECAEA30264D94BA` | — | tesSUCCESS |
| Guest faucet (lobby) | `11D7626BF19C68DC6EE13F29F75D2713E7181A68254B3AAB41256D6E6359FD13` | — | tesSUCCESS |
| TrustSet CRUMB | `37F37EECCA35F0F367720924228CB7FCC89F8AB21052E3CFE87786115FA31C66` | 20291738 | tesSUCCESS |

Guest r-addresses: `r4McfvYaDywCH4157ZXTD2DFJZd6p1hVaq` (script), `rMPGwc7qxRxUnVmWyJtEvaaTdQPZB4mSj9` (lobby). Explorer: [testnet.xrpl.org](https://testnet.xrpl.org). CRUMB on Testnet has no value.

## Smoke: 4-seat fill

`pnpm --filter server test` starts HungryRoom on an ephemeral port, connects one human, fills the other three seats with AI, completes a shortened round, and asserts `MatchResult.txHashes === []` plus a `settleMatch` record (`xrplSubmitted: false`). It also creates a private room, looks up the code, joins by id, and binds a sample r-address to a seat.

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
- **On-chain this phase:** XRPL Testnet identity, CRUMB TrustSet toward `XRPL_ISSUER_ADDRESS`.
- **On-chain later (Phase 4):** CRUMB treasury issuance, XLS-20 pellets, Payment-first settlement receipts.
- Default network is XRPL **Testnet**:
  - WebSocket `wss://s.altnet.rippletest.net:51233`
  - Faucet `https://faucet.altnet.rippletest.net/`
  - Explorer `https://testnet.xrpl.org`
- The game server holds treasury and guest seeds. The client never does.
- `settleMatch` is still a REST/WS hook stub: it records `matchId` + 4 address slots + seat map and **does not** submit XRPL Payments.

## Repo

```
apps/web          Playable Vite + React 18 + R3F client
apps/server       Colyseus HungryRoom (room name: hungry) + guest faucet/TrustSet
packages/shared   Seats, pellets, chomp input, match results
packages/xrpl     Testnet config, faucet, TrustSet, balances
packages/ai       Easy / Normal / Hungry fill
assets/           Original art landing zone
docs/             GDD, XRPL, launch gate, art, legal
```

## Phase 3 scope

Wallet connect (Crossmark, Xaman, guest), CRUMB TrustLine on Testnet, bind r-address to Colyseus seat. No settlement Payments, no winner CRUMB, no trophy NFTs, no Mainnet.

## License

MIT. Copyright (c) 2026 Hobie Cunningham.
