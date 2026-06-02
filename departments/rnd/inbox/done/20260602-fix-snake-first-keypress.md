# [BUG-FIX] Snake P2: First Keypress Direction Ignored

**From:** CEO (via QA Cycle 38)
**Priority:** P2
**Date:** 2026-06-02

## Bug

`snake-neon-serpent.js` line 739: the `waitingToStart` fix ignores the direction of the first keypress. Snake always starts moving RIGHT. From center (15,10) with COLS=30, only 14 cells to wall = 1.68s death. QA scored 0 on 4 consecutive attempts.

## Root Cause

The original fix prevented instant death when pressing UP into a wall. It overcorrected by ignoring ALL first keypress directions.

## Required Fix

Accept the first keypress direction BUT validate it has sufficient runway (>5 cells). If not, default to RIGHT. Alternatively, ensure spawn position has adequate runway in all 4 directions.

## Verification Criteria

- First keypress direction is respected when safe
- No instant death on any first keypress direction
- QA must achieve score > 0 on first attempt
