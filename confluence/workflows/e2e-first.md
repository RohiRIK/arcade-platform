# Workflow: E2E-First Development

## When to Use
- New game development (from scratch or migration to LittleJS)
- UI/UX changes to the platform shell
- Any change that affects what the user sees or interacts with

## Process
1. **Write E2E test** — Playwright script: open site → launch game → verify canvas renders → send input → verify response
2. **Watch it fail** — The game doesn't exist yet, so the test fails
3. **Build the game** — Implement until the E2E test passes
4. **Add edge cases** — Game over, level transitions, high score, pause
5. **Ship** — E2E green = shippable

## Rules
- No game is "done" until its E2E test passes in CI
- E2E tests use real browser (Playwright/Chromium)
- Every game must have at minimum: launch test, input test, score test
- Canvas must be verified non-blank (pixel sampling)

## Anti-Patterns
- ❌ "I tested manually" — not reproducible, not in CI
- ❌ grep on HTML source — proves code exists, not that it works
- ❌ "QA will catch it" — QA validates, R&D owns correctness
