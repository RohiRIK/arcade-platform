# Design: CSS Custom Properties (Design Tokens)

## Current State
All ~40 color values, spacing, and radius values in the stylesheet (lines 9–103 of index.html) are hardcoded hex literals. Example:
```css
body { background: #0f0f23; color: #e0e0e0; }
.header { background: linear-gradient(135deg, #1a1a2e, #16213e); }
.nav button { background: #1a1a2e; border: 1px solid #333; color: #ccc; }
```
Changing accent color requires ~15 find-and-replace edits. The styleguide documents tokens but code doesn't use them.

## Proposed State
Add a `:root` block at the top of `<style>` defining all tokens, then replace every hardcoded value in the **UI chrome CSS** (not game canvas JS) with `var()` references.

### `:root` block to add (before `body` rule):
```css
:root {
  --bg-primary: #0f0f23;
  --bg-card: #1a1a2e;
  --bg-header-end: #16213e;
  --bg-canvas: #000;
  --border: #333;
  --border-header: #0f3460;
  --accent: #e94560;
  --accent-hover: #c73652;
  --accent-glow: rgba(233,69,96,0.2);
  --success: #4ade80;
  --info: #60a5fa;
  --warning: #f97316;
  --text-primary: #e0e0e0;
  --text-secondary: #888;
  --text-muted: #555;
  --text-label: #aaa;
  --text-bright: #fff;
  --text-mid: #ccc;
  --radius-card: 12px;
  --radius-btn: 6px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --transition: 0.2s ease;
}
```

### CSS replacements (UI chrome only, lines 9–103):

| Selector | Property | Old | New |
|----------|----------|-----|-----|
| `body` | background | `#0f0f23` | `var(--bg-primary)` |
| `body` | color | `#e0e0e0` | `var(--text-primary)` |
| `.header` | background grad start | `#1a1a2e` | `var(--bg-card)` |
| `.header` | background grad end | `#16213e` | `var(--bg-header-end)` |
| `.header` | border-bottom color | `#0f3460` | `var(--border-header)` |
| `.header h1` | gradient colors | `#e94560, #0f3460, #e94560` | `var(--accent), var(--border-header), var(--accent)` |
| `.header p` | color | `#888` | `var(--text-secondary)` |
| `.nav button` | background | `#1a1a2e` | `var(--bg-card)` |
| `.nav button` | border color | `#333` | `var(--border)` |
| `.nav button` | color | `#ccc` | `var(--text-mid)` |
| `.nav button:hover/active` | background | `#e94560` | `var(--accent)` |
| `.nav button:hover/active` | color | `#fff` | `var(--text-bright)` |
| `.nav button:hover/active` | border-color | `#e94560` | `var(--accent)` |
| `.game-card` | background | `#1a1a2e` | `var(--bg-card)` |
| `.game-card` | border-radius | `12px` | `var(--radius-card)` |
| `.game-card` | border color | `#333` | `var(--border)` |
| focus-visible rules | outline color | `#e94560` | `var(--accent)` |
| `.game-card:focus-visible` | box-shadow rgba | `rgba(233,69,96,0.2)` | `var(--accent-glow)` |
| `select:focus-visible, input:focus-visible` | border-color | `#e94560` | `var(--accent)` |
| `.game-card .info p` | color | `#888` | `var(--text-secondary)` |
| `.game-card .info .version` | background | `#333` | `var(--border)` |
| `.game-card .info .version` | border-radius | `4px` | `var(--radius-sm)` |
| `.game-view canvas` | border color | `#333` | `var(--border)` |
| `.game-view canvas` | border-radius | `8px` | `var(--radius-md)` |
| `.game-view canvas` | background | `#000` | `var(--bg-canvas)` |
| `.game-view .controls` | color | `#888` | `var(--text-secondary)` |
| `.back-btn` | background | `#e94560` | `var(--accent)` |
| `.back-btn` | color | `#fff` | `var(--text-bright)` |
| `.back-btn` | border-radius | `6px` | `var(--radius-btn)` |
| `.back-btn:hover` | background | `#c73652` | `var(--accent-hover)` |
| `.touch-btn` | background | `#1a1a2e` | `var(--bg-card)` |
| `.touch-btn` | border color | `#333` | `var(--border)` |
| `.touch-btn` | color | `#ccc` | `var(--text-mid)` |
| `.touch-btn` | border-radius | `8px` | `var(--radius-md)` |
| `.touch-btn:active` | background | `#e94560` | `var(--accent)` |
| `.touch-btn:active` | color | `#fff` | `var(--text-bright)` |
| `.touch-btn:active` | border-color | `#e94560` | `var(--accent)` |
| `.restart-btn` | background | `#1a1a2e` | `var(--bg-card)` |
| `.restart-btn` | border color | `#333` | `var(--border)` |
| `.restart-btn` | color | `#ccc` | `var(--text-mid)` |
| `.restart-btn:hover/active` | background | `#e94560` | `var(--accent)` |
| `.restart-btn:hover/active` | color | `#fff` | `var(--text-bright)` |
| `.restart-btn:hover/active` | border-color | `#e94560` | `var(--accent)` |
| `.health-bar span` | background | `#1a1a2e` | `var(--bg-card)` |
| `.health-bar span` | border-radius | `4px` | `var(--radius-sm)` |
| `.health-bar .ok` | color | `#4ade80` | `var(--success)` |
| `.log-entry` | background | `#1a1a2e` | `var(--bg-card)` |
| `.log-entry` | border color | `#333` | `var(--border)` |
| `.log-entry` | border-radius | `8px` | `var(--radius-md)` |
| `.log-entry h4` | color | `#e94560` | `var(--accent)` |
| `.log-entry pre` | color | `#888` | `var(--text-secondary)` |
| `.log-entry .ts` | color | `#555` | `var(--text-muted)` |
| `.config-view label` | color | `#aaa` | `var(--text-label)` |
| `.config-view select/input` | background | `#1a1a2e` | `var(--bg-card)` |
| `.config-view select/input` | color | `#e0e0e0` | `var(--text-primary)` |
| `.config-view select/input` | border color | `#333` | `var(--border)` |
| `.config-view select/input` | border-radius | `4px` | `var(--radius-sm)` |
| `.save-btn` | background | `#4ade80` | `var(--success)` |
| `.save-btn` | border-radius | `6px` | `var(--radius-btn)` |

### Inline style (line 134, scope input):
Replace hardcoded `background:#1a1a2e;color:#e0e0e0;border:1px solid #333;border-radius:4px;` with a class `.config-input` that uses tokens.

## Scope Boundaries
- **IN SCOPE**: All CSS in `<style>` block (lines 9–103) and the one inline style on the scope input.
- **OUT OF SCOPE**: Game canvas JS colors (Snake, Pong, Breakout, Tetris, Space Invaders). These are R&D domain and drawn via canvas API, not CSS. They can adopt tokens later via `getComputedStyle()` if R&D chooses.
- **OUT OF SCOPE**: Inline styles in JS template literals for dynamic banner colors (line 168) — these are per-game identity colors, not design tokens.

## Interaction Notes
- Zero visual change — this is a pure refactor.
- No transitions, animations, or hover states are modified — only the values they reference.
- Future benefit: theme switching (e.g., light mode) becomes a single `:root` override or `[data-theme="light"]` block.

## Risk
- Low. Every replacement is 1:1 value swap.
- QA should verify no visual regression after build.
