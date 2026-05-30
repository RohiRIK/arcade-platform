# Breakout — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Breakout becomes **"Prism Shatter"** — you're fracturing a crystal wall with a ball of light. Each brick is a colored crystal that shatters into gem-like fragments. As rows break, light floods through the gaps, illuminating the dark playfield below. The paddle is a mirror reflecting the light-ball. Combos make the ball glow hotter (white→yellow→orange→red). It should feel like cracking open a treasure vault — every hit is satisfying, every clear row reveals more light.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0d0015` | Deep purple-black void |
| Paddle | `#c0c0c0` | Silver mirror, 2px white highlight on top edge |
| Ball | `#f0f0ff` | Cool white light orb, 3px glow |
| Ball (combo 3+) | `#ffd54f` | Warm yellow, 5px glow |
| Ball (combo 6+) | `#ff6e40` | Hot orange, 7px glow |
| Brick row 1 (top) | `#e040fb` | Magenta crystal — 30pts |
| Brick row 2 | `#7c4dff` | Deep purple — 25pts |
| Brick row 3 | `#448aff` | Blue — 20pts |
| Brick row 4 | `#00e676` | Green — 15pts |
| Brick row 5 (bottom) | `#ffea00` | Yellow — 10pts |
| Score text | `#e0e0e0` | 16px monospace |
| Lives | `#f0f0ff` | Small ball icons (6px) bottom-left |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Brick hit | Crystal shatter | 350ms | 6 particles in brick's color, size 4→0px, angular spread 120° upward from impact, slight gravity (0.5px/frame²) |
| Row cleared | Light beam | 500ms | Vertical light column (8px wide, row's color at 30% opacity) shoots up from cleared row position, fades over 500ms |
| Paddle hit | Mirror flash | 150ms | Brief white line along paddle top edge, opacity 1→0 |
| Ball lost | Fade + drop | 400ms | Ball leaves 5 fading afterimages as it falls below paddle |
| Combo 3 | Heat up | 200ms | Ball color transitions to yellow over 200ms, 4-particle burst |
| Combo 6 | Overheat | 200ms | Ball color transitions to orange, 8-particle burst, trail lengthens |
| All bricks cleared | Prismatic explosion | 1000ms | 50 particles in all 5 brick colors, radial burst from center, confetti physics (gravity + air resistance) |
| Power-up spawn | Gem drop | continuous | Slowly falling gem shape (10×10px), rotating 90°/s, in power-up color, pulsing glow |

### Sprite Style
Procedural:
- Bricks: rounded rectangles 54×18px (10 columns, 5 rows, 2px gaps), border-radius 3px, 1px lighter top/left highlight for crystal facet look
- Paddle: rounded rectangle 80×12px, border-radius 6px, white 1px highlight on top
- Ball: circle radius 7px with glow
- Power-up gems: rotated squares (diamond) 10×10px

---

## Sound Design

**Style:** Crystalline / glass — clean, bright, resonant

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Brick hit | `glass_clink` | 100ms | High sine 1800Hz, 30ms attack, 70ms decay, slight reverb. Pitch varies by row: top=2200Hz, bottom=1400Hz |
| Paddle hit | `mirror_ping` | 80ms | Clean ping 880Hz, triangle wave, 80ms, no distortion |
| Ball lost | `drop_womp` | 300ms | Descending sine 400Hz→100Hz, 300ms, low-pass filter sweep |
| Row cleared | `chime_cascade` | 400ms | Five-note descending arpeggio matching row colors, 80ms each, sine wave |
| Combo 3+ | `heat_sizzle` | 120ms | White noise burst with high-pass filter at 4kHz, 120ms |
| All cleared | `victory_cascade` | 800ms | Ascending major arpeggio C5-E5-G5-C6, 200ms each, bright sine + reverb |
| Power-up collect | `gem_pickup` | 150ms | Two-tone rising: 660Hz→990Hz, 75ms each, triangle wave |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Ball speed:** Start 3.5px/frame, +0.5px/frame per level cleared, max 6px/frame
- **Combo system:** Consecutive brick hits without paddle touch = combo. Score multiplier = 1.0 + (combo × 0.25), max 3.0×
- **Power-ups (10% drop chance per brick):**
  - 🔵 Wide paddle (`#448aff`): paddle 80→120px for 15s
  - 🟢 Multi-ball (`#00e676`): splits into 3 balls
  - 🟡 Slow (`#ffea00`): ball speed ×0.6 for 10s
- **Levels:** 5 brick layouts with increasing complexity. Level 1: standard grid. Levels 2-5: introduce indestructible bricks (`#505050`, bounce off), multi-hit bricks (crack overlay after first hit)
- **Lives:** 3 lives, displayed as small ball icons

### Difficulty Curve
| Level | Speed | Layout | Feel |
|-------|-------|--------|------|
| 1 | 3.5px/frame | Standard 10×5 grid | Learn mechanics |
| 2 | 4.0px/frame | 10×5 + 2 indestructible | Strategic bouncing |
| 3 | 4.5px/frame | 10×6 + 4 indestructible + 4 multi-hit | Patience required |
| 4 | 5.0px/frame | 10×6 + pattern layout + 6 multi-hit | Precision |
| 5 | 5.5px/frame | 10×7 fortress layout | Mastery |

### "Wow" Moment
**The Prismatic Clear:** When the player clears all bricks in a level, the entire screen fills with a 1-second confetti explosion of crystal particles in all 5 row colors. Each particle has slight gravity and air resistance, creating a "gem rain" effect. The score for the clear bonus (500 × level) writes itself digit-by-digit in `#ffea00` at 32px, each digit triggering a small particle pop.

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Bricks materialize row-by-row top→bottom (80ms per row), paddle slides up from bottom | 600ms |
| Level clear | Prismatic explosion → fade to black (300ms) → new bricks materialize | 1500ms total |
| Ball lost | Ball fades → screen dims slightly (200ms) → ball respawns on paddle → dim lifts | 600ms |
| Game over | All remaining bricks shatter simultaneously → overlay → score display | 1000ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS particle system with gravity for crystal shatter + confetti
- LittleJS `zzfx()` for all sounds
- Canvas 2D for bricks, paddle, ball, power-up gems
- Level layout data (5 arrays)
- localStorage for high score

---

## Quality Bar Checklist
- [x] Unique color palette: `#0d0015` / `#e040fb` / `#7c4dff` / `#448aff` / `#00e676` / `#ffea00`
- [x] 7 sound effects: brick hit, paddle, ball lost, row clear, combo, victory, power-up
- [x] Particle effects: crystal shatter, light beams, mirror flash, confetti clear
- [x] Smooth transitions: brick materialize, level clear, game over
- [x] Difficulty progression: 5 levels with speed + layout complexity
- [x] "Wow" moment: Prismatic Clear confetti explosion
