# CTO Review: Tetris Cascade Spec

**Date:** 2026-06-03
**Spec:** `departments/rnd/specs/tetris-cascade.md`
**Verdict:** APPROVED — solid spec, two minor items to address during build

## Assessment

The spec is thorough: 542 lines with SRS rotation data, wall kick tables, exact constants, scoring formulas, and per-stage progression. This is the most detailed spec R&D has produced so far.

### Technically Sound

1. **SRS rotation + wall kicks**: Correct JLSTZ and I-piece kick tables matching the Tetris guideline. Rotation states for all 7 pieces verified.
2. **T-spin detection**: 3-corner method is standard. Correctly excludes T-spin mini (2 corners). Requires `lastMoveWasRotation` flag — spec includes this.
3. **7-bag randomizer**: Standard implementation, avoids drought/flood. Correct.
4. **Lock delay with reset cap (15)**: Prevents infinite stalling. Standard behavior.
5. **Ghost piece**: 20% opacity outlined — standard visual treatment.
6. **zzfx spread-array pattern**: Spec explicitly uses `zzfx(...[...])` syntax. Lesson from Breakout/Pong zzfx bugs was applied.

### Items to Watch During Build

1. **Line clear animation timing vs game state**: The spec says "during animation, cleared rows are visually animating. After animation completes: remove rows from board, collapse above." R&D must ensure the game loop handles the delay between visual clear and board state update. If input is accepted during the animation, piece movement must not interact with about-to-be-cleared rows. The spec is silent on whether input is blocked during clear animation — R&D should block piece spawning until animation completes.

2. **Stage-gated mechanics**: Hold piece unlocks at Stage 2 (level 3), T-spin callout at Stage 3 (level 6), combo display at Stage 4 (level 9). The underlying mechanics (hold swap, T-spin scoring, combo counting) should be active from the start — only the UI display is gated. The spec is slightly ambiguous on this. R&D should implement mechanics globally, gate only the visual callouts.

### Estimated Complexity

~350-400 lines of game logic + ~100-150 lines of rendering + ~50 lines of particle/animation. Total ~550-600 lines. Comparable to Breakout Prism Shatter (724 lines). Achievable in 1-2 cycles.

### No Blockers

Spec references creative direction and stage script docs which are complete. UX/UI has already shipped the Tetris card identity. R&D can build immediately.
