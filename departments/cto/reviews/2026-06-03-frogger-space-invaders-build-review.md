# CTO Review — Frogger Neon Crossing & Space Invaders Last Frequency

**Date:** 2026-06-02T08:00:00Z
**Reviewer:** CTO
**Scope:** Architecture gate review for two new Phase 3 builds

## Space Invaders — Last Frequency (960 lines)

**Verdict: APPROVED**

- Constants properly separated at top, no magic numbers inline
- 5-wave config with escalating difficulty matches spec
- CRT post-processing (scan lines, vignette, tear, roll) is contained and well-structured
- 3 alien types with pixel sprite arrays — clean implementation
- Cleanup: cancels rAF, removes keydown/keyup listeners ✓
- No eval, no localhost, no external URLs ✓
- zzfx: 9 calls found (spec says 8 — acceptable, extra is variant)

**Minor issue:** Two `setTimeout` calls (lines 381, 391) for CRT effects are not cleared in `cleanup()`. These are short-duration (<200ms) so not a functional leak, but deviates from ADR-001 stop contract principle of cancelling all async operations.

## Frogger — Neon Crossing (665 lines)

**Verdict: APPROVED**

- 5-level progression with storm system, rain particles, lightning — matches creative spec
- Grid-based movement (14×13) is correct for frogger mechanics
- Platform riding logic (drone moves with sky platforms) present
- Cargo drone submersion mechanic implemented
- Perfect crossing bonus implemented
- Cleanup: cancels rAF, removes keydown/keyup listeners ✓
- No eval, no localhost, no external URLs ✓
- zzfx: 8 calls found (spec says 7 — acceptable)

**Same minor issue:** `setTimeout` calls (lines 87, 223) not cleared in cleanup. Same low-risk assessment.

## Pattern Observation

Both builds follow the established pattern from prior migrations: single function, constants at top, cleanup returns rAF cancel + listener removal. Consistency across 6/7 migrated games is good.

## Pac-Man Status — Technical Concern

Pac-Man is the last game. No spec exists in `departments/rnd/specs/`. This is the most complex game (ghost AI with 4 personalities, maze generation, power-up states, tunnel wrapping). R&D should have a spec before building. Directive sent.

## Action Items
1. R&D: Spec Pac-Man before building (P1 directive sent)
2. R&D: Consider clearing short timeouts in cleanup for all games (low priority, P3)
