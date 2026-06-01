# Research: Game Selection Screen Redesign

## Problem
The game selection grid is functional but generic. With all 7 card identities now shipped (unique gradients + glow per game), the cards themselves have personality — but the surrounding selection screen is plain. Phase 4 of the pivot calls for a game selection screen redesign.

Current issues:
1. **No category/filter** — 7 games in a flat grid, fine now, but won't scale if more games are added
2. **No "last played" or "featured" emphasis** — all cards are equal weight
3. **No game status indicators** — no way to see if a game is new, updated, or has a known issue
4. **Header area is underused** — shimmer title + subtitle + health bar, but no engaging content
5. **No visual hierarchy** — every card is the same 280px minimum, no featured/hero card option

## Inspiration

### Reference 1: itch.io Game Grid
- Clean dark grid with varied card sizes (featured games get larger cards)
- Hover reveals description overlay
- Tags/badges on cards (new, popular, jam entry)
- What works: hierarchy through size variation, quick-scan badges

### Reference 2: Steam Library Grid View  
- Cards with game art as full bleed
- Hover shows play button overlay
- Recently played section at top
- What works: full-bleed imagery, temporal sorting ("recent" section)

### Reference 3: Classic Arcade Cabinet Select Screens
- Horizontal scrolling game list with large preview
- Selected game gets a zoomed/highlighted treatment
- Attract mode animations on idle
- What works: strong focus state, one game dominates view at a time

### Reference 4: Retroarch Menu (XMB Theme)
- Horizontal categories, vertical game list per category
- Selected item is centered and enlarged
- Consistent icon style across all entries
- What works: consistent visual language, clear selection state

## Proposed Approach

Stay within our dark arcade design language. Key improvements:

1. **Featured card variant** — allow one card to span 2 columns on desktop, showcasing the newest/most recently updated game. CSS-only with a `.featured` class.

2. **"New" / "Updated" badges** — small pill badges on cards for games that were recently added or rebuilt. Uses existing `--accent` and `--success` tokens. Fades after 7 days.

3. **Subtle grid entrance animation** — cards stagger-fade-in on page load (0.05s delay per card). Respects `prefers-reduced-motion`.

4. **Game count in header** — show "7 GAMES" count as a subtle badge next to the title, replacing the health bar (which references backend checks no longer relevant).

5. **Empty state** — if no games loaded, show a styled "No games available" message instead of empty grid.

These changes are CSS + minimal HTML template changes. No game logic touched. All within UX/UI domain.

## Constraints
- Must not break existing card identity CSS (per-game gradients/glows)
- Must work at mobile viewport (single column, no featured span)
- Must respect `prefers-reduced-motion`
- Cards already have `tabindex="0"` and `role="button"` — maintain accessibility
