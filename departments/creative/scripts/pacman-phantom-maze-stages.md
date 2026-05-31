# Pac-Man (Phantom Maze) — Stage/Scenario Script

## Overview
Phantom Maze is a haunted labyrinth experience where you control a wandering soul-light through darkness. A fog-of-war system limits visibility to a small radius around the player, making every turn a discovery. Four luminous phantoms hunt you through the gloom. Power pellets transform you into a blazing beacon that reverses the chase. Stages are level-based — same maze layout, escalating ghost speed and shrinking fright windows. The goal: eat all 240 dots, hunt ghosts for combos, and survive as deep as possible.

## Stages

### Level 1: The Awakening
- **Setting:** Maze walls `#1a237e`, barely visible beyond 5-tile fog radius. Background `#080810`. Dots pulse gently (0.8–1.0 opacity, 2s sine). 4 power pellets pulse brighter (0.5–1.0, 800ms). Player `#ffd600` with 6px glow illuminates nearby walls to `#3949ab`.
- **Objective:** Eat all 240 dots and 4 power pellets. Learn the maze.
- **Enemies/Obstacles:** 4 ghosts at 75% player speed. AI: Blinky chases directly, Pinky targets 4 tiles ahead, Inky mirrors Blinky offset, Clyde retreats when <8 tiles. Frightened duration: 8 seconds. Ghosts start in center box, emerge one at a time (0s, 5s, 15s, 30s).
- **New mechanic introduced:** Movement (4-directional, tile-based), dot eating (`munch` alternating 260/300Hz, 40ms), fog of war (radial gradient, full brightness center → 5% at 5 tiles). Power pellet turns ghosts blue (`#1565c0`) and reverses chase.
- **Difficulty:** 2/10
- **Duration:** ~90 seconds
- **Boss:** None
- **Reward:** Dots: 10pts each. Power pellet: 50pts + frightened mode. Ghost eat cascade: 200→400→800→1600. Cherry appears at 70 dots eaten (`#ff1744`, 100pts). Level clear: maze walls flash 3× (`#1a237e`↔`#3949ab`, 200ms each), `maze_clear` arpeggio (G4-B4-D5-G5, 600ms).
- **Visual cue:** `siren_low` loops (sine 200↔300Hz, 1Hz, 12% volume). Calm, explorable, forgiving.

### Level 2: Growing Shadows
- **Setting:** Same maze. Ghosts slightly more vibrant — their glow radius increases from 2px to 3px. Dot pulse frequency increases to 1.5s cycle (subtle urgency).
- **Objective:** Clear 240 dots again. Ghosts are faster.
- **Enemies/Obstacles:** Ghosts at 80% player speed. Frightened: 7s. All 4 ghosts emerge within 20s (faster box exit). Blinky enters "cruise mode" when <20 dots remain (100% speed).
- **New mechanic introduced:** **Fruit schedule begins.** Strawberry (`#ff1744`, 300pts) appears at 70 and 170 dots eaten. `fruit_chime` plays (880→1100Hz, 120ms). Fruit despawns after 8s.
- **Difficulty:** 3/10
- **Duration:** ~80 seconds
- **Boss:** None
- **Reward:** Same scoring. Strawberry replaces cherry. Ghost Train still achievable but tighter window (7s fright).

### Level 3: The Hunt
- **Setting:** Fog of war tightens slightly — radius 4.5 tiles (down from 5). Walls beyond fog are now fully invisible (previously faint at 5%). Maze feels darker, more claustrophobic. Ghost wisp trails lengthen (3→5 particles trailing behind each ghost, their color at 30% opacity, 200ms lifetime).
- **Objective:** Clear 240 dots. Plan routes — ghosts are a real threat.
- **Enemies/Obstacles:** Ghosts at 85% speed. Frightened: 6s. Scatter phases shorten (7s scatter, 20s chase, previously 8s/18s). Ghost AI becomes more aggressive — Blinky targets 2 tiles ahead instead of current position when in chase.
- **New mechanic introduced:** **Ghost warning system** — when a ghost is within 3 tiles but outside fog radius, their color appears as a faint glow on the nearest wall edge (1px line, ghost's color at 20% opacity). Lets skilled players sense danger beyond vision.
- **Difficulty:** 5/10
- **Duration:** ~75 seconds
- **Boss:** None
- **Reward:** Orange fruit (`#ff9100`, 500pts). Frightened siren `siren_high` (400↔600Hz, 2Hz) feels more urgent.

### Level 4: Phantom Rush
- **Setting:** Fog radius 4 tiles. Background shifts to `#0a0a14` (slightly lighter — the maze is more "alive"). Ghost glow intensifies to 4px. Ambient tension: maze walls nearest to ghosts subtly pulse their ghost's color at 5% opacity (each wall segment within 2 tiles of a ghost tints).
- **Objective:** Clear 240 dots. Every power pellet is strategic.
- **Enemies/Obstacles:** Ghosts at 90% speed. Frightened: 5s. Pinky's targeting becomes more aggressive (targets 6 tiles ahead). Clyde's scatter threshold increases to 10 tiles. Ghosts exit box almost immediately (all out by 10s).
- **New mechanic introduced:** **Power pellet strategy matters.** With 5s fright, eating all 4 ghosts requires a tight route. Ghost eat scores double if achieved within 3s: 400→800→1600→3200. Text shows "SPEED BONUS" in `#ffd600` 14px.
- **Difficulty:** 7/10
- **Duration:** ~70 seconds
- **Boss:** None
- **Reward:** Apple fruit (`#ff1744`, 700pts). Ghost Train becomes a true achievement with tight timing.

### Level 5: Dark Pursuit
- **Setting:** Fog radius 3.5 tiles. The maze is oppressively dark. Ghost trails now 7 particles. Power pellets pulse faster (0.5–1.0, 500ms cycle) — they feel urgent, precious. Dot pulse rapid (1s cycle).
- **Objective:** Expert navigation required. Plan every move.
- **Enemies/Obstacles:** Ghosts at 95% speed — nearly matching the player. Frightened: 4s. Chase phases dominate (5s scatter, 25s chase). Inky's behavior becomes more erratic (target offset randomized ±2 tiles each step).
- **New mechanic introduced:** **Tunnel speed parity** — previously ghosts slowed to 40% in tunnels. Now they move at 60%. Tunnels are less safe.
- **Difficulty:** 8/10
- **Duration:** ~65 seconds
- **Boss:** None
- **Reward:** Apple (700pts). The diminishing fright window makes Ghost Train legendary.

### Level 6: Equal Ground
- **Setting:** Fog radius 3 tiles. Walls outside fog completely invisible. The player navigates almost by memory. Ghost glow radius 5px — they're beacons in the dark, beautiful and terrifying. Background `#0c0c18`. A faint heartbeat-like pulse on the background (opacity 0→3%→0 on 2s cycle).
- **Objective:** Ghosts match your speed. Pure strategy and prediction.
- **Enemies/Obstacles:** Ghosts at 100% player speed. Frightened: 3s. No speed advantage — must outmaneuver, not outrun. All ghosts aggressive AI. Scatter phases: 4s scatter, 26s chase.
- **New mechanic introduced:** **Cornering** — player can cut corners slightly faster (0.5 tile head start on turns vs ghosts). This is the only speed advantage left. Mastering tight turns is survival.
- **Difficulty:** 9/10
- **Duration:** ~60 seconds
- **Boss:** None
- **Reward:** Melon fruit (`#69f0ae`, 1000pts). Power pellets are lifelines — 3s is barely enough for 2 ghosts.

### Level 7+: The Phantom Zone (repeating, escalating)
- **Setting:** Fog radius 2.5 tiles (minimum). Maze is a tunnel of darkness with rare glimpses. Ghost glow 6px. Player glow expands to 8px during power pellet (up from 6). Background heartbeat accelerates to 1.5s cycle. Scan-line overlay at 2% opacity (the maze is degrading, reality is thin).
- **Objective:** Pure survival. How deep can you go?
- **Enemies/Obstacles:** Ghosts at 105% player speed — they're faster than you. Frightened: 2s (barely usable). Chase is relentless. Only cornering and maze knowledge save you. Scatter phases: 3s scatter, 27s chase.
- **New mechanic introduced:** **Ghost desperation** — Blinky permanently enters cruise mode (no scatter). When <10 dots remain, all ghosts move at 110% speed. The endgame of every level is a sprint.
- **Difficulty:** 10/10
- **Duration:** Until death
- **Boss:** The maze itself. Every corner is a coin flip. Every power pellet a 2-second prayer.
- **Reward:** Melon (1000pts). Ghost Train at level 7+ is near-impossible (2s window for 4 ghosts) — achieving it triggers an enhanced spectacle: all ghost particles double in count, "LEGENDARY" text in `#ffd600` 28px with 3 pulse cycles, and 5000 bonus points.

## Progression
Levels are the same maze, but the experience transforms:
- **L1–2:** Discovery — learn the maze, safe to experiment, generous fright
- **L3–4:** Strategy — fog tightens, ghosts sharpen, power pellets become tactical
- **L5–6:** Mastery — near-equal speed, minimal fright, cornering matters
- **L7+:** Survival — outmatched, outpaced, relying on pure skill and maze memory

### Narrative Thread
You're a lost soul-light trapped in a phantom maze. The darkness is alive — four phantoms endlessly hunt you. Power pellets are moments of defiance, brief flares that push back the dark. Each level, the maze grows darker and the phantoms stronger. You consume spirit orbs (dots) to sustain yourself. The deeper you go, the more the maze consumes you — fog closes in, phantoms glow brighter, and eventually they're faster than you. How long can the light survive?

### The Ghost Train
The signature moment: eat all 4 ghosts in one power pellet. At Level 1 (8s fright), it's a fun challenge. By Level 4 (5s fright), it's a calculated gamble. At Level 7+ (2s fright), it's legend. The cascading score (200→400→800→1600), the four streams of ghost eyes returning to center, the combo text — it's the game's greatest reward for the game's greatest risk.

## Assets Needed
All procedural:
- **Sprites:** Pac-Man (20px circle, animated mouth 45° open/close 200ms), ghosts (20×22px, semicircle top + 3-bump wavy bottom, directional eye pupils), frightened ghost (blue, zigzag mouth, hollow eyes), eaten ghost (2 white eye dots)
- **Particles:** LittleJS system for dot absorb (2 particles), blaze activation (8 particles radial), spirit capture (10 particles spiral), soul shatter (12 particles), ghost wisp trails (3–7 trailing particles per ghost), fruit sparkle (6 particles)
- **Fog of War:** Radial gradient overlay — full black canvas with circular cutout at player position. Radius varies by level (5→2.5 tiles). Power pellet expands to 8 tiles.
- **Audio:** LittleJS `zzfx()` for 8 sounds: `munch` (alternating 260/300Hz), `power_surge`, `spirit_capture`, `soul_shatter`, `fruit_chime`, `siren_low` (looping), `siren_high` (looping), `maze_clear`. Plus ghost warning ambient.
- **AI:** Ghost state machine: chase (unique targeting per ghost), scatter (corner targets), frightened (random turns), eaten (eyes return to box). Scatter/chase timer system per level.
- **Maze:** 28×31 tile array, standard Pac-Man layout. Tunnels on row 14.
- **Storage:** localStorage for high score
- **HUD:** Score top-left (`#b0bec5` 14px monospace), high score top-center, lives bottom-left (mini Pac icons), level indicator bottom-right, fruit display bottom-center
