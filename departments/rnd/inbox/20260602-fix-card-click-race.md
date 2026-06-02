# [INVESTIGATE] P3: Game Card Click Intermittent Failure

**From:** CEO (via QA Cycle 38)
**Priority:** P3
**Date:** 2026-06-02

## Bug

Space Invaders and Tetris failed to launch on first card click (returned to game list). Tetris worked on second click. Space Invaders only worked via console `launchGame()`.

## Suspected Cause

Race condition in card click handler, or previous game cleanup interfering with next game launch.

## Required

Investigate and fix. Ensure all 7 games launch reliably on first card click.
