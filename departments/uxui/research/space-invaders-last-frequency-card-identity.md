# Research: Space Invaders "Last Frequency" Card Identity

## Problem
Space Invaders has no per-game card identity. It uses the default `#1a1a2e` banner. 4/7 games now have unique card identities (Snake, Pong, Breakout, Tetris). Space Invaders needs one next per Phase 3 migration order.

## Inspiration
- Creative direction: "Last Frequency" — CRT/radio-signal defense. Phosphor green (`#00ff88`) is the dominant color. Background is near-black CRT (`#020408`). Secondary accent is red (`#ff1744`) from top-row invaders.
- Classic CRT monitors: dark with subtle green/blue phosphor bleed
- Radar screens: dark background, green scan lines

## Proposed Approach
- Banner gradient: CRT black (`#020408`) to card base (`#1a1a2e`) at 135deg — consistent with other cards
- Text-shadow glow: phosphor green (`#00ff88`) primary glow + subtle red secondary glow from invader color (`#ff1744`)
- Maintains platform consistency: same gradient angle, same structure, unique palette from creative spec
