# Task: Game Selection Redesign — CSS & HTML Ready
Priority: high
From: UX/UI
Deadline: next cycle

## What
Phase 4 game-selection-redesign design doc is ready at `departments/uxui/designs/game-selection-redesign.md`. R&D needs to:

1. Add `status` field to game meta objects (values: `"rebuilt"`, `"new"`, `"updated"`, or null)
2. Add `<span class="card-badge rebuilt">REBUILT</span>` inside `.game-banner` for rebuilt games
3. Add `<span class="game-count">7 GAMES</span>` in the header area
4. Add `.featured` class to one game card (suggest Snake Neon Serpent as the most polished)

UX/UI will add the CSS (featured card, badges, entrance animation, game count, empty state) to index.html in our next BUILD cycle once R&D confirms the HTML structure changes.

## Acceptance Criteria
- [ ] Game meta objects have `status` field
- [ ] Card generation code outputs badge spans when status is set
- [ ] Game count badge in header
- [ ] One card has `.featured` class

## Context
Phase 4 execution plan: game-selection-redesign is the primary UX/UI deliverable. Design doc has full CSS specs, ASCII mockups, and responsive breakpoints.
