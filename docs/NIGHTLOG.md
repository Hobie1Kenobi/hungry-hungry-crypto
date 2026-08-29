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

- Camera sits in the middle of Cycle 2 void (dist 28.8 / fov 46 / look −1.35,1.7) and Cycle 3 mesh (dist 13.2 / fov 34 / start 4.8,6.4,10.4). Default is a 1280×800 three-quarter toy-ad: dist 22.8, elev 0.66, az 0.4, fov 40, look 0,0.55,−0.28. First Canvas frame uses the same pose. Near clip 0.35. Top-down stays debug via `T` / CAM TOY.
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

Cycle 5: first playing frame is the toy, honest GO, and the north neck has to reach the chips.

## Cycle 5 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 4 playtest LOOK FAILED), **ATLAS** (Path B lock).

Path B remains locked. Beauty, feel, and the live play bugs. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names.

Cycle 4 live Practice on a 1280×800 box desktop, one tab (`b28b883`) is the incoming ground truth. Image 1: first arena frame was a black 3D viewport, HUD only, BYTEBITE 0 / RIPSAW 0 / GOLDGRUB 0 / BLOCKMAW 0, 44.7s ROUND — scene not rendered, clock already burning. Image 2: after the scene popped, BYTEBITE 0 / RIPSAW 2 / GOLDGRUB 8 / BLOCKMAW 4, 19 chips still on the pond, BYTEBITE neck short of the cluster. Image 3: GOLDGRUB 8 win, BLOCKMAW 4, RIPSAW 2, BYTEBITE 0. Same scores as mid-round. Hopper never visibly dumped after the pop. No new scores invented here.

### What changed

- Practice match clock starts on the first presented Canvas frame (GO), not on the lobby click. Arena canvas stays mounted through lobby/waiting so WebGL is warm. First playing frame is the 3D toy at 45.0s, not a black HUD.
- `practiceWallClock` still sets `timeLeft` from wall time after GO. A single step cannot skip 10s of dump / hopper / AI — `dt` is clamped to `PRACTICE_MAX_STEP_DT` (0.1). A hitch cannot vacuum the opening then freeze the back half.
- Full-extend mouths cover the pond field for every seat, including BYTEBITE's north chips. Seat-0 hold-scores stays. Visual head sits so the jaws land on `chompReach`. AI not nerfed. Eat AABBs still use sim pellet `x`/`z`. Locked types unchanged.
- Cycle 4 camera distance stays (readable toy-ad, all four bodies on 1280×800). No camera-inside-mesh. No Cycle 2 void. Arcade cabinet / studio sits behind the toy. Floating teal lid and white sky slab are gone. Hopper stays a small north-rim chute.
- Four open maws with interior gums and teeth. RIPSAW keeps the saw cavity; BYTEBITE / GOLDGRUB / BLOCKMAW are no longer a closed box + red wedge.
- Juice a stranger can see: CHOMP plunger stem + travel, harder neck slam, longer eat trails, bigger winner lean / loser slump. Score labels stack name over role so GOLDGRUB / BLOCKMAW do not crop.

Play path stays locked: `chompHeld` + `setPointerCapture` latch, seat-0 hold-scores test, `practiceWallClock` (45s ends at 2fps), 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card in the corner. The 3D lean/slump is visible beside it, but the overlay still owns the win announcement.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 6: volume pond or a real bloom pass — the first frame and the north neck should be honest now.

## Cycle 6 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 5 playtest), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names. Applications stay locked.

Cycle 5 live Practice on a 1280×800 box desktop, one tab (`c01c14a`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame: 3D toy, not black. ROUND 45.0s. Full cabinet/pond, four beasts, HUD. Pond empty of chips at t=0 (hopper not dumped yet). This is a WIN. Do not regress it.
- Image 2 / mid ~23s: BYTEBITE 1, RIPSAW 5, GOLDGRUB 6, BLOCKMAW 6. Hopper x1, 39 chips. Scene readable. BYTEBITE (north) is small and far.
- Image 3 / late 7.3s left: BYTEBITE 2, RIPSAW 15, GOLDGRUB 16, BLOCKMAW 24. Scores kept moving. Hopper dumped. BYTEBITE neck still short of the mid-board pile.
- First frame 3D at 45.0s. Scores kept moving after t=22s. Hopper x2. BYTEBITE scored 2 on a full-round hold vs AI 15-24.
- Results overlay did not persist. Round snapped back to lobby. True finals unverified.
- LOOK is a marginal readable diorama, not a trailer. Juice unread. Mouths barely visible. CHOMP button clipped at the bottom edge. Lobby 3D behind the menu is a muddy blur.

### What changed

- Results stick until a labeled **Lobby** or **Replay** press. The card docks left so it does not sit on the CHOMP plunger. Buttons stay inert until the leftover captured pointer is up, so a CHOMP pointerup cannot dismiss the card or start another match.
- Full-extend mouths on every seat reach the mid-pond cluster, not only the north rim. Same `chompReach` / AABB on all four seats. Seat-0 hold-scores stays. AI not nerfed. Eat AABBs still use sim pellet `x`/`z`.
- Cycle 4/5 camera family, nudged closer and north so BYTEBITE is readable and not hidden behind the pond wall/marquee. All four bodies stay on 1280×800. No camera-inside-mesh. No Cycle 2 void.
- Juice a stranger can see: CHOMP plunger stays fully on screen, harder neck slam + squash, brighter chip trails into the mouth, winner lean / loser slump behind a left-docked results card.
- Four open maws with interior gums and teeth at this camera. RIPSAW keeps the saw cavity; BYTEBITE / GOLDGRUB / BLOCKMAW are CRT / grub / vault mouths, not a closed box.
- Lobby 3D backdrop stays mounted. Overlay is a light vignette so the toy still reads; the card is dim, not a muddy smear.

Play path stays locked: GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `chompHeld` + `setPointerCapture` latch, seat-0 hold-scores test, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is visible beside it; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 7: volume pond or a real bloom pass — results and the north reach should be honest now.

## Cycle 7 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 6 playtest), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names. Applications stay locked.

Cycle 6 live Practice on a 1280×800 box desktop, one tab (`c5ac503`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame: 3D toy at 45.0s. Full cabinet/pond, four beasts, HUD. Pond empty of chips at t=0. This is a WIN. Do not regress it.
- Image 2 / ~30s: pond chips in a CENTER pile. BYTEBITE cyan neck is a stub at the north rail and does not enter the pile. Hopper dumped. Scores moving.
- Image 3 / results STUCK: BLOCKMAW 26 winner, RIPSAW 24, GOLDGRUB 23, BYTEBITE 5. Left-docked card with Replay/Lobby. BLOCKMAW win lean visible. WIN for sticky results. Do not regress.
- First frame 3D at 45.0s. Results stuck after pointerup. Hopper x2. Scores climbed past t=22s (2/4/5/5 at 23s left to 5/21/20/23 at 0.9s).
- BYTEBITE 5 on a full-round CHOMP hold vs AI 23-26. Visual neck never reaches the mid-pond pile. Chips settle in one central cluster. Camera too far/high, empty tan floor. Center scrum is soup. Juice: slam flash and rail trail exist; no per-eat score pop.

### What changed

- Visual neck now tracks `chompReach` on every seat. The piston/head at extend=1 sits in the mid-pond pile, not a rail stub. Same reach / AABB on all four seats. Seat-0 hold-scores stays. AI not nerfed. Eat AABBs still use sim pellet `x`/`z`.
- 28+1 pond is four lanes plus a small mid cluster. Each seat has chips in front of its mouth. Hopper refill uses the same lane field, not one vacuum blob.
- Camera closer and a bit lower so BYTEBITE (north) is a readable toy. All four bodies stay on 1280×800. Less empty tan floor. No camera-inside-mesh. No Cycle 2 void. Sticky results card stays left and still shows the winner lean.
- Per-eat `+1` / `+5` pops at the mouth. Slam, trail, and win lean stay.
- Four open maws with interior gums and teeth at this camera. Labels ride the head (`BYTEBITE` / `YOU`) so they do not mush at the rail.

Play path stays locked: GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `chompHeld` + `setPointerCapture` latch, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is visible beside it; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 8: latch CHOMP so the north neck stays out, prove it on the HUD, and keep four floor lanes.

## Cycle 8 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 7 playtest LOOK FAILED), **ATLAS** (Path B lock).

Path B remains locked. Beauty and feel. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names. Applications stay locked.

Cycle 7 live Practice on a 1280×800 box desktop, one tab (`f562916`) is the incoming ground truth. Do not invent new scores.

- Image 1 / mid-hold ~26.7s: BYTEBITE 1, RIPSAW 4, GOLDGRUB 5, BLOCKMAW 5. BYTEBITE is a tiny cyan nub at the north rail. GOLDGRUB / RIPSAW / BLOCKMAW tongues stretch into a CENTER chip blob. Labels collide. A vertical column of chips floats in mid-air. CHOMP button looks pressed.
- Image 2 / results: BLOCKMAW 20, GOLDGRUB 16, RIPSAW 13, BYTEBITE 3. Left-docked sticky card with Replay / Lobby. WIN for sticky results. Do not regress.
- The visual-neck math did not matter because seat 0 was not held. `Beast.tsx` already drives visExt from sim `extend`. A stub head means `neckExtend[0]` is ~0. AI necks are long because AI `chompDown` stays true. Player hold was pulse-only: `useChompInput` listened to document `pointerup` capture, so every desktop drag ended the hold. Tests that force `chompDown[0]=true` for a full step still pass and still fail on the box desktop.

### What changed

- Practice CHOMP is a latch. One tap (CHOMP control or pond) stays ON until the next tap. Space stays hold-while-down. Documented on the HUD as **CHOMP LATCHED**. A stranger taps once and the north neck stays out for the rest of the hold. AI not nerfed. Same reach / AABB on all four seats.
- Practice HUD debug line: `HOLD on/off  EXT 0.00` from `chompHeld` and `neckExtend[0]`. If HOLD is on and EXT is 0, the latch is still broken.
- Camera sits behind BYTEBITE (north), three-quarter, in front of the north cabinet wall. Player is the largest readable beast. All four bodies stay on 1280×800. No camera-inside-mesh. No Cycle 2 void. Sticky left results stay.
- Hopper dump flies chips from the north chute onto four floor lanes. Chips that land stay landed — no mid-air column, no dumpT reset float. Spawn keeps a lane in front of each mouth; the four inner chips sit in-lane, not a center blob that starves north.
- Per-eat `+1` / `+5` pops at the mouth (depth-test off, bigger). Labels stay on the body at the rail so they do not stack in the scrum.

Play path stays locked: GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is visible beside it; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 9: trailer polish. Latch stays. Hide debug chrome. Load the lanes at GO. Snap the neck. Dismiss the hint.

## Cycle 9 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 8 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked. Trailer polish only. No new modes, shops, quests, tokenomics, engine rewrite, Godot, Unreal, Unity, Babylon, Rapier, Mainnet, Hooks, EVM, or licensed-toy names. Applications stay locked. Practice local. No Mainnet.

Cycle 8 live Practice on a 1280x800 box desktop, one tab (`15c891e`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame: 3D toy at 45.0s. Camera behind BYTEBITE. HOLD off EXT 0.00. Pond EMPTY of chips. Tutorial card bottom-left. Debug chrome top-right (HOLD off EXT 0.00, LOCAL NO LEDGER WRITES, CAM TOY T).
- Image 2 / one CHOMP tap: HOLD on, EXT 0.28 still ramping, LATCHED on the button, cyan neck leaving the rail. Chips now on the four floor lanes.
- Image 3 / mid-round ~20s: HOLD on EXT 1.00, head in the chips, four floor lanes, +1 pops, BYTEBITE competitive. Debug chrome and tutorial card still up.
- Image 4 / results STUCK: BYTEBITE 21, GOLDGRUB 16, BLOCKMAW 12, RIPSAW 9. Left-docked card. WIN for latch, north neck, lanes, sticky results, LOOK-as-trailer. Do not regress those.
- Latch stayed HOLD on / EXT 1.00 the whole round after one tap. That is a WIN. Latch contract unchanged.

### What changed

- Default Practice HUD no longer ships HOLD/EXT or CAM TOY as billboards. HOLD/EXT and the cam toggle sit behind `T` / debugTopDown or `?debug=1`. LOCAL NO LEDGER WRITES stays a Practice truth on the lobby and left-docked results, not a title card over the toy.
- Practice GO starts with `dumpT` already landed. First presented frame is a loaded four-lane board. Hopper refill later in the round still resets `dumpT` and plays the chute.
- Neck extend is snappier on all four seats (same speed). Retract stays snappy. Eat AABBs unchanged. Visible slam / jaw telegraph on the latch. No cooldown, fatigue, auto-unlatch, or eat-cost.
- Tutorial / hint card dismisses after the first successful latch or ~2s into the round.
- Small camera settle / BYTEBITE head-track. Hopper shifted west of the north rim. RIPSAW saw tucked and smaller so it does not sit in the chute. Necks sit a hair higher over the rails. All four bodies stay on 1280x800. No camera-inside-mesh. No Cycle 2 void. No Cycle 7 speck-land.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is visible beside it; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 10: composition. Camera, CHOMP pin, lanes, RIPSAW off the hopper, honest tie copy.

## Cycle 10 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 9 live composition leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 9 live Practice on a 1280x800 box desktop, one tab (`321c14a`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame 44.1s: real 3D, no HOLD/EXT, no CAM TOY, no LOCAL banner. Chips ON the board (WIN vs Cycle 8 empty pond) but they read as a loose center blob/arcs, not four floor lanes. Tutorial card bottom-left. CHOMP bottom-right. BYTEBITE / YOU clipped off the right edge (BYTEBIT / YOU). RIPSAW intersects the dark hopper/corner box on the left.
- Image 2 / one CHOMP tap: neck snapped long (WIN). Button says LATCHED (WIN). Hint dismissed (WIN). CHOMP jumped from bottom-right to bottom-left where the hint was. FAIL.
- Image 3 / mid-round ~13s left: latch held, BYTEBITE scoring, chips still a scattered field. Nameplate still clipped. RIPSAW still in the hopper.
- Image 4 / results STUCK: BYTEBITE 22 star, GOLDGRUB 22, BLOCKMAW 22, RIPSAW 16. Left-docked card. BYTEBITE wins a triple-22 because pickWinner keeps the first highest seat (seat 0). Overlay is clean. BACKGROUND FAIL: a giant cyan neck slab fills ~1/4 of the frame from the top-right. Winner body unreadable. RIPSAW still clipped. Leftover chips sparse and random.
- Latch snap, debug chrome gone, chips at GO, hint dismiss, sticky results are WINS. Do not regress those.

### What changed

- Playing camera is a fixed behind-BYTEBITE toy-ad. Per-frame neck / head-track is gone so the piston cannot sit on the near plane as a cyan slab. Results camera pulls back a little and looks at the winner body / cabinet, not down the ram. All four bodies stay on 1280x800. No camera-inside-mesh. No Cycle 2 brown void. No Cycle 7 speck-land. BYTEBITE / YOU sits on the body toward the pond so the nameplate stays on screen.
- CHOMP is pinned to the bottom-right for the whole round. Hint still dismisses after first latch or ~2s; the plunger does not teleport when the card unmounts.
- Hopper chute sits on the north-west rim. RIPSAW kit is south of the NE corner with a smaller saw so the saw is off the hopper from this camera. RIPSAW stays on screen.
- 28+1 pond is four obvious floor lanes radiating from each mouth plus a small mid cluster. Hopper refill uses the same field. Eat AABBs unchanged. Same reach on all four seats.
- pickWinner is still first highest seat. A shared top score now says it is a tie and that BYTEBITE wins it, not a mystery star. Test: equal 22s returns seat 0.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is visible beside it; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 11: mid-round machine read. Composition (camera, CHOMP pin, lanes) is proven. Do not regress it.

## Cycle 11 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 10 live machine-read leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 10 live Practice on a 1280x800 box desktop, one tab (`025ca7f`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame 45.0s: real 3D. Four floor lanes as a CROSS (WIN). HOLD/EXT gone. CAM TOY gone. CHOMP bottom-RIGHT TAP ONCE. RIPSAW off the hopper (WIN). BYTEBITE nameplate on screen but the first B is eaten by its own red/cyan body slab (reads BVTEBITE / RVTEBITE). YOU line missing or late. Beasts still boxes.
- Image 2 / one CHOMP tap: CHOMP still bottom-right LATCHED (WIN). Hint gone (WIN). Neck snapped (WIN). Scoring started.
- Image 3 / mid-round 13.0s left: camera NEVER moved (WIN vs Cycle 9 slab). CHOMP still right. Nameplate on screen. FAIL: center is a traffic jam of overlapping red/cyan/pink/white rectangular slabs. Four necks occupy the same plane and interpenetrate. No readable jaws or teeth. Latched necks are cheap flat boxes.
- Image 4 / results STUCK: GOLDGRUB 13 star, BLOCKMAW 12, RIPSAW 8, BYTEBITE 7. Overlay clean. Winner is a CSS icon badge, not a 3D hero, but NOT a cyan neck slab (WIN vs Cycle 9). No tie this round.
- Composition WINS (do not regress): lanes, CHOMP pin, RIPSAW off hopper, camera stays put, no neck-slab, latch snap, debug chrome gone, sticky results.

### What changed

- Visual necks only. Same `chompReach` / AABB / eat math on all four seats. Mid-pond rams stagger in Y so they stack instead of occupying one slab. Each latched neck is a tapered ringed piston, not a flat box. A small idle pulse / jaw chew runs while latched. No cooldown, fatigue, auto-unlatch, or eat-cost.
- Four open maws at this toy-ad camera: CRT / saw / grub / vault. Hollow gum cavity, wet teeth, distinct head silhouette. Do not hide heads underground. Do not pull the playing camera. Do not shrink `chompReach`.
- BYTEBITE / YOU sits on the camera side of the CRT, above the chassis, depth-test off so the first glyph cannot be eaten by the body. Other labels stay off their own kits.
- Results still left-docked and sticky. Match-id / hash line is short so it does not dominate. Camera still looks at the winner BODY (win lean) beside the card. Visual necks still park short. No new results mode.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 12: kill Html-through-HUD, park visual maws on four lanes, show BYTEBITE jaws, make the CROSS read, hero the winner body.

## Cycle 12 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 11 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 11 live Practice on a 1280x800 box desktop, one tab (`14b2e98`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame 45.0s: HUD BYTEBITE / YOU left of CHOMP, first B intact (WIN). CHOMP bottom-right TAP ONCE. RIPSAW off hopper. Debug chrome gone. FAIL: pond reads as one flat slab, not four lanes. FAIL: GOLDGRUB Html world label prints over the BLOCKMAW score card as GOLDGRUBLOCKMAW.
- Image 2 / after one tap: LATCHED, hint gone, CHOMP still right, neck out (WIN). FAIL: BYTEBITE head/jaws cropped off the bottom of the viewport. Visible teeth belong to RIPSAW. Player score stayed 0 on that frame (AIs already scoring).
- Image 3 / mid-round 11.6s: camera fixed (WIN). HUD plate + CHOMP right (WIN). FAIL: four necks still one interpenetrating cluster at the same apparent height. Cycle 11 Y-stack (0.32 / 1.55 / 2.38 / 0.96) and weave (+/-0.48) are NOT visible from this high toy-ad camera. Jaws unreadable. GOLDGRUB Html label still over the scoreboard.
- Image 4 / results STUCK: GOLDGRUB 13, BLOCKMAW 12, RIPSAW 8, BYTEBITE 7. Overlay sticks. Match-id short (WIN). FAIL: no 3D winner body, camera on an empty pond, RIPSAW Html label prints through the GOLDGRUB score row.
- Cycle 11 WINS to keep: HUD you-plate, CHOMP pin, latch snap, tapered rams / open maw kits, debug chrome gone, RIPSAW off hopper.

### What changed

- World Html / sprite name tags are gone. Score cards name the four beasts. The you-plate still says BYTEBITE / YOU. No zIndex tweak that still loses.
- Visual necks only. Same `chompReach` / AABB / eat math on all four seats. Visual head along is capped so each maw sits over that seat's cardinal-ray chips, not stacked on 0,0. Cycle 11 Y-stack and +/-0.48 weave are gone. Four heads are four separate toys at mid-round. Open jaws / teeth face the pond. No cooldown, fatigue, auto-unlatch, or eat-cost.
- Playing camera is still a fixed behind-BYTEBITE toy-ad, raised and pulled back just enough that BYTEBITE head, open jaws, and teeth stay on screen at rest and latched. No per-frame neck track. No Cycle 9 cyan neck-slab. No Cycle 2 void. No Cycle 7 speck. All four bodies stay on 1280x800.
- Four floor-lane marks are a bright CROSS on first frame. Opening chips stay on those rays. Pond is not a blank slab.
- Results camera looks at the winner BODY (win lean) beside the left card, not an empty pond. Visual necks still park short. No Html labels through the card.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 13: raised CROSS, short in-lane visual rams, opaque necks, camera headroom, results hero.

## Cycle 13 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 12 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 12 live Practice on a 1280x800 box desktop, one tab (`b38c7e9`) is the incoming ground truth. Do not invent new scores.

- Image 1 / first playing frame 45.0s: HUD clean, no world labels (WIN). CHOMP TAP ONCE bottom-right. BYTEBITE jaws on screen (WIN) but base nearly clipped at the bottom. FAIL: no bright CROSS. Pond is dead grey-green. Chips are a lopsided V/X smear. Cycle 12 painted transparent cyan planes that do not read on this camera.
- Image 2 / after one tap: LATCHED, hint gone, CHOMP still right, maw/teeth in frame (WIN). FAIL: pale cyan neck fires diagonally through the CENTER as a translucent plastic tube, not over a north lane.
- Image 3 / mid-round 6.5s: no world labels (WIN). FAIL: all four heads are one tangled knot center/upper-left. Half the pond is empty dark floor. Not speck-land, but badly framed.
- Image 4 / results STUCK: GOLDGRUB 13, BLOCKMAW 12, RIPSAW 8, BYTEBITE 7. Overlay sticks, no labels through card (WIN). FAIL: camera crash-zooms into a giant green sausage-and-crate blob tucked behind the left card. Not a hero in open pond.
- LIVE Cycle 12 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / RIPSAW 8 / BYTEBITE 7.
- Cycle 12 WINS to keep: no Html tags, HUD plate, CHOMP pin, latch, jaws on screen, debug chrome gone.

### Why Cycle 12 visual cap failed

`BEAST_OFFSET` is 5.2. `VISUAL_LANE_HEAD_LATCH` 2.28 plus `NECK_VISUAL_ORIGIN` still puts four heads ~2.5 from world origin, so they knot. A cap that leaves heads inside a ~2.5 radius is still a pileup from this camera. Cycle 13 does not ship another 2.28 cap.

### What changed

- CROSS is raised box gutters sitting ON TOP of the liquid, one beast-colored rail per cardinal. Opening chips stay on those rays. Flat transparent cyan planes are gone.
- Visual rams only. Same `chompReach` / AABB / eat math on all four seats. Latched visual heads sit over the outer cardinal-ray chips (3.82 / 3.05), short of center, clearly apart. Opaque metal rams (no translucent plastic pipe). Open jaws / teeth on each head. No cooldown, fatigue, auto-unlatch, or eat-cost.
- Playing camera is still a fixed behind-BYTEBITE toy-ad, pulled back and up so the BYTEBITE base/barrel is not on the bottom clip plane. Jaws stay on screen. All four bodies stay on 1280x800. No per-frame neck track. No Cycle 9 cyan slab. No Cycle 2 void. No Cycle 7 speck.
- Results camera pulls BACK. Winner body is fully visible in the open pond to the right of the left card, win lean, not a crash-zoom blob. Visual necks still park short. No Html tags.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 14: first presented GO, results hero in open pond, winner name inside the card, playing camera fills the pond.

## Cycle 14 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 13 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 13 live Practice on a 1280x800 box desktop, one Chrome tab (`f76e5be`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 13 scores (do not invent): BLOCKMAW 13 / BYTEBITE 11 / GOLDGRUB 9 / RIPSAW 8.
- Image 1 / first playing frame: HUD + CHOMP up, timer already 43.0s. 3D viewport fully BLACK. Clock ran on a black canvas. FAIL. Cycle 5 GO contract broken: `GoOnFirstFrame` marked GO on the first playing `useFrame`, which is not a presented warm 3D frame.
- Image 2 / first rendered 3D ~40s: raised beast-colored CROSS, chips on all four rays, BYTEBITE base not clipped, all four jaws on screen, HUD BYTEBITE/YOU left of CHOMP, CHOMP TAP ONCE bottom-right, no 3D name tags, RIPSAW off hopper, debug chrome gone. KEEP THIS.
- Image 3 / mid-round 7.2s: four separate toys on four lanes, opaque metal rams, no center knot. KEEP THE FOUR-LANE READ. FAIL: camera wastes the bottom-right third on empty table/floor; pond sits upper-left ~60%.
- Image 4 / results: CRASH-ZOOM. Winner BLOCKMAW jammed against/behind the left overlay card. Pond and other beasts gone. `h2` "BLOCKMAW wins" overflows the card right edge. Overlay stayed put (WIN). Not an open-pond win lean.
- Cycle 13 WINS to keep: raised CROSS (`LaneGutter` + `RaisedCross`), visual rams 0.62/0.94, opaque steel rams, HUD plate + CHOMP pin, latch CHOMP, no Html tags, no HOLD/EXT on default HUD, playing camera fixed behind BYTEBITE, sticky left-docked results, pickWinner first highest seat.

### Why Cycle 13 GO / results failed

ArenaCanvas stays mounted under the lobby overlay. Clicking Practice uncovers the canvas. The first playing `useFrame` called `markMatchGo` during the WebGL compile/resize hitch, so `practiceWallClock` burned ~2s (43.0s on the LiveTimer) while pixels were still black. CSS behind the canvas was `--bg` #161018, which reads as black.

Results used `setViewOffset(width+pad, height, pad, 0, width, height)` with pad=0.36 width plus an orbit at ~7.8/4.2 looking at `beastVisualRoot`. Positive x on setViewOffset crops the right of a wider frustum and shifts the hero LEFT, under the card. Combined with a close orbit, BLOCKMAW filled the frame.

### What changed

- Practice clock stays frozen at 45.0s (`matchClockOrigin` 0, `timeLeft` ROUND_SECONDS) until a presented warm 3D frame. The first playing `useFrame` still carries lobby render stats, so that frame is dropped. GO needs a real drawing buffer, `gl.info.render.calls` >= 6, triangles >= 800, and two such playing presents (pond/beasts actually drew, not a warm clear-color hitch). `startPractice` does not call `markMatchGo`. `applyMatchStart` still starts the online clock. `PRACTICE_GO_DUMP_T` still lands on that GO. Hitch clamp stays. Canvas wrap / WebGL clear are warm #eddcc6. drei `Preload all` compiles while lobby is up.
- Results camera is a high pond overview with the winner on camera-right so the body sits in open pond to the RIGHT of the left card. Radius 13.6 stays inside the studio. Cycle 13 `setViewOffset` pad=0.36 with x=pad parked the hero under the card; a lane-axis orbit then crash-zoomed or left the room. This cycle drops `setViewOffset`. Playing path still `clearViewOffset()`. No per-frame neck-track on the playing camera. Visual necks still park short (0.94 latch).
- Results title stacks name over "wins" so BLOCKMAW / TIE copy stays inside the card. 3D hero is not shrunk to hide overflow.
- Playing camera is still a fixed behind-BYTEBITE toy-ad. Look/pos retuned so the pond/CROSS/four beasts fill the useful frame instead of parking empty floor in the bottom-right third. No follow-cam. No Cycle 9 cyan slab. No Cycle 2 void. No Cycle 7 speck.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 15: camera fill + results hero - LOOK (black GO, results hero) passed; leftover crop still reads as a leftover crop.

## Cycle 15 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 14 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 14 live Practice on a 1280x800 box desktop, one Chrome tab (`96b82d6`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 14 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / BYTEBITE 8 / RIPSAW 8.
- LOOK PASSED: first playing frame is warm 3D at 45.0s (no black open). Results is an open-pond overview, not a crash-zoom. Trailer contract holds. Do not regress the GO present or the no-crash-zoom results.
- Image 1 / first playing frame 45.0s: warm 3D, raised beast-colored CROSS, chips on four rays, four heads on four lanes short of center, opaque metal rams. KEEP. FAIL: BYTEBITE base/body is CUT OFF by the bottom viewport edge. Jaw is on screen, barrel/base is not. Left edge is a big magenta RIPSAW ram tail. Pond sits left-of-center.
- Image 2 / after one tap: LATCHED, hint gone, neck extended over its own north lane. KEEP.
- Image 3 / mid-round 8.8s: four lanes still readable. FAIL: bottom-right third is dark empty table/floor. Framing still off-center left.
- Image 4 / results: GOLDGRUB 13 wins. Overlay left. Winner name stacked, no overflow. Winner body is in open pond to the RIGHT of the card (not a crash-zoom). KEEP that. FAIL: camera pitched too high, ~25% of the frame is bare beige floor/grey wall top-right, and the green winner is shoved to the far upper-right corner of the pond instead of staged center-right as a hero.
- Cycle 14 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). Raised CROSS. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad.

### Why Cycle 14 framing failed

Cycle 14 playing `TOY_POS` y 6.95 z -9.35 was too low/close for the north toy. Look (0.95, 0.08, 1.72) aimed past pond center toward GOLDGRUB and RIPSAW, so the pond sat left, BLOCKMAW fell off the right, and the bottom-right third became empty table. Cycle 13 (z -11.85 y 8.85 look z -2.42 fov 36) kept the base in frame but donated empty floor. Cycle 15 does not snap back to that composition.

Cycle 14 results `RESULTS_ELEV` 9.4 plus `RESULTS_POND_BLEND` 0.12 looked at the pond origin from a high wide seat. GOLDGRUB (south) read as a small green toy in the far corner of a flattened overview. `setViewOffset` stays parked.

### What changed

- Playing camera is still a fixed behind-BYTEBITE toy-ad. Pulled back/up to y 8.72 z -11.62, look retuned to pond center-north ( -0.06, 0.34, -0.55 ), fov 35. BYTEBITE barrel and base sit in frame on 1280x800 with air under the feet. Pond + CROSS + four beasts fill the useful middle. RIPSAW stays on the left with margin. GOLDGRUB / BLOCKMAW stay on screen. No per-frame neck-track. No Cycle 9 cyan slab. No Cycle 2 void. No Cycle 7 speck. Not Cycle 13's empty-floor look.
- Results camera drops elevation to 5.25, radius 11.45, fov 37, look-Y 0.52, pond blend 0.62, plus a small orbit turn toward the winner. Winner is a readable hero center-right of the left card, lower pitch, still an open-pond overview. Other beasts and CROSS stay readable. No crash-zoom. No `setViewOffset` pad. Visual necks still park short (0.94 latch). Winner name stays stacked inside the card.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. GO contract unchanged. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 16: pond center + BYTEBITE feet - Cycle 15 pull-back/up did not clear the live box.

## Cycle 16 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 15 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 15 live Practice on a 1280x800 box desktop, one Chrome tab (`bfad6fd`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 15 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / BYTEBITE 8 / RIPSAW 8.
- LOOK FAILED. Cycle 14 GO and no-crash-zoom still hold. Cycle 15 camera polish did NOT clear the two disqualifiers.
- Image 1 / first playing frame 45.0s: warm 3D, raised CROSS, chips on four rays, four heads short of center, opaque metal rams, HUD/CHOMP pin, no nametags. KEEP. FAIL: BYTEBITE deck/base/feet cut at the bottom viewport (playtester: clipped near y=680). No air under the base. Pond/CROSS hub left-of-center (playtester: hub near x=620 of 1280). RIPSAW pink rail/tail eats the left third out toward x=170.
- Image 2 / after one tap: LATCHED, hint gone. KEEP.
- Image 3 / mid-round 8.5s: FAIL worse. BYTEBITE base still on the bottom clip. Bottom-right third is a dead dark table/floor wedge (playtester: x about 900 to 1280, y about 450 to 740) with only a stray chip and a yellow ramp. Pond still left-of-center.
- Image 4 / results: GOLDGRUB 13. KEEP: open pond to the RIGHT of the left card, no crash-zoom, name fits. FAIL: winner is small-ish and high; about the top-right 30% is flat beige wall/floor; other three beasts are barely readable (chips and rail fragments behind the card). Not hero-scale.
- Cycle 15 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). Raised CROSS. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad.

### Why Cycle 15 framing failed

Cycle 15 playing `TOY_POS` y 8.72 z -11.62 (x 1.48, look -0.06 / 0.34 / -0.55, fov 35) was another pull-back/up. It did not clear the box. Camera sat on the RIPSAW (+X) side of south, so RIPSAW ate the left third and the CROSS hub sat left-of-center. Look z -0.55 aimed at pond center-north and pushed BYTEBITE's deck/pad/feet through the bottom clip. The SW pond floor then filled the bottom-right third as an empty table wedge. Cycle 13 (x 4.35, y 8.85, z -11.85, look z -2.42) kept the base but wasted floor and shoved RIPSAW further left. Cycle 16 does not snap back to that composition and does not ship Cycle 15 numbers unchanged.

Cycle 15 results `RESULTS_RADIUS` 11.45 / `RESULTS_ELEV` 5.25 / `RESULTS_LOOK_Y` 0.52 / `RESULTS_POND_BLEND` 0.62 / `RESULTS_ORBIT_TURN` 0.16 / `RESULTS_FOV` 37 kept the no-crash-zoom overview but parked the winner small and high, with a beige studio band in the top-right and the other beasts as fragments under the left card. `setViewOffset` stays parked.

### What changed

- Playing camera is still a fixed behind-BYTEBITE toy-ad. Lateral shift to x -4.15 (BLOCKMAW / screen-right side of south), y 8.72 z -11.18, look retuned to 0.22 / 0.58 / -1.96, fov 35. Not another pull-back/up. BYTEBITE barrel, deck, and rubber feet sit in the 1280x800 frame with air under the base. CROSS hub recenters. RIPSAW tail and the east table stripe leave the left clip. BLOCKMAW and the west CROSS rail occupy the old bottom-right floor wedge. GOLDGRUB / BLOCKMAW stay on screen. All four jaws stay on screen. No per-frame neck-track. No Cycle 9 cyan slab. No Cycle 2 void. No Cycle 7 speck. Not Cycle 13's empty-floor look.
- Results camera sits at elevation 4.35, radius 9.4, fov 35, look-Y 1.22, pond blend 0.52, orbit turn 0.22. South orbit Z is clamped in front of the cabinet so a BLOCKMAW win cannot punch through the south wall. Winner is a readable hero center-right of the left card, lower in the frame, still an open-pond overview. Other beasts and CROSS stay readable to the right of the card. Beige wall band is cropped. No crash-zoom. No `setViewOffset` pad. Visual necks still park short (0.94 latch). Winner name stays stacked inside the card.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. GO contract unchanged. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Volume pond and bloom stay parked.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 17: results overview + pond fill - Cycle 16 feet/GO held; results crash-zoom and pond wedges failed on the live box.

## Cycle 17 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 16 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Cycle 16 live Practice on a 1280x800 box desktop, one Chrome tab (`f37059f`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 16 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / RIPSAW 8 / BYTEBITE 7.
- LOOK FAILED. Trailer still fails. Cycle 16 win to keep: BYTEBITE base/treads in the 1280x800 playing frame with air under the feet (Cycle 15 clip is FIXED). GO still 45.0s warm 3D. Do not regress those.
- Image 1 / first playing frame 45.0s: warm 3D, raised CROSS, chips on four rays, four heads short of center, opaque metal rams, HUD/CHOMP pin, no nametags. KEEP. BYTEBITE cyan base/treads visible with air under the feet. KEEP. FAIL: CROSS hub still left-and-high (playtester: about x=700, y=360). Bottom-right third still an empty dark table wedge (x 900-1280, y 480-740) plus pond rail. Left third above y=500 is dead dark table. RIPSAW tail ends around x=255 (better than Cycle 15 x=170) but RIPSAW is shoved to the far corner instead of the pond filling the middle.
- Image 2 / after one tap: LATCHED, hint gone. KEEP.
- Image 3 / mid-round 4.4s left: BYTEBITE base still in frame (KEEP). FAIL: huge empty black floor bottom-right AND bottom-left. Board stripped, worst trailer frame.
- Image 4 / results: GOLDGRUB 13. Name fits. FAIL: CRASH-ZOOM again. Near-ground low angle. Top ~28% is a flat beige/grey wall band. Winner is large but tilted/rolled on a diagonal like a crashed prop, high-center not lower hero. CROSS and other beasts are cropped fragments crawling in from left/bottom behind the card. Cycle 14/15 no-crash-zoom REGRESSED.
- Cycle 16 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). BYTEBITE feet in frame with air. Raised CROSS. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad.

### Why Cycle 16 framing failed

Cycle 16 playing `TOY_POS` x -4.15 y 8.72 z -11.18, look 0.22 / 0.58 / -1.96, fov 35. The lateral shift DID put BYTEBITE feet in frame. It did NOT recenter the pond. Look z -1.96 aims too far north, so the CROSS hub sits high and both lower corners become empty table. RIPSAW stays a corner leftover. Cycle 17 does not snap back to Cycle 13 (x 4.35, y 8.85, z -11.85, look z -2.42) or Cycle 15 (x 1.48, y 8.72, z -11.62, look z -0.55) and does not ship Cycle 16 numbers unchanged.

Cycle 16 results `RESULTS_RADIUS` 9.4 / `RESULTS_ELEV` 4.35 / `RESULTS_LOOK_Y` 1.22 / `RESULTS_POND_BLEND` 0.52 / `RESULTS_ORBIT_TURN` 0.22 / `RESULTS_FOV` 35 / `RESULTS_SOUTH_CLEAR` -7.35 crash-zoomed on the box. The side orbit sat beside GOLDGRUB at head height (elev 4.35 + look-Y 1.22 + radius 9.4 looks at the winner head from inside the cabinet). Pitch was ~19 degrees, so the top of the frustum hit the beige studio wall (~28% dead band). Cycle 15 (radius 11.45, elev 5.25, look-Y 0.52) was a high wide establishing shot with a tiny corner winner. Cycle 16 overcorrected into a crash-zoom. Cycle 13 `setViewOffset` pad stays parked.

### What changed

- Playing camera is still a fixed behind-BYTEBITE toy-ad. Look moves into the pond (z -0.95, not Cycle 16's -1.96 and not Cycle 15's -0.55). Lateral stay on the BLOCKMAW / screen-right side of south (x -4.05). Pulled a hair back/up (y 9.48 z -12.28) so BYTEBITE barrel, deck, and rubber feet stay in the 1280x800 frame with air under the base while the CROSS hub drops toward frame center and the lower table wedges fill with pond / CROSS / four beasts. RIPSAW stays a lane beast, not a far-corner leftover. GOLDGRUB / BLOCKMAW stay on screen. No per-frame neck-track. No Cycle 9 cyan slab. No Cycle 2 void. No Cycle 7 speck. Not Cycle 13's empty-floor look.
- Results camera leaves the Cycle 16 side-orbit. It sits further BACK and UP on a north-west 3/4 (west -4.55, elev 8.2, north -10.55, look-Y 0.42, blend 0.46, fov 36). A small per-winner pull keeps GOLDGRUB a readable upright hero center-right of the left card in OPEN POND, larger than Cycle 15's far-corner speck, not a near-ground diagonal tumble. Other beasts and CROSS stay readable. Beige/grey wall band is cropped by the downward pitch. No crash-zoom. No `setViewOffset` pad. No neck-track. Visual necks still park short (0.94 latch). Winner name stays stacked inside the card.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. GO contract unchanged. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Volume pond and bloom stay parked.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. The 3D lean/slump is the readable winner; the overlay no longer owns a bottom-right CHOMP collision.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 18: set-scale or FOV only. Camera locked. Stop the camera spiral.

## Cycle 18 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 17 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: stop the camera spiral. Do not slide `TOY_POS` / `TOY_LOOK`. Do not rewrite results camera. Playing leftovers may be fixed by set-scale or FOV only.

Cycle 17 live Practice on a 1280x800 box desktop, one Chrome tab (`c9d4a3f`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 17 scores (do not invent): RIPSAW 12 (tie win) / BLOCKMAW 12 / BYTEBITE 9 / GOLDGRUB 8.
- LOOK FAILED on results crash-zoom. THIS CYCLE DOES NOT FIX RESULTS.
- Image 1 / first playing frame 45.0s: warm 3D. BYTEBITE feet in with air. CROSS hub about x=655 y=390. Bottom-right empty table wedge. Left ~25% dead rail. RIPSAW jammed far upper-left.
- Image 2 / mid-round 9.4s: same composition. RIPSAW leftover in the far corner. Empty floor can remain this cycle.
- Cycle 17 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). BYTEBITE feet in frame with air. Raised CROSS. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad.

### Why this cycle is FOV, not another TOY_POS

Cycles 14-17 kept sliding `TOY_POS` / `TOY_LOOK` / results pull. Hobie killed that spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }

`TOY_FOV` was 35. Raising it is the approved FOV path. Results `RESULTS_WEST` / `RESULTS_ELEV` / `RESULTS_NORTH` / `RESULTS_PULL` / `RESULTS_FOV` are not touched. Results is a later cycle.

### What changed

- Playing FOV only. `TOY_FOV` 35 -> 39 (Hobie 38-40). `TOY_POS` and `TOY_LOOK` unchanged. No set-scale group. No sim constant change. Same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. Eat AABBs still use sim pellet `x`/`z`.
- Goal on 1280x800: all four beasts' feet in frame with air, CROSS hub not clipped, RIPSAW not a leftover jammed into the far corner. Empty floor can remain. Camera stays locked.
- Results camera not rewritten. Volume pond, bloom, GLB, chip juice, HungryRoom sync, and XRPL stay parked.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Pond liquid is still a cheap hex/caustic plane, not a volume.
2. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
3. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 19: volume pond + splash. Not another TOY_POS.

## Cycle 19 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 18 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: camera stays locked. This cycle is volume pond + splash only. Do not slide `TOY_POS` / `TOY_LOOK` / `TOY_FOV`. Do not rewrite results camera.

Cycle 18 live Practice on a 1280x800 box desktop, one Chrome tab (`c80180c`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 18 scores (do not invent): RIPSAW 12 (tie win) / BLOCKMAW 12 / BYTEBITE 9 / GOLDGRUB 8.
- LOOK PASSED (FOV 39 reframe). Four feet in with air. CROSS hub in frame. RIPSAW on its lane. Do not regress that.
- Image 1 / first-45s.webp 45.0s: warm 3D. Four feet in with air. CROSS hub in frame. RIPSAW on its lane. FAIL: pond is still a cheap hex/caustic PLANE. Dark but flat. Reads as a generic board, not a dish of liquid.
- Image 2 / mid-round.webp: same plane. No splash readable on eat/dump.
- Cycle 18 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). BYTEBITE feet in frame with air. FOV 39. Raised CROSS. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad. Camera constants locked.

### Why this cycle is volume pond, not another TOY_POS

Cycles 14-17 slid the camera. Cycle 18 locked FOV 39 and LOOK passed. Hobie killed the camera spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }
- `TOY_FOV` 39

Results `RESULTS_*` not touched. Results is a later cycle. If a foot clips, stop and report; do not TOY_POS.

### What changed

- Pond is a shallow darker dish, not a flat quad on the table. Table cabinet / apron / play plate now leave a `POND_SIZE` hole. Well floor + sloped liners sit in that hole. Liquid at y=-0.05 is darker than the Cycle 18 plane. CROSS stays proud on the liquid (beds 0.04, rails 0.22, hub 0.12). Lane gutters stay. Chips still sit ON the liquid (same `restY` 0.08+r). Eat AABBs still use sim pellet `x`/`z`. `POND_SIZE` unchanged.
- Cheap ripple on eat and hopper dump. Tiny splash sprites at eat / land / dump. Hooked the existing juice bus: `notifyEat` and `notifyDump` now push `splashes[]`. Practice dump juice fires on `markMatchGo` so the first playing frame can show it (not under the lobby card). `PelletChip` already called `notifySplash` on land. `Fx` draws a flash + rings + droplet sprites on that list. Pond draws surface ripple rings from the same list. Dump ripples sit in the four open quadrants, not under the CROSS hub. No second juice bus. No fluid sim. No postprocessing water. No Rapier. No bloom.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. GO contract unchanged. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Dish is boxes + one liquid plane so the first frame stays warm 3D. Camera constants unchanged. No GLB. No chip squash/trail. No results-camera rewrite. No HungryRoom sync. No XRPL.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Glow is still additive materials. No real bloom pass on visor / golden / hopper sparks.
2. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
3. BYTEBITE is still the shared in-engine CRT kit, not a GLB.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 20: SelectiveBloom on visor / golden / hopper sparks only. Practice local. No Mainnet.

## Cycle 20 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 19 live LOOK leftovers), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F + drei. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: camera stays locked. This cycle is SelectiveBloom on visor / golden / hopper sparks only. Do not slide `TOY_POS` / `TOY_LOOK` / `TOY_FOV`. Do not rewrite results camera.

Cycle 19 live Practice on a 1280x800 box desktop, one Chrome tab (`cc1d332`) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 19 scores (do not invent): RIPSAW 13 / BLOCKMAW 12 / BYTEBITE 9 / GOLDGRUB 8.
- LOOK PASSED (dish, CROSS proud, splash readable). Recessed dish. CROSS proud on the liquid. Chips on liquid. Splash readable on eat/dump. Do not regress that.
- Image 1 / first-45s.webp 45.0s: warm 3D. Recessed dish. CROSS proud. Chips on liquid. FAIL: glow is still additive materials. Visors and golden do not bloom.
- Image 2 / latched-splash.webp: splash readable. FAIL: hopper sparks are additive, not a real bloom pass.
- Cycle 19 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2). BYTEBITE feet in frame with air. FOV 39. Recessed dish. CROSS proud. Chips on liquid. Splash bus. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad. Camera constants locked.

### Why this cycle is SelectiveBloom, not another TOY_POS

Cycles 14-17 slid the camera. Cycle 18 locked FOV 39. Cycle 19 LOOK passed on dish / CROSS proud / splash. Hobie killed the camera spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }
- `TOY_FOV` 39

Results `RESULTS_*` not touched. Results is a later cycle. If a foot clips, stop and report; do not TOY_POS.

### What changed

- Real bloom pass. `@react-three/postprocessing` 2.19 (R3F 8) `EffectComposer` + `SelectiveBloom`. Dedicated three.js layer 10 (postprocessing selection range 2-31). Only three families sit on that layer: HeadDressing visor meshes (`visorRef` in kits.tsx / Beast.tsx), golden `PelletChip` (`pellet.golden`, not cyan chips), hopper dump sparks (Hopper.tsx). CROSS rails, splash sprites, table, rams, gums, HUD, studio, liquid stay unbloomed. No SMAA. No SSAO. No N8AO. Composer is cheap: canvas AA off (composer owns the blit), no MSAA, no stencil, mipmapBlur, 5 mip levels.
- GO contract kept. `practiceGoReady` unchanged (2 presents, calls 6, triangles 800). EffectComposer can hitch. Composer warms while the lobby canvas is mounted. GoOnFirstFrame still drops the first playing useFrame, still waits for a presented warm 3D buffer, and also waits until the composer has presented so the clock cannot start on a black viewport.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Camera constants unchanged. No GLB. No chip squash/trail. No results-camera rewrite. No HungryRoom sync. No XRPL. No volume-pond rewrite.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
2. BYTEBITE is still the shared in-engine CRT kit, not a GLB.
3. Chip squash / eat trail still parked.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 21: visor bloom readable from the locked toy camera. Practice local. No Mainnet.

## Cycle 21 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 20 live LOOK FAIL), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F 8 + drei + `@react-three/postprocessing` 2.19. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: camera stays locked. This cycle is visor bloom readable from the behind-BYTEBITE toy camera. Do not slide `TOY_POS` / `TOY_LOOK` / `TOY_FOV`. Do not rewrite results camera.

Cycle 20 live Practice on a 1280x800 box desktop, one Chrome tab (`fe6a2af`, PR #30 squash-merged) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 20 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / RIPSAW 11 / BYTEBITE 7.
- LOOK FAILED. Visor strips have no postprocess halo. Golden chip bloom PASS. Overbloom CLEAN (CROSS / splash / table / liquid / rams / gums / cyan chips / HUD do not bloom). First frame 45.0s PASS (warm 3D). Dish / camera held. Hopper sparks NOT OBSERVED (dump too brief / too small).
- Image 1 / c20_2_firstframe.webp 45.0s: golden marble has a real halo. Four beast heads are flat paint. BYTEBITE (cyan, near) skull is a solid cyan block with no visor halo.
- Image 2 / c20_3_latched.webp 36.9s LATCHED: gold blooms, visors do not.
- Image 3 / crop_bytebite.png: BYTEBITE from the toy camera (behind the player). Head is flat cyan. Beige teeth/segments on the camera-facing face. No bloom bleed. Gold marble in the same crop DOES bloom. SelectiveBloom is live; visors are not contributing a readable halo.
- Image 4 / crop_lanes.png: RIPSAW west, gold halo, magenta head flat. No visor halo on RIPSAW either.
- Cycle 20 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2; composerPresented). Golden chip BloomSelect + pointLight. Overbloom CLEAN. Recessed dish. CROSS proud. Chips on liquid. Splash bus. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad. Camera constants locked.

### Why this cycle is visor bloom, not BYTEBITE GLB and not another TOY_POS

Cycle 20 put BloomSelect on a thin pond-facing face strip (BYTEBITE visor box 0.96 x 0.1 x 0.07 at local z=0.28). The playing camera sits BEHIND BYTEBITE, so that strip is occluded by the vinyl skull. GOLDGRUB's strip faces the camera and still showed no halo, so the strip was also too small / too dim in the SelectiveBloom buffer (MeshStandardMaterial + tiny area vs the golden marble + pointLight). Hopper sparks scaled to 0 when dumping===false, and GO already has dumpT landed, so sparks vanished before a human frame could score them.

Cycles 14-17 slid the camera. Cycle 18 locked FOV 39. Hobie killed the camera spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }
- `TOY_FOV` 39

Results `RESULTS_*` not touched. Results is a later cycle. If a foot clips, stop and report; do not TOY_POS. BYTEBITE hero GLB is Cycle 22, only after visors actually bloom.

### What changed

- Visor family is a crown / brow light-bar, not a hidden face thread. Cycle 20's pond-facing strip sits under the open upper jaw from the toy camera, so the hero read is a chassis-top + camera-facing rear lip on BYTEBITE (the cyan CRT block the camera actually sees) plus a raised head crown. GOLDGRUB gets a body-top + wide front visor so the far facing-camera head blooms. RIPSAW / BLOCKMAW get the same visor family when their heads are in frame. One shared unlit `MeshBasicMaterial` per beast (toneMapped off) so the SelectiveBloom buffer gets visor luminance even when backlit; still hooked through `visorRef` so Beast.tsx blink / chomp / winner intensity drives every visor mesh. BLOOM_LAYER 10 + BloomSelect only on those visor meshes. Vinyl skull / gums / rams stay off the bloom layer.
- Hopper sparks stay in BloomSelect. GO dump juice already fires `notifyDump`; sparks now linger ~0.6s after dump starts (and after GO, where dumpT is already landed). Still tiny, still hopper-only, still not a second fluid sim.
- Golden chip BloomSelect + pointLight untouched. Composer untouched: no SMAA / SSAO / N8AO, no whole-framebuffer bloom.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Camera constants unchanged. No GLB. No chip squash/trail. No results-camera rewrite. No HungryRoom sync. No XRPL.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
2. BYTEBITE is still the shared in-engine CRT kit, not a GLB.
3. Chip squash / eat trail still parked.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 22: thin visor BAR, not whole-head bloom. Practice local. No Mainnet.

## Cycle 22 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 21 live LOOK FAIL), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F 8 + drei + `@react-three/postprocessing` 2.19. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: camera stays locked. This cycle is a thin visor BAR on paint. Do not slide `TOY_POS` / `TOY_LOOK` / `TOY_FOV`. Do not rewrite results camera.

Cycle 21 live Practice on a 1280x800 box desktop, one Chrome tab (`010e03c`, PR #31 squash-merged) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 21 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / RIPSAW 10 / BYTEBITE 7.
- LOOK FAILED. Whole-head bloom, not a visor bar. Golden chip bloom PASS. Overbloom FAIL on skulls. Cyan chips matte. CROSS / table / liquid / gums / rams / HUD CLEAN. First frame 45.0s PASS (warm 3D). Dish / camera held. Hopper sparks weak. CHOMP latched.
- Image 1 / first-45s.webp 45.0s: all four beasts are glow blobs. BYTEBITE (near cyan) is a uniform emissive brick with a silhouette halo. GOLDGRUB (far) is white-hot. Golden marbles still bloom. Cyan chips stay flat.
- Image 2 / bytebite.png crop: from BEHIND. Entire cyan skull+body is one glow brick. Teeth stay sharp. No crown/brow/rear-lip bar. Soft cyan halo around the whole silhouette.
- Image 3 / goldgrub.png crop: whole chartreuse skull white-hot, halo past the outline, marble lost inside the head glow.
- Cycle 21 WINS to keep: GO contract (clock frozen at 45.0s until presented warm 3D; GoOnFirstFrame drops first playing useFrame, then practiceGoReady with drawing buffer / calls 6 / triangles 800 / presents 2; composerPresented). Golden chip BloomSelect + pointLight. Recessed dish. CROSS proud. Chips on liquid. Splash bus. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad. Camera constants locked.

### Why this cycle is a thin visor bar, not BYTEBITE GLB and not another TOY_POS

Cycle 21 put BloomSelect on chassis-top slabs that ARE a second skull (BYTEBITE chassis boxes about 1.2 x 0.22 x 0.78 plus a 1.16 x 0.24 rear lip, plus a 1.18 x 0.22 head crown). GOLDGRUB head visor is about 1.2 x 0.34 x 0.2. Shared MeshBasicMaterial then color.multiplyScalar(1.85-2.35) every frame, SelectiveBloom intensity 3.4, luminanceThreshold 0. That turns any large visor mesh into a silhouette floodlight. Golden chip stays a small marble so it still looks like a halo. The chassis BloomSelect family is the main offender for BYTEBITE-from-behind.

Cycles 14-17 slid the camera. Cycle 18 locked FOV 39. Hobie killed the camera spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }
- `TOY_FOV` 39

Results `RESULTS_*` not touched. Results is a later cycle. If a foot clips, stop and report; do not TOY_POS. BYTEBITE hero GLB is Cycle 23, only after the bar reads.

### What changed

- DELETE the chassis-top BloomSelect slabs. CRT body / vinyl hull stay off BLOOM_LAYER 10. Chassis no longer takes the visor material.
- One thin visor bar per beast, readable from the locked behind-BYTEBITE camera. BYTEBITE hero: a thin cyan strip along the top-rear edge of the head (camera-facing lip), about 1.02 x 0.044 x 0.062, not a cap. GOLDGRUB: a thin brow bar facing camera (~0.7 x 0.034 x 0.046), not a second skull. RIPSAW / BLOCKMAW: same family, thin. Vinyl paint stays visible around the bar.
- Visor MeshBasicMaterial stays unlit / toneMapped off and still hooks `visorRef` for blink / chomp / winner. Drive is about 0.72x beast color (small blink, winner 0.92). No multiplyScalar 1.85-2.35 floodlight. Chartreuse at 1x unlit was still a far-head floodlight.
- SelectiveBloom intensity 3.4 -> 0.95, luminanceThreshold 0 -> 0.28, radius 0.7 -> 0.3, levels 6 -> 4. Still catches the golden marble and the bar. Does not bloom cyan chips, CROSS, table, splash, gums, rams, HUD.
- Hopper sparks stay at the Cycle 21 linger. Golden chip BloomSelect + pointLight untouched. Composer stays cheap: no SMAA / SSAO / N8AO, no whole-framebuffer bloom.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Camera constants unchanged. No GLB. No chip squash/trail. No results-camera rewrite. No HungryRoom sync. No XRPL.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
2. BYTEBITE is still the shared in-engine CRT kit, not a GLB.
3. Chip squash / eat trail still parked.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 23: GOLDGRUB brow bar. BYTEBITE rear-lip bar stays. Camera stays locked. Practice local. No Mainnet.

## Cycle 23 — 2026-08-29 America/Chicago

Hats used: **HAT DIRECTOR** (Cycle 22 live LOOK FAIL), **ATLAS** (Path B lock).

Path B remains locked: `apps/web` stays Vite + React 18 + R3F 8 + drei + `@react-three/postprocessing` 2.19. No Godot, Unreal, Unity, Babylon, Rapier rewrite. No new modes, shops, quests, tokenomics, engine rewrite. No Mainnet. No Hooks. No EVM. Applications stay locked. Practice local.

Hobie lock this cycle: camera stays locked. This cycle is GOLDGRUB brow bar. BYTEBITE rear-lip bar stays. Do not slide `TOY_POS` / `TOY_LOOK` / `TOY_FOV`. Do not rewrite results camera.

Cycle 22 live Practice on a 1280x800 box desktop, one Chrome tab (`8ba882a`, PR #32 squash-merged) is the incoming ground truth. Do not invent new scores.

- LIVE Cycle 22 scores (do not invent): GOLDGRUB 13 / BLOCKMAW 12 / RIPSAW 9 / BYTEBITE 7.
- LOOK FAILED. GOLDGRUB has no brow bar (Cycle-20-style miss on the far mascot). BYTEBITE thin visor bar PASS. Golden chip bloom PASS. Overbloom PASS (no whole-head blobs). First frame 45.0s PASS (warm 3D). CHOMP latched. Dish / camera held.
- Image 1 / first-45s.webp 45.0s: warm 3D. BYTEBITE near/south has a thin pale-cyan lip. GOLDGRUB far/north is a matte chartreuse dome.
- Image 2 / bytebite-pass.png: KEEP. From behind, thin brighter pale-cyan strip on the top-rear lip above the tooth row. Vinyl skull, cream teeth, maroon gums readable as paint. Not a glow brick.
- Image 3 / goldgrub-fail.png: chartreuse dome, one specular highlight, no thin brow bar above the teeth. Uniform paint.
- Cycle 22 WINS to keep: BYTEBITE visor mesh 1.02 x 0.044 x 0.062 at head local [0, 0.192, -0.418]. Chassis BloomSelect stays deleted. Golden chip BloomSelect + pointLight. SelectiveBloom intensity 0.95 / luminanceThreshold 0.28 / radius 0.3 / levels 4. GO contract (clock frozen at 45.0s until presented warm 3D). Recessed dish. CROSS proud. Chips on liquid. Splash bus. Visual rams 0.62/0.94. Opaque steel rams. HUD you-plate + CHOMP pin. Latch CHOMP. No Html tags. No HOLD/EXT on default HUD. Playing camera fixed behind BYTEBITE. Sticky left-docked results. pickWinner first highest seat. No setViewOffset pad. Camera constants locked.

### Why this cycle is GOLDGRUB brow bar, not BYTEBITE GLB and not another TOY_POS

Cycle 22 put GOLDGRUB's HeadDressing bar at 0.7 x 0.034 x 0.046 at [0, 0.38, 0.36]. That strip sits in the open-jaw cavity, under the vinyl dome the toy camera actually sees. BYTEBITE's bar works because it is closer, longer, and on the camera-facing rear lip. Chartreuse * 0.72 was not the main miss (luminance still clears 0.28); the bar was a few pixels and buried. Raising SelectiveBloom intensity / dropping threshold would risk Cycle 21 whole-head flood.

Cycles 14-17 slid the camera. Cycle 18 locked FOV 39. Hobie killed the camera spiral. Locked playing camera stays:

- `TOY_POS` { x: -4.05, y: 9.48, z: -12.28 }
- `TOY_LOOK` { x: 0.0, y: 0.42, z: -0.95 }
- `TOY_FOV` 39

Results `RESULTS_*` not touched. Results is a later cycle. If a foot clips, stop and report; do not TOY_POS. BYTEBITE hero GLB is Cycle 24, only after GOLDGRUB's bar reads.

### What changed

- GOLDGRUB brow bar sits ON the vinyl dome, proud toward the camera: 0.8 x 0.056 x 0.072 at head local [0, 0.74, 0.14], slight pitch 0.28 so the strip faces the locked toy camera. Still a bar, not a cap. Vinyl hull stays paint / off BLOOM_LAYER 10.
- GOLDGRUB visor idle drive is 0.9x beast color (chomp 0.96, winner 1.0). BYTEBITE / RIPSAW / BLOCKMAW stay on the Cycle 22 0.72 / 0.8 / 0.92 curve. No shared multiplyScalar flood.
- RIPSAW / BLOCKMAW get the same proud-thin-bar treatment so the side seats do not fail next play. BYTEBITE HeadDressing visor mesh unchanged.
- SelectiveBloom globals untouched (intensity 0.95, luminanceThreshold 0.28, radius 0.3). Chassis BloomSelect stays deleted. Golden chip BloomSelect + pointLight untouched.
- Play path untouched: latch CHOMP, same `chompReach` / AABB / `BEAST_OFFSET` / `NECK_EXTEND_SPEED` on all four seats. AI not nerfed. Hitch clamp stays. `PRACTICE_GO_DUMP_T` still lands on GO. Canvas wrap / WebGL clear stay warm #eddcc6. drei `Preload all` stays. Camera constants unchanged. No GLB. No chip squash/trail. No results-camera rewrite. No HungryRoom sync. No XRPL.

Play path stays locked: Practice CHOMP is a latch (tap on, tap off). Space is hold-while-down. No cooldown, fatigue, auto-unlatch, or eat-cost. Do not nerf the player. Do not nerf AI. GO on first presented frame, `PRACTICE_MAX_STEP_DT` hitch clamp, `practiceWallClock` after GO, `PRACTICE_GO_DUMP_T` landed, seat-0 hold-scores + mid-pond reach tests, 28+1 pond, hopper refill + `dumpT` reset, AI nibble after t=22s, Practice `txHashes: []`. Locked types unchanged. Eat AABBs still use sim pellet `x`/`z`. Same reach / AABB on all four seats. Sticky left-docked results stay inert until leftover captured pointer is up. Default Practice HUD does not ship HOLD/EXT or CAM TOY. Playing camera is a fixed behind-BYTEBITE toy-ad. pickWinner is still first highest seat.

### Five leftover notes

1. Kits are in-engine primitives. They are four machines now; they are not hero sculpts.
2. BYTEBITE is still the shared in-engine CRT kit, not a GLB.
3. Chip squash / eat trail still parked.
4. Results is still a CSS card. Cycle 17 LOOK failed on results crash-zoom. This cycle did not touch results camera.
5. Online HungryRoom still uses the server tick. Only Practice waits for GO and clamps a hitch step.

### Next action

Cycle 24 BYTEBITE hero GLB only after GOLDGRUB's bar reads. Practice local. No Mainnet.

