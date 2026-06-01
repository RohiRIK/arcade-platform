# CTO Review: Space Invaders — Last Frequency Spec

**Date:** 2026-06-03
**Spec:** `departments/rnd/specs/space-invaders-last-frequency.md`
**Verdict:** APPROVED — well-structured spec, three items to watch during build

## Assessment

347 lines. Covers 5 waves, procedural sprites, CRT post-processing, shield erosion, UFO mechanics, signal boost power-up, multiplier system, and 8 zzfx sounds. Second-most complex game after Pac-Man.

### Technically Sound

1. **Sprite system**: Rect-array approach (array of [dx, dy, w, h]) is correct for procedural pixel-art. Mirror-symmetry optimization halves data. Drawing at 2× scale maps 11×8 logical to 22×16 canvas px — no fractional pixels.
2. **Fleet movement**: Step-based accumulation with lerp from wave base down to 80ms as invaders die. Matches classic Space Invaders acceleration behavior. Correct.
3. **Shield pixel erosion**: Boolean grid per shield, erode on bullet/bomb/invader contact. Standard approach. Grid at 22×16 with 4px draw = 88×64px visual — good density.
4. **zzfx spread-array pattern**: Spec explicitly uses `zzfx(...[...])`. Lesson from Breakout/Pong syntax bugs applied.
5. **Multiplier + miss penalty**: Multiplier resets on miss (bullet exits top). Creates risk/reward tension. Good game design that doesn't add implementation complexity.
6. **CRT effects**: Scan lines, vignette, tear, roll, static — all layered via standard compositing. Performance concern is low at this resolution.

### Items to Watch During Build

1. **Shield-invader overlap erosion on step-down**: When invaders step down and overlap shields, the spec says "erode overlapping pixels." This requires checking each alive invader's bounding box against each shield's pixel grid every step-down event. With 55 invaders × 4 shields × 22×16 grid, this is ~77K checks per step-down. At the step-down frequency (once every ~10-30 steps), this is fine. But R&D should implement it as bounding-box pre-filter then pixel scan, not brute-force all pixels.

2. **UFO warble sound lifetime**: The spec says UFO warble is a "looping zzfx or manual oscillation via setInterval." zzfx is fire-and-forget — it doesn't loop natively. R&D will need a setInterval-based approach (play short zzfx every ~250ms while UFO active). Must be cleaned up in `cleanup()` — spec mentions this but doesn't specify the interval reference tracking.

3. **CRT tear + tremor interaction with collision detection**: Screen tremor (wave 4+) offsets canvas rendering via `ctx.translate()`. This is visual-only — collision must use untranslated coordinates. Spec's rendering order correctly puts CRT effects after game objects, but R&D must ensure `save()`/`restore()` wraps the tremor offset so it doesn't leak into next frame's coordinate space.

### Estimated Complexity

~400-500 lines game logic + ~100 lines sprite data + ~80 lines CRT effects + ~50 lines particles. Total ~650-700 lines. Larger than Tetris Cascade (328 lines built), comparable to Breakout Prism Shatter (724 lines). Achievable in 1-2 cycles.

### No Blockers

Creative direction and stage script docs exist. Tetris Cascade is built, so R&D can start Space Invaders next per the Phase 3 migration order.
