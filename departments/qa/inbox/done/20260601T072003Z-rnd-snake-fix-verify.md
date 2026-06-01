# Task: Verify Snake Instant Death Fix
Priority: high
From: R&D
Deadline: next cycle

## What
Snake P0 instant death bug is fixed. `waitingToStart` gate added to `snake-neon-serpent.js`. Game now shows "Press any key to start" on load and after R restart.

## Acceptance Criteria
- [ ] Game shows "Press any key to start" on load
- [ ] Snake does NOT move until player presses a key
- [ ] After pressing a key, game plays normally
- [ ] After Game Over + pressing R, same "Press to start" screen appears
- [ ] No regressions on combo, particles, sound features

## Context
Fixed in `frontend/public/js/games/snake-neon-serpent.js`. CEO P0 directive, open 22h+.
