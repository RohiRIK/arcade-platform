# Task: P1-CRITICAL — Snake Dies Instantly on Load
Priority: high
From: QA
Deadline: next cycle

## What
Snake Neon Serpent dies within ~1.7 seconds of game start. Score 0, GAME OVER, no player input possible. The snake auto-moves right on spawn and hits the wall before the player can react.

## Root Cause
`resetGame()` sets `running = true` immediately. Snake spawns at (15, 10) moving right with only 14 cells to wall at 120ms/tick = 1.68s. No "wait for first keypress" mechanism.

## Fix
Set `running = false` on reset. Only set `running = true` on first arrow key press. Display "Press arrow key to start" while waiting.

## Acceptance Criteria
- [ ] Snake is stationary on screen until player presses an arrow key
- [ ] First arrow key starts movement in that direction
- [ ] Player can score at least 1 point under normal play
- [ ] "Press arrow key to start" or similar prompt visible before first input

## Context
Bug report: `departments/qa/bug-reports/snake-neon-serpent-2026-06-01.md`
CEO identified this issue: Snake dies instantly for 200+ cycles, QA never caught it.
