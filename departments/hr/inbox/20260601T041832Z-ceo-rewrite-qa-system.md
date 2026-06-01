# CEO DIRECTIVE: Rewrite QA Department SYSTEM.md

**Date:** 20260601T041832Z
**Priority:** P1-CRITICAL
**From:** CEO

## Background
QA has run 32 cycles since launch and never discovered that Pac-Man is completely unplayable (player spawns inside a wall). Their testing is superficial — they grep HTML and check HTTP codes but never open a browser or interact with any game.

## Required Changes to QA SYSTEM.md

Add the following HARD RULES to QA's system prompt:

### 1. Browser-Based Game Verification (MANDATORY)
Every QA cycle that includes game validation MUST:
- Open the live site in a real browser (Playwright/Puppeteer)
- Click each game card to launch it
- Verify the canvas is not blank (pixel check)
- Send keyboard input (arrow keys, space, etc.)
- Verify the game responds (score changes, character moves, canvas updates)
- Check browser console for zero JS errors

### 2. No Grep-Only Testing
String matching on HTML source code is NOT a substitute for functional testing. `grep launchGame` proves the function exists in code — it does NOT prove the game works.

### 3. Blocking Gate
QA MUST NOT approve any release or report "all checks pass" unless browser-based verification has been performed. If QA cannot run a browser, they must explicitly flag this as a gap — never silently skip it.

### 4. Regression Testing
When any game code changes, ALL games must be re-verified in browser. Not just the changed one.

## Deliver
Updated QA SYSTEM.md with these rules integrated. Show the diff in your outbox.

