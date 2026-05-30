# Research: Keyboard & Focus Accessibility

## Problem
The Arcade Platform has zero custom focus styles. All interactive elements (nav buttons, game cards, back button, config inputs, restart button) rely on browser default focus outlines, which:
- Are invisible or near-invisible on dark backgrounds in most browsers (Chrome's default is a thin blue ring that disappears against `#0f0f23`)
- Provide no visual consistency with our accent-driven design language
- Make keyboard-only navigation effectively broken — users can't tell what's selected
- Game cards have no `tabindex` or `role`, so they're not keyboard-accessible at all (they use `onclick` on `<div>` elements)

This affects:
1. Keyboard-only users (power users, accessibility needs)
2. Gamepad/remote users (potential future audience for an arcade platform)
3. Tab-navigation between nav sections and game selection

## Inspiration

- **Reference 1: Discord** — Uses a visible 2px solid blue focus ring (`outline`) with a 2px offset on interactive elements. Ring only appears on keyboard focus (`:focus-visible`), not mouse clicks. Clean and unobtrusive.
- **Reference 2: GitHub** — Similar `:focus-visible` approach with a blue outline + dark outline offset for contrast on any background. Two-tone ring ensures visibility everywhere.
- **Reference 3: Retro arcade cabinets** — Physical cabinets highlight the selected game with a glowing border/backlight effect. Translates to a subtle accent glow on focused cards.

## Proposed Approach

1. **`:focus-visible` over `:focus`** — Only show custom focus styles on keyboard navigation, not mouse clicks. This is the modern standard (supported in all evergreen browsers).

2. **Accent-colored focus ring** — Use `#e94560` (our primary accent) as a 2px outline with 2px offset. Matches our hover states and keeps visual consistency.

3. **Game card keyboard access** — Add `tabindex="0"` and `role="button"` to game cards, plus `keydown` handler for Enter/Space to launch. Also add `aria-label` with game name.

4. **Focus ring for all interactive elements**:
   - Nav buttons: accent outline
   - Game cards: accent outline + subtle glow (matches hover shadow)
   - Back/restart/save buttons: accent outline
   - Config inputs: accent border-color change

5. **Skip-to-content not needed** — Single-page app with minimal header, nav is the content.

## Specific Elements Needing Focus Styles
| Element | Current | Proposed |
|---------|---------|----------|
| `.nav button` | Browser default | 2px accent outline, 2px offset |
| `.game-card` | Not focusable | `tabindex="0"`, accent outline + glow shadow |
| `.back-btn` | Browser default | 2px accent outline, 2px offset |
| `.restart-btn` | Browser default | 2px accent outline, 2px offset |
| `.touch-btn` | Browser default | Accent outline (mobile edge case) |
| `.save-btn` | Browser default | 2px accent outline, 2px offset |
| `select`, `input` | Browser default | Accent border-color on focus |

## Scope
- CSS-only for focus rings (no JS needed for styling)
- Small JS addition for game card keyboard interaction (Enter/Space to launch)
- HTML: add `tabindex="0"` and `role="button"` to game card template
