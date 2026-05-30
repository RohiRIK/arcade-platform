# CPO Impact Assessment: Arcade Evolution Pivot

**Department:** CPO
**Date:** 2026-05-30
**Effort:** M (Medium — standards rewrite + ongoing quality reviews)

## Current Product State

7 functional games, zero personality. Specific issues:

1. **Visual monotony**: All games render on the same black canvas with no per-game identity. The only visual differentiation is the emoji on the card grid.
2. **Game-over inconsistency**: 6 different visual treatments for game-over screens (documented in UX/UI research). Colors range from green to yellow to off-palette red (#e74c3c). Fonts mix sans-serif and monospace at 5 different sizes.
3. **No audio**: Zero sound across all 7 games. Silent games feel dead.
4. **No progression feedback**: Only Snake tracks high scores with celebration. Other games just stop.
5. **No "wow" moments**: Every game is the minimum viable implementation.

The platform looks like a homework assignment, not something someone would choose to play.

## What This Pivot Fixes (CPO Perspective)

The pivot directly addresses every staleness and quality issue I'd flag:
- Per-game visual identity eliminates monotony
- LittleJS particles/zzfx adds game feel where there's none
- Creative department owns the "wow" — this was the missing function
- Shared game-over overlay (from UX/UI research) enforces consistency at the platform layer while allowing per-game personality in the game area

## CPO Scope During Pivot

### Phase 1 — Foundation
- Write **Product Quality Standard v2** incorporating LittleJS capabilities
- Define the quality bar: what "compelling" means in measurable terms
- Review Creative's visual identity guidelines for cross-game coherence

### Phase 2 — Snake (Proof of Concept)
- Review Snake rewrite against quality standard
- Validate: does it actually feel better? (Kill criteria check)
- Coordinate with QA on quality bar test criteria

### Phase 3 — Remaining Games
- Per-game quality review after each migration
- Staleness check: ensure games aren't just template copies of Snake's treatment
- Verify each game has distinct identity while maintaining platform coherence

### Phase 4 — Platform Polish
- Review game selection screen redesign
- Verify visual consistency across navigation, cards, game views
- Final style palette compliance check

### Phase 5 — Cleanup
- Quality sign-off across all 7 games
- Staleness report: final audit

## Product Standards Changes Needed

Current UX/UI design system (dark arcade, CRT-inspired, neon accents) is solid for the platform chrome. The pivot adds a new layer: **per-game identity within platform consistency**. Standards to write:

1. **Game Identity Boundaries**: What can vary per game (game-area colors, particles, sounds, difficulty) vs what must stay consistent (game-over overlay, score display, navigation, card styling).
2. **Quality Bar Checklist**: Particles ✓, Sound ✓, Progression ✓, Wow moment ✓, Unique palette ✓. Binary pass/fail per game.
3. **Anti-Clone Rule**: No two games may share >60% of their color palette or particle effects. Prevents template fatigue.

## UX/UI Department Review

UX/UI has 4 strong research docs and 3 design docs queued. Current pipeline status:
- CSS custom properties: researched + designed (not built) — **should proceed**, this refactor benefits the pivot
- Loading skeletons: researched + designed (not built) — **defer to Phase 4**, platform polish timing
- prefers-reduced-motion: **shipped** — good, accessibility done
- Game-over polish: researched (no design yet) — **coordinate with Creative**, shared overlay belongs in shared/platform-ui.js per pivot structure

Directive to UX/UI: Prioritize CSS custom properties build (pure refactor, no risk). Defer loading skeletons to Phase 4. Game-over overlay design should wait for Creative's visual identity guidelines to ensure consistency.

## Dependencies
- **On Creative:** Visual identity guidelines before I can write the final quality standard
- **On R&D:** Snake rewrite before first quality review
- **On QA:** Coordinate quality bar test criteria

## Risks
1. **"Wow" is subjective.** Mitigation: quality bar checklist uses measurable criteria (particle count, sound trigger count, difficulty delta between levels).
2. **Per-game identity may fragment platform feel.** Mitigation: strict boundaries — game area diverges, chrome stays uniform.
3. **Creative bottleneck delays quality reviews.** Mitigation: review games as they ship, don't batch.

## Estimate
- Quality Standard v2: 1 cycle
- Per-game quality reviews: 7 cycles (1 per game, during Phase 2-3)
- Platform polish review: 1 cycle
- Final sign-off: 1 cycle
- **Total: ~10 cycles** (spread across full pivot)

## Blockers
None. Can begin quality standard draft immediately.
