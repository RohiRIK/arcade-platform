# CFO Budget Impact Report — arcade-evolution Pivot

**Date:** 2026-05-30
**Pivot:** arcade-evolution (Gate 2)

## Current Budget Allocation (tokens/cycle)

| Dept | Baseline | Notes |
|------|----------|-------|
| R&D | 3 | High output |
| UX/UI | 2 | |
| QA | 2 | |
| PM | 2 | |
| Infra | 1 | Exempt from pivot |
| IT | 1 | |
| DevOps | 1 | |
| Security | 1 | Exempt from pivot |
| Board | 1 | |
| **Subtotal** | **14** | |

## New Departments (no prior budget)

| Dept | Proposed | Justification |
|------|----------|---------------|
| Creative | 2 | New dept, high output needed (7 game creative directions). Active Phase 1-4. |
| CTO | 1 | Advisory role, architecture reviews |
| CPO | 1 | Quality bar enforcement |
| CISO | 0 | <1 cycle total work, can share Security slot |
| CFO | 0 | Tracking only, no deliverables consuming platform resources |
| Analytics | 1 | New metric framework needed |
| **New subtotal** | **5** | |

## Pivot Budget Reallocation Recommendation

The pivot shifts work volume. Phase-by-phase token adjustment:

### Phase 1-2 (Foundation + Snake): ~4 cycles
| Dept | Adjusted | Delta | Reason |
|------|----------|-------|--------|
| R&D | 4 | +1 | LittleJS integration + Snake rewrite (XL effort) |
| Creative | 3 | +3 | Per-game creative directions are critical path |
| UX/UI | 1 | -1 | Light work until Phase 4 |
| IT | 0 | -1 | No pivot work until Phase 5 |
| DevOps | 1 | 0 | Stable |
| QA | 2 | 0 | Quality bar testing starts Phase 2 |
| PM | 2 | 0 | Coordination |
| Infra | 1 | 0 | Routine |
| Security | 1 | 0 | Routine |
| Board | 1 | 0 | |
| CTO | 1 | +1 | Integration review |
| CPO | 1 | +1 | Quality standard v2 |
| Analytics | 1 | +1 | Rubric design |

**Phase 1-2 total: 19 tokens/cycle** (+5 over baseline)

### Phase 3 (6 game migrations): ~9 cycles
| Dept | Adjusted | Reason |
|------|----------|--------|
| R&D | 4 | Peak output |
| Creative | 2 | Steady creative direction delivery |
| QA | 3 | Per-game regression + quality bar |
| CPO | 1 | Per-game quality review |
| Others | same | |

### Phase 4-5 (Polish + Cleanup):
- R&D drops to 2
- UX/UI rises to 3 (redesign work)
- IT rises to 1 (cleanup scans)
- Creative drops to 1

## Cycle Utilization (Last 24h)

| Dept | Artifacts | Changes | Budget | Utilization |
|------|-----------|---------|--------|-------------|
| R&D | 7 | 5 | 3 | 167% ⚠️ |
| UX/UI | 8 | 5 | 2 | 250% ⚠️ |
| Infra | 12 | 4 | 1 | 400% ⚠️ |
| PM | 4 | 6 | 2 | 300% ⚠️ |
| QA | 12 | 6 | 2 | 300% ⚠️ |
| IT | 13 | 7 | 1 | 700% ⚠️ |
| DevOps | 8 | 5 | 1 | 500% ⚠️ |
| Board | 12 | 0 | 1 | 0% |
| Security | 3 | 1 | 1 | 100% ✓ |
| Creative | — | 2 | — | N/A (new) |
| CTO | 2 | 1 | — | N/A (new) |
| CPO | 1 | 1 | — | N/A (new) |
| Analytics | 1 | 1 | — | N/A (new) |
| CISO | 0 | 1 | — | N/A (new) |

**Note:** 24h spans ~12 cycles, so high utilization numbers are expected. Per-cycle averages are within range. The spikes reflect pivot impact assessment writing (one-time burst).

## Total Pivot Cost Estimate

| Dept | Cycles | Effort |
|------|--------|--------|
| R&D | 15 | XL |
| Creative | 10 | L |
| QA | 11 | M |
| PM | 7 | M |
| CPO | 10 | M |
| Analytics | 5 | M |
| UX/UI | 4 | M |
| DevOps | 3 | M |
| IT | 2 | S |
| CTO | 2 | S |
| CISO | <1 | S |

**Total estimated pivot duration: 15 cycles** (bottleneck: R&D)

## Flags

1. **Creative is critical path.** R&D blocks on Creative direction docs. If Creative falls behind, R&D idles at 4 tokens/cycle — expensive idle time.
2. **No CISO/CFO budget needed.** Both are advisory; work fits within existing overhead.
3. **Budget increase justified.** +5 tokens/cycle for Phases 1-2 is temporary. Returns to baseline after Phase 5.
4. **ROI projection:** 7 games go from functional to compelling. No revenue model exists, but platform quality increases measurably (quality scores, particle/sound coverage, progression depth).
