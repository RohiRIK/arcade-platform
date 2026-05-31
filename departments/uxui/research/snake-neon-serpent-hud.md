# Research: Snake Neon Serpent HUD & Visual Feedback

**Date:** 2026-05-31
**Phase:** arcade-evolution Phase 2
**References:** Creative stage script, R&D research doc

---

## Problem
The Snake Neon Serpent rewrite introduces combo systems, stage progression, and bonus food with time-limited spawns. The current Snake has zero HUD beyond score/high-score. The new game needs in-canvas UI elements that communicate:
1. Combo tier (×1–×5+) with visual escalation
2. Current stage (implicit — communicated through environment, not a label)
3. Bonus food timer (5s countdown with shrink animation)
4. Score/high-score with new-best indicator
5. Stage transition feedback (environmental color shifts)

These are **in-game canvas overlays**, not HTML DOM elements — R&D owns implementation. UX/UI's role is defining the visual language so it's consistent with our design system.

## Inspiration

### 1. Geometry Wars (Xbox 360)
- Neon-on-black aesthetic with glowing particles
- Score counter top-center, multiplier bottom-right — never obscures gameplay
- Environmental escalation through particle density and color temperature
- HUD is minimal: the game world IS the feedback

### 2. Pac-Man Championship Edition DX
- Score prominently displayed, combo counter appears mid-screen briefly then fades
- Stage transitions are color palette shifts — no loading, no text, just the world changes
- Ghost chain counter floats up from action point (contextual, not HUD-anchored)

### 3. Tetris Effect
- Score/level info tucked to sides, gameplay center is sacred
- Stage transitions are seamless environmental morphs
- Audio-visual synchronization creates flow state

### 4. Nokia Snake (Original)
- Zero HUD clutter — score was literally the phone's status bar
- Lesson: Snake's appeal is simplicity. Don't over-HUD it.

## Analysis: What Needs UX/UI vs R&D

| Element | Owner | Rationale |
|---------|-------|-----------|
| Combo counter position/style | UX/UI defines, R&D implements | Visual consistency with design system |
| Score/high-score layout | UX/UI defines, R&D implements | Typography tokens apply |
| Stage color palettes | Creative defines, R&D implements | Already in stage script |
| Bonus food visual | Creative defines, R&D implements | Already specified (gold diamond) |
| Game-over overlay | UX/UI (shared `drawGameOverOverlay`) | Already built in Phase 1 |
| Canvas responsive sizing | UX/UI | CSS `max-width: 100%; height: auto` already in styleguide |
| Touch controls for Snake | UX/UI | D-pad already designed, may need combo display on mobile |

## Proposed Approach

### HUD Layout (600×400 canvas)
```
┌──────────────────────────────────────────┐
│ SCORE: 150          HI: 320    ×3 COMBO  │  ← top bar, 20px from top
│                                          │
│                                          │
│              [gameplay area]             │
│                                          │
│                                          │
│                          BONUS 3.2s      │  ← near bonus food, contextual
└──────────────────────────────────────────┘
```

- **Score/Hi:** Top-left, monospace, `#e0e0e0`, 14px. High score only shows if > 0.
- **Combo counter:** Top-right, appears only when combo ≥ 2. Color escalates:
  - ×2: `#ffea00` (gold)
  - ×3: `#f97316` (warning orange)
  - ×4: `#e94560` (accent pink)
  - ×5+: `#e94560` with 200ms pulse animation
- **Bonus timer:** Contextual, near the bonus food item, not in HUD bar. Shrinks with the food.
- **Stage transitions:** No HUD indicator. Environment shifts (grid opacity, bg color, firefly color) per Creative spec. This is the right call — explicit stage numbers break immersion.

### Typography Tokens (Canvas)
- Score text: `monospace 14px`, fill `#e0e0e0`
- Combo text: `bold monospace 16px`, fill per tier
- Float-up text (combo announce, bonus pickup): `bold monospace 20px`, float-up 60px over 600ms, fade out

### Color Mapping to Design System
| Game Element | Design System Token | Value |
|-------------|-------------------|-------|
| Score text | `--text-primary` | `#e0e0e0` |
| High score text | `--text-secondary` | `#888` |
| Combo ×2 | (game-specific) | `#ffea00` |
| Combo ×3 | `--warning` | `#f97316` |
| Combo ×4+ | `--accent` | `#e94560` |
| Snake body | `--success` | `#4ade80` |
| Food | `--accent` | `#e94560` |
| Bonus food | (game-specific) | `#ffea00` |
| Death flash | `--accent` | `#e94560` |
| New best | `--success` | `#4ade80` |

### Mobile Considerations
- Touch D-pad already implemented and works for Snake (4-directional)
- Combo counter must be visible at smaller canvas sizes — test at 320px width
- Float-up text should scale with canvas (use relative sizing, not fixed px)

## Next Step
Design doc with exact CSS/canvas specifications for R&D to implement the HUD overlay, plus any HTML/CSS changes needed for the Snake game card (updated banner color to match neon theme).
