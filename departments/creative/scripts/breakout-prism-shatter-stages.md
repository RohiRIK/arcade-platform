# Breakout (Prism Shatter) — Stage/Scenario Script

## Overview
Prism Shatter is a crystal-breaking arcade experience where the player controls a silver mirror paddle, bouncing a ball of light into rows of colored crystals. Each level introduces new brick types and layouts, escalating from a simple grid to a fortress. The player's goal: shatter all destructible bricks, chain combos for score multipliers, and survive 5 increasingly complex levels. Every clear triggers a prismatic explosion — a visual reward that makes mastery feel earned.

## Stages

### Stage 1: First Light (Standard Grid)
- **Setting:** Deep purple-black void (`#0d0015`). 10×5 grid of crystal bricks — 5 color rows from top: magenta (`#e040fb`), purple (`#7c4dff`), blue (`#448aff`), green (`#00e676`), yellow (`#ffea00`). Clean, symmetrical, inviting.
- **Objective:** Clear all 50 bricks.
- **Enemies/Obstacles:** None. Pure grid, no special bricks.
- **New mechanic introduced:** Ball launch from paddle (click/space), paddle movement (left/right or mouse), combo system (consecutive hits without paddle = multiplier).
- **Difficulty:** 2/10
- **Duration:** ~45 seconds
- **Boss:** None
- **Reward:** 500pt clear bonus. Ball speed stays at 3.5px/frame. Combo tutorial text appears on first 3-hit combo: "COMBO ×1.75!" in `#ffea00`, 20px, 500ms float-up.
- **Layout data:** `[1,1,1,1,1,1,1,1,1,1]` × 5 rows (1 = standard brick)

### Stage 2: Crystal Pillars (Indestructible Intro)
- **Setting:** Same void. 10×5 grid with 2 indestructible bricks (`#505050`, no shatter animation — ball bounces with a deep `thunk` at 220Hz, 100ms). Indestructible bricks have a metallic sheen — 1px white top highlight, 1px dark bottom shadow.
- **Objective:** Clear all 48 destructible bricks. Indestructible bricks remain.
- **Enemies/Obstacles:** 2 indestructible bricks at positions (3,2) and (6,2) — center-ish, forcing angled shots.
- **New mechanic introduced:** Indestructible bricks as strategic deflectors. Ball bounces off them at normal angles. Player learns to use them for trick shots.
- **Difficulty:** 4/10
- **Duration:** ~55 seconds
- **Boss:** None
- **Reward:** 1000pt clear bonus. Ball speed increases to 4.0px/frame. Power-ups begin dropping (10% chance per brick destroyed).
- **Layout data:** `[1,1,1,1,1,1,1,1,1,1]` × 5 rows, with `X` at (3,2) and (6,2) (X = indestructible)

### Stage 3: Crystal Fortress (Multi-Hit + Indestructible)
- **Setting:** Grid expands to 10×6. 4 indestructible bricks form a diamond shape at rows 2-3. 4 multi-hit bricks (2 hits to destroy) at corners of row 4 — first hit adds a crack overlay (2 diagonal white lines, 1px, 40% opacity), second hit shatters normally.
- **Objective:** Clear all 52 destructible bricks (48 standard + 4 multi-hit).
- **Enemies/Obstacles:** 4 indestructible bricks at (2,1), (7,1), (4,2), (5,2) — diamond formation. 4 multi-hit bricks at (0,3), (9,3), (0,4), (9,4).
- **New mechanic introduced:** Multi-hit bricks. First hit: crack appears + glass_clink at 50% pitch (900Hz). Second hit: full shatter + normal clink. Multi-hit bricks worth 2× points.
- **Difficulty:** 5/10
- **Duration:** ~70 seconds
- **Boss:** None
- **Reward:** 1500pt clear bonus. Ball speed 4.5px/frame. Ambient particle fireflies appear — 3 slow-drifting particles in `#7c4dff` at 10% opacity, size 2px.

### Stage 4: Labyrinth (Pattern Layout)
- **Setting:** 10×6 grid with a designed pattern — indestructible bricks form a zigzag wall across rows 2-3, creating channels the ball must navigate. 6 multi-hit bricks guard the top two rows. Background gets a barely-visible radial gradient centered on ball position (radius 150px, `#1a0030`).
- **Objective:** Clear all 42 destructible bricks. Strategic angles required.
- **Enemies/Obstacles:** 6 indestructible bricks forming zigzag: (1,1), (3,1), (5,2), (7,2), (4,1), (8,1). 6 multi-hit bricks at (0,0), (2,0), (5,0), (7,0), (9,0), (4,0) — top row fortress.
- **New mechanic introduced:** Ball trail effect — 3 afterimages at 60%, 30%, 10% opacity, spaced 2 frames apart. Trail color matches ball state (white/yellow/orange depending on combo).
- **Difficulty:** 7/10
- **Duration:** ~90 seconds
- **Boss:** None
- **Reward:** 2000pt clear bonus. Ball speed 5.0px/frame. Background hue shifts: void becomes `#0d0020` (slightly warmer purple).

### Stage 5: The Vault (Fortress Layout — Final Level)
- **Setting:** 10×7 grid — maximum density. Indestructible bricks form a protective shield over 8 multi-hit bricks in the top 2 rows. The fortress must be cracked from the sides and through gaps. Background pulses subtly (opacity oscillation 90-100%, period 3000ms). Ambient particles increase to 8, mixed colors (`#e040fb`, `#448aff`).
- **Objective:** Clear all 54 destructible bricks. This is the mastery test.
- **Enemies/Obstacles:** 8 indestructible bricks forming a roof: (1,0), (2,0), (3,0), (4,0), (5,0), (6,0), (7,0), (8,0). 8 multi-hit bricks directly below: (1,1), (2,1), (3,1), (4,1), (5,1), (6,1), (7,1), (8,1). Remaining rows 2-6: standard bricks. Gaps at columns 0 and 9 in the roof for entry.
- **New mechanic introduced:** None new — this is the execution test. All mechanics combined.
- **Difficulty:** 9/10
- **Duration:** ~120 seconds
- **Boss:** None (the layout IS the boss)
- **Reward:** 2500pt clear bonus + "VAULT CRACKED" title in `#ffea00` at 36px, 1200ms display. Game loops back to Stage 1 with +1.0px/frame speed increase (hard mode).

## Progression
Stages are explicit levels (clear to advance). Difficulty curve: linear speed increase (3.5→5.5px/frame) combined with layout complexity. The indestructible bricks teach strategic bouncing in Stage 2, multi-hit bricks teach patience in Stage 3, pattern layouts teach precision in Stage 4, and the fortress combines everything in Stage 5. Combos reward aggressive play — players who aim for bank shots through tight gaps get massive score multipliers.

**Score curve:**
| Level | Bricks | Base Points | Max w/ Combo (3.0×) | Clear Bonus | Potential Total |
|-------|--------|-------------|---------------------|-------------|-----------------|
| 1 | 50 | ~1000 | ~3000 | 500 | ~3500 |
| 2 | 48 | ~960 | ~2880 | 1000 | ~3880 |
| 3 | 52 | ~1200 | ~3600 | 1500 | ~5100 |
| 4 | 42 | ~1100 | ~3300 | 2000 | ~5300 |
| 5 | 54 | ~1500 | ~4500 | 2500 | ~7000 |

## Assets Needed
All procedural — no external sprites:
- LittleJS particle system: crystal shatter (6 particles, gravity 0.5px/f²), prismatic explosion (50 particles), power-up gems
- LittleJS `zzfx()`: glass_clink (1800Hz, variable by row), mirror_ping (880Hz), drop_womp (400→100Hz), chime_cascade (5-note arp), heat_sizzle (white noise), victory_cascade (C5-E5-G5-C6), gem_pickup (660→990Hz)
- Canvas 2D: brick rectangles 54×18px, paddle 80×12px, ball radius 7px, crack overlays for multi-hit
- 5 level layout arrays (nested arrays of 0/1/2/X — empty/standard/multi-hit/indestructible)
- localStorage for high score persistence
