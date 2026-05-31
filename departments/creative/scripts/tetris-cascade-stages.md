# Tetris (Cascade) — Stage/Scenario Script

## Overview
Cascade is a zen-industrial Tetris experience where falling blocks are liquid-metal fragments solidifying into place. Unlike traditional Tetris with discrete levels, Cascade uses a continuous tension system: the deeper your stack grows, the more the world reacts — background color shifts, ambient sounds intensify, and visual effects escalate. Stages are implicit, triggered by level thresholds. The player's goal: clear lines, chain combos, survive the acceleration, and chase the Tetris Meltdown.

## Stages

### Stage 1: Cold Forge (Level 1–2, Lines 0–19)
- **Setting:** Deep steel void (`#0a0e14`). Grid lines barely visible (`#111820`). Clean, minimal, meditative. Well border `#1c2833` steady.
- **Objective:** Learn stacking and line clears. Clear 20 lines to reach Level 3.
- **Enemies/Obstacles:** None. Standard 10×20 well. Drop speed 800ms→680ms.
- **New mechanic introduced:** Basic movement, rotation (SRS), hard drop, ghost piece preview (20% opacity outline). Next piece display in right panel.
- **Difficulty:** 1/10
- **Duration:** ~90 seconds
- **Boss:** None
- **Reward:** Each line clear plays `drain_hiss` (300ms white noise, descending bandpass 2kHz→500Hz). Solidify flash on piece lock (150ms white highlight on cell corners).
- **Visual cue:** Food—er, pieces—drop smoothly. Grid is calm. Hard drop generates 4 particles (white, 2→0px, spray left/right from impact point, 100ms).

### Stage 2: Warm Metal (Level 3–5, Lines 20–49)
- **Setting:** Grid lines brighten slightly (`#141c28`, 40% opacity). Background stays `#0a0e14` but a faint radial gradient appears centered on the well (radius 300px, `#0e1218`).
- **Objective:** Build rhythm. Discover doubles and triples. Clear 30 more lines.
- **Enemies/Obstacles:** Drop speed 620ms→440ms. Pieces arrive noticeably faster.
- **New mechanic introduced:** **Hold piece** unlocks (press C). HUD shows held piece in right panel below next piece. "HOLD" label appears in `#78909c` 12px. One swap per drop.
- **Difficulty:** 3/10
- **Duration:** ~75 seconds
- **Boss:** None
- **Reward:** Double clear triggers double drain + horizontal light bar (`#ffffff` at 15% opacity, 500ms). Triple clear triggers staggered cascade (100ms per row top→bottom) + screen vibrate ±1px 200ms. Score multiplier text floats up: "×2" or "×3" in `#b0bec5`, 16px, 400ms.

### Stage 3: Crucible (Level 6–8, Lines 50–79)
- **Setting:** Background begins shifting — `#0a0e14` tints toward `#0e0c14` (subtle warm shift). Grid pulses: line opacity oscillates 30%↔50% on 4000ms sine wave. 3 ambient particles drift in background (metallic sparks, `#ff9800` at 6% opacity, 1px, random drift 0.2px/frame).
- **Objective:** Survive the speed. Chase Tetris (4-line) clears. Clear 30 more lines.
- **Enemies/Obstacles:** Drop speed 380ms→260ms. Pieces feel fast. Stack management critical.
- **New mechanic introduced:** **T-Spin detection** activates. T-spin clears get 2× score multiplier + "T-SPIN" text flash (`#9c27b0`, 20px, pulse 1.0→1.3→1.0 over 400ms).
- **Difficulty:** 5/10
- **Duration:** ~60 seconds
- **Boss:** None
- **Reward:** Level-up border pulse (well border brightens to `#4fc3f7`, fades back to `#1c2833` over 400ms). "LEVEL X" text appears center-screen 24px `#b0bec5`, fades 400ms. `power_surge` sound (rising square 200→600Hz, 400ms).

### Stage 4: Red Heat (Level 9–11, Lines 80–109)
- **Setting:** Background shifts to `#120a0e` (red-brown tint). Grid lines now `#1c1418` with reddish cast. Ambient spark particles increase to 8, colors mix `#ff9800` and `#f44336` at 8% opacity. Well border subtly pulses `#1c2833`↔`#2c2030` on 6000ms sine.
- **Objective:** Survive intense speed. Every line matters. Clear 30 more lines.
- **Enemies/Obstacles:** Drop speed 200ms→140ms. Barely time to think. Lock delay becomes precious.
- **New mechanic introduced:** **Combo counter** — consecutive clears (no dry drops between) show "COMBO ×N" in `#ffc107`, 18px, stacking multiplier. Each combo level adds 50×level bonus. Combo breaks on any lock without a clear.
- **Difficulty:** 8/10
- **Duration:** ~50 seconds
- **Boss:** None
- **Reward:** Screen tension is palpable. Background `#1a0a0a` fully red-tinted. Ambient hum (`metal_ambient`, low 60Hz drone) fades in at 8% volume. Single clears now also produce 2 particles per cell (piece color, 3→0px, fall downward).

### Stage 5: Meltdown Zone (Level 12+, Lines 110+)
- **Setting:** Full tension. Background `#1a0a0a`. Grid lines `#201414`. Ambient particles: 12, mixed all piece colors at 10% opacity, drifting upward (heat rising). Well border oscillates `#2c2030`↔`#3a1c28` on 3000ms sine. Scan-line overlay: horizontal lines every 4px at 3% opacity (CRT stress effect).
- **Objective:** Pure survival. Drop speed locked at 100ms. Chase the highest score possible.
- **Enemies/Obstacles:** 100ms drop speed — pieces practically slam down. Stack management is frantic. Every misplaced piece is potentially fatal.
- **New mechanic introduced:** **Meltdown multiplier** — all scores are ×1.5 base in this stage. Tetris clears (4-line) are worth 800×level×1.5. The Tetris Meltdown visual becomes even more dramatic: 60 particles (up from 40), screen shake ±3px for 400ms (up from ±2px/300ms), "TETRIS!" text at 42px (up from 36).
- **Difficulty:** 10/10
- **Duration:** Until death
- **Boss:** The stack itself. Every row is the enemy.
- **Reward:** Bragging rights. High score saved to localStorage. Game over sequence: pieces gray out row-by-row bottom→top (50ms/row), well darkens, final score with "NEW BEST!" (`#ffc107` 24px pulse) if applicable.

## Progression
Stages flow seamlessly — no loading screens, no interruptions. The world shifts around you:
- **Level 1–2:** Cold, calm, learning → steel blue void
- **Level 3–5:** Warming up, rhythm building → subtle radial gradient, hold piece unlocks
- **Level 6–8:** Crucible heat → grid pulses, ambient sparks, T-spins matter
- **Level 9–11:** Red heat → background goes red, combos unlock, tension hum
- **Level 12+:** Meltdown zone → full tension, CRT stress, survival mode

The difficulty curve is exponential: the first 80 lines feel like a warm-up, the next 30 feel urgent, and everything past 110 is pure adrenaline.

### Narrative Thread
You're forging something — each line cleared is metal refined, each Tetris is a meltdown that purifies the forge. The deeper you go, the hotter the forge burns. When it finally overwhelms you, the forge cools (gray-out animation) and your score is the quality of what you forged.

## Assets Needed
All procedural — no external sprites:
- **Particles:** LittleJS particle system for solidify flash, dissolve drain (single/double/triple/Tetris), hard drop impact, ambient metallic sparks, level-up border pulse
- **Audio:** LittleJS `zzfx()` for all 8 sounds: `metal_tick` (move), `gear_click` (rotate), `clamp_thud` (lock), `slam_impact` (hard drop), `drain_hiss` (single clear), `meltdown_boom` (Tetris), `power_surge` (level-up), `shutdown` (game over). Plus `metal_ambient` (continuous low drone, Web Audio oscillator 60Hz sine at 8% volume)
- **Rendering:** Canvas 2D — 28×28px cells in 30×30 grid slots, 2px border-radius, bevel effect (1px lighter top/left, 1px darker bottom/right). Ghost piece: outlined, 20% opacity. Next + hold piece preview panels.
- **Rotation:** Standard SRS with wall kicks
- **Storage:** localStorage for high score persistence
- **HUD:** Score, level, lines cleared (right panel, `#b0bec5` 14px monospace). Combo counter (center-top, `#ffc107` 18px, fades when combo breaks). T-spin callout (`#9c27b0` 20px pulse).
