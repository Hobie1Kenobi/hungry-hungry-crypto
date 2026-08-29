# Night log

## Cycle 1 — 2026-08-28 23:50 America/Chicago

Hats used: **HAT DIRECTOR** (live 30s play notes), **ATLAS** (orchestrator / Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Hooks, EVM, or Mainnet.

### Five blunt notes from the live dump

1. Beasts were still capsules + box jaws + stick necks. Capsule-on-a-stick is forbidden even as a placeholder.
2. Default camera was top-down debug. Shipped look must be a three-quarter cinematic toy ad (~35–45°). Top-down only as a debug overlay toggle.
3. Table/pond was a teal quad on a grey slab. Need a chunky arcade cabinet: rivets, rubber feet, enamel, recessed dark liquid pond, faint hex, caustic shimmer, splash on land/chomp.
4. Hopper was a thin glass cylinder. Need an industrial candy chute.
5. Zero juice: no squash, no eat trail, no score pop, no camera shake, no win pose, no miss click, no synthesized audio.

### What changed

- Shared in-engine machine-beast: lathe body, telescoping ringed neck, visor, antennae, plated jaws, rubber gums, wet teeth. Four palettes, idle breathe / antenna tick / visor blink, chomp slam + squash, gulp trail, miss shake, win lean / lose slump.
- Toy cabinet table, recessed pond with hex + cheap caustic, industrial hopper with dump sparks. Studio cyclorama, warm key / cool fill / per-beast rims. No grey void, no fog oval.
- Default camera is three-quarter toy-ad. Dolly-in on GO, 120ms eat shake, soft golden zoom, winner orbit. `T` / HUD toggle for debug top-down only.
- Juice: CHOMP depress + glow, score pops, Practice banner `LOCAL · NO LEDGER WRITES`, results portrait + score burst, original synthesized blips (`chomp_whoosh`, `jaw_snap`, `teeth_miss`, `gulp`, `chip_clack`, `splash_small`, `hopper_dump`, `golden_chime`, `win_sting`).
- Play path untouched: `chompHeld` latch, 28+1 pond, hopper refill, AI nibble, Practice never writes the ledger. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`.

### What still sucks

- Live Practice pass: CHOMP hold still scores; gums/teeth read on open jaws; T is a HUD + key debug overlay. Additive glow stands in for a real bloom pass.
- Beasts share one rig; silhouette variants are fat/saw/gold/antenna only, not four unique machines.
- Pond liquid is a cheap plane, not a volume. Hopper gantry is still a bit floaty.
- Miss audio is local-only so AI chatter does not drown the mix; AI head-shakes without a click.

### Next action

Cycle 2: selective bloom on visor / golden / hopper sparks only, thicker per-beast silhouette kits, and a heavier candy-chute mount that never occludes GOLDGRUB.

## Cycle 2 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 1 playtest LOOK FAILED), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel only. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names.

Cycle 1 playtest (PR #11, `f26a079`) was the ground truth: glossy egg + soda-straw necks + box heads, GOLDGRUB/BLOCKMAW cropped, hopper floating, frozen results, CHOMP juice too small to read. No new playtest scores invented here.

### What changed

- Four unique in-engine kits. BYTEBITE is a cyan CRT terminal. RIPSAW is a magenta saw-visor with side blades. GOLDGRUB is a chartreuse segmented grub tank. BLOCKMAW is an ivory/gold vault. Shared lathe / capsule-on-a-stick / sphere+tube+box are gone.
- Wide plated heads with a deep gum/tooth cavity. Idle sits open a crack. CHOMP hold opens wide. Necks are short thick hydraulic rams with rings, not stretching straws.
- Camera pulled back to a fixed three-quarter toy-ad (~42°). All four bodies stay in frame. No per-frame random wander. Eat shake is 120ms sine then settle. Golden zoom is 0.985. Winner orbit is a small pendulum on results only.
- Hopper hangs from a north-cabinet gantry/arm so GOLDGRUB is not occluded. Dump sparks stay.
- Juice a stranger can see: arcade CHOMP plunger travel + glow, neck slam + squash on press, brighter eat trails, 3D winner lean / loser slump behind a thinner results card.
- Play path untouched: `chompHeld` latch, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`.

### Five blunt leftovers

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They read as four machines now; they are not hero sculpts.
4. Results still uses a CSS card. The 3D lean/slump is there, but the overlay still owns the win announcement.
5. Camera was framed for the desktop three-quarter. Portrait and ultrawide were not the playtest crop that failed Cycle 1; they still need a live pass.

### Next action

Cycle 3: volume pond or a real bloom pass — not another shared-rig silhouette pass.
