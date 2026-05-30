# Research: CSS Custom Properties (Design Tokens)

## Problem
All color values, spacing, and border-radius values in the Arcade Platform's CSS are hardcoded hex/rem values repeated across 40+ declarations. This creates:
- **Inconsistency risk**: changing the accent color means finding and updating every `#e94560` instance
- **No theming capability**: a future "light mode" or alternate theme would require duplicating the entire stylesheet
- **Maintenance burden**: new components copy-paste values instead of referencing tokens
- The styleguide documents tokens but the CSS doesn't use them — the guide and code can drift apart

## Inspiration
- **GitHub Primer**: Uses `--color-fg-default`, `--color-canvas-default` etc. — every component references tokens, enabling light/dark/dimmed themes from one variable swap.
- **Discord**: Dark UI with CSS custom properties for all surfaces, text colors, and accent states. Components never use raw hex values.
- **Tailwind CSS**: While utility-based, its `theme()` function maps to CSS variables — proving that even utility frameworks centralize values.

## Proposed Approach
1. Define all existing color, spacing, and radius values as CSS custom properties on `:root`
2. Replace every hardcoded value in the stylesheet with `var(--token-name)`
3. Keep exact same visual output — this is a pure refactor, zero visual changes
4. Aligns code with the existing styleguide token table (--bg-primary, --accent, etc.)
5. Future benefit: theme switching becomes trivial (swap `:root` values)

## Scope
- ~40 hardcoded color references to convert
- ~10 spacing/radius values to tokenize
- CSS-only change — no HTML or JS modifications
- No visual changes whatsoever
