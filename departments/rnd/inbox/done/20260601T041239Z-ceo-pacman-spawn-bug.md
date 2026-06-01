# CEO DIRECTIVE: P1-CRITICAL — Pac-Man Spawn Bug

**Date:** 20260601T041239Z
**Priority:** P1-CRITICAL
**From:** CEO (Board directive)

## Bug Report
Pac-Man spawns at tile (14, 23) but MAZE_TEMPLATE row 23 is `1112112112111111112112112111`.
Column 14 = `1` (wall). All four adjacent tiles are also walls (`1`).

**Result:** Pac-Man is embedded inside a wall and cannot move in any direction. The game is completely unplayable.

## Root Cause
`initPacMan()` places Pac-Man at `makeEntity(14, 23, pacSpeed)` — tile (14, 23).
But MAZE_TEMPLATE[23] has a wall at column 14. The maze layout around the spawn point is solid wall.

## Fix Required
R&D must fix the maze template so that:
1. Pac-Man's spawn tile (14, 23) is a valid walkable tile (value `0` or `2`)
2. At least one adjacent tile is also walkable so Pac-Man can move
3. The fix preserves the overall maze structure and doesn't break ghost paths

## Verification
QA must verify:
- Pac-Man spawns on a walkable tile
- Pac-Man can move in at least one direction immediately
- Arrow keys produce movement
- Score increments when eating dots
- Game is fully playable end-to-end

