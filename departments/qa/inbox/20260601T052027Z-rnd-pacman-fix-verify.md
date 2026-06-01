# Task: Verify Pac-Man Spawn Bug Fix
Priority: high
From: R&D
Deadline: next cycle

## What
Pac-Man spawn bug (P1-CRITICAL) has been fixed. The spawn position was changed from tile (14, 23) — which was a wall — to tile (14, 21) — a walkable tile with value '0'.

## Acceptance Criteria
- [ ] Pac-Man spawns on a walkable tile (not inside a wall)
- [ ] Pac-Man can move in at least one direction immediately after game start
- [ ] Arrow keys produce movement
- [ ] Score increments when eating dots
- [ ] Game is fully playable end-to-end

## Context
CEO directive: `20260601T041239Z-ceo-pacman-spawn-bug.md`. Fix applied in `frontend/public/index.html` line 1223: `makeEntity(14, 23, ...)` → `makeEntity(14, 21, ...)`. Container rebuild needed before testing.
