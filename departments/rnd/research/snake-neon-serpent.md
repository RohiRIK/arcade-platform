# Research: Snake Neon Serpent (Phase 2 Rewrite)

**Date:** 2026-06-01
**Phase:** arcade-evolution Phase 2
**Creative Spec:** departments/creative/artifacts/snake-creative-direction.md
**Stage Script:** departments/creative/scripts/snake-neon-serpent-stages.md

---

## Original Game Analysis

### History
Snake originated in 1976 (Blockade by Gremlin Industries). The most culturally significant version was Nokia Snake (1998) by Taneli Armanto, preloaded on Nokia 6110. The game became synonymous with mobile gaming for an entire generation.

### Core Mechanics
- **Movement:** Continuous in 4 directions on a grid. Snake moves at fixed tick rate.
- **Growth:** Eating food adds one segment. Snake never shrinks.
- **Self-collision:** Hitting your own body = death. This is THE core tension — your own body becomes the obstacle.
- **Wall collision:** Hitting boundaries = death (in most versions; some wrap).
- **Food placement:** Random position, never on snake body.
- **Scoring:** Points per food. High score persistence.

### What Makes It Fun
1. **Emergent difficulty** — the obstacle IS your score. Longer snake = harder game. No artificial difficulty needed.
2. **Spatial planning** — advanced players think 5+ moves ahead, planning routes through tight corridors of their own body.
3. **Flow state** — simple inputs, increasing speed, hypnotic rhythm. Perfect flow-state game.
4. **"One more try"** — instant restart, short sessions, clear improvement arc.

### Control Scheme
Arrow keys (4-directional). 180° reversal blocked. No diagonal movement.

### Difficulty Curve
Exponential — first 10 food trivial, 10-25 engaging, 25+ expert territory. Speed increase compounds with length increase.

### Scoring System
Flat points per food in basic versions. Our Neon Serpent adds combo multiplier (time-based chaining).

---

## Current Implementation Analysis

Current `startSnake()` (lines 210-373 of index.html):
- **162 lines** of vanilla JS
- Simple setInterval game loop at variable speed
- Grid-based movement with collision detection
- Basic HUD (score + high score)
- No particles, no sound, no visual effects
- Flat green rectangles for snake, red square for food
- Inline game-over overlay (not using shared `drawGameOverOverlay`)
- No localStorage persistence (high score resets on page reload)
- Speed: 120ms initial, -8ms every 5 food, min 50ms

**Gaps vs Neon Serpent spec:**
| Feature | Current | Target |
|---------|---------|--------|
| Visual theme | Flat green on black | Neon cyberpunk, glowing, grid, particles |
| Sound | None | 7 zzfx SFX + ambient pad + heartbeat |
| Particles | None | 6 effect types (food burst, star burst, death, ring, trail, afterimage) |
| Combo system | None | 5-tier combo with visual/audio feedback |
| Bonus food | None | Gold diamond every 10th food, 50pts, 5s timeout |
| Stages | None | 8 implicit stages with environmental shifts |
| Speed curve | -8ms/5food | -5ms/5food (smoother), stage-based |
| High score | Session only | localStorage persistent |
| Game over | Inline | Shared drawGameOverOverlay with accent color |
| Transitions | None | Start fade-in, death animation, restart |

---

## Technical Approach

### Architecture
Full rewrite of `startSnake()`. Uses Phase 1 shared modules:
- `playSound()` from `js/shared/audio.js` for zzfx
- `drawGameOverOverlay()` from `js/shared/platform-ui.js` for game-over
- LittleJS engine available but Snake uses **Canvas 2D directly** (not LittleJS rendering) — LittleJS provides zzfx only

### Data Structures
- **Snake:** Array of `{x, y}` grid positions (head at index 0)
- **Particles:** Array of `{x, y, vx, vy, life, maxLife, size, color, type}` — updated each frame
- **Stage state:** Derived from `foodEaten` thresholds, no separate state machine needed
- **Combo:** `{tier, lastEatTime}` — tier increments if eat within 2000ms
- **Bonus food:** `{x, y, spawnTime, active}` — spawns every 10th food, despawns after 5000ms

### Game Loop
Switch from `setInterval` to `requestAnimationFrame` with tick accumulator:
```
lastTime = 0
accumulator = 0
function gameLoop(timestamp):
  delta = timestamp - lastTime
  lastTime = timestamp
  accumulator += delta
  while accumulator >= currentSpeed:
    updateSnake()  // grid movement
    accumulator -= currentSpeed
  updateParticles(delta)  // smooth particle animation
  updateAudio(delta)  // ambient/heartbeat timing
  draw()
  requestAnimationFrame(gameLoop)
```
This gives smooth particle rendering decoupled from snake tick rate.

### Rendering Layers (draw order)
1. Background fill (`#0a0a1a`)
2. Grid lines (opacity varies by stage)
3. Background effects (fireflies, wave distortion in late stages)
4. Vignette (Stage 5+)
5. Snake trail/afterimage
6. Snake body + head (rounded rects with glow)
7. Food (pulsing circle/diamond)
8. Particles (food burst, ring pulse, etc.)
9. HUD (score, combo, stage indicator)
10. Game-over overlay (shared function)

### Collision Detection
Same as current — grid-based exact match. No physics needed.

### Sound Implementation
All via `playSound()` wrapping zzfx. 7 discrete sounds + 2 continuous:
- Discrete: pickup_blip, bonus_chime, death_buzz, levelup_fanfare, combo_ding, start_whoosh (play on event)
- Continuous: ambient_hum (looping pad), heartbeat (Stage 7+, 1000ms interval)
- zzfx params to be tuned during build phase

### Stage System
Pure function of `foodEaten`:
```js
function getStage(foodEaten) {
  if (foodEaten >= 45) return 8;
  if (foodEaten >= 35) return 7;
  if (foodEaten >= 25) return 6;
  if (foodEaten >= 20) return 5;
  if (foodEaten >= 15) return 4;
  if (foodEaten >= 10) return 3;
  if (foodEaten >= 5) return 2;
  return 1;
}
```
Stage config object holds: bgColor, gridColor, gridOpacity, speed, fireflies, effects.
Transitions: 500ms lerp between stage configs when crossing threshold.

---

## Scope for Arcade Platform

### V1 (Phase 2 — this build)
- Full Neon Serpent visual theme (all 8 stages)
- All 7 zzfx sound effects + ambient pad + heartbeat
- Particle system (6 effect types)
- Combo system (5 tiers)
- Bonus food (gold diamond)
- localStorage high score + zone_reached
- Shared game-over overlay integration
- requestAnimationFrame game loop

### Deferred
- Leaderboard integration (future platform feature)
- Touch controls (future mobile support)
- Replay system

### Estimated Complexity: L (Large)
- ~400-500 lines estimated (vs current 162)
- Particle system is the biggest new subsystem
- 8 stage configurations with visual transitions
- Sound design tuning (zzfx params)

### Risks
1. **zzfx ambient loop** — zzfx is designed for one-shot SFX, not continuous pads. May need a simple oscillator via Web Audio API directly for ambient_hum and heartbeat.
2. **Particle performance** — Stage 8 afterimage trail (3 full-body afterimages) could mean 100+ particles. Need max particle cap.
3. **Stage transition smoothness** — lerping colors/opacity over 500ms at 60fps needs to feel seamless.
4. **Code size** — 500 lines is large for a single function. Consider internal helper functions for particles, stages, audio.
