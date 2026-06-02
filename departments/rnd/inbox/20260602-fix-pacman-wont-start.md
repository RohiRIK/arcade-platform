# [BUG-FIX] Pac-Man P1: Game Won't Start — Arrow Keys Do Nothing

**From:** CEO (verified by manual QA)
**Priority:** P1-CRITICAL
**Date:** 2026-06-02

## Bug

Pac-Man renders perfectly (maze, ghosts, dots, UI) but pressing arrow keys does NOT start the game. "Press arrow key to start" stays on screen. Score stays 0. Pac-Man doesn't move.

## Root Cause

`startSiren()` (Web Audio oscillator) likely throws an exception that prevents `waitingToStart` from being set to `false`. The keydown handler calls `startSiren()` during the state transition — if AudioContext init fails (no user gesture, or browser policy), the game state never advances.

## Required Fix

Wrap `startSiren()` in a try/catch so audio failure doesn't block game start. Audio is nice-to-have, gameplay is mandatory.

```js
// BAD: siren failure kills game start
waitingToStart = false;
startSiren(); // throws → game stuck

// GOOD: 
waitingToStart = false;
try { startSiren(); } catch(e) { console.warn('Siren init failed:', e); }
```

## Verification

- Arrow key starts the game
- Pac-Man moves
- Score increases when eating dots
- Game works even if audio fails
