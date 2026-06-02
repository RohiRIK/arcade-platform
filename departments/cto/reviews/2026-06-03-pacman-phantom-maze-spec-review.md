# CTO Spec Review: Pac-Man Phantom Maze

**Date:** 2026-06-02
**Spec:** departments/rnd/specs/pac-man-phantom-maze.md
**Verdict:** APPROVED — clear to build

## Assessment

This is the most complex game in the set. The spec is thorough and implementation-ready. Key observations:

### Architecture: Sound
1. **Web Audio siren oscillator** — correct call to use Web Audio instead of zzfx for looping audio. The spec handles creation/teardown in `startSiren()/stopSiren()`. Cleanup function includes `stopSiren()`. No leak risk if implemented as written.

### Architecture: Fog of War
2. **Radial gradient per frame** — `createRadialGradient()` every frame is fine for a 600×400 canvas. No performance concern at this scale. The approach (draw everything, then overlay fog) is simpler and less error-prone than selective rendering.

### Architecture: Ghost AI
3. **Ghost AI state machine** is well-specified. The 4-personality targeting with mode cycling (scatter/chase/frightened/eaten) follows the original arcade's design. Direction priority order (up, left, down, right) matches the 1980 arcade spec — good attention to detail.
4. **Level-scaling scatter compression** formula (`scatterDuration * max(0.4, 1 - (level-1)*0.1)`) is clean. At L7 this gives 0.4× multiplier (2.8s/2s scatter), which is aggressive but intentional per creative direction.

### Architecture: Cleanup
5. **Cleanup contract** is correct: cancels rAF, removes both keydown and keyup listeners, stops siren oscillator. Matches the stop contract pattern from all 6 prior games.

### Minor Flags (non-blocking)
- **L4+ speed bonus** (line 413): "eating all 4 ghosts within 3s of power pellet doubles ghost eat scores" — this is a bonus mechanic not covered in the constants section. R&D should implement as a simple timer check, not a new state variable.
- **Ghost warning glow** (line 412): "faint glow on nearest wall edge" when ghost within 3 tiles but outside fog. Rendering detail — R&D has discretion on exact implementation.
- **Particle cap**: 200 particles with ghost wisp trails (up to 7 per ghost × 4 ghosts = 28/frame) plus event particles is manageable. No concern.

### Consistency with Prior Games
- Same function signature pattern: `startPacManPhantomMaze(canvas, ctx)` returning `{controls, cleanup}`.
- Same constant naming, HUD layout, localStorage key pattern.
- 800-1000 line estimate is realistic given ghost AI complexity.

## Decision

**APPROVED for build.** No architectural blockers. This is Phase 3's final and most complex game. R&D should build with confidence — the spec covers all edge cases adequately.
