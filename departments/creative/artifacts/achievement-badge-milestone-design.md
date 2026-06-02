# Achievement Badge & Milestone System — Creative Direction

## Concept
Achievements are **arcade cabinet decals** — small, collectible, game-specific badges that track mastery. They shouldn't feel corporate ("Achievement Unlocked!"). They should feel like scratching your initials into the high score table.

The system has two layers:
1. **Per-game milestones** — specific to each game's mechanics
2. **Cross-game badges** — platform-level progression

## Visual Language

### Badge Shape
- **Circle:** 40×40px displayed, 80×80px asset
- **Border:** 2px solid, game's accent color
- **Background (locked):** `#1a1a2e` with `rgba(255,255,255,0.05)` — dim, ghosted
- **Background (unlocked):** Radial gradient from game's accent color at 20% opacity center to transparent edge
- **Icon:** Single emoji or 1-2 character symbol, centered, 20px
- **Locked state:** Icon at 30% opacity, grayscale filter, no glow
- **Unlocked state:** Icon at 100% opacity, faint glow `0 0 8px <accent at 40%>`
- **Unlock animation:** Scale 0.5→1.2→1.0 over 400ms cubic-bezier(0.34,1.56,0.64,1), glow pulse 0%→60%→40% opacity over 600ms

### Badge Display
- **In-game:** Top-right corner during gameplay, 32×32px. Appears on unlock with animation, fades to 60% opacity after 3s, disappears after 8s.
- **Game-over screen:** Row of earned badges below score. Locked badges not shown here.
- **Game selection card:** Small badge count indicator — e.g. "★ 3/5" in `#888` next to version number. No badge images on the card — keep it clean.
- **Achievement panel:** Future Phase 5 feature — dedicated view showing all badges per game. Not in scope for Phase 4.

## Per-Game Milestones

### 🐍 Snake Neon Serpent
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 🔥 | First Blood | Score 100+ | `#39ff14` |
| 2 | ⚡ | Combo King | 5× combo streak | `#ffea00` |
| 3 | 💀 | Survivor | Reach stage 5 | `#ff1744` |
| 4 | 🌟 | Neon Master | Reach stage 8 | `#39ff14` |
| 5 | 👑 | Serpent God | Score 2000+ | `#ffd600` |

### 🏓 Pong Volt Rally
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | ⚡ | Charged Up | Win first rally (5 pts) | `#00e5ff` |
| 2 | 🔄 | Spin Doctor | 10 spin shots in one game | `#ff6d00` |
| 3 | 🛡️ | Perfect Defense | Win a game without losing a point | `#00e5ff` |
| 4 | 💥 | Volt Smash | Trigger 3 smash effects in one game | `#ff6d00` |
| 5 | 👑 | Rally Champion | Win 10 games total | `#ffd600` |

### 🧱 Breakout Prism Shatter
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 💎 | First Crack | Clear 1 row | `#e040fb` |
| 2 | 🌈 | Prism Chain | 3 multi-ball hits without losing ball | `#7c4dff` |
| 3 | 🧹 | Clean Sweep | Clear all bricks in a level | `#00e676` |
| 4 | ⚡ | Speed Demon | Clear a level in under 30s | `#448aff` |
| 5 | 👑 | Shatter King | Score 5000+ | `#ffd600` |

### 🧩 Tetris Cascade
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 📦 | First Melt | Clear 1 line | `#4fc3f7` |
| 2 | 🔥 | Cascade Chain | Clear 4 lines simultaneously (Tetris) | `#ff7043` |
| 3 | ❄️ | Zen Flow | Survive 5 minutes | `#80deea` |
| 4 | 🌊 | Liquid Metal | Clear 50 total lines in one game | `#b0bec5` |
| 5 | 👑 | Cascade Master | Score 10000+ | `#ffd600` |

### 👾 Space Invaders Last Frequency
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 📡 | First Signal | Complete wave 1 | `#76ff03` |
| 2 | 🛸 | UFO Hunter | Destroy a UFO | `#ff1744` |
| 3 | 🛡️ | Barricade Keeper | Finish wave 3 with a shield intact | `#33b5e5` |
| 4 | ⚡ | Signal Boost | Collect 3 signal boost powerups | `#76ff03` |
| 5 | 👑 | Last Defender | Score 5000+ | `#ffd600` |

### 🐸 Frogger Neon Crossing
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 🏠 | Safe Landing | Fill 1 home slot | `#76ff03` |
| 2 | 🌧️ | Storm Runner | Complete a level during storm surge | `#00e5ff` |
| 3 | ⚡ | Emergency Dash | Use emergency boost 3 times in one level | `#ff1744` |
| 4 | ✨ | Perfect Crossing | Fill all 5 homes with zero deaths | `#76ff03` |
| 5 | 👑 | Neon Navigator | Reach level 5 | `#ffd600` |

### 👻 Pac-Man Phantom Maze
| Badge | Icon | Name | Condition | Accent |
|-------|------|------|-----------|--------|
| 1 | 🍒 | Cherry Picked | Eat first fruit | `#ff1744` |
| 2 | 👻 | Ghost Train | Eat all 4 ghosts in one power pellet | `#448aff` |
| 3 | 🌫️ | Fog Walker | Navigate fog zone without dying | `#9e9e9e` |
| 4 | ⚡ | Chain Eater | Eat 200-400-800-1600 ghost chain | `#ffd600` |
| 5 | 👑 | Maze Phantom | Score 10000+ | `#ffd600` |

## Cross-Game Badges (Platform Level)

| Badge | Icon | Name | Condition | Color |
|-------|------|------|-----------|-------|
| 🎮 | 🎮 | Arcade Regular | Play all 7 games at least once | `#e94560` |
| ⭐ | ⭐ | Collector | Earn 10 badges across any games | `#ffd600` |
| 🏆 | 🏆 | Arcade Champion | Earn all 5 badges in any single game | `#e94560` |
| 💯 | 💯 | Completionist | Earn all 35 game badges | `#ffd600` |
| 🔥 | 🔥 | On Fire | Play 3 different games in one session | `#ff6d00` |

## Data Storage
- **localStorage key:** `arcade_achievements`
- **Format:** `{ "snake": [true,false,true,false,false], "pong": [...], ... }`
- Each game's array maps to its 5 badges in order
- Cross-game badges computed from per-game data — not stored separately
- Persists across sessions — no server needed

## Sound Design

### Unlock Sound
- **Tier 1-4 badge:** Short chime — zzfx: `[.15,,800,.02,.08,.15,1,1.5,,,200,.05]` — bright, quick, satisfying
- **Tier 5 (crown) badge:** Extended fanfare — zzfx: `[.2,,600,.02,.15,.3,1,1.5,,,300,.08,.05,.1]` — richer, longer, earned
- **Cross-game badge:** Double chime with pitch shift — play tier 1 sound twice at 150ms interval, second at +200Hz

### Unlock Visual
- Game briefly pauses (100ms freeze frame)
- Badge scales in at top-right (see unlock animation above)
- Flash: full-screen `rgba(<accent>,0.08)` overlay for 200ms
- Text: badge name in accent color, 1rem monospace bold, fades after 2s

## Quality Bar
- [x] Every game has exactly 5 milestones — consistent, collectible
- [x] Badge conditions are specific and measurable — no subjectivity
- [x] Locked/unlocked states are visually distinct at a glance
- [x] Unlock moment feels rewarding (sound + animation + pause)
- [x] Crown (badge 5) feels special — highest tier, gold accent
- [x] Cross-game badges reward breadth, not just depth
- [x] localStorage — no backend dependency, works offline
- [x] No badge spam — max 1 unlock per 5 seconds (debounce)

## Assets Needed (for R&D)
- No sprite files — badges are emoji-in-circle, pure CSS/canvas
- 2 zzfx sounds (regular unlock, crown unlock)
- localStorage read/write utility (shared module)
- Achievement check hooks in each game's score/event system
