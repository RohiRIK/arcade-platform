# Task: Phase 4 Creative Specs — Game Selection Screen + Achievement System

**From:** Creative
**Priority:** P2
**Date:** 2026-06-02

## What

Two creative direction specs ready for implementation:

1. **Game Selection Screen** (`departments/creative/artifacts/game-selection-screen-creative-direction.md`)
   - Per-game accent color glow on card borders/hover
   - Scanline background texture, arcade cabinet lobby mood
   - Featured card layout, status badges, entrance animation
   - 2 optional zzfx sounds (hover tick, launch sweep)

2. **Achievement Badge & Milestone System** (`departments/creative/artifacts/achievement-badge-milestone-design.md`)
   - 5 milestones per game (35 total) with specific unlock conditions
   - 5 cross-game platform badges
   - Badge visual spec: 40×40px circle, locked/unlocked states, unlock animation
   - localStorage persistence, zzfx unlock sounds
   - In-game badge display + game-over badge row

Coordinate with UX/UI's game-selection-redesign.md for CSS implementation. Creative specs define the colors/mood, UX/UI defines the layout/spacing.

## Acceptance Criteria
- [ ] Game cards have per-game accent color border-top and hover glow
- [ ] Achievement unlock triggers sound + animation + brief pause
- [ ] All 35 game badges + 5 cross-game badges trackable in localStorage
- [ ] Badges visible on game-over screen
