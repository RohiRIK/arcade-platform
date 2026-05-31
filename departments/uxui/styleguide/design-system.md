# Arcade Platform — Design System

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0f0f23` | Page background (deep navy-black) |
| `--bg-card` | `#1a1a2e` | Cards, nav buttons, inputs |
| `--bg-header-grad` | `#1a1a2e → #16213e` | Header gradient |
| `--border` | `#333` | Card borders, input borders |
| `--border-header` | `#0f3460` | Header bottom border |
| `--accent` | `#e94560` | Primary accent (hot pink/red) — hover states, active nav, game-over text |
| `--accent-hover` | `#c73652` | Back button hover |
| `--success` | `#4ade80` | Health OK, Snake color, win text |
| `--info` | `#60a5fa` | Pong player paddle, Breakout paddle |
| `--warning` | `#f97316` | Orange — Breakout card color |
| `--text-primary` | `#e0e0e0` | Body text |
| `--text-secondary` | `#888` | Subtitle, descriptions, controls text |
| `--text-muted` | `#555` | Timestamps |
| `--text-label` | `#aaa` | Config labels |
| `--text-bright` | `#fff` | Scores, active button text |
| `--text-error` | `#e94560` | Error states, offline indicator |

## Typography

- **Body**: `'Segoe UI', system-ui, sans-serif`
- **Scores/code**: `monospace` (16px in-game, 24px pong score)
- **Header h1**: 2.5rem with shimmer gradient animation
- **Card title**: 1.2rem
- **Card description**: 0.85rem
- **Version badge**: 0.7rem
- **Control hints**: 0.85rem

## Spacing

- Base unit: `0.5rem`
- Header padding: `1.5rem 2rem`
- Content max-width: `1200px`, margin `2rem auto`, padding `0 1rem`
- Card info padding: `1rem`
- Game grid gap: `1.5rem`
- Nav gap: `0.5rem`
- Button padding: `0.4rem 1rem` (nav), `0.5rem 1.5rem` (action)

## Border Radius

- Cards: `12px` (game-card), `8px` (log-entry, canvas, game-view)
- Buttons: `6px`
- Small elements: `4px` (version badge, health-bar span)

## Transitions

- Default: `0.2s ease` (nav buttons)
- Card hover: `transform 0.2s, box-shadow 0.2s` → `translateY(-4px)` + pink glow shadow
- Header shimmer: `3s infinite` background-position animation

## Components

### Game Card
- Background: `#1a1a2e`, border `1px solid #333`, radius `12px`
- Banner: 120px height, centered 3rem emoji icon, tinted background (`{color}20`)
- Info section: title, description, version badge
- Hover: lift -4px + `box-shadow: 0 8px 24px rgba(233,69,96,0.2)`

### Nav Button
- Default: card bg, `#333` border, `#ccc` text
- Active/hover: accent bg, white text, accent border

### Action Buttons
- Back: accent bg, white text, darken on hover
- Save: success green bg, black text, bold

### Health Bar
- Flex row, centered, 0.8rem text
- Status dot: `●` with `#4ade80` (ok) or `#e94560` (offline)

### Log Entry
- Card-style container, accent-colored heading, monospace pre content

## Layout

- Single-page app with section toggling (Games / Changelog / Config)
- Game grid: CSS grid, `repeat(auto-fill, minmax(280px, 1fr))`
- Game view: centered canvas (600×400), stacked controls
- Config: max-width 500px, centered form

### Touch Controls (mobile)
- D-pad: CSS grid 60×60px buttons, card-bg with #333 border, 8px radius
- Variants: `.touch-dpad` (4-way), `.touch-dpad-vertical`, `.touch-dpad-horizontal`
- Active state: accent bg + white text (0.1s transition)
- Shown via `@media (max-width: 768px), (pointer: coarse)`
- Restart button: card-styled, 6px radius, accent on hover

### Responsive Canvas
- `max-width: 100%; height: auto` on game canvas
- Mobile header: 1.8rem h1, 1rem padding, 1rem content margin

### Loading & Skeleton States
- Game launch overlay: `.game-loading` over `.canvas-wrapper`, shows game emoji + "LOADING..." + sliding bar
- Overlay fades out after 400ms via `opacity 0.3s` transition + `.hidden` class
- Health check pending: `⏳ Checking...` with yellow pulsing dot (`skeleton-pulse 1.5s`)
- Keyframes: `skeleton-pulse` (opacity 0.4↔0.9), `loading-slide` (translateX -100%→350%)

### Reduced Motion Accessibility
- `@media (prefers-reduced-motion: reduce)` block at end of stylesheet
- Global: `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `transition-duration: 0.01ms` (all `!important`)
- Card hover/focus: `transform: none` (shadow preserved)
- Pattern: animations "complete" instantly so `animationend` events still fire

## Per-Game Card Identities

Each game card banner has a unique gradient + glow from its Creative direction:

| Game | Gradient | Glow (text-shadow) |
|------|----------|--------------------|
| Snake | `#0a2a0a → #1a1a2e` (dark green) | `#4ade80` green |
| Pong | `#050510 → #1a1a2e` (deep blue-black) | `#00e5ff` cyan + `#ff6d00` orange |
| Breakout | `#0d0015 → #1a1a2e` (deep purple-black) | `#e040fb` magenta + `#7c4dff` purple |
| Tetris | `#0a0e14 → #1a1a2e` (dark steel) | `#00bcd4` cyan + `#ffc107` gold |
| Space Invaders | `#020408 → #1a1a2e` (CRT black) | `#00ff88` phosphor green + `#ff1744` red |
| Frogger | *pending* | *pending* |
| Pac-Man | *pending* | *pending* |

All use 135deg angle, `!important` override on background, consistent structure.

## Current Gaps
- No touch-hold repeat for continuous movement (Pong/Breakout)
- 2/7 card identities remaining (Frogger, Pac-Man)
