# Snake (Neon Serpent) — Stage/Scenario Script

## Overview
Neon Serpent is a flow-state arcade experience where the player guides a glowing cyberpunk snake through increasingly intense stages. Each stage introduces a new mechanic or visual shift, keeping the experience fresh as difficulty ramps. The player's goal: survive as long as possible, chain combos, and chase the high score. Stages are implicit (triggered by food count thresholds) — no loading screens, just seamless escalation.

## Stages

### Stage 1: Awakening (Food 0–4)
- **Setting:** Deep void (`#0a0a1a`), subtle grid (`#141428`), minimal visual noise. Calm, empty, inviting.
- **Objective:** Eat 5 food pellets. Learn movement.
- **Enemies/Obstacles:** None. Open grid, no walls kill yet (wrap-around mode OFF, but board is spacious).
- **New mechanic introduced:** Basic movement + food pickup + trail afterglow (300ms).
- **Difficulty:** 1/10
- **Duration:** ~15 seconds
- **Boss:** None
- **Reward:** Speed remains 120ms/tick. Ambient hum (`ambient_hum`) fades in at 5% volume.
- **Visual cue:** Grid lines are at 30% opacity. Food pulses gently (800ms sine, scale 0.85–1.15).

### Stage 2: First Pulse (Food 5–9)
- **Setting:** Grid lines brighten to 50% opacity (`#1e1e3c`). Background gets a barely-visible radial gradient centered on snake head (radius 200px, `#0f0f2a`).
- **Objective:** Eat 5 more food. Discover combos.
- **Enemies/Obstacles:** None. Self-collision active (always was).
- **New mechanic introduced:** **Combo system** unlocks. HUD shows combo counter when active. Eating within 2000ms = combo tier +1.
- **Difficulty:** 2/10
- **Duration:** ~18 seconds
- **Boss:** None
- **Reward:** Speed drops to 115ms/tick. Combo tutorial text appears once: "COMBO ×2!" floats up on first combo (`#ffea00`, 20px, 600ms float-up).

### Stage 3: The Garden (Food 10–14)
- **Setting:** Faint particle "fireflies" appear in background — 5 ambient particles drifting slowly, `#39ff14` at 8% opacity, size 2px, random drift 0.3px/frame.
- **Objective:** Eat 5 food. First bonus food appears.
- **Enemies/Obstacles:** None.
- **New mechanic introduced:** **Bonus food** (gold diamond `#ffea00`, spinning 180°/s) spawns at food #10. Worth 50pts × combo multiplier. Despawns after 5000ms with 1000ms shrink.
- **Difficulty:** 3/10
- **Duration:** ~20 seconds
- **Boss:** None
- **Reward:** Speed 110ms/tick. Ambient hum volume rises to 10%.

### Stage 4: Current (Food 15–19)
- **Setting:** Grid lines now pulse — opacity oscillates 40%↔60% on a 4000ms sine wave. Background fireflies increase to 10.
- **Objective:** Eat 5 food. Manage growing length.
- **Enemies/Obstacles:** Snake length becoming a spatial constraint.
- **New mechanic introduced:** **Level-up ring pulse** triggers every 5th food (already happened at 5, 10, 15 — but now it feels impactful because the ring is bigger: radius 0→100px).
- **Difficulty:** 4/10
- **Duration:** ~22 seconds
- **Boss:** None
- **Reward:** Speed 105ms/tick. Snake body segments gain a subtle 1px `#2acc0e` border glow.

### Stage 5: Tension (Food 20–24)
- **Setting:** Background shifts to `#08081a` (slightly darker). Grid color becomes `#1a1a40`. A vignette effect — edges of canvas darken (20px gradient to black at 30% opacity). The arena feels tighter.
- **Objective:** Survive and score. Space is becoming precious.
- **Enemies/Obstacles:** Snake length is now a real threat. Corridors between body segments narrow.
- **New mechanic introduced:** **Speed milestone indicator** — a brief screen-edge pulse (`#ff1744`, 2px border flash, 200ms) when speed drops below 100ms.
- **Difficulty:** 5/10
- **Duration:** ~25 seconds
- **Boss:** None
- **Reward:** Speed 100ms/tick. Score multiplier text size increases to 18px.

### Stage 6: Overdrive (Food 25–34)
- **Setting:** Fireflies turn `#ff1744` (red). Grid pulses faster (2000ms cycle). Background radial gradient follows snake head more visibly (radius 150px, `#12122e`).
- **Objective:** Chain combos for maximum score. Every food counts.
- **Enemies/Obstacles:** Tight corridors. Self-collision increasingly likely.
- **New mechanic introduced:** **Combo tier 3+ visual** — at combo ×3, snake body segments flash alternating `#39ff14`/`#7dff6b` every 200ms. At combo ×5, Mega Combo triggers (full spec in creative-direction.md).
- **Difficulty:** 6–7/10
- **Duration:** ~50 seconds (10 food in this stage)
- **Boss:** None
- **Reward:** Speed 95→90ms/tick. Ambient hum gets a subtle tremolo effect (LFO rate doubles).

### Stage 7: The Zone (Food 35–44)
- **Setting:** Background becomes `#050510`. All fireflies gone — replaced by a single slow-moving background wave (horizontal sine distortion of grid lines, amplitude 2px, period 600px, speed 0.5px/frame). The grid breathes.
- **Objective:** Pure survival. Flow state or die.
- **Enemies/Obstacles:** Extreme length. Speed is punishing. One wrong turn = death.
- **New mechanic introduced:** **Heartbeat audio** — a low `thump` (60Hz sine, 50ms, every 1000ms) replaces ambient hum, volume 15%. Intensity increases with speed.
- **Difficulty:** 8–9/10
- **Duration:** ~60 seconds
- **Boss:** None
- **Reward:** Speed 85→80ms/tick. Snake head glow radius increases to 4px.

### Stage 8: Infinity (Food 45+)
- **Setting:** Grid lines disappear entirely. Background is pure `#030308`. Only the snake, food, and particles exist in the void. Minimalist. Stark. Beautiful.
- **Objective:** How long can you last? Every food eaten is a personal record.
- **Enemies/Obstacles:** Maximum speed. Maximum length. The entire board is your body.
- **New mechanic introduced:** **Afterimage trail** — snake leaves a full-body afterimage every 500ms that fades over 1500ms (3 afterimages visible at once, stacking at 15% opacity each).
- **Difficulty:** 10/10
- **Duration:** Until death
- **Boss:** None — *you are your own boss*
- **Reward:** Speed locked at 50ms/tick. Score per food increases to 15 (from 10). Every food pickup triggers the "star burst" particle effect (usually reserved for bonus food).

## Progression
Stages flow seamlessly — no transition screens. Environmental changes (grid opacity, fireflies, background color, audio) shift gradually over 500ms when crossing a threshold. The player should feel the world reacting to their skill without interruption.

**Narrative thread:** The snake "wakes up" in a quiet digital void, gradually awakening the world around it through consumption. By Stage 8, it has consumed everything — even the grid itself — and exists alone in the dark, a neon ouroboros.

**Difficulty curve:** Linear from 1–5, then steepening. Stage 6–7 is where most players die. Stage 8 is aspirational — reaching it should feel like an achievement.

**Unlock:** Reaching Stage 8 (45 food) for the first time triggers a one-time celebration: 3-second particle rain (50 particles falling from top of screen, mixed `#39ff14` and `#ffea00`, size 2–4px). Text: "∞ THE ZONE ∞" in `#39ff14`, 28px, pulsing scale 0.95–1.05.

## Assets Needed
All procedural (LittleJS + Canvas 2D):
- Particle system: food burst (12p), star burst (20p), death sparks (8p), body dissolve (sequential), ring pulse, screen flash, combo flash, particle rain, afterimage trail
- Audio via `zzfx()`: 7 sound effects + ambient pad + heartbeat
- No sprites, no external images, no audio files
- localStorage: `arcade_snake_highscore` (number), `arcade_snake_zone_reached` (boolean)
