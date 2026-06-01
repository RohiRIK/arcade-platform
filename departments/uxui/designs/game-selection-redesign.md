# Design: Game Selection Screen Redesign

## Current State
```
┌──────────────────────────────────────────────────┐
│  ✨ ARCADE PLATFORM ✨                           │
│  Arcade Platform                                 │
│  ● Online — 7 games                              │
│  [Games] [Changelog]                             │
├──────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │  🐍      │ │  🏓      │ │  🧱      │          │
│ │  Snake   │ │  Pong    │ │  Breakout│          │
│ │  v2.0    │ │  v2.0    │ │  v2.0    │          │
│ ├──────────┤ ├──────────┤ ├──────────┤          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │  🧩      │ │  👾      │ │  🐸      │          │
│ │  Tetris  │ │  Space   │ │  Frogger │          │
│ │  v1.0    │ │  v1.0    │ │  v1.0    │          │
│ ├──────────┤ ├──────────┤ ├──────────┤          │
│ ┌──────────┐                                     │
│ │  👻      │                                     │
│ │  Pac-Man │                                     │
│ │  v1.0    │                                     │
│ └──────────┘                                     │
└──────────────────────────────────────────────────┘
```

All cards same size (280px min), flat grid, no hierarchy, no badges, no entrance animation.

## Proposed State
```
┌──────────────────────────────────────────────────┐
│  ✨ ARCADE PLATFORM ✨        ╭─────────╮        │
│  Arcade Platform              │ 7 GAMES │        │
│  [Games] [Changelog]          ╰─────────╯        │
├──────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌──────────┐         │
│ │  🐍 Snake Neon Serpent  │ │  🏓      │         │
│ │  Neon trail, combos,    │ │  Pong    │ [NEW]   │
│ │  10-tier difficulty     │ │  v2.0    │         │
│ │  v2.0          [REBUILT]│ ├──────────┤         │
│ ├─────────────────────────┤ ┌──────────┐         │
│ ┌──────────┐ ┌──────────┐ │  🧱      │         │
│ │  🧩      │ │  👾      │ │  Breakout│ [REBUILT]│
│ │  Tetris  │ │  Space   │ │  v2.0    │         │
│ │  v1.0    │ │  v1.0    │ ├──────────┤         │
│ ├──────────┤ ├──────────┤                        │
│ ┌──────────┐ ┌──────────┐                        │
│ │  🐸      │ │  👻      │                        │
│ │  Frogger │ │  Pac-Man │                        │
│ │  v1.0    │ │  v1.0    │                        │
│ └──────────┘ └──────────┘                        │
└──────────────────────────────────────────────────┘
```

Key changes: featured card (2-col span), status badges, game count badge, stagger entrance.

## CSS/HTML Changes

### 1. Featured Card (`.game-card.featured`)
```css
.game-card.featured {
  grid-column: span 2;
}

.game-card.featured .game-banner {
  height: 160px;  /* taller banner for featured */
}

.game-card.featured .game-info p {
  display: block;  /* show description, hidden on normal cards if desired */
}

@media (max-width: 768px) {
  .game-card.featured {
    grid-column: span 1;  /* single column on mobile */
  }
  .game-card.featured .game-banner {
    height: 120px;
  }
}
```

### 2. Status Badges (`.card-badge`)
```css
.card-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
}

.card-badge.rebuilt {
  background: var(--accent, #e94560);
  color: #fff;
}

.card-badge.new {
  background: var(--success, #4ade80);
  color: #000;
}

.card-badge.updated {
  background: var(--info, #60a5fa);
  color: #000;
}
```
Badges placed inside `.game-banner` div. The `.game-card` or `.game-banner` needs `position: relative` (already has it via existing card identity styles).

### 3. Game Count Badge (header)
```css
.game-count {
  display: inline-block;
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent, #e94560);
  border: 1px solid rgba(233, 69, 96, 0.3);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-left: 1rem;
  vertical-align: middle;
}
```
HTML: Add `<span class="game-count">7 GAMES</span>` after the subtitle `<p>` or next to the `<h1>`.

### 4. Grid Entrance Animation
```css
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-card {
  animation: card-enter 0.3s ease both;
}

.game-card:nth-child(1) { animation-delay: 0s; }
.game-card:nth-child(2) { animation-delay: 0.05s; }
.game-card:nth-child(3) { animation-delay: 0.1s; }
.game-card:nth-child(4) { animation-delay: 0.15s; }
.game-card:nth-child(5) { animation-delay: 0.2s; }
.game-card:nth-child(6) { animation-delay: 0.25s; }
.game-card:nth-child(7) { animation-delay: 0.3s; }
```

Already have `prefers-reduced-motion` block that kills animations — this is covered.

### 5. Health Bar Replacement
Remove the backend health check display. Replace with the static game count badge (item 3 above). The `healthBar` div can be removed or repurposed.

```css
/* Remove or hide */
.health-bar { display: none; }
```

### 6. Empty State
```css
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary, #888);
  font-size: 1.1rem;
}

.empty-state .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
```
HTML: `<div class="empty-state"><div class="empty-icon">🕹️</div>No games available</div>` shown when game grid is empty.

## Interaction Notes

- **Featured card hover**: Same lift + glow as normal cards, but larger shadow spread (wider card = wider glow)
- **Badge**: Static, no animation. Just a label.
- **Entrance animation**: Plays once on page load. 0.3s duration, 0.05s stagger per card. Total sequence: 0.6s for 7 cards. Subtle — not showy.
- **Responsive**: Featured card collapses to single column on mobile. Badges stay. Entrance animation stays (but killed by reduced-motion).
- **Accessibility**: Badges are purely decorative labels (visible text in DOM). No ARIA needed beyond existing card structure.

## Implementation Notes
- This is Phase 4 work per the pivot execution plan. Design doc is ready for when Phase 4 begins.
- HTML changes: add `.featured` class to one card, add badge `<span>` elements inside banners, add game count badge in header, add empty state div.
- CSS changes: ~60 new lines in `styles.css`. No existing selectors modified.
- R&D coordination: R&D controls `index.html` JS that generates game cards. Badge data (which games are "rebuilt", "new") could come from the static GAMES array metadata. Will need R&D to add a `status` field to game meta objects.
