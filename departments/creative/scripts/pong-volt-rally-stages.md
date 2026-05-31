# Pong (Volt Rally) — Stage/Scenario Script

## Overview
Volt Rally is a high-voltage electric duel where two Tesla-coil paddles smash a plasma orb across a dark field. Stages are implicit — triggered by the cumulative rally count within a match. As rallies grow longer, the court charges up with increasingly dramatic electrical effects. The player's goal: reach 11 points first (win by 2, cap 15). Each rally is a micro-narrative of building tension.

## Stages

### Stage 1: Cold Start (Rally 0–4)
- **Setting:** Near-black void (`#050510`), faint court border (`#1a1a3a`, 1px), dashed center line barely visible. Calm, clinical silence.
- **Objective:** Return the ball. Learn paddle movement and timing.
- **Enemies/Obstacles:** AI paddle has 60ms reaction delay — forgiving.
- **New mechanic introduced:** Basic paddle hit + wall bounce. Ball at 4px/frame.
- **Difficulty:** 1/10
- **Duration:** ~3 seconds per rally
- **Boss:** None
- **Reward:** Electric hum (`electric_hum`) fades in at 5% volume.
- **Visual cue:** Paddles glow at 70% brightness. Ball trail shows 3 ghost positions, 200ms decay.

### Stage 2: First Spark (Rally 5–9)
- **Setting:** Court border brightens to `#2a2a4a`. Paddle glow increases to 100%. Center line dashes become more visible (opacity 30%→50%).
- **Objective:** Build rally length. Discover the ball is getting faster.
- **Enemies/Obstacles:** Ball at 5.5px/frame. AI reaction delay unchanged.
- **New mechanic introduced:** **Ball speed increase** — player feels the acceleration for the first time. Ball trail extends to 4 ghost positions.
- **Difficulty:** 3/10
- **Duration:** ~2.5 seconds per rally
- **Boss:** None
- **Reward:** `hit_zap` sound gains a subtle reverb tail (50ms).

### Stage 3: Live Wire (Rally 10–14)
- **Setting:** Faint lightning arcs appear — 1 random arc every 500ms between top and bottom walls (`#3a3a6a`, 2px lines, 150ms visible then fade). Court feels alive.
- **Objective:** Maintain the rally. Points scored now worth 3× instead of 1×.
- **Enemies/Obstacles:** Ball at 7px/frame. AI reaction delay drops by 5ms per AI score.
- **New mechanic introduced:** **Rally bonus scoring** (3× after 10 hits). **Rally counter** appears (`#ffab00`, 14px, pulses 0.9–1.1 scale on 600ms sine). `rally_charge` sound plays once (rising sine 200→800Hz, 150ms).
- **Difficulty:** 5/10
- **Duration:** ~2 seconds per rally
- **Boss:** None
- **Reward:** Ambient hum volume rises to 12%, pitch shifts up by 50Hz.

### Stage 4: Overcharge (Rally 20+)
- **Setting:** Full electrical storm. Lightning arcs fire every 300ms, `#4a4a8a`. Ball radius grows 8→12px. Ball trail extends to 8 ghost positions. Both paddles vibrate (±1px random offset per frame). Court border pulses (`#3a3a6a`↔`#5a5aaa`, 1000ms sine).
- **Objective:** Survive the chaos. Scoring here is worth 5× points.
- **Enemies/Obstacles:** Ball at 8px/frame (max speed), larger and harder to track. AI at minimum delay.
- **New mechanic introduced:** **Overcharge mode**. `rally_overcharge` sound plays (distorted C3+E3 chord, 200ms). Ambient hum swells to 25% volume. Paddles vibrate. Scoring triggers 30-particle dual-color explosion.
- **Difficulty:** 8/10
- **Duration:** ~1.5 seconds per rally
- **Boss:** None — the rally itself is the boss
- **Reward:** If player scores during overcharge: massive particle burst (30 particles, half `#00e5ff` half `#ff6d00`, size 5→0px, spread 100px), screen flash white 50ms at 10% opacity.

## Progression
Stages are per-rally, not per-match. Each new rally resets to Stage 1 speed (4px/frame) but effects from previous overcharges leave residual glow on the court — a subtle `#1a1a2e` ambient that persists until the next score, reminding the player of the intensity they survived.

**Narrative thread:** Two energy sources face off in a dark void. Each rally charges the arena until it can barely contain the power. Scoring is a violent discharge that resets the field — but traces of energy linger. By late game (8–8 score or higher), the baseline court glow is permanently elevated, making the entire match feel like it's about to explode.

**Late-game escalation:** When both players reach 8+ points:
- Baseline court border color shifts to `#2a2a5a` (permanent)
- Ambient hum starts at 10% volume instead of 5%
- Ball starts at 5px/frame instead of 4px/frame
- Lightning arcs appear at rally 7 instead of 10

**Deuce mechanic (10–10 or higher):** Screen border pulses red (`#ff1744`, 2px, 500ms sine) to signal "must win by 2." Text "DEUCE" appears center-top in `#ff1744`, 18px, flicker effect (opacity 0.6–1.0, 80ms toggle).

## Match Flow

| Score State | Court Mood | Audio Shift |
|-------------|-----------|-------------|
| 0–0 to 3–3 | Dark, calm | Hum at 5% |
| 4+ either side | Court border brightens | Hum at 8% |
| 8+ both sides | Permanent elevated glow | Hum at 10%, pitch +50Hz |
| 10–10 (deuce) | Red border pulse | Hum at 15%, tremolo LFO |
| Match point | Winner's paddle color floods border | Hum drops to silence (tension) |

## Victory Celebration
- **Normal win (< 10 pts):** Winner's paddle flashes 3× (150ms each), 30-particle burst in winner's color, `win_fanfare` plays (3 ascending power chords).
- **Deuce win (11+ pts):** Everything above + full-screen flash in winner's color at 15% opacity (200ms), both paddles emit continuous particle streams (10 particles/second) for 2 seconds, "CLUTCH" text floats up in `#ffea00` 24px bold.

## Assets Needed
All procedural (LittleJS + Canvas 2D):
- Particle system: electric discharge (8p), spark shower (6p), ball shatter (16p), lightning arcs (line drawing), overcharge explosion (30p), victory burst (30p)
- Audio via `zzfx()`: 7 sound effects + ambient hum
- AI paddle: configurable reaction delay (60ms default, -5ms per AI score, min 20ms), speed = ball speed × 0.85
- No sprites, no external images, no audio files
- localStorage: `arcade_pong_highscore` (highest winning margin), `arcade_pong_overcharge_reached` (boolean)
