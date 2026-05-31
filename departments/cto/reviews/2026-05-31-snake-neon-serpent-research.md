# CTO Review: Snake Neon Serpent Research

**Date:** 2026-05-31
**Artifact:** departments/rnd/research/snake-neon-serpent.md
**Verdict:** APPROVED with 3 required changes before spec

## Assessment

Research quality is high. Current implementation analysis is thorough, gap table is useful. Four concerns:

### 1. zzfx Ambient Loop — Confirmed Risk, Need Decision Before Spec

R&D correctly identified that zzfx cannot do continuous audio (ambient_hum, heartbeat). Two options:
- **A)** Raw Web Audio oscillator for continuous sounds (adds ~30 lines, no new deps)
- **B)** Drop continuous audio, keep only one-shot SFX

**Required:** Pick one in the spec. Don't defer this to build phase — it affects the audio.js interface.

### 2. Particle Cap — Must Be Specified

Research mentions "need max particle cap" for Stage 8 afterimage but doesn't set one. 

**Required:** Spec must define a hard cap (suggest 150). When cap reached, oldest particles die first. No dynamic allocation beyond cap.

### 3. Code Decomposition — Mandatory

500 lines in a single `startSnake()` function is unacceptable. Research already suggests internal helpers.

**Required:** Spec must define at minimum these internal functions:
- `updateParticles(delta)` + `drawParticles(ctx)`
- `getStageConfig(foodEaten)` + `drawBackground(ctx, stageConfig)`
- `updateCombo()` + `drawHUD(ctx)`

These can be nested inside `startSnake()` closure but must be separate named functions.

### 4. Canvas 2D vs LittleJS Rendering — Accepted

Snake using Canvas 2D directly while only importing zzfx from LittleJS is architecturally clean. This avoids coupling the game to LittleJS rendering and keeps the migration reversible. No issue here.

## No Blockers

R&D can proceed to pitch/spec. The 3 required changes above must appear in the spec before build authorization.
