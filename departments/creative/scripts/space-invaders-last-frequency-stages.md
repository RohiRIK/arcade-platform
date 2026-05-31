# Space Invaders (Last Frequency) — Stage/Scenario Script

## Overview
Last Frequency is a retro-radio-signal defense game viewed through a CRT phosphor screen. The player operates a ground station cannon intercepting alien transmissions that materialize as holographic invaders. Five waves of increasing intensity, each introducing new threats and escalating the radio-static atmosphere. The goal: survive all 5 waves, destroy every invader, and hunt the elusive 300-point UFO.

## Stages

### Wave 1: First Contact (55 invaders, easy)
- **Setting:** CRT boot-up. Background `#020408` with horizontal scan lines every 2px at 15% opacity (`#0a0a14`). Vignette darkens edges 20%. Clean signal — minimal static.
- **Objective:** Destroy all 55 invaders (5 rows × 11). Learn aiming and timing.
- **Enemies/Obstacles:** Invaders step at 500ms intervals. Fire rate: 0.5 bullets/second (one every 2s average). Invader bullets are red zigzags (`#ff1744`, 2×6px). 4 shields (`#00bfa5`) fully intact.
- **New mechanic introduced:** Player cannon (`#00ff88`, 26×16px) moves left/right, fires single bullet at a time. Ghost invaders: destroyed invaders leave a 200ms afterimage at 15% opacity.
- **Difficulty:** 2/10
- **Duration:** ~45 seconds
- **Boss:** None. UFO (`#e040fb`) may appear once (20–30s random timer), crosses in 6s.
- **Reward:** Wave clear bonus: 1000pts. `frequency_sweep` sound (ascending sine 200→2000Hz, 500ms). Scan-line sweep top→bottom in `#00ff88` at 10% opacity.
- **Visual cue:** March cadence `march_blip` starts at 120Hz, steady and calm. Row flash: moving row brightens 20% per step (50ms).

### Wave 2: Signal Noise (55 invaders, moderate)
- **Setting:** Background unchanged but scan lines intensify slightly (18% opacity). Occasional static flicker: every 8–12s, 3 random scan lines flash to 40% opacity for 100ms. The signal is degrading.
- **Objective:** Destroy all 55 invaders. Manage shields — they're eroding.
- **Enemies/Obstacles:** Invaders start at 450ms step. Fire rate: 0.8/s. Invader bullets now have a slight homing tendency (±2px drift toward player over bullet lifetime). Shields have residual damage from Wave 1.
- **New mechanic introduced:** **Score multiplier display** — consecutive kills without missing show "×N" in `#00ff88` 14px next to score. Miss resets to ×1. Max ×5.
- **Difficulty:** 4/10
- **Duration:** ~50 seconds
- **Boss:** None. UFO frequency: may appear 1–2 times.
- **Reward:** Wave clear bonus: 2000pts. March pitch has increased ~30Hz from invader losses in prior wave. Shields partially regenerate between waves (50% of damage repaired, pixel blocks regrow with 200ms fade-in).

### Wave 3: Interference (55 invaders, challenging)
- **Setting:** CRT degradation visible. Scan lines at 22% opacity. Static flickers every 5–8s now. New: occasional horizontal tear — a 4px-tall band shifts 3px right for 150ms, every 10–15s. Background shifts to `#030610` (slightly more blue, like signal interference).
- **Objective:** Survive and clear. Invaders are closing in faster.
- **Enemies/Obstacles:** Start at 400ms step. Fire rate: 1.2/s. Invaders start 1 row lower than Waves 1–2 (closer to player). Red zigzag bullets are joined by new type: green straight bullets (`#69f0ae`, 2×8px) from bottom-row invaders, faster travel (6px/frame vs 4px).
- **New mechanic introduced:** **Panic zone** — when invaders reach row 16/20 (4 rows from player), well border starts pulsing `#ff1744` at 8% opacity on 1000ms sine. `march_blip` pitch is now 180Hz+.
- **Difficulty:** 6/10
- **Duration:** ~55 seconds
- **Boss:** None. UFO may appear 1–2 times. UFO now drops a single bomb when directly above player (dodge warning: `#e040fb` circle expands from UFO position for 300ms before bomb drops).
- **Reward:** Wave clear bonus: 3000pts. Brief screen stabilization: static flickers pause for 3s after wave clear. Relief moment.

### Wave 4: Critical Mass (55 invaders, hard)
- **Setting:** CRT is stressed. Scan lines 25% opacity. Static flickers every 3–5s, now 5 lines at a time. Horizontal tears every 6–10s, more severe (6px shift, 200ms). Faint phosphor burn: a ghost image of the invader grid from Wave 3 lingers at 3% opacity for the first 5s of Wave 4 (CRT burn-in effect).
- **Objective:** Survive the onslaught. Shields are nearly gone.
- **Enemies/Obstacles:** Start at 350ms step. Fire rate: 1.5/s. Mix of red zigzag and green straight bullets. New: **double-shot invaders** — top row (red, `#ff1744`) occasionally fires 2 bullets simultaneously (side-by-side, 8px gap). Shields heavily damaged.
- **New mechanic introduced:** **Rapid fire** — player can now fire 2 bullets on screen simultaneously (up from 1). Cooldown reduced from 300ms to 150ms between shots.
- **Difficulty:** 8/10
- **Duration:** ~60 seconds
- **Boss:** None. UFO appears guaranteed at least once. 300-point UFO chance increases to 1/6 (from 1/8).
- **Reward:** Wave clear bonus: 4000pts. Screen does a full CRT refresh: horizontal green line sweeps top→bottom (200ms), screen clears all artifacts, momentary pristine image.
- **Visual cue:** March `blip` now at 220Hz+. The entire screen subtly vibrates ±0.5px continuously (tension tremor).

### Wave 5: Last Frequency (55 invaders, extreme)
- **Setting:** Maximum CRT degradation. Scan lines 30% opacity. Static flickers every 2–3s, 8 lines at a time. Horizontal tears every 4–6s. New: **vertical roll** — entire screen shifts up 2px then snaps back every 8s (old TV vertical hold issue). Background `#040810` with faint `#ff1744` interference bands at bottom (where invaders start closest). Phosphor glow around all entities increased by 1px.
- **Objective:** This is it. Clear the final wave or die trying.
- **Enemies/Obstacles:** Start at 300ms step. Fire rate: 2.0/s. All bullet types active. Top two rows fire double-shots. Invaders start 2 rows lower than default (very close). Shields: only 2 remain (outer two destroyed by "EMP" at wave start — flash white 200ms then dissolve, 8 particles each).
- **New mechanic introduced:** **Signal boost** — a pickup (`#00ff88` diamond, 8×8px, pulsing) spawns at a random destroyed invader position once per wave. Collecting it grants 3s of triple fire rate (3 bullets on screen, 100ms cooldown) + player glows brighter (`#00ff88` at full intensity + 4px glow). Sound: `signal_catch` arpeggio on collect.
- **Difficulty:** 10/10
- **Duration:** ~70 seconds
- **Boss:** The wave itself is the boss. UFO appears guaranteed twice. Second UFO is a **Super UFO**: larger (48×20px), `#e040fb` with white stripes, takes 3 hits to destroy, worth 500pts. Each hit produces magenta explosion (8 particles). On destruction: full "Last Frequency Catch" spectacle.
- **Reward:** Game complete! Victory sequence: all invader positions flash in their row colors (100ms on/off × 3), then CRT power-off animation in reverse — screen expands from center line, all text turns green, "TRANSMISSION TERMINATED" appears at 24px `#00ff88` center-screen, score tallies digit by digit (20ms/digit), high score comparison with "NEW RECORD" (`#e040fb` 28px pulse) if applicable.

## Progression
Waves flow with brief inter-wave moments:
- **Wave 1:** Clean signal, learn mechanics → calm, methodical
- **Wave 2:** Signal noise, accuracy rewards → slight pressure
- **Wave 3:** Interference, new bullet types → real danger, panic zone
- **Wave 4:** Critical mass, rapid fire unlocked → frantic but empowered
- **Wave 5:** Last frequency, everything thrown at you → climactic survival

### Narrative Thread
You're a lone ground station operator receiving alien transmissions. Each wave is a stronger broadcast — the signal degrades your equipment (CRT effects worsen). By Wave 5, your screen is barely holding together, but so is their transmission. Destroy the last wave and you sever the frequency forever.

### The UFO Thread
The UFO is a recurring mystery — a rogue signal that crosses the sky. Most of the time it's worth modest points. But occasionally (1/8 → 1/6 chance), it carries the **Last Frequency**: 300pts (or 500 for the Super UFO in Wave 5). Catching it triggers the game's signature spectacle — static burst, echoing score text, magenta border flash. It's the game's hidden reward for attentive players.

## Assets Needed
All procedural:
- **Sprites:** Pixel-art invaders (3 types × 2 animation frames, 11×8px at 2× scale), player cannon (13×8px at 2×), UFO (16×7px at 2×), Super UFO (24×10px at 2×), shields (22×16 destructible pixel grids, 4×4px blocks)
- **Particles:** LittleJS particle system for glitch shatter (8 scan-line fragments per invader), static burst (16 particles player death), magenta explosion (12 particles UFO), pixel erosion (2 particles shield hit), wave clear sweep
- **Audio:** LittleJS `zzfx()` for 8 sounds: `pulse_fire`, `static_pop`, `ufo_warble` (looping sine vibrato), `signal_catch`, `static_crash`, `march_blip` (variable pitch), `shield_crunch`, `frequency_sweep`
- **CRT Post-processing:** Scan-line overlay (horizontal lines every 2px), radial vignette gradient, static flicker (random line brightening), horizontal tear (band shift), vertical roll (periodic screen shift)
- **Storage:** localStorage for high score
- **HUD:** Score top-left (`#00ff88` 14px monospace), high score top-center, lives bottom-left (cannon icons), wave indicator top-right ("WAVE 3/5" `#78909c` 12px)
