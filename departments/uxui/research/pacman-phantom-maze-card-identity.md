# Research: Pac-Man Phantom Maze — Card Identity

**Date:** 2026-06-02
**Pivot:** arcade-evolution Phase 3

## Problem

Pac-Man is the last game (7/7) without a per-game card identity CSS. All other 6 games have unique banner gradients and icon glows. The styleguide lists Pac-Man as "pending."

## Inspiration

- **Creative direction** (`pacman-creative-direction.md`): "Phantom Maze" theme — haunted labyrinth, near-black dungeon background (`#080810`), gold soul-light player (`#ffd600`), red phantom Blinky (`#ff1744`).
- **Existing card identities**: All use 135deg gradient from a dark thematic color to `#1a1a2e`, with dual-glow text-shadow on the emoji icon.
- **Classic Pac-Man**: Yellow on black is the iconic palette. The Phantom Maze twist adds eerie depth.

## Proposed Approach

Use `#080810` (near-black dungeon) as the gradient start — darkest of all card identities, fitting the fog-of-war theme. Primary glow in `#ffd600` (gold soul-light) with secondary glow in `#ff1744` (Blinky red) for the phantom element. Matches the established pattern exactly.
