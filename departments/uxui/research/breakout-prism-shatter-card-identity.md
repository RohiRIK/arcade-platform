# Research: Breakout Prism Shatter — Card Identity

## Problem
Breakout is being rewritten as "Prism Shatter" — a crystal-fracturing theme with magenta/purple bricks, a silver paddle, and a light-ball that heats up through combos. The game card in the selection grid currently uses a generic orange-tinted banner (the default `--warning` color from the old hardcoded setup). It needs a distinct visual identity matching the prismatic crystal theme, consistent with how Snake (neon green) and Pong (electric cyan/orange) received their card treatments.

## Inspiration
- **Crystal/gem photography** — deep purple-black backgrounds with vibrant magenta and violet refractions. The "cracking open a vault of light" concept translates to a dark card with a purple-magenta glow.
- **Vaporwave/synthwave aesthetics** — deep purple gradients are a staple of retro-futurism, fitting the arcade platform's dark theme while being distinct from Snake's green and Pong's blue-black.
- **Stained glass windows** — prismatic light through colored panels. The multi-color brick rows (magenta → purple → blue → green → yellow) suggest a rainbow refraction, but the dominant Creative colors are magenta `#e040fb` and deep purple `#7c4dff`.

## Proposed Approach

### Card Banner
- Dark gradient: `#0d0015` (deep purple-black, from Creative's background color) → `#1a1a2e` (standard card bg) at 135deg
- Text shadow: magenta/purple dual glow — primary `#e040fb` and secondary `#7c4dff` — to evoke the prismatic crystal shatter
- Pattern: same `data-game="breakout"` attribute approach used for Snake and Pong

### Scope
- Card banner CSS: 2 rules (gradient + text-shadow) following established pattern
- `data-game="breakout"` attribute already present on the game card HTML element
- No game logic changes (R&D domain)
- No HUD CSS (all canvas-rendered per Creative spec)

## Risk
- Low. Same proven pattern as Snake and Pong card identities. Additive-only CSS.
- Purple-magenta glow is visually distinct from Snake's green and Pong's cyan/orange — no palette collision.
