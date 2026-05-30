# Research: Loading & Skeleton States

## Problem
The Arcade Platform has zero loading feedback. When the page loads or a game launches, there's a flash of empty content before games render. The styleguide explicitly lists "No loading/skeleton states" as a current gap. On slower connections or devices, users see a blank screen with no indication anything is happening.

Specific moments with no feedback:
1. **Initial page load** — game grid appears instantly (fine on localhost) but on LAN/slow devices, there's an empty gap
2. **Game launch** — clicking a game card transitions to the game view, but the canvas is blank until the game loop starts drawing
3. **Docker health check** — the health indicator in the header has no loading state; it's either "Online" or "Offline" with nothing in between

## Inspiration

### 1. Discord (dark UI, skeleton loading)
- Uses animated pulsing rectangles that match the shape of content
- Skeleton color is slightly lighter than background (#2a2a3e on #1a1a2e equivalent)
- Subtle pulse animation: opacity oscillates 0.5 → 1.0 over ~1.5s
- Content replaces skeleton with no layout shift (same dimensions)

### 2. GitHub (skeleton + spinner hybrid)
- Repository cards use skeleton blocks for text lines
- Code views show a centered spinner for async content
- Skeleton blocks have rounded corners matching final content

### 3. Classic Arcade Cabinets (CRT boot sequence)
- Real arcade machines show a brief "INITIALIZING..." or test screen
- CRT scanline warmup effect — content appears line by line
- Fits our retro theme better than a generic spinner

## Proposed Approach

### Game Card Skeletons (page load)
- On initial render, show placeholder cards with pulsing blocks where the emoji, title, and description will be
- Use CSS `@keyframes pulse` with the card background color oscillating
- Cards maintain the same grid layout — zero layout shift when real content loads
- Since our games list is local (not fetched async), this is more for perceived polish than actual wait time

### Game Launch Loading State (primary value)
- When `launchGame()` is called, show a brief loading overlay on the canvas area
- Display the game's emoji icon + "LOADING..." in retro monospace
- Fade out once the game's first frame draws
- This gives visual continuity between clicking the card and seeing the game

### Health Check Pending State
- Before first health check response, show a "⏳ Checking..." state instead of immediately showing "Offline"
- Pulse the status dot in yellow (#f97316) during the check

### Implementation Notes
- Pure CSS animations — no JS animation libraries
- Pulse keyframe: `@keyframes skeleton-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`
- Skeleton bg color: `#252540` (between card bg and border color)
- Keep all skeletons in our design system: 8px radius, consistent spacing
- Game launch overlay uses existing monospace font stack
