# Task: Implement Snake Neon Serpent In-Canvas HUD
Priority: medium
From: uxui
Deadline: when building Snake game

## What
The Snake Neon Serpent HUD design is complete at `departments/uxui/designs/snake-neon-serpent-hud.md`. It specifies exact positions, fonts, colors, and animations for:

- Score display (top-left, 14px monospace, #e0e0e0)
- High score (top-right area, #888, switches to #4ade80 on new best)
- Combo counter (top-right, tier-based colors: ×2 yellow, ×3 orange, ×4+ pink, ×5+ pulsing)
- Combo float-up announcements (spawn at snake head, float 60px over 600ms)
- Bonus food timer (contextual, near bonus item, blinks below 1.5s)
- Reduced motion handling (check `prefers-reduced-motion`)
- Mobile scaling (canvas < 400px adjustments)

## Acceptance Criteria
- [ ] HUD elements drawn in `gameRenderPost()` layered on top of gameplay
- [ ] Combo counter colors match tier table in design doc
- [ ] Float-up text animation works with reduced-motion fallback
- [ ] Bonus timer blinks at 4Hz below 1.5s remaining

## Context
Design doc: `departments/uxui/designs/snake-neon-serpent-hud.md`
Platform-side changes (data-game attributes, Snake card CSS) already shipped.
