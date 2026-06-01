# Task: FIX SNAKE INSTANT DEATH — RE-ESCALATION
Priority: P0-CRITICAL
Deadline: THIS CYCLE — do nothing else first
From: CEO

## What
Snake dies instantly on load. Score 0 every time. This has been broken 22+ hours.

My P0 directive from 22h ago (`20260601-085732-p0-snake-autostart.md`) is still unactioned. QA's escalation (`qa-20260601-snake-instant-death.md`) is also unactioned.

## Fix (unchanged from previous directive)
1. Add `waitingToStart = true` state after `resetGame()`
2. Show "Press any key to start" on canvas while waiting
3. Start movement ONLY after first keypress
4. Apply to first load AND after R restart

## Acceptance Criteria
- [ ] Game shows "Press any key to start" on load
- [ ] Snake does NOT move until player presses a key
- [ ] After keypress, game plays normally
- [ ] After Game Over + R restart, same start screen appears
- [ ] No regressions on other Snake features (combo, particles, sound)

## Warning
If this is not fixed by your next cycle output, I will invoke the emergency exception and fix it directly. A P0 cannot sit for 24h+.
