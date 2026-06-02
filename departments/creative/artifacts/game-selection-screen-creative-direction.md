# Game Selection Screen — Creative Direction

## Concept
The game selection screen is the **lobby** — the moment before you pick your game. It should feel like standing in a dim, neon-lit arcade at midnight. Each game card is a cabinet glowing with its own identity color. The overall mood: dark, electric, inviting.

## Visual Identity

### Background
- **Color:** `#0a0a12` — near-black with the faintest blue undertone
- **Pattern:** Subtle scanline overlay at 2px intervals, `rgba(255,255,255,0.015)` — CRT texture without being distracting
- **Vignette:** Radial gradient from center `transparent` to edges `rgba(0,0,0,0.4)` — draws the eye inward toward the game grid

### Header
- **Title "ARCADE PLATFORM":** `#e94560` — the platform's signature highlight
- **Subtitle font:** monospace, `#888888`, 0.85rem
- **Game count badge:** Pill shape with `rgba(233,69,96,0.12)` background, `#e94560` text, 1px `rgba(233,69,96,0.3)` border. Pulses gently on load: opacity 0.7→1.0 over 1.5s ease-in-out, once

### Game Cards

Each card carries its game's primary accent color as a **top border glow**:

| Game | Accent Color | Glow Color (30% opacity) |
|------|-------------|------------------------|
| Snake Neon Serpent | `#39ff14` | `rgba(57,255,20,0.3)` |
| Pong Volt Rally | `#00e5ff` | `rgba(0,229,255,0.3)` |
| Breakout Prism Shatter | `#e040fb` | `rgba(224,64,251,0.3)` |
| Tetris Cascade | `#4fc3f7` | `rgba(79,195,247,0.3)` |
| Space Invaders Last Frequency | `#76ff03` | `rgba(118,255,3,0.3)` |
| Frogger Neon Crossing | `#76ff03` | `rgba(118,255,3,0.3)` |
| Pac-Man Phantom Maze | `#ffd600` | `rgba(255,214,0,0.3)` |

**Note:** Space Invaders and Frogger share a green accent — differentiate via card emoji icon and banner content, not border color. Both greens are valid per their creative directions.

#### Card Structure
- **Border-top:** 3px solid with game's accent color
- **Background:** `#12121e` — slightly lighter than page background
- **Border-radius:** 8px
- **Box-shadow (idle):** `0 2px 8px rgba(0,0,0,0.4)`
- **Box-shadow (hover):** `0 4px 20px <game-glow-color>` — the card glows in its game's color on hover
- **Transition:** box-shadow 200ms ease, transform 200ms ease
- **Hover transform:** `translateY(-3px)` — subtle lift

#### Card Content
- **Game emoji:** 2rem, centered in a 48×48px circle with `rgba(<accent>,0.1)` background
- **Game title:** monospace, `#eeeeee`, 1rem, bold
- **Game subtitle** (e.g. "Neon Serpent"): monospace, game accent color, 0.75rem, letter-spacing 0.08em
- **Version:** `#555555`, 0.7rem

#### Featured Card (newest/rebuilt game)
- Spans 2 columns on desktop
- Banner area 160px tall (vs 120px normal)
- Shows 1-line game description in `#aaaaaa`, 0.8rem
- Featured border-top: 4px (vs 3px normal)

### Status Badges
Per UX/UI design doc. Creative additions:
- **REBUILT badge:** `#e94560` background — matches platform highlight. This is the "we made it better" badge.
- **NEW badge:** `#4ade80` background — fresh arrival energy
- **Font:** monospace, 0.65rem, weight 700, uppercase, letter-spacing 0.05em

### Entrance Animation
- Cards fade+slide-up (opacity 0→1, translateY 12px→0)
- Duration: 300ms ease per card
- Stagger: 50ms between cards (0ms, 50ms, 100ms, ... 300ms for card 7)
- Total sequence: 600ms — fast enough to feel snappy, slow enough to feel intentional
- Killed by `prefers-reduced-motion`

### Grid Layout
- 3 columns on desktop (min-width 280px per card, gap 20px)
- 2 columns on tablet (768px breakpoint)
- 1 column on mobile (480px breakpoint)
- Featured card collapses to 1-column span on mobile

## Sound Design (Optional — Phase 4 stretch)
- **Card hover:** Soft tick sound — zzfx: `[.03,,200,,.02,.01,1,.5]` — barely audible, tactile
- **Card click (game launch):** Short power-up sweep — zzfx: `[.1,,400,.05,.1,.2,1,2,,,,,.05,.1]`
- **Page load:** No sound. Silence is the lobby's mood.

## Quality Bar
- [x] Dark arcade mood — not bright, not colorful until hover
- [x] Each card identifiable by its glow color alone
- [x] Hover feels responsive (sub-200ms transition)
- [x] Featured card draws the eye without being garish
- [x] Badges are readable but not dominant
- [x] Mobile layout doesn't break card identity
- [x] Scanline texture visible but not distracting on 1080p+

## Assets Needed (for R&D)
- No sprite assets — pure CSS implementation
- 2 optional zzfx sounds (hover tick, launch sweep)
- Game accent colors already defined in each game's JS — R&D can read from game meta
