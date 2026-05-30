# Tetris — Creative Direction (Arcade Evolution)

**Author:** Creative Director
**Date:** 2026-05-30
**Phase:** 3 (Second Wave Migration)
**Status:** Concept + Prototype Spec

---

## Concept

Tetris becomes **"Cascade"** — a zen-industrial experience where falling blocks are liquid-metal fragments solidifying into place. Line clears trigger a satisfying dissolve-and-collapse animation like molten metal draining away. The mood is calm but focused — deep ambient tones, smooth movements, and a clean dark interface. The deeper you stack, the more the background subtly shifts color to signal rising tension.

---

## Visual Identity

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0a0e14` | Dark steel blue-black |
| Well border | `#1c2833` | 2px border, subtle metallic |
| Grid lines | `#111820` | 1px, barely visible |
| I-piece | `#00bcd4` | Cyan liquid metal |
| O-piece | `#ffc107` | Gold alloy |
| T-piece | `#9c27b0` | Purple titanium |
| S-piece | `#4caf50` | Green chrome |
| Z-piece | `#f44336` | Red-hot iron |
| L-piece | `#ff9800` | Orange copper |
| J-piece | `#2196f3` | Blue steel |
| Ghost piece | current color at 20% opacity | Drop preview |
| Score/level text | `#b0bec5` | 14px monospace, right panel |
| Next piece label | `#78909c` | 12px monospace, right panel |
| Background tension | `#0a0e14` → `#1a0a0a` | Shifts red-tint as stack passes row 15 |

### Visual Effects (LittleJS particles)
| Event | Effect | Duration | Details |
|-------|--------|----------|---------|
| Piece lock | Solidify flash | 150ms | Each cell of piece flashes white highlight (top-left 2px corner) then settles to normal color |
| Line clear (single) | Dissolve drain | 400ms | Cleared row cells melt downward (stretch-y to 0 over 400ms), 3 particles per cell drop down |
| Line clear (double) | Double drain + flash | 500ms | Same dissolve + brief horizontal light bar across both rows, `#ffffff` at 15% |
| Line clear (triple) | Triple cascade | 600ms | Rows dissolve with 100ms stagger top→bottom, screen vibrates ±1px for 200ms |
| Tetris (4 lines) | Meltdown | 800ms | All 4 rows flash white 100ms → dissolve simultaneously → 40 particles spray upward in all piece colors → screen shake ±2px 300ms |
| Hard drop | Impact | 100ms | 4 particles spray left/right from bottom of piece, `#ffffff`, size 2→0px |
| Level up | Border pulse | 400ms | Well border brightens to `#4fc3f7` then fades back to `#1c2833` |

### Sprite Style
Procedural:
- Blocks: 28×28px cells in 30×30 grid slots, border-radius 2px, 1px lighter top/left edge (bevel), 1px darker bottom/right edge
- Ghost piece: same shape, outlined only (2px border, no fill), 20% opacity
- Next piece preview: 4×4 grid area, right panel, scaled to 20×20px cells

---

## Sound Design

**Style:** Industrial ambient — metallic impacts, deep resonance

| Event | Sound | Duration | Description |
|-------|-------|----------|-------------|
| Piece move | `metal_tick` | 30ms | Very short click, square wave 600Hz, 30ms, volume 40% |
| Piece rotate | `gear_click` | 50ms | Two-click: 800Hz+1000Hz, 25ms each, mechanical feel |
| Piece lock | `clamp_thud` | 80ms | Low thud 150Hz, triangle wave, 80ms, slight reverb |
| Hard drop | `slam_impact` | 120ms | Bass hit 80Hz + white noise crack, 120ms |
| Line clear (1) | `drain_hiss` | 300ms | White noise with descending bandpass 2kHz→500Hz |
| Line clear (4 / Tetris) | `meltdown_boom` | 500ms | Deep bass 50Hz 200ms + ascending sine sweep 200→1200Hz 300ms + reverb |
| Level up | `power_surge` | 400ms | Rising square wave 200Hz→600Hz with volume swell |
| Game over | `shutdown` | 600ms | Descending power-down: 400Hz→40Hz, triangle wave, slow decay, reverb tail |

All sounds via LittleJS `zzfx()`.

---

## Gameplay Enhancements

### Progression System
- **Drop speed:** Level 1 = 800ms/row, decreases by 60ms per level, minimum 100ms at level 12+
- **Scoring:** Single=100×level, Double=300×level, Triple=500×level, Tetris=800×level
- **Level up:** Every 10 lines cleared
- **T-Spin bonus:** Detected T-spin clears get 2× score multiplier + "T-SPIN" text flash in `#9c27b0` at 20px
- **Next piece preview:** Shows next piece in right panel
- **Hold piece:** Press C to swap current piece with held piece (once per drop)

### Difficulty Curve
| Level | Drop speed | Feel |
|-------|-----------|------|
| 1 | 800ms | Relaxed, learn stacking |
| 2–3 | 680–620ms | Comfortable rhythm |
| 4–6 | 560–440ms | Engaging |
| 7–9 | 380–260ms | Fast, strategic |
| 10–11 | 200–140ms | Intense |
| 12+ | 100ms | Survival mode |

### "Wow" Moment
**The Tetris Meltdown:** Clearing 4 lines simultaneously triggers the full meltdown sequence — all 4 rows flash white, then dissolve into 40 molten particles spraying upward, the screen shakes ±2px for 300ms, the score counter rapidly ticks up digit-by-digit, and the well border flashes the piece's color. The word "TETRIS!" appears center-screen in `#ffc107` at 36px bold, pulsing scale 1.0→1.2→1.0 over 400ms.

---

## Transitions
| Transition | Animation | Duration |
|-----------|-----------|----------|
| Game start | Well border draws in (top→sides→bottom), grid fades in, first piece drops from above | 500ms |
| Level up | Border pulse + brief "LEVEL X" text center-screen at 24px, fades 400ms | 400ms |
| Game over | Pieces gray out row-by-row bottom→top (50ms/row) → overlay → final score | 1000ms + rows |
| Restart | Gray rows dissolve → empty well → new game | 500ms |

---

## Assets Needed (for R&D)
All procedural:
- LittleJS particle system for dissolve/meltdown/impact
- LittleJS `zzfx()` for all sounds
- Canvas 2D for blocks with bevel effect, ghost piece, next preview
- Standard SRS rotation system
- localStorage for high score

---

## Quality Bar Checklist
- [x] Unique color palette: `#0a0e14` + 7 distinct piece colors
- [x] 8 sound effects: move, rotate, lock, drop, clear×2, level-up, game-over
- [x] Particle effects: solidify, dissolve drain, meltdown, impact, border pulse
- [x] Smooth transitions: well draw-in, level-up flash, gray-out game over
- [x] Difficulty progression: 12-level speed curve
- [x] "Wow" moment: Tetris Meltdown (4-line clear spectacle)
