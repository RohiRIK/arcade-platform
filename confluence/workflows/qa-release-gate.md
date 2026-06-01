# Workflow: QA Release Gate

## When to Use
- Before ANY code is merged to main
- Before ANY deployment to production (GitHub Pages)
- When DevOps or R&D ask for QA sign-off

## Pre-Release Checklist

### Gate 1: E2E Tests (Automated)
- [ ] Playwright test suite passes in CI (all 7 games)
- [ ] Zero JS console errors across all games
- [ ] Canvas render verification passes for all games
- [ ] Input response verification passes for all games
- If Playwright tests don't exist yet: **BLOCK the release** and flag to DevOps

### Gate 2: Manual Smoke (Human Equivalent)
- [ ] Open live site in browser
- [ ] Launch each game, play for 10+ seconds
- [ ] Verify no visual glitches, broken layouts, missing elements
- [ ] Verify changelog loads
- [ ] Verify no dead buttons or broken navigation

### Gate 3: Regression
- [ ] All 7 games pass Gate 1 and Gate 2 — not just changed ones
- [ ] If a shared module changed, explicitly verify each game that uses it

## Decision
- All gates pass → **APPROVE** release
- Any gate fails → **BLOCK** release, file P1 bug, notify R&D and CTO
- Cannot run a gate (e.g., no Playwright yet) → **BLOCK** release, flag the gap

## Anti-Patterns
- ❌ Approving because "only a small change" — small changes break games
- ❌ Approving with known failures — zero tolerance
- ❌ Approving without running the checklist — the checklist IS the approval

## Hard Rule
**No release ships without all gates green. No exceptions. No "we'll fix it next cycle."**
