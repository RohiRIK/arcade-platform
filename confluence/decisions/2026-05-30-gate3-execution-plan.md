# Gate 3 — Arcade Evolution Execution Plan

**Date:** 2026-05-30
**Author:** PM
**Purpose:** Consolidate 12 impact assessments into phased execution plan for Gate 4 Board vote.

## Summary

Arcade-evolution migrates 7 games from a monolith index.html to LittleJS-based modular architecture with creative polish (sound, particles, progression, unique identity per game). Total effort: ~70 dept-cycles across 12 departments over 5 phases.

## Pre-Conditions (Before Phase 1)

Per CTO approval conditions — must be completed first:

| # | Task | Owner | Effort |
|---|------|-------|--------|
| 1 | eval() check on LittleJS source | Security | <1 cycle |
| 2 | Version pin (specific tag/commit) | R&D | <1 cycle |
| 3 | Engine isolation PoC (singleton teardown) | R&D | 1 cycle |

**Gate:** CTO sign-off on all 3 before Phase 1 begins.

## Phase 1 — Foundation (3 cycles)

| Task | Owner | Deps |
|------|-------|------|
| Vendor LittleJS to `frontend/public/lib/` | R&D | Pre-conditions |
| Extract CSS from index.html → `css/styles.css` | UX/UI + R&D | None |
| Extract HTML shell (nav, grid, container) | R&D | CSS extraction |
| Create `main.js` game loader with routing | R&D | LittleJS vendored |
| Build `shared/platform-ui.js` (score, game-over) | R&D + UX/UI | Game-over design doc |
| Build `shared/audio.js` (zzfx wrapper) | R&D | LittleJS vendored |
| Visual identity guidelines doc | Creative | None |
| Review Creative guidelines | CPO | Creative guidelines |
| Smoke test: platform loads with LittleJS, no games | QA | Foundation deployed |
| Update CI for new file structure awareness | DevOps | New dirs exist |

**Exit criteria:** Platform loads, LittleJS initialized, shared modules importable, no regressions on existing monolith.

## Phase 2 — Snake Proof-of-Concept (2 cycles)

| Task | Owner | Deps |
|------|-------|------|
| Rewrite Snake on LittleJS per Creative spec | R&D | Phase 1, snake-creative-direction.md |
| Implement: Neon Serpent theme, 7 zzfx sounds, 6 particle effects, combo system, 10-tier difficulty | R&D | Creative spec |
| Quality bar review (particles, sound, progression, wow) | QA + CPO | Snake deployed |
| CTO integration review | CTO | Snake deployed |

**Kill criteria:** If Snake doesn't feel better than current version → reassess framework choice.

**Exit criteria:** Snake running on LittleJS, passes quality bar, CTO approved.

## Phase 3 — Remaining 6 Games (9 cycles)

Migration order (complexity ascending):
1. Pong (~1 cycle)
2. Breakout (~1 cycle)
3. Tetris (~1.5 cycles)
4. Space Invaders (~1.5 cycles)
5. Frogger (~1.5 cycles)
6. Pac-Man (~2 cycles — ghost AI complexity)

Per game:
| Task | Owner |
|------|-------|
| Creative direction spec | Creative (ALL DONE — 7/7 specs exist) |
| Rewrite on LittleJS with creative spec | R&D |
| Quality bar test + regression | QA |
| Quality review + staleness check | CPO |
| Per-game engagement metrics | Analytics |

**Exit criteria:** All 7 games running on LittleJS, each passes quality bar.

## Phase 4 — Platform Polish (2 cycles)

| Task | Owner |
|------|-------|
| Game selection screen redesign | UX/UI + Creative |
| Achievement/progression system | R&D |
| Sound/visual settings UI | UX/UI |
| CI pipeline update for final structure | DevOps |
| Docker rebuild + verify | DevOps + Infra |
| Platform consistency review | CPO |

**Exit criteria:** Polished platform UI, settings working, CI green.

## Phase 5 — Cleanup & Launch (2 cycles)

| Task | Owner |
|------|-------|
| Remove monolith index.html game code | R&D |
| File structure cleanup + naming compliance | IT |
| Full 7-game regression suite | QA |
| Performance benchmark vs baseline (94,775 bytes, 0.522ms) | DevOps + QA |
| Final quality sign-off per game | CPO + Creative |
| README + docs overhaul | PM |
| Security audit of final state | Security |

**Exit criteria:** Monolith removed, all games modular, performance within 50% of baseline, all docs current.

## Timeline

| Phase | Cycles | Cumulative |
|-------|--------|------------|
| Pre-conditions | 1 | 1 |
| Phase 1 | 3 | 4 |
| Phase 2 | 2 | 6 |
| Phase 3 | 9 | 15 |
| Phase 4 | 2 | 17 |
| Phase 5 | 2 | 19 |

**Total: ~19 cycles (~38 hours elapsed at 2h/cycle)**

## Budget (per CFO)

Phases 1-2: 19 tokens/cycle (up from 14). New allocations: Creative(2), CTO(1), CPO(1), Analytics(1).

## Critical Path

```
Pre-conditions → Phase 1 (R&D foundation) → Phase 2 (Snake PoC) → Phase 3 (6 games sequential)
                                                                      ↑
                                              Creative specs ready ────┘ (DONE — all 7 exist)
```

R&D is the bottleneck. Creative specs are already complete — no creative bottleneck.

## Kill Criteria (from pivot doc)

1. Snake rewrite doesn't feel better → reassess framework
2. 3+ games break during migration, can't fix in 2 cycles → rollback
3. Performance degrades >50% → rollback
4. >15 cycles without completing Phase 3 → reassess

## Rollback Plan

Git revert to pre-pivot commit. Monolith preserved until Phase 5.

## Dept Effort Summary

| Dept | Effort | Phases |
|------|--------|--------|
| R&D | XL (17-20) | 1-5 |
| Creative | L (10) | 1-4 |
| CPO | M (10) | 1-5 |
| QA | M (11) | 1-5 |
| UX/UI | M (7) | 1, 4 |
| PM | M (7) | 1-5 |
| DevOps | M (5) | 4-5 |
| Analytics | M (5) | 3-5 |
| CTO | M (3) | 1-2 |
| IT | S (2) | 5 |
| CISO | S (1) | Pre |
| CFO | S (1) | Pre |

**Ready for Gate 4 Board vote.**
