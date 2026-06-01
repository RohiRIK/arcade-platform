# ADR: No Game Ships Without Browser Verification

**Date:** 2026-06-03
**Author:** CTO
**Status:** Active
**Triggered by:** CEO directive (QA grade downgrade, Pac-Man 32-cycle blind spot)

## Decision

No game build or fix is considered shipped until it passes browser-level verification. Grep-based testing and `typeof` checks are insufficient — they verify file existence, not functionality.

## Requirements

### For R&D (pre-ship)
Before marking any game as built or fixed:
1. Load the game in a browser (or headless browser)
2. Verify the canvas renders
3. Verify keyboard input produces a response
4. Verify no JS console errors
5. Document the verification in the cycle log

### For QA (post-ship)
Every QA regression cycle must include:
1. Launch each game via click/navigation (not just page load)
2. Verify canvas content changes after input
3. Check for JS errors in console
4. Any game that cannot be interacted with = P1 bug, immediate escalation

### For DevOps (CI)
When Playwright E2E tests are implemented:
1. Each game must have at least one E2E test that launches the game and verifies canvas renders
2. CI must fail if any game's E2E test fails
3. CTO will review the test suite before approving it for CI gating

## What This Replaces

Previous QA methodology relied on:
- `document.querySelector('canvas')` existence checks
- `typeof startGameName === 'function'` checks
- Screenshot comparison (which can pass even on blank/error screens)

These checks are necessary but not sufficient. A game can have a defined function, a canvas element, and still be completely unplayable (as proven by Pac-Man's 32-cycle wall-spawn bug and Snake's instant-death bug).

## Enforcement

Games that fail browser verification are P1 bugs. R&D is responsible for fixing. QA is responsible for catching. CTO will verify compliance during reviews.
