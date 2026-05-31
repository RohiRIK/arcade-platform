# Design: Snake Neon Serpent HUD & Visual Feedback

**Date:** 2026-05-31
**Research:** departments/uxui/research/snake-neon-serpent-hud.md
**Pivot:** arcade-evolution Phase 2
**Confluence Acknowledgment:** Read `confluence/decisions/2026-05-31-test-pivot-validation.md` — RnD & Creative frozen. UX/UI not frozen, proceeding with design work.

---

## Current State

Snake game card has generic green banner with 🐍 emoji. In-game HUD is minimal: score and high-score drawn in white monospace at top of 600×400 canvas. No combo display, no stage indicators, no bonus timer. Game-over is the shared `drawGameOverOverlay()` from Phase 1.

```
┌──────────────────────────────────────────┐
│ Score: 50            High Score: 120     │
│                                          │
│                                          │
│              [snake gameplay]            │
│                                          │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

## Proposed State

### In-Canvas HUD Layout (600×400)

```
┌──────────────────────────────────────────┐
│ SCORE 150              HI 320   ×3 COMBO │  ← 20px from top, 12px from edges
│                                          │
│                                          │
│              [snake gameplay]            │
│                                          │
│                        ◆ BONUS           │
│                        ──── 3.2s         │  ← contextual, near bonus food
└──────────────────────────────────────────┘
```

### HUD Specifications

#### Score Display (top-left)
- **Font:** `14px monospace`
- **Color:** `#e0e0e0` (--text-primary)
- **Position:** `x: 12, y: 20`
- **Format:** `SCORE ${score}` — uppercase label, space, value
- **Alignment:** `ctx.textAlign = 'left'`

#### High Score Display (top-center-right)
- **Font:** `14px monospace`
- **Color:** `#888` (--text-secondary)
- **Position:** `x: 420, y: 20`
- **Format:** `HI ${highScore}`
- **Condition:** Only render if `highScore > 0`
- **New Best Indicator:** When `score > highScore`, color changes to `#4ade80` (--success) and text becomes `★ NEW BEST ${score}`

#### Combo Counter (top-right)
- **Font:** `bold 16px monospace`
- **Position:** `x: 588, y: 20`, `ctx.textAlign = 'right'`
- **Condition:** Only render when `comboTier >= 2`
- **Format:** `×${comboTier} COMBO`
- **Color by tier:**

| Tier | Color | Extra |
|------|-------|-------|
| ×2 | `#ffea00` | Static |
| ×3 | `#f97316` | Static |
| ×4 | `#e94560` | Static |
| ×5+ | `#e94560` | Pulse: `globalAlpha` oscillates 0.6–1.0 over 200ms (`Math.sin(Date.now() / 100)`) |

#### Combo Announce (float-up)
- **Trigger:** When combo tier increases
- **Font:** `bold 20px monospace`
- **Color:** Same as tier color
- **Animation:** Spawns at snake head position, floats up 60px over 600ms, alpha fades 1.0→0.0
- **Implementation:** R&D manages a `floatingTexts[]` array, each entry: `{text, x, y, startY, color, startTime, duration: 600}`

#### Bonus Food Timer (contextual)
- **Font:** `12px monospace`
- **Color:** `#ffea00` (bonus gold)
- **Position:** 8px below the bonus food item
- **Format:** Countdown `${seconds.toFixed(1)}s`
- **Animation:** Alpha fades from 1.0 to 0.3 as timer depletes. Below 1.5s: blink at 4Hz (`Math.floor(Date.now() / 125) % 2`)

### Game Card Update (HTML/CSS)

Update Snake's game card banner to hint at Neon Serpent identity:

```css
/* Snake card banner — neon green tint instead of generic */
.game-card[data-game="snake"] .game-card-banner {
  background: linear-gradient(135deg, #0a2a0a 0%, #1a1a2e 100%);
}
.game-card[data-game="snake"] .game-card-banner .game-icon {
  text-shadow: 0 0 20px #4ade80, 0 0 40px #4ade8040;
}
```

**Note:** This requires adding `data-game` attributes to game cards in index.html. If cards don't have this attribute yet, add `data-game="snake"` to the Snake card element.

### Game-Over Overlay

Uses the shared `drawGameOverOverlay()` from Phase 1 platform-ui.js. Snake-specific parameters:

```js
drawGameOverOverlay({
  title: 'GAME OVER',
  score: currentScore,
  highScore: highScore,
  isNewBest: currentScore > previousHighScore,
  accentColor: '#4ade80',  // snake green, not platform pink
  stats: [
    { label: 'STAGE', value: currentStage },
    { label: 'MAX COMBO', value: maxComboReached },
    { label: 'FOOD EATEN', value: totalFood }
  ]
});
```

## CSS/HTML Changes

### CSS Additions (in `<style>` block or `css/styles.css` post-extraction)

```css
/* Snake Neon Serpent card identity */
.game-card[data-game="snake"] .game-card-banner {
  background: linear-gradient(135deg, #0a2a0a 0%, #1a1a2e 100%);
}

.game-card[data-game="snake"] .game-card-banner .game-icon {
  text-shadow: 0 0 20px #4ade80, 0 0 40px rgba(74, 222, 128, 0.25);
}
```

### HTML Changes

Add `data-game` attribute to game cards for per-game CSS targeting. Example:

```html
<div class="game-card" data-game="snake" onclick="launchGame('snake')">
```

This is a one-time structural addition — all 7 cards get `data-game` attributes. Enables per-game card theming for the entire pivot without class proliferation.

## Interaction Notes

### Reduced Motion (`prefers-reduced-motion: reduce`)
- Combo pulse: disabled (static full opacity)
- Float-up text: instant position (no animation), show for 600ms then remove
- Bonus blink: disabled (static alpha 0.5 below 1.5s)
- These are canvas-side checks — R&D implements via `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

### Mobile / Small Canvas
- At canvas width < 400px: combo counter moves below score (second row at y: 36)
- Float-up text scales: `Math.max(12, 20 * (canvasWidth / 600))` px
- Bonus timer font: `Math.max(10, 12 * (canvasWidth / 600))` px
- Touch D-pad already handles Snake 4-directional input — no changes needed

### Transitions
- Stage color shifts are handled by Creative spec (environment tints) — no UX/UI CSS involvement
- Game-over overlay uses 0.3s fade-in per existing implementation

## Implementation Notes for R&D

All in-canvas HUD elements are drawn in `gameRenderPost()` (LittleJS post-render callback), ensuring they layer on top of gameplay. R&D should:

1. Create a `drawHUD(ctx, state)` function in `js/games/snake/game.js`
2. Accept a state object: `{score, highScore, comboTier, bonusTimer, floatingTexts}`
3. Follow the exact px positions, fonts, and colors from this spec
4. Check `prefers-reduced-motion` once at game init, cache the result

## Next Step

BUILD: Add `data-game` attributes to all 7 game cards in `index.html` and add per-game banner CSS for Snake. The in-canvas HUD specs are for R&D to implement during Snake rewrite — send R&D inbox message with this design doc reference (after freeze lifts).
