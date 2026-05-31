# Design: Remove Dead .config-view CSS

## Current State
`css/styles.css` lines 141-143 contain 3 selectors targeting `.config-view`, an element removed during the static-frontend pivot. The CSS is harmless but dead.

## Proposed State
Remove lines 141-143 entirely. No replacement needed — the Config panel no longer exists.

## CSS Changes
**Delete:**
```css
.config-view { display: none; max-width: 500px; margin: 0 auto; }
.config-view label { display: block; margin: 1rem 0 0.3rem; color: var(--text-label); }
.config-view select, .config-view input[type=checkbox] { background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); padding: 0.4rem; border-radius: var(--radius-sm); }
```

## Interaction Notes
None — pure deletion, zero visual impact.
