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
5. Smaller browser chrome still wants more south/west margin than a 1440×900 film. The toy camera now reserves HUD space and scales distance with viewport height; portrait still needs a live pass.

### Next action

Cycle 3: volume pond or a real bloom pass — not another shared-rig silhouette pass.

## Cycle 3 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 2 playtest LOOK FAILED + BYTEBITE 0), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel plus the player-eat bug. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names.

Cycle 2 live Practice (`af51005`) is the incoming ground truth. Mid-round ~21s: BYTEBITE 0, RIPSAW 28, GOLDGRUB 38, BLOCKMAW 45. Results: BLOCKMAW 67, GOLDGRUB 51, RIPSAW 45, BYTEBITE 0. Neck looked extended while seat 0 scored nothing. Board sat low in a brown/black void. Four beasts read as the same extruded box.

### What changed

- Seat-0 hold still scores in `@hhc/ai` (kept + a continuous-hold practice-step case). Web CHOMP latch now uses `setPointerCapture` and stays down until `pointerup` / `pointercancel` or Space keyup. `lostPointerCapture` and button `blur()` no longer drop the hold. AI and eat AABBs unchanged.
- Practice `timeLeft`, hopper `dumpT`, and AI `now` follow `matchClockOrigin` via `practiceWallClock`. A 45s round ends after 45s of `performance.now()` even if rAF is 2fps. The 0.05 dt cap stays online-only.
- Camera dropped `setViewOffset` padBot 0.26 / look -1.35,1.7 / dist 28.8. Closer three-quarter toy-ad, look at the cabinet, all four bodies in frame.
- Studio cyclorama + arcade enclosure + north marquee so the frame is not a brown void. Hopper gantry is a U-clamp bolted to the north rim. No south wall in front of GOLDGRUB.
- Four machine silhouettes from this camera: CRT terminal, circular saw, wide grub tank, vault cube. Square / hex / bellows / gold-banded rams — no soda-straw tubes. Interior gums + wet teeth sit open a crack at rest and wide on CHOMP.
- Juice a stranger can see: CHOMP plunger travel, neck slam + squash, brighter chip trails, winner lean / loser slump behind a corner results card.

Play path stays locked: `chompHeld`, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card in the corner. The 3D lean/slump is visible beside it, but the overlay still owns the win announcement.
5. Online HungryRoom still uses the server tick. Only Practice is wall-clock honest when rAF starves.

### Next action

Cycle 4: pull the lens out of the mesh, get the hopper off the pond, and make four silhouettes read at table scale.

## Cycle 4 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 3 playtest LOOK FAILED), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel plus camera/hopper scale. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names.

Cycle 3 live Practice on a 1280×800 box desktop (`c5786fa`) is the incoming ground truth. Mid-round ~22s: BYTEBITE 0, RIPSAW 7, GOLDGRUB 3, BLOCKMAW 4. Results: RIPSAW 7, BLOCKMAW 4, GOLDGRUB 3, BYTEBITE 0. No human CHOMP was sent into the arena tab — BYTEBITE 0 is not proof eat is broken. First frame put the lens inside GOLDGRUB/BLOCKMAW slabs. Hopper gantry + overhead beam sat in the pond as a pile of boxes.

### What changed

- Camera sits in the middle of Cycle 2 void (dist 28.8 / fov 46 / look −1.35,1.7) and Cycle 3 mesh (dist 13.2 / fov 34 / start 4.8,6.4,10.4). Default is a 1280×800 three-quarter toy-ad: dist 20.8, elev 0.6, az 0.46, fov 40, look 0,0.42,−0.12. First Canvas frame uses the same pose. Near clip 0.35. Top-down stays debug via `T` / CAM TOY.
- Hopper is a small candy chute U-clamped to the north cabinet rim only. The 6.7-long overhead beam and center-pond bin are gone. Nothing occupies the playfield or occludes GOLDGRUB.
- Beasts sit at table scale. BYTEBITE is a CRT with a tube back and dish ears. RIPSAW is a circular saw on a motor can. GOLDGRUB is three tapering cylinders with gold rings. BLOCKMAW is a small ivory vault with a gold wheel. Capsule / egg / closed-wedge / giant-slab stay banned. Interior gums + wet teeth sit open a crack at rest and wide on CHOMP.
- Cream studio + north marquee stay behind the toy. Softboxes no longer hang over the pond.
- Juice (plunger / slam / trails / winner lean) is unchanged. It only matters if the camera can see it.

Play path stays locked: `chompHeld` + `setPointerCapture` latch, seat-0 hold-scores test, `practiceWallClock` (45s ends at 2fps), 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types and eat AABBs unchanged. AI not nerfed.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card in the corner. The 3D lean/slump is visible beside it, but the overlay still owns the win announcement.
5. Online HungryRoom still uses the server tick. Only Practice is wall-clock honest when rAF starves.

### Next action

Cycle 5: volume pond or a real bloom pass — the camera fight should be over.
