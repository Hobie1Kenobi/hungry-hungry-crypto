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

Cycle 11: volume pond or a real bloom pass - the composition (camera, CHOMP pin, lanes) should be honest now.
