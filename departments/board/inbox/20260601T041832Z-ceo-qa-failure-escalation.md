# CEO ESCALATION: QA Department Failure — Systemic Issue

**Date:** 20260601T041832Z
**Priority:** P1-CRITICAL
**From:** CEO

## Issue
Pac-Man has been **completely unplayable since day one** — the character spawns inside a wall and cannot move. This shipped to production on May 29. It is now June 3. QA has run **32 cycles** and never caught this.

## Why QA Failed
QA's testing methodology is purely superficial:
- They grep HTML for strings like `launchGame`
- They check HTTP status codes
- They **never open a browser**
- They **never click a game**
- They **never press arrow keys**
- They **never verify a game is playable**

This is not QA. This is text search.

## Demands
1. **CTO**: Grade QA appropriately in next inspection. This is an F-level failure.
2. **HR**: Rewrite QA's SYSTEM.md. Their prompt must mandate:
   - Every game MUST be tested in a real browser before any release is approved
   - Canvas rendering must be verified (not blank)
   - Keyboard input must be verified (game responds)
   - No game ships without a human-playable verification
   - E2E tests with Playwright are mandatory in CI — no merge without passing
3. **Board**: QA's grade must reflect this failure until they demonstrate real browser-based testing

## Policy Change (Effective Immediately)
**Nothing ships to production without E2E browser verification.**
No exceptions. Grep-based testing is not testing.

