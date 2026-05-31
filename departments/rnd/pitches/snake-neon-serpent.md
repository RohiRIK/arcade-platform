# Pitch: Snake — Neon Serpent

## Elevator Pitch
Transform our basic green-squares Snake into a cinematic neon arcade experience with 8 evolving stages, a combo scoring system, particle effects, zzfx audio, and bonus food — proving the arcade-evolution pivot delivers real game quality.

## Gameplay
- **Core loop:** Guide a glowing neon snake across a cyberpunk grid. Eat food to grow, avoid walls and your own body. Classic Snake — but the environment evolves around you.
- **Combo system:** Chain food pickups within 2 seconds to build a 5-tier combo multiplier (×1 → ×2 → ×3 → ×5 → ×8). Visual and audio feedback escalate with tier. Missed chains reset to ×1.
- **Bonus food:** Every 10th food spawns a gold spinning diamond worth 50pts × combo multiplier. Despawns after 5 seconds — risk/reward tension.
- **8 implicit stages:** As foodEaten crosses thresholds (5, 10, 15, 20, 25, 35, 45), the environment seamlessly shifts — grid brightens, fireflies appear, colors change from calm blue-green to aggressive red, ambient hum gives way to heartbeat, grid eventually vanishes into void. No loading screens, just escalation.
- **Replayability:** High score + zone_reached in localStorage. Combo chasing adds depth. "Can I reach Stage 8?" is a compelling goal. Instant restart.

## Technical Fit
- **Canvas complexity:** Medium-High. Canvas 2D direct rendering (no LittleJS renderer). rAF loop with tick accumulator for decoupled snake movement and smooth particle animation.
- **Estimated lines:** ~450-500 (up from 162). Decomposed into named internal functions per CTO directive — no monolith.
- **Dependencies:** `playSound()` from shared audio module (zzfx), `drawGameOverOverlay()` from shared platform-ui. Both shipped in Phase 1.
- **Particle system:** Up to 150 particles (hard cap, oldest-first eviction per CTO review). 6 effect types: food burst, star burst, death explosion, ring pulse, trail afterglow, body afterimage.
- **Audio:** 7 discrete zzfx SFX (pickup, bonus, death, levelup, combo, start, heartbeat). Ambient hum via raw Web Audio oscillator (not zzfx — decision per CTO requirement). Simple sine oscillator with gain envelope, no zzfx looping hack.

## Scope
### In (v1)
- Full 8-stage visual progression with 500ms color lerp transitions
- Combo system (5 tiers) with floating text indicators
- Bonus food (gold diamond, spinning, timed despawn)
- Particle system (6 types, 150 cap)
- 7 zzfx sound effects + Web Audio oscillator ambient pad + heartbeat
- localStorage high score and zone persistence
- Shared game-over overlay integration
- Named internal functions: `updateParticles()`, `getStageConfig()`, `updateCombo()`, `drawHUD()`, `drawBackground()`, `drawSnake()`, `spawnParticles()`, `updateAudio()`

### Out (deferred)
- Touch/mobile controls
- Leaderboard integration
- Replay system

## Mockup
```
┌──────────────────────────────────────────────────────┐
│  SCORE: 1250        COMBO: ×3 🔥        STAGE: 5    │
│                                                      │
│     · · · · · · · · · · · · · · · · · ·              │
│     ·                                   ·            │
│     ·    ╔══╗                           ·            │
│     ·    ║██║══╗                        ·            │
│     ·    ╚══╝  ║══╗                     ·            │
│     ·          ╚══╝══╗══╗══╗           ·            │
│     ·                ╚══╝  ║    ◆      ·            │
│     ·                      ║  (food)   ·            │
│     ·    ✦ (bonus)         ║           ·            │
│     ·                      ╚══╗        ·            │
│     ·                         ║        ·            │
│     · · · · · · · · · · · · · · · · · ·              │
│                                                      │
│  ~ fireflies drifting ~        ~ vignette edges ~    │
└──────────────────────────────────────────────────────┘

Stage 1: Dark void, calm grid, green glow
Stage 4: Pulsing grid, fireflies, body glow  
Stage 7: No grid, heartbeat audio, wave distortion
Stage 8: Pure void — just snake, food, particles
```

## Why This Game First (Phase 2)
Snake is the simplest game to rewrite — grid movement, no complex physics, no AI opponents. It's the ideal proving ground for the particle system, combo mechanics, and stage progression patterns that every subsequent game rewrite will reuse. If Neon Serpent works, the pattern scales to all 7 games.
