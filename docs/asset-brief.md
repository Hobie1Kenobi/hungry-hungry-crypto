# Asset brief — original mascots

Hungry Hungry Crypto ships **four in-engine vinyl machine-beasts + a toy arcade cabinet**. Capsule-on-a-stick, sphere+tube+box, and shared-lathe placeholders are retired. Do not wait on Blender for playable beauty.

## Beasts

Crypto machines with jaws, not wildlife. Four unique chassis kits. No licensed toy silhouettes.

| Seat | Name     | Side  | Palette                      | Machine read                         |
| ---- | -------- | ----- | ---------------------------- | ------------------------------------ |
| 0    | BYTEBITE | North | Cyan `#00E5FF`               | CRT terminal chassis, I/O ports      |
| 1    | RIPSAW   | East  | Magenta `#FF2BD6`            | Angular saw-visor, side blades       |
| 2    | GOLDGRUB | South | Chartreuse `#B8FF2C`         | Fat segmented grub tank, gold bolts  |
| 3    | BLOCKMAW | West  | White `#F4F1E8` / gold `#D4AF37` | Ivory vault, gold bands + dial   |

Required parts now in-engine: unique toy chassis per seat, short thick hydraulic neck with rings, wide plated head, deep interior mouth (rubber gums + wet teeth readable closed-a-crack and on CHOMP). Idle breathe / blink / antenna. CHOMP slam + squash, eat trail, winner lean / loser slump.

## Pond, hopper, chips

- **Cabinet / pond:** chunky enamel arcade table, rivets, rubber feet, recessed dark liquid well, faint hex, cheap caustic shimmer, splash on land.
- **Hopper:** industrial candy chute mounted to the north cabinet rim by a visible gantry/arm. Bin, rings, nozzle, dump sparks. Must not occlude GOLDGRUB.
- **Pellets:** glass/plastic marbles (sphere meshes), 28+1 per dump. Clear-ish cyan glass for normal, gold glass + own point light for the golden token. Geometric two-chevron / X mark is a generated canvas texture, not a downloaded brand file. Optional visual roll does **not** own score positions. Eat AABBs stay on sim pellet `x`/`z`.

## Camera / lighting / juice

Default view is a three-quarter toy-ad (~35–45°), all four beast bodies on screen for the whole round. No per-frame camera wander. Eat shake is 100–140ms then settle. Top-down is debug only (`T` or HUD toggle). Winner orbit only on results and still shows all four. Studio lighting: warm key, cool fill, colored rim per beast. Glow on visors, golden chip, hopper sparks. Contact shadows. No grey void. No fog oval hiding GOLDGRUB.

Audio: tiny original synthesized blips only. No third-party music beds. UI: thin dark arcade, beast-color accents, Orbitron-style headings. Practice shows **LOCAL · NO LEDGER WRITES**.

## Landing zone

Drop original exports in `assets/` (`beasts/`, `arena/`, `ui/`). Filenames use beast names above only.
