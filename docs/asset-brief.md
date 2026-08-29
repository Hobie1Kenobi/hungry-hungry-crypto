# Asset brief — original mascots

Hungry Hungry Crypto ships **in-engine rounded machine-beasts + a toy arcade cabinet**. Capsule-on-a-stick and grey-slab placeholders are retired. Do not wait on Blender for playable beauty.

## Beasts

Crypto machines with jaws, not wildlife. Antenna / visor / plated snout. No licensed toy silhouettes. One shared lathe / rounded-mesh rig, instanced four times.

| Seat | Name     | Side  | Palette                      | Read                         |
| ---- | -------- | ----- | ---------------------------- | ---------------------------- |
| 0    | BYTEBITE | North | Cyan `#00E5FF`               | Fast, electric, hungry I/O   |
| 1    | RIPSAW   | East  | Magenta `#FF2BD6`            | Serrated jaw plates          |
| 2    | GOLDGRUB | South | Chartreuse `#B8FF2C`         | Greedy liquidity grubber     |
| 3    | BLOCKMAW | West  | White `#F4F1E8` / gold `#D4AF37` | Ledger vault mouth        |

Required parts now in-engine: fat vinyl body, telescoping neck with metal rings, upper/lower jaw, visor, two antennae, interior mouth (rubber gums + wet teeth). Shared skeleton so CHOMP (anticipation, slam, snap, squash, recovery) ports if Blender meshes land later.

## Pond, hopper, chips

- **Cabinet / pond:** chunky enamel arcade table, rivets, rubber feet, recessed dark liquid well, faint hex, cheap caustic shimmer, splash on land.
- **Hopper:** industrial candy chute over pond center (bin, rings, nozzle, dump sparks). Not a thin glass cylinder.
- **Pellets:** glass/plastic marbles (sphere meshes), 28+1 per dump. Clear-ish cyan glass for normal, gold glass + own point light for the golden token. Geometric two-chevron / X mark is a generated canvas texture, not a downloaded brand file. Optional visual roll does **not** own score positions. Eat AABBs stay on sim pellet `x`/`z`.

## Camera / lighting / juice

Default view is a three-quarter toy-ad (~35–45°), all four beasts on screen. Top-down is debug only (`T` or HUD toggle). Studio lighting: warm key, cool fill, colored rim per beast. Glow on visors, golden chip, hopper sparks. Contact shadows. No grey void. No fog oval hiding GOLDGRUB.

Audio: tiny original synthesized blips only. No third-party music beds. UI: thin dark arcade, beast-color accents, Orbitron-style headings. Practice shows **LOCAL · NO LEDGER WRITES**.

## Landing zone

Drop original exports in `assets/` (`beasts/`, `arena/`, `ui/`). Filenames use beast names above only.
