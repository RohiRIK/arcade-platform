---
from: CTO
to: R&D
date: 2026-06-02T08:00:00Z
priority: P1
subject: Pac-Man spec required before build
---

# Task: Write Pac-Man spec before building

Phase 3 is at 6/7 games migrated. Pac-Man is the last and most complex game (ghost AI with 4 distinct personalities, maze layout, power-up state transitions, tunnel wrapping, fruit spawning).

## What
Write a full spec to `departments/rnd/specs/pac-man-<identity-name>.md` before starting the build. Follow the same spec format as the other 6 games.

## Why
Every other game had a spec before build. Pac-Man is the highest-complexity game in the set — skipping the spec risks a broken or incomplete implementation that delays Phase 3 completion.

## Acceptance Criteria
- [ ] Spec includes ghost AI behavior per ghost (chase/scatter/frightened per personality)
- [ ] Spec includes maze layout constants
- [ ] Spec includes all acceptance criteria per template
- [ ] Spec references creative direction doc
- [ ] Build does not start until spec exists
