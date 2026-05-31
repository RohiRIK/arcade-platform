# Research: Pong (Volt Rally)

## Original Game Analysis
- **Creator:** Allan Alcorn at Atari, 1972 — the game that launched the arcade industry
- **Platform:** Atari arcade cabinet, later Atari 2600
- **Core mechanics:** Two paddles, one ball, score to win. The genius is in the physics: ball angle changes based on where it hits the paddle (center = straight, edge = steep angle). Speed increases over rally length. Simple rules, deep emergent gameplay.
- **Control scheme:** Single axis — paddle moves up/down only. Original used a rotary dial (analog), most ports use digital up/down.
- **Difficulty curve:** Implicit — ball gets faster each rally. CPU opponent gets harder as score approaches match end. No explicit levels.
- **Scoring system:** First to 11 wins (arcade standard). Some versions use 15 or 21. No bonus points in original — just "you scored or you didn't."

## Current Implementation Analysis
- **Lines:** ~37 (lines 211-248 of index.html)
- **What works:** Basic paddle movement, ball physics, CPU opponent, scoring display
- **What's missing:**
  - No win condition (game runs forever)
  - No ball angle variation on paddle hit (always reflects at same angle)
  - CPU is trivially simple (just tracks ball y at 0.08 lerp rate)
  - No visual polish (plain white ball, solid paddles, no effects)
  - No sound at all
  - No restart mechanism
  - Uses `setInterval` instead of `requestAnimationFrame`
  - Paddle movement is per-keypress (20px jumps), not smooth held-key movement

## Creative Direction: Volt Rally
Source: `departments/creative/scripts/pong-volt-rally-stages.md`

The creative vision transforms Pong into an electric duel:
- **4 implicit stages** based on rally count (0-4, 5-9, 10-14, 20+)
- **Rally-based progression:** Each rally builds tension via speed, effects, lighting
- **Per-rally reset:** Stages reset each rally, but residual glow persists
- **Late-game escalation:** At 8-8+, baseline effects permanently elevated
- **Deuce mechanic:** At 10-10+, red border pulse, "DEUCE" text, win-by-2
- **Victory celebration:** Particle bursts, paddle flashes, "CLUTCH" text for deuce wins
- **7 zzfx sounds** + ambient hum via Web Audio oscillator
- **Particle systems:** Electric discharge, spark shower, lightning arcs, overcharge explosion, victory burst

## Technical Approach

### Data Structures
```
paddle: { y, height, score, color }  — two instances (player, cpu)
ball: { x, y, vx, vy, radius, trail[] }  — trail stores last N positions for ghost effect
rallyCount: number  — resets on score, drives stage progression
particles: []  — capped at 150 (same as Snake)
lightningArcs: []  — { x1, y1, x2, y2, life, maxLife, color }
floatingTexts: []  — reused pattern from Snake
```

### Game Loop Design
- `requestAnimationFrame` with delta-time accumulator (same pattern as Snake Neon Serpent)
- Fixed timestep for physics (60fps equivalent), variable for rendering
- Per-frame: update ball physics → check collisions → update particles → update audio → render

### Collision Detection
- **Paddle-ball:** AABB check against paddle rect. On hit:
  - Reflect ball X velocity
  - Calculate angle based on hit offset from paddle center: `offset = (ball.y - paddle.centerY) / (paddle.height / 2)`, apply as angle modifier
  - Increment rally count
  - Spawn hit particles
- **Wall-ball:** Top/bottom bounce (reflect Y velocity)
- **Score zones:** Ball passes left/right edge → opponent scores

### Ball Physics
- Base speed 4px/frame, increases per stage: 4 → 5.5 → 7 → 8 (max)
- Ball speed increases within a rally based on `rallyCount` and stage thresholds
- After score, ball resets to center at base speed (or elevated base if late-game)

### CPU AI
- Reaction delay: 60ms base, -5ms per AI score, minimum 20ms
- Speed: `ballSpeed × 0.85` — always slightly slower than ball
- Targets ball Y position with delay-based smoothing
- Late-game: delay decreases faster, creating genuine challenge

### Audio Architecture
- Web Audio oscillator for ambient hum (same pattern as Snake)
- Hum volume/pitch scales with match state (5% → 8% → 10% → 15%)
- 7 zzfx sound effects: paddle_hit, wall_bounce, score, rally_charge, rally_overcharge, win_fanfare, electric_hum
- Match point: hum drops to silence for tension

### Rendering
- Dark void background (`#050510`)
- Court border brightens with stage progression
- Dashed center line with variable opacity
- Paddle glow (shadow blur) increases with stage
- Ball trail: ghost positions with decay
- Lightning arcs: random lines between walls, periodic spawning
- Particle system for hits, scores, overcharge, victory

## Scope for Arcade Platform

### v1 (Phase 3) Include:
- 4 implicit rally stages with all visual/audio escalation
- Proper paddle physics (angle variation on hit position)
- Rally counter display
- Late-game escalation (8-8+ permanent glow, accelerated stages)
- Deuce mechanic (10-10+, win by 2, cap at 15)
- Victory celebration (particle burst, paddle flash)
- 7 zzfx sounds + ambient hum
- Ball trail (ghost positions)
- Lightning arc effects
- Overcharge mode (rally 20+)
- CPU AI with configurable difficulty
- R to restart after match
- localStorage high score (best winning margin)

### Skip for v1:
- Multiplayer (second human player) — future enhancement
- Tournament mode / best-of-3 — future
- Paddle size changes — not in creative spec

### Estimated Complexity: M (Medium)
- ~400-500 lines estimated
- Simpler physics than Snake (no grid, no self-collision)
- Rally stage system is simpler than Snake's 8 food-based stages
- Particle system and audio architecture reuse Snake patterns
- Lightning arcs are the main new visual element
- CPU AI is the main gameplay challenge to tune

### Risks
1. **Ball speed tuning:** Too fast = unplayable, too slow = boring. Creative spec's 8px/frame max may need adjustment at 600x400 canvas.
2. **CPU difficulty balance:** Must feel fair but challenging. The reaction delay system needs careful tuning.
3. **Lightning arcs performance:** Random line drawing every 300ms could be expensive if not managed. Cap arc count.
4. **Rally counter display:** Need to position without overlapping score. Creative spec puts it at center-right area.
