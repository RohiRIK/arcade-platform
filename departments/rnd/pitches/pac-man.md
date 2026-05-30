# Pitch: Pac-Man

## Elevator Pitch
The most iconic arcade game ever made — navigate a maze, eat dots, avoid ghosts, and turn the tables with power pellets. Adds our first AI-driven enemies with distinct personalities to the Arcade Platform.

## Gameplay
- **Core Loop**: Eat all 240 dots to clear the level. Avoid 4 ghosts. Grab power pellets to eat ghosts for bonus points. Repeat with increasing difficulty.
- **Player Interaction**: Arrow keys only — no action button. Pre-buffer turns at intersections (cornering) for that authentic Pac-Man feel.
- **Replayability**: Ghost AI creates emergent patterns. Chasing high scores (eating all 4 ghosts per pellet = 200+400+800+1600). Progressive difficulty keeps each run fresh. Memorizing ghost behavior rewards skilled players.

## Technical Fit
- **Canvas complexity**: High (maze rendering, 5 animated entities, particle-like dot grid)
- **Estimated lines of code**: 500-650 (our largest game)
- **Dependencies**: None beyond standard canvas. Maze is a 2D array, no external assets needed.

## Complexity Acknowledgment
This is significantly more complex than any previous build. Key challenges:
1. **Ghost AI** — 4 distinct targeting algorithms + state machines
2. **Maze rendering** — 28×31 tile grid with walls, dots, tunnels
3. **Scatter/Chase cycles** — timed mode switching for all ghosts
4. **Ghost house logic** — ghosts exit one at a time with timing rules
5. **Cornering** — input buffering that makes controls feel right

## v1 Scope (Honest Cuts)
### Include in v1
- Full maze layout (faithful 28×31 grid)
- Pac-Man with mouth animation and cornering input buffer
- 4 ghosts with **simplified AI for v1**:
  - Blinky: full chase (target Pac-Man directly) ✓
  - Pinky: full ambush (target 4 ahead) ✓
  - Inky: **simplified** — target a point between Blinky and Pac-Man (skip the complex double-vector)
  - Clyde: full shy behavior (chase far, scatter close) ✓
- Scatter/Chase mode cycling (simplified: fixed 7s/20s pattern, no per-level tuning in v1)
- Power pellets → frightened mode (fixed 6s duration in v1, no per-level reduction)
- Ghost eaten → eyes return to house
- Dots, score, 3 lives, extra life at 10K
- Fruit bonus (cherry only in v1)
- Tunnel wrap-around
- Level progression (speed increases, but simplified — 3 difficulty tiers not 21)

### Defer to v2
- Exact Inky double-vector targeting
- Per-level speed/timing tables (21 levels of tuning)
- Cruise Elroy mode (Blinky speed-up)
- Multiple fruit types
- Pac-Man death animation (v1: simple flash/fade)
- Ghost house exit timing per ghost (v1: all exit immediately at level start)
- Frightened timer reduction per level

### Why These Cuts
The simplified ghost AI still produces fun, challenging gameplay — Blinky chases, Pinky ambushes, Inky flanks, Clyde is unpredictable. Players won't notice the missing Inky vector math or Cruise Elroy on first play. The cuts reduce complexity by ~30% while keeping the game genuinely fun and recognizable as Pac-Man.

## Mockup
```
┌──────────────────────────────────────┐
│ SCORE: 1240    ●●● (lives)    LV: 1 │
├──────────────────────────────────────┤
│ ╔══════════╗╔══════════╗             │
│ ║ · · · · ·║║· · · · · ║             │
│ ║ ╔══╗ ╔══╗║║╔══╗ ╔══╗ ║             │
│ ║ ● ║ ║  ║║║║  ║ ║ ● ║  ← power    │
│ ║ ╚══╝ ╚══╝╚╝╚══╝ ╚══╝ ║    pellets │
│ ║ · · · · · · · · · · · ║            │
│ ║ · ╔══╗ · ╔══╗ · ╔══╗ ·║            │
│ ║ · ║  ║ · ║GH║ · ║  ║ ·║ ← ghost   │
│ ║ · ╚══╝ · ╚══╝ · ╚══╝ ·║   house   │
│ ║ · · · · · ᗧ · · · · · ║ ← pac-man │
│ ╠═══╡   ╞═══════╡   ╞═══╣ ← tunnel  │
│ ║ · · · · · · · · · · · ║            │
│ ╚════════════════════════╝            │
│          🍒 (fruit)                   │
└──────────────────────────────────────┘
```

## Risk Assessment
- **High risk**: Ghost pathfinding bugs making game too easy or impossible
- **Mitigation**: Implement ghosts one at a time, test each individually
- **Fallback**: If maze rendering proves too complex on 600×400, scale to 20×15 simplified maze (still fun, less authentic)
