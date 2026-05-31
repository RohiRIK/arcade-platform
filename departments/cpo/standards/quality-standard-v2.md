# Quality Standard v2: Arcade Evolution

**Date:** 2026-05-31
**Author:** CPO
**Version:** 2.0
**Applies to:** All 7 games post-LittleJS migration

## Purpose

Defines the measurable quality bar each game must pass during Phase 2-3 migration. R&D builds to this. QA tests against this. CPO verifies.

## Per-Game Quality Checklist

### Visual Identity (must pass all)
- [ ] Game uses its unique color palette from Creative script (not default `#e94560`)
- [ ] Background color distinct from platform chrome (`#0f0f23`)
- [ ] At least 3 distinct colors used in gameplay area
- [ ] No two games share >60% of their in-game palette

### Particles & Effects (minimum 4 of 6)
- [ ] Food/item pickup effect
- [ ] Death/game-over effect
- [ ] Level-up or stage transition effect
- [ ] Combo/chain visual feedback
- [ ] Ambient background particles (if specified in Creative script)
- [ ] Score float-up on significant events

### Sound (minimum 3)
- [ ] At least 3 distinct zzfx sounds per game
- [ ] Sounds mapped to correct events per Creative script
- [ ] No audio glitches (clicks, pops, overlapping)

### Progression (must pass all)
- [ ] Difficulty increases over time (speed, enemy count, or complexity)
- [ ] High score tracked and persisted (localStorage)
- [ ] Score displayed during gameplay
- [ ] Game-over uses shared `drawGameOverOverlay()` with correct theming

### Game Feel (minimum 2 of 4)
- [ ] Screen shake or flash on impactful events
- [ ] Combo or multiplier system
- [ ] Visual escalation as difficulty increases (color shift, particle density)
- [ ] At least one "wow moment" per Creative script

### Platform Consistency (must pass all)
- [ ] Game-over overlay uses shared function with correct per-game colors
- [ ] Restart key is R (standardized)
- [ ] Canvas renders at 600×400
- [ ] Game stops cleanly (no leaked intervals/listeners/rAF)

## Grading

| Result | Criteria |
|--------|----------|
| PASS | All "must pass" sections clear + minimums met in optional sections |
| CONDITIONAL | 1-2 minor gaps, fixable in same cycle |
| FAIL | Missing "must pass" items or <50% of optional checklist |

## Anti-Staleness Rule

After Phase 3, CPO will run a cross-game comparison. If any two games feel interchangeable (same palette, same particle colors, same sound profile), the later-built game gets sent back to Creative for identity rework.

## Review Cadence

CPO reviews each game within 1 cycle of R&D completing its migration. Review artifact goes to `departments/cpo/reviews/`.
