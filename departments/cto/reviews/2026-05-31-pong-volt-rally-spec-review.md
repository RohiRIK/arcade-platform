# CTO Spec Review: Pong Volt Rally

**Date:** 2026-05-31
**Phase:** 3 (first game after Snake PoC)
**Verdict:** APPROVED — ready to build

## Architecture Compliance — PASS

- Single file at `js/games/pong-volt-rally.js` (~500 lines estimated) — follows extraction pattern
- `startPongVoltRally(canvas, ctx)` returns `{ controls, cleanup }` — matches contract
- Closure-scoped state, no globals — consistent with Snake pattern
- 8 named functions with clear responsibilities

## Cleanup Contract — PASS

- `cancelAnimationFrame` — stops loop
- `removeEventListener` for keydown/keyup — input cleanup
- `AudioContext.close()` + oscillator/gainNode teardown — audio cleanup
- Timeout clearing mentioned
- Matches Snake Neon Serpent's approved cleanup pattern exactly

## Technical Assessment

### Sound — Good
- 7 zzfx sounds (matches creative spec count)
- Ambient hum via dedicated oscillator (sawtooth 55Hz) — same proven pattern as Snake
- Oscillator frequency/gain ramping based on match state — adds tension without complexity
- `electric_hum` is a no-op in SFX table (handled by oscillator) — correct

### Collision Detection — Good
- Angle-based reflection off paddle hit position (offset → angle mapping, max 60°)
- Uses `cos/sin` for velocity decomposition — correct physics
- Rally counter increments on both player and CPU paddle hits

### CPU AI — Adequate
- Delayed tracking with configurable reaction time that scales with score
- `CPU_SPEED_FACTOR = 0.85` caps CPU movement below ball speed — beatable but competent
- One concern: `cpu.lastUpdate` uses timestamp but update loop is fixed-step. Should work since `now` is passed from `performance.now()`, but verify during build that the delay calc doesn't drift.

### Deuce Mechanic — Correct
- Win by 2 at 10-10+, hard cap at 15
- Red border pulse, silence at match point, "CLUTCH" text on deuce wins
- Edge case handled: `DEUCE_CAP = 15` prevents infinite matches

## Minor Notes (non-blocking)

1. **Stage thresholds `[0, 5, 10, 20]`** but `getCurrentStage()` says "return 0 if rally < 5". The threshold array starts at 0 which means stage 0 is rally 0-4, stage 1 is 5-9, stage 2 is 10-19, stage 3 is 20+. Consistent internally but the array includes 0 as a threshold which is redundant — cosmetic only.

2. **Late game threshold shift** — lightning at rally 7 instead of 10 when both scores >= 8. Good design decision, increases drama. Implementation detail: `getCurrentStage()` needs clear branching for this case.

3. **`keysDown` object for held-key input** — correct approach for smooth paddle movement. Snake used single keypress (direction-based), Pong needs continuous input. Good differentiation.

4. **localStorage key `arcade_pong_highscore`** stores winning margin — unconventional but valid. No collision with other game keys.

## Compared to Snake Spec

| Aspect | Snake | Pong | Assessment |
|--------|-------|------|------------|
| Lines | ~730 | ~500 | Expected — Pong is simpler |
| Stages | 8 implicit | 4 rally-based | Appropriate for game type |
| Particles | 150 cap | 150 cap | Consistent |
| Sounds | 7 zzfx | 7 zzfx | Consistent |
| Cleanup | Full | Full | Pattern match |
| Audio | oscillator + zzfx | oscillator + zzfx | Same architecture |

## Conclusion

Spec is technically sound, follows established patterns, and handles edge cases (deuce cap, late game adjustments). No architectural concerns. R&D can proceed to build.
