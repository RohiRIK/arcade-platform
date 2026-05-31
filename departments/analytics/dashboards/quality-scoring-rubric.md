# Game Quality Scoring Rubric

**Version:** 1.0
**Date:** 2026-06-01
**Author:** Analytics Lead

## Scoring Dimensions

Each dimension scored 0–10. Total max: 50.

### 1. Visual Polish (0–10)
| Score | Criteria |
|-------|----------|
| 0–2 | Raw canvas, no effects, placeholder colors |
| 3–4 | Basic colors, static rendering, no animations beyond gameplay |
| 5–6 | Smooth animations, consistent palette (4+ colors), background effects |
| 7–8 | Particle effects on 3+ events, screen transitions, vignette/glow effects |
| 9–10 | Per-game visual identity (unique palette, themed effects), afterimage/trail effects, ambient visuals |

### 2. Sound Design (0–10)
| Score | Criteria |
|-------|----------|
| 0–2 | Silent or 1 sound effect |
| 3–4 | 2–3 basic sound effects on key events |
| 5–6 | 4–5 distinct sounds, covers core actions (move, score, die) |
| 7–8 | 6–7 zzfx sounds, ambient audio layer, sounds match game theme |
| 9–10 | 7+ zzfx sounds, ambient audio (oscillator/hum), dynamic audio (pitch/volume changes with gameplay state) |

### 3. Progression & Difficulty (0–10)
| Score | Criteria |
|-------|----------|
| 0–2 | Single difficulty, no speed/complexity change |
| 3–4 | Basic speed increase over time |
| 5–6 | 3+ difficulty tiers, score tracking, visible difficulty feedback |
| 7–8 | 5+ stages/tiers, combo or multiplier system, difficulty curve matches player skill ramp |
| 9–10 | 8+ implicit stages, multi-tier combo system (3+ tiers), bonus mechanics, cap mechanics (e.g., deuce/overcharge) |

### 4. Game Feel (0–10)
| Score | Criteria |
|-------|----------|
| 0–2 | Functional but flat — no feedback beyond state change |
| 3–4 | Basic collision/score feedback |
| 5–6 | Visual feedback on 3+ events, responsive controls |
| 7–8 | Particle bursts on key events, score popups, death animation, restart is instant |
| 9–10 | Screen shake or flash on impact, combo feedback (visual + audio), trail effects, at least 1 "wow moment" per session |

### 5. Identity (0–10)
| Score | Criteria |
|-------|----------|
| 0–2 | Generic — could be any game, no theme |
| 3–4 | Named theme but visuals are default |
| 5–6 | Unique color palette applied, themed card banner on platform |
| 7–8 | Unique palette + themed sounds + particle colors match identity, card banner with glow |
| 9–10 | Complete thematic package — name, palette, sounds, particles, ambient effects, and card identity all reinforce a single coherent theme |

## Scoring Scale Summary

| Total | Grade | Meaning |
|-------|-------|---------|
| 0–10 | F | Prototype |
| 11–20 | D | Functional but unpolished |
| 21–30 | C | Acceptable, missing polish areas |
| 31–40 | B | Good, minor gaps |
| 41–45 | A | High quality |
| 46–50 | A+ | Exceptional |

## Retroactive Scores

### Snake Neon Serpent — Total: 43/50 (A)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Visual Polish | 9 | Vignette, wave, afterimage effects, 150-particle cap, neon theme |
| Sound Design | 9 | 7 zzfx sounds + ambient sawtooth oscillator |
| Progression | 9 | 8 implicit stages, 5-tier combo system, bonus food |
| Game Feel | 8 | Particle bursts, combo feedback, instant restart (R key). No screen shake. |
| Identity | 8 | "Neon Serpent" theme with dark-green gradient card + neon glow. Cohesive. |

### Pong Volt Rally — Total: 42/50 (A)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Visual Polish | 8 | Lightning arcs, ball trail, 150-particle cap. No vignette. |
| Sound Design | 9 | 7 zzfx sounds + ambient electric hum (sawtooth oscillator) |
| Progression | 9 | 4 rally stages, deuce mechanic (win-by-2, cap 15), overcharge mode at rally 20+ |
| Game Feel | 8 | Particle effects on hit, scaling CPU AI. No screen shake. |
| Identity | 8 | "Volt Rally" electric-blue theme, dual cyan/orange card glow. Cohesive. |

## Application

- Score each game after R&D build + QA verification
- Analytics publishes scores in cycle reports
- CPO uses scores to validate quality bar (must score ≥35/50 to ship)
- Scores tracked per game across phases to measure improvement
