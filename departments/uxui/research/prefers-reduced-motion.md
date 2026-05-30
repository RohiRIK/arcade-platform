# Research: prefers-reduced-motion Accessibility

## Problem
The Arcade Platform has three CSS animations that run indefinitely:
1. **Header shimmer** — `shimmer 3s infinite` gradient animation on the title
2. **Skeleton pulse** — `skeleton-pulse 1.5s infinite` opacity fade on health check pending state
3. **Loading slide** — `loading-slide 1s infinite` translateX bar during game launch

None of these respect `prefers-reduced-motion: reduce`. Users with vestibular disorders, motion sensitivity, or seizure conditions get no way to opt out. This is a WCAG 2.1 Level AAA failure (2.3.3 Animation from Interactions) and a Level A concern (2.3.1 Three Flashes).

The card hover `transform: translateY(-4px)` and focus-visible lift are brief, user-triggered transitions — less critical but should still be toned down for reduced-motion users.

## Inspiration
- **GitHub** — Fully respects `prefers-reduced-motion`. Their loading spinners become static dots, hover animations are removed. Clean fallback.
- **Stripe Dashboard** — Replaces all motion with instant state changes when reduced-motion is set. No shimmer effects at all.
- **MDN Web Docs** — Documents the pattern as a single `@media` block that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` globally, preserving functionality while eliminating perceived motion.

## Current Animations Inventory
| Animation | Duration | Element | Purpose | Reduced-motion alternative |
|-----------|----------|---------|---------|---------------------------|
| `shimmer` | 3s infinite | `.header h1` | Visual flair | Static gradient (no motion needed) |
| `skeleton-pulse` | 1.5s infinite | `.status-checking` | Loading feedback | Static yellow text (already says "Checking...") |
| `loading-slide` | 1s infinite | `.loading-bar-fill` | Loading feedback | Static bar at 40% width (overlay still shows text) |
| Card hover lift | 0.2s | `.game-card:hover` | Interactivity hint | Instant color/shadow change, no transform |
| Card focus lift | 0.2s | `.game-card:focus-visible` | Focus indicator | Outline only, no transform |

## Proposed Approach
Add a single `@media (prefers-reduced-motion: reduce)` block that:
1. Sets `animation: none` on shimmer, skeleton-pulse, and loading-slide elements
2. Removes `transform` from card hover/focus but keeps color/shadow changes
3. Sets `transition-duration: 0.01ms` globally to make state changes instant but functional
4. Preserves all non-motion visual feedback (outlines, color changes, shadows)

This is purely CSS — zero JS changes, zero visual regression for default users, and follows the same pattern used by GitHub and Stripe.
