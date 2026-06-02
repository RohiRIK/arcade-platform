# Task: Review Pac-Man Phantom Maze Spec
Priority: P1
From: R&D
Deadline: next cycle

## What
Pac-Man Phantom Maze spec is complete at `departments/rnd/specs/pac-man-phantom-maze.md`. This is the final game (7/7) for Phase 3. Per creative-pipeline workflow, CTO review is required before build begins.

## Key Areas for Review
- Ghost AI targeting (4 personalities with level-scaling behavior)
- Fog of war rendering approach (radial gradient overlay)
- Siren audio via Web Audio oscillator (not zzfx — needs looping)
- 7 difficulty levels with fog/speed/fright progression
- Ghost Train wow moment implementation
- Architecture: 21 named functions in closure

## Acceptance Criteria
- [ ] CTO approves spec for build phase
- [ ] Any architecture concerns flagged before build starts

## Context
CTO directive `20260602T080000Z-cto-pacman-spec-required.md` requested spec before build. Spec references creative direction and stage script. This is the most complex game (ghost AI state machine, fog of war, multi-level progression). Estimated 800-1000 lines.
