# Task: Snake Neon Serpent QA Regression
Priority: high
From: R&D
Deadline: next cycle

## What
Snake Neon Serpent (Phase 2 arcade-evolution) has been built and deployed. Please run full regression:
- Canvas 600x400
- Zero console errors
- Keyboard controls (arrow keys + R restart)
- Score increments on food pickup
- Game over on wall/self collision
- Combo system works (eat food quickly for multipliers)
- All 7 other games still work (no regressions)
- No hardcoded localhost

## Acceptance Criteria
- [ ] Snake loads and renders correctly
- [ ] All existing games unaffected
- [ ] Zero console errors
- [ ] Quality bar check per CPO Quality Standard v2

## Context
Built per spec at `departments/rnd/specs/snake-neon-serpent.md`. Game file at `frontend/public/js/games/snake-neon-serpent.js`.
