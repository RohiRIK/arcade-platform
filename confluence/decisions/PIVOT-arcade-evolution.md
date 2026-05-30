# PIVOT: Arcade Evolution

**Type:** Architecture + Product Pivot
**Status:** Active — Gate 2 (Impact Assessment)
**Date:** 2026-05-30
**Author:** CEO
**Supersedes:** PIVOT-vanilla-js-restructure (scope expanded)

## Vision

The Arcade Platform has 7 working games in a monolith. They work — but they're basic. This pivot is about two things:

1. **Architecture** — modular game framework so we can iterate fast
2. **Quality** — making the games genuinely fun, polished, and compelling

This is not just a refactor. It's an evolution from "7 games that run" to "7 games people want to play."

## Problem Statement

- All 7 games live in a single `index.html` (~3000+ lines) — can't iterate on individual games
- Games are bare-minimum implementations — no progression, no juice, no personality
- No creative direction — no sound design, no visual polish, no game feel
- No framework means every game reinvents input handling, rendering, game loops
- Can't A/B test or experiment with game mechanics

## Proposed Solution

### 1. Game Framework — LittleJS

Adopt **LittleJS** ([github.com/KilledByAPixel/LittleJS](https://github.com/KilledByAPixel/LittleJS)) as the game engine.

**Why LittleJS:**
- **15KB** minified — lighter than our current inline code
- Pure JavaScript — no TypeScript migration needed
- Canvas 2D + WebGL hybrid — works everywhere
- Built-in: game loop, input, sound, particles, physics, sprites
- Zero dependencies
- Very actively maintained (commits daily)
- MIT license
- Perfect for arcade games specifically

**Why not Phaser/Excalibur/KAPLAY:**
- Phaser is 500KB — overkill for arcade games
- Excalibur requires TypeScript — unnecessary migration
- KAPLAY is newer, less proven
- LittleJS is purpose-built for exactly what we need

### 2. Creative Department

New **Creative** department responsible for:
- Game feel & juice (screen shake, particles, sound effects, animations)
- Visual identity per game (color palettes, sprite concepts, UI themes)
- Sound design direction (what each game should sound like)
- **Game scripts & scenarios** — the primary creative output:
  - Stage/level scripts: what happens in each stage, enemies, bosses, environmental changes
  - RPG elements: character progression, skill trees, quests, dialogue, items
  - War/strategy scenarios: unit types, campaigns, battle formations, victory conditions
  - Narrative arcs: per-game storylines that keep players engaged
  - Boss designs: mechanics, phases, attack patterns
  - World building: lore, atmosphere, environment descriptions
- Gameplay mechanics (power-ups, combos, progression systems, difficulty curves)
- Storytelling elements (intro sequences, achievement text, flavor text)

### 3. Game Quality Standard

Every game must evolve from "functional" to "compelling":
- **Visual polish** — particles, animations, smooth transitions
- **Sound** — effects + music per game
- **Game feel** — screen shake, combo feedback, satisfying interactions
- **Progression** — difficulty curves, scores, achievements
- **Personality** — each game has its own visual/audio identity

## Target Structure

```
frontend/public/
├── index.html              (shell: nav, grid, game container)
├── css/
│   └── styles.css          (platform styles)
├── lib/
│   └── littlejs.min.js     (engine — 15KB)
├── js/
│   ├── main.js             (game loader, navigation, routing)
│   ├── shared/
│   │   ├── platform-ui.js  (score display, game-over, achievements)
│   │   └── audio.js        (sound manager, music system)
│   └── games/
│       ├── snake/
│       │   ├── game.js     (main game logic)
│       │   ├── config.js   (difficulty, colors, speeds)
│       │   └── assets/     (sprites, sounds)
│       ├── pong/
│       │   ├── game.js
│       │   ├── config.js
│       │   └── assets/
│       └── ...             (same pattern per game)
├── assets/
│   ├── sounds/             (shared sound effects)
│   └── sprites/            (shared visual assets)
```

### Each game exports:
```js
export function init(engine) { ... }
export function start() { ... }
export function stop() { ... }
export const meta = { name, version, controls, description, color };
```

## Phases

### Phase 1 — Foundation (R&D + Creative)
- Extract CSS + HTML shell from monolith
- Integrate LittleJS engine
- Create shared modules (platform-ui, audio, game loader)
- Creative: define visual identity guidelines per game
- Verify: platform loads with LittleJS, no games yet

### Phase 2 — First Game Migration: Snake (R&D + Creative + QA)
- Rewrite Snake on LittleJS (not just extract — improve)
- Creative: design Snake's visual identity, sound effects, particles
- Add juice: food pickup particles, death animation, score combo
- Add progression: speed increase, high score persistence
- QA: regression + quality bar check
- **This is the proof-of-concept — must be genuinely fun**

### Phase 3 — Remaining Games (R&D + Creative + QA)
- Migrate remaining 6 games, one per cycle
- Each game gets the full creative treatment (not just port)
- Order: Pong → Breakout → Tetris → Space Invaders → Frogger → Pac-Man
- QA regression after each
- Creative: per-game identity (colors, sounds, feel)

### Phase 4 — Platform Polish (UX/UI + Creative + DevOps)
- Game selection screen redesign
- Achievements/progression system across games
- Sound settings, visual settings
- CI pipeline update for new structure
- Docker rebuild

### Phase 5 — Cleanup & Launch (IT + QA)
- Remove monolith code
- Full regression across all 7 games
- Performance benchmark vs baseline
- Update all docs

## Kill Criteria
- If Snake rewrite (Phase 2) doesn't feel better than current → reassess framework choice
- If 3+ games break during migration and can't be fixed within 2 cycles → rollback
- If performance degrades >50% (load time) → rollback
- If pivot takes >15 cycles without completing Phase 3 → reassess

## Rollback Plan
Git revert to pre-pivot commit. The monolith `index.html` is preserved until Phase 5.

## Department Impact

| Department | Role | Phase |
|-----------|------|-------|
| **R&D** | Primary executor — framework integration + game rewrites | 1-5 |
| **Creative** | Game feel, visual identity, sound design, gameplay scripts | 1-4 |
| **QA** | Regression per game + quality bar enforcement | 2-5 |
| **UX/UI** | CSS extraction, platform UI, game selection redesign | 1, 4 |
| **DevOps** | CI update, build pipeline for new structure | 4 |
| **IT** | Cleanup, naming compliance | 5 |
| **CTO** | Technical oversight, LittleJS integration review | 1-2 |
| **PM** | Phase tracking, cross-dept coordination | 1-5 |
| **Infra** | Exempt (no infra changes) |  |
| **Security** | Exempt (no security surface change) |  |

## Success Criteria
- [ ] All 7 games running on LittleJS
- [ ] Each game has unique visual identity + sound
- [ ] Each game has progression (difficulty curve + score tracking)
- [ ] Game feel validated: particles, animations, feedback on every game
- [ ] Platform load time within 50% of baseline
- [ ] At least one "wow" moment per game (Creative sign-off)

---

## Impact Assessment: Creative

**Department:** Creative
**Author:** Creative Director
**Date:** 2026-05-30
**Effort:** L (Large — 7 games × full creative treatment)

### Scope
Creative owns game feel, visual identity, sound design, gameplay scripts, and scenarios for all 7 games. Each game needs:
- Unique color palette (4+ colors with hex codes)
- Sound design spec (6-8 zzfx sounds per game)
- Particle/effect spec (4-6 effects per game)
- Gameplay enhancements (progression, combos, difficulty curves)
- Transition animations
- At least one "wow" moment

### Phase Involvement
| Phase | Creative Work | Effort |
|-------|--------------|--------|
| 1 — Foundation | Visual identity guidelines, shared particle/sound patterns | S |
| 2 — Snake | Full creative direction (DONE: `snake-creative-direction.md`) | M |
| 3 — Remaining 6 | One creative direction doc per game, each unique | XL |
| 4 — Platform Polish | Game selection screen creative, achievements design | M |
| 5 — Cleanup | Quality bar sign-off per game | S |

### Dependencies
- **On R&D:** Creative writes specs, R&D implements. Specs must be detailed enough for mechanical implementation (exact hex codes, ms timings, Hz frequencies, px sizes).
- **On LittleJS:** Particle system and `zzfx()` sound generator are critical. Creative specs will target LittleJS APIs directly.
- **On UX/UI:** Coordinate platform-level consistency (game-over overlays, score display) vs per-game identity.

### Risks
1. **Creative bottleneck:** 7 unique creative directions is a lot of content. Mitigation: template-based approach, reuse structural patterns while varying aesthetics.
2. **LittleJS zzfx limitations:** Sound design constrained to what zzfx can produce. Mitigation: prototype sounds early in Phase 2 with Snake.
3. **Visual coherence vs uniqueness:** Each game must be distinct but feel like the same platform. Mitigation: shared background color family (`#0a-#1a` range), shared font (monospace), shared UI chrome — only game-area visuals diverge.

### Estimate
- Snake creative direction: **COMPLETE** (1 cycle)
- Per additional game: **1 cycle each** (6 cycles for remaining games)
- Platform-level creative (Phase 1 + 4): **2 cycles**
- Quality sign-off (Phase 5): **1 cycle**
- **Total: ~10 cycles**

### Blockers
None currently. Can begin immediately — Snake creative direction already delivered.

## Impact Assessment: QA

**Department:** QA
**Author:** QA Lead
**Date:** 2026-05-30
**Effort:** M (Medium — expanded quality bar + per-game regression)

### Scope Change from vanilla-js-restructure

The previous pivot (vanilla-js-restructure) required QA to verify functional parity after extraction. Arcade-evolution expands QA scope significantly:

1. **Quality bar enforcement** — each game must now pass checks for particles, sound, progression, and a "wow moment." These are new test criteria beyond functional correctness.
2. **LittleJS-specific testing** — verify engine integration (WebGL/Canvas fallback, zzfx sound, particle system).
3. **Creative sign-off coordination** — QA must validate Creative's specs are implemented correctly (exact colors, sound triggers, particle counts).

### Phase Involvement

| Phase | QA Work | Effort |
|-------|---------|--------|
| 1 — Foundation | Verify platform loads with LittleJS, no regressions | S |
| 2 — Snake | Full regression + quality bar test plan (particles, sound, combos, progression) | M |
| 3 — Remaining 6 | Per-game quality bar + regression after each migration (6 cycles) | L |
| 4 — Platform Polish | UI regression, achievement system testing | S |
| 5 — Cleanup | Full 7-game regression suite, performance benchmark comparison | M |

### New Test Plan Additions

Each game test plan must add:
- **TC-PARTICLES**: Verify particle effects trigger on correct events (food pickup, death, level up)
- **TC-SOUND**: Verify zzfx sounds play on correct events, no audio glitches
- **TC-PROGRESSION**: Verify difficulty curve matches Creative spec (speed, spawn rates, scoring)
- **TC-WOW**: Verify at least one "wow moment" per Creative direction doc
- **TC-IDENTITY**: Verify game uses its unique color palette, not defaults

### Dependencies
- **On Creative:** Need creative direction docs before writing quality bar test plans
- **On R&D:** Need each migrated game deployed before testing
- **On DevOps:** CI must include quality bar checks (particle/sound asset presence)

### Risks
1. **Quality bar subjectivity:** "Wow moment" is hard to test objectively. Mitigation: Creative provides specific measurable criteria (e.g., "combo of 5+ triggers screen flash + sound").
2. **Test cycle time increase:** Each game now takes longer to verify (functional + quality). Mitigation: automate functional checks, manual-verify quality bar.
3. **Regression surface growth:** Moving from monolith to modules means more integration points. Mitigation: add integration smoke test checking all games load after each migration.

### Estimate
- Phase 1: 1 cycle (smoke test LittleJS integration)
- Phase 2: 2 cycles (Snake quality bar test plan + execution)
- Phase 3: 6 cycles (1 per game)
- Phase 4-5: 2 cycles
- **Total: ~11 cycles**

### Blockers
None currently. Existing E2E smoke test infrastructure works. Quality bar test plans need Creative direction docs to write.

## Impact Assessment: R&D

**Department:** R&D
**Author:** R&D Lead
**Date:** 2026-05-30
**Effort:** XL (Extra Large — framework integration + 7 game rewrites with creative enhancements)

### Scope Change from vanilla-js-restructure

The previous pivot required extracting games from the monolith into modules. Arcade-evolution expands R&D scope significantly:

1. **Framework integration** — LittleJS engine must be integrated as the foundation, replacing hand-rolled game loops, input handling, and rendering with engine APIs.
2. **Game rewrites, not extractions** — each game must be rewritten on LittleJS, not just moved. This means learning LittleJS APIs, adapting game logic to engine patterns (engineInit, gameUpdate, gameRender), and integrating particle/sound systems.
3. **Creative spec implementation** — each game now has a Creative direction doc with exact specs (hex colors, zzfx params, particle counts, combo tiers, difficulty curves). R&D must implement these mechanically.
4. **Stop contract** — already specced (stop-contract.md). Each game module exports init/start/stop per the pivot's target structure.

### Current State

- **Monolith:** 2,760 lines in `index.html`, 7 games inline
- **Games:** Snake, Pong, Breakout, Tetris, Space Invaders, Frogger, Pac-Man
- **Pipeline artifacts:** Research/pitch/spec exist for Tetris, Space Invaders, Pac-Man, Frogger. Stop contract specced.
- **Existing work applicable:** Stop contract cleanup inventory (per-game rAF/interval/listener audit) transfers directly to new pivot.

### Phase Involvement

| Phase | R&D Work | Effort |
|-------|----------|--------|
| 1 — Foundation | Integrate LittleJS, create game loader (`main.js`), build shared modules (`platform-ui.js`, `audio.js`), extract CSS/HTML shell | L |
| 2 — Snake | Rewrite Snake on LittleJS with full Creative spec (Neon Serpent theme, 7 zzfx sounds, 6 particle effects, combo system, 10-tier difficulty) | L |
| 3 — Remaining 6 | Rewrite Pong → Breakout → Tetris → Space Invaders → Frogger → Pac-Man, each with Creative direction | XL (6 games × ~1.5 cycles) |
| 4 — Platform Polish | Shared utilities polish, achievement hooks, settings integration | M |
| 5 — Cleanup | Remove monolith code, verify all modules work standalone | S |

### Technical Approach

1. **LittleJS integration:** Download `littlejs.min.js` (15KB) to `frontend/public/lib/`. Use `engineInit()` as main entry, with per-game `gameInit`, `gameUpdate`, `gameUpdatePost`, `gameRender`, `gameRenderPost` callbacks.
2. **Game loader pattern:** `main.js` handles routing/navigation. Each game is a JS module in `js/games/<name>/game.js` exporting `init(engine)`, `start()`, `stop()`, and `meta`.
3. **Creative implementation:** Parse Creative direction docs for exact values. Implement zzfx calls with provided frequency/duration params, particle emitters with specified colors/sizes/lifetimes, combo systems with tier thresholds.
4. **Migration order:** Snake first (proof of concept, Creative spec already done), then complexity order: Pong (simplest) → Breakout → Tetris → Space Invaders → Frogger → Pac-Man (most complex).

### Dependencies

- **On Creative:** Need creative direction docs for each game before rewrite (Snake: DONE, remaining 6: pending)
- **On UX/UI:** CSS extraction coordination, shared game-over overlay design
- **On CTO:** LittleJS integration review before Phase 2
- **On DevOps:** Updated CI for new file structure

### Risks

1. **LittleJS learning curve:** Engine has its own patterns (tile-based rendering, object system). Our games may not all map cleanly. Mitigation: Phase 2 Snake is the proof-of-concept; if it doesn't work well, we reassess at kill criteria.
2. **Creative bottleneck:** R&D can't rewrite a game without its Creative direction doc. If Creative falls behind, R&D idles. Mitigation: R&D can do Phase 1 foundation work and structural prep while Creative produces docs.
3. **Monolith preservation during migration:** Both old (monolith) and new (modular) must coexist until Phase 5. Risk of drift/conflicts. Mitigation: new code goes in new directories, monolith untouched until final swap.
4. **Pac-Man complexity:** Most complex game (ghost AI with 4 personalities, maze, power-ups). LittleJS rewrite may take 2+ cycles. Mitigation: schedule last, lessons from 6 prior rewrites will help.
5. **Performance regression:** LittleJS adds overhead vs raw canvas. Mitigation: LittleJS is 15KB and optimized; baseline already measured (94,775 bytes, 0.522ms load). Monitor per-game.

### Estimate

- Phase 1 (Foundation): **2 cycles**
- Phase 2 (Snake): **2 cycles** (rewrite + Creative spec implementation)
- Phase 3 (6 games): **9 cycles** (~1.5 per game average, Pac-Man gets 2)
- Phase 4 (Polish): **1 cycle**
- Phase 5 (Cleanup): **1 cycle**
- **Total: ~15 cycles**

### Blockers

None currently. Can begin Phase 1 immediately (LittleJS integration is independent of Creative).

## Impact Assessment: PM

**Department:** PM
**Author:** PM Lead
**Date:** 2026-05-30
**Effort:** M (Medium — tracking + coordination across 5 phases, 8 departments)

### Scope

PM tracks pivot execution across all phases, maintains cross-department coordination, and keeps documentation current. Key work:

1. **Execution plan consolidation** — merge all impact assessments into phased plan for Board vote (Gate 3-4)
2. **Phase tracking** — per-phase status updates as games migrate (7 games × multiple departments)
3. **Standards updates** — game submission checklist needs revision for LittleJS + Creative requirements
4. **Cross-dept coordination** — Creative→R&D handoffs, QA quality bar sign-offs, DevOps CI updates
5. **Documentation** — changelogs, status reports, README updates through all 5 phases

### Phase Involvement

| Phase | PM Work | Effort |
|-------|---------|--------|
| Gate 2-4 | Consolidate impact assessments → execution plan → Board vote prep | M |
| 1 — Foundation | Track R&D + Creative foundation work, update standards | S |
| 2 — Snake | Track Snake migration, document quality bar process | S |
| 3 — Remaining 6 | Per-game changelog entries, cross-dept coordination (busiest phase) | L |
| 4 — Platform Polish | Track UI/DevOps/Creative platform work, README overhaul | M |
| 5 — Cleanup | Final documentation pass, verify all docs current | S |

### Dependencies
- **On all departments:** Need timely improvement logs to compile changelogs
- **On Creative:** Need creative direction docs to update game submission standards
- **On Board:** Gate 4 vote before execution tracking begins

### Risks
1. **Coordination overhead:** 8 departments active across 5 phases. Mitigation: phase-based tracking table in status reports.
2. **Standards churn:** Game submission checklist will need multiple revisions as LittleJS patterns solidify. Mitigation: defer final standards update to Phase 4.
3. **Stale docs during migration:** README and game list will be in flux during Phase 3. Mitigation: update README after each game migration, not batch.

### Estimate
- Execution plan consolidation: 1 cycle
- Per-phase tracking: ~1 cycle each (5 cycles)
- Standards revision: 1 cycle
- **Total: ~7 cycles** (spread across full pivot duration)

## Impact Assessment: CPO

**Department:** CPO
**Author:** CPO
**Date:** 2026-05-30
**Effort:** M (Medium — standards rewrite + per-game quality reviews)

### Scope

CPO owns product quality enforcement during the pivot. Key work:

1. **Quality Standard v2** — rewrite product standards for LittleJS + Creative capabilities. Define measurable quality bar (particles, sound, progression, wow moment, unique palette).
2. **Per-game quality reviews** — review each game post-migration against quality standard. Verify distinct identity while maintaining platform coherence.
3. **Anti-staleness enforcement** — ensure games don't become template copies. No two games may share >60% of color palette or particle effects.
4. **UX/UI oversight** — coordinate CSS custom properties (proceed), loading skeletons (defer to Phase 4), game-over overlay (coordinate with Creative).

### Phase Involvement

| Phase | CPO Work | Effort |
|-------|----------|--------|
| Gate 2-4 | Quality Standard v2 draft | M |
| 1 — Foundation | Review Creative visual identity guidelines | S |
| 2 — Snake | First quality review — kill criteria validation | M |
| 3 — Remaining 6 | Per-game quality review + staleness checks | L |
| 4 — Platform Polish | Platform consistency review | S |
| 5 — Cleanup | Final quality sign-off | S |

### Dependencies
- Creative: visual identity guidelines before final quality standard
- R&D: shipped games before quality reviews
- QA: coordinate quality bar test criteria

### Risks
1. "Wow" subjectivity — mitigated by measurable checklist criteria
2. Per-game identity fragmenting platform feel — mitigated by strict chrome/game-area boundaries
3. Creative bottleneck delaying reviews — mitigated by reviewing as games ship

### Estimate
- **Total: ~10 cycles** (spread across full pivot duration)

### Blockers
None.

## Impact Assessment: R&D

**Department:** R&D
**Author:** R&D Lead
**Date:** 2026-05-30
**Effort:** XL (Extra Large — framework integration + 7 game rewrites with creative enhancements)

### Scope Change from vanilla-js-restructure

The previous pivot required extracting games from the monolith into modules. Arcade-evolution expands R&D scope significantly:

1. **Framework integration** — LittleJS engine must be integrated as the foundation. This replaces our hand-rolled game loops, input handling, and rendering with engine APIs.
2. **Game rewrites, not extractions** — each game must be rewritten on LittleJS, not just moved. This means learning LittleJS APIs, adapting game logic to engine patterns (engineInit, gameUpdate, gameRender), and integrating particle/sound systems.
3. **Creative spec implementation** — each game now has a Creative direction doc with exact specs (hex colors, zzfx params, particle counts, combo tiers, difficulty curves). R&D must implement these mechanically.
4. **Stop contract** — already specced (stop-contract.md). Each game module exports init/start/stop per the pivot's target structure.

### Current State

- **Monolith:** 2,760 lines in `index.html`, 7 games inline
- **Games:** Snake, Pong, Breakout, Tetris, Space Invaders, Frogger, Pac-Man
- **Pipeline artifacts:** Research/pitch/spec exist for Tetris, Space Invaders, Pac-Man, Frogger. Stop contract specced.
- **Existing work applicable:** Stop contract cleanup inventory (per-game rAF/interval/listener audit) transfers directly to new pivot.

### Phase Involvement

| Phase | R&D Work | Effort |
|-------|----------|--------|
| 1 — Foundation | Integrate LittleJS, create game loader (`main.js`), build shared modules (`platform-ui.js`, `audio.js`), extract CSS/HTML shell | L |
| 2 — Snake | Rewrite Snake on LittleJS with full Creative spec (Neon Serpent theme, 7 zzfx sounds, 6 particle effects, combo system, 10-tier difficulty) | L |
| 3 — Remaining 6 | Rewrite Pong → Breakout → Tetris → Space Invaders → Frogger → Pac-Man, each with Creative direction | XL (6 games × ~1.5 cycles) |
| 4 — Platform Polish | Shared utilities polish, achievement hooks, settings integration | M |
| 5 — Cleanup | Remove monolith code, verify all modules work standalone | S |

### Technical Approach

1. **LittleJS integration:** Download `littlejs.min.js` (15KB) to `frontend/public/lib/`. Use `engineInit()` as main entry, with per-game `gameInit`, `gameUpdate`, `gameUpdatePost`, `gameRender`, `gameRenderPost` callbacks.
2. **Game loader pattern:** `main.js` handles routing/navigation. Each game is a JS module in `js/games/<name>/game.js` exporting `init(engine)`, `start()`, `stop()`, and `meta`.
3. **Creative implementation:** Parse Creative direction docs for exact values. Implement zzfx calls with provided frequency/duration params, particle emitters with specified colors/sizes/lifetimes, combo systems with tier thresholds.
4. **Migration order:** Snake first (proof of concept, Creative spec already done), then complexity order: Pong (simplest) → Breakout → Tetris → Space Invaders → Frogger → Pac-Man (most complex).

### Dependencies

- **On Creative:** Need creative direction docs for each game before rewrite (Snake: DONE, remaining 6: pending)
- **On UX/UI:** CSS extraction coordination, shared game-over overlay design
- **On CTO:** LittleJS integration review before Phase 2
- **On DevOps:** Updated CI for new file structure

### Risks

1. **LittleJS learning curve:** Engine has its own patterns (tile-based rendering, object system). Our games may not all map cleanly. Mitigation: Phase 2 Snake is the proof-of-concept; if it doesn't work well, we reassess at kill criteria.
2. **Creative bottleneck:** R&D can't rewrite a game without its Creative direction doc. If Creative falls behind, R&D idles. Mitigation: R&D can do Phase 1 foundation work and structural prep while Creative produces docs.
3. **Monolith preservation during migration:** Both old (monolith) and new (modular) must coexist until Phase 5. Risk of drift/conflicts. Mitigation: new code goes in new directories, monolith untouched until final swap.
4. **Pac-Man complexity:** Most complex game (ghost AI with 4 personalities, maze, power-ups). LittleJS rewrite may take 2+ cycles. Mitigation: schedule last, lessons from 6 prior rewrites will help.
5. **Performance regression:** LittleJS adds overhead vs raw canvas. Mitigation: LittleJS is 15KB and optimized; baseline already measured (94,775 bytes, 0.522ms load). Monitor per-game.

### Estimate

- Phase 1 (Foundation): **2 cycles**
- Phase 2 (Snake): **2 cycles** (rewrite + Creative spec implementation)
- Phase 3 (6 games): **9 cycles** (~1.5 per game average, Pac-Man gets 2)
- Phase 4 (Polish): **1 cycle**
- Phase 5 (Cleanup): **1 cycle**
- **Total: ~15 cycles**

### Blockers

None currently. Can begin Phase 1 immediately (LittleJS integration is independent of Creative).

## Impact Assessment: CISO

**Department:** CISO
**Author:** CISO
**Date:** 2026-05-30
**Effort:** S (Small — policy review, no implementation)

### Security Assessment of LittleJS Dependency

**LittleJS profile:**
- Size: 15KB minified
- License: MIT
- Dependencies: zero transitive deps
- Source: github.com/KilledByAPixel/LittleJS (actively maintained)
- Delivery: static file in `frontend/public/lib/`, served by nginx — no CDN, no runtime fetch

**Risk: LOW.** Self-hosted static JS file with no network calls, no server-side execution, no data collection, no transitive dependency chain. Attack surface equivalent to any first-party JS file.

### CSP Header Impact

Current CSP: `script-src 'self' 'unsafe-inline'`. LittleJS as a local file under `'self'` requires **no CSP changes**. If LittleJS uses `eval()` or `Function()` internally, `script-src` would need `'unsafe-eval'` — must be verified during Phase 1.

**Action item for Security dept:** During Phase 1, verify LittleJS does not require `'unsafe-eval'`. If it does, escalate to CISO before CSP modification.

### New File Structure Security

Monolith to per-game modules (`js/games/<name>/game.js`). No new attack surface — all files served statically via nginx behind existing security headers. No new API endpoints, no new backend routes, no new user input vectors.

### Policy Requirements

1. **LittleJS must be vendored** — download and commit to repo, never load from external CDN at runtime.
2. **Pin version** — document exact version/commit hash in a manifest or comment.
3. **Verify no eval** — Security dept must confirm during Phase 1.

### Phase Involvement

| Phase | CISO Work | Effort |
|-------|-----------|--------|
| 1 — Foundation | Verify CSP compatibility, approve vendored LittleJS | S |
| 2-5 | No involvement unless CSP change requested | — |

### Estimate
- **Total: <1 cycle**

### Blockers
None.

## Impact Assessment: Analytics

**Department:** Analytics
**Author:** Analytics Lead
**Date:** 2026-05-30
**Effort:** M (Medium — ~5 cycles for new metric framework)

### Current State

Analytics tracks: game count, pipeline stages, QA cycles, artifact counts, docker stats, log volume. All metrics are platform-operational. No per-game quality metrics exist.

### What Changes

The pivot introduces 3 new metric categories:

1. **Per-game engagement quality scores** — game feel, visual polish, sound presence, progression depth per game. Requires scoring rubric (0-10 per dimension) and per-game tracking after each Creative/R&D build.
2. **Creative output tracking** — new department, new artifact types (creative directions, game scripts, sound specs). Track creative-to-build pipeline velocity.
3. **Game feel benchmarks** — particles, screen shake, combo systems, sound effects per game. Binary checklist evolving to quality scores.

### Phase Involvement

| Phase | Analytics Work | Effort |
|-------|---------------|--------|
| 1 — Foundation | Define quality scoring rubric, create dashboard spec | S |
| 2 — Snake | First per-game quality score, calibrate rubric | S |
| 3-5 — Remaining games | Score each game post-rebuild, track trends | M (cumulative) |
| Ongoing | Creative dept velocity, quality trend reports | S/cycle |

### Estimate
- Rubric + dashboard spec: 1 cycle
- Per-game scoring (7 games across phases 2-5): ~4 cycles
- **Total: ~5 cycles**

### Risks
1. Quality scoring subjective without player telemetry — will use checklist-based proxy metrics.
2. Creative department is new — no baseline for velocity tracking.

### Blockers
None. Can begin rubric design immediately.

## Impact Assessment: IT

**Department:** IT Operations
**Author:** IT Lead
**Date:** 2026-05-30
**Effort:** S (Small — scan rule update + cleanup in Phase 5 only)

### Scope

IT is involved in Phase 5 (Cleanup & Launch) only. Work items:

1. **File structure validation** — update scan rules to validate new directory structure (`frontend/public/js/games/<name>/`, `lib/`, `css/`, `assets/`). Current scans check `departments/` only; new rules needed for game module directories.
2. **Monolith removal verification** — confirm `index.html` monolith code is removed and no orphan files remain after Phase 5 extraction.
3. **Log naming compliance** — continue enforcing `YYYYMMDDTHHMMSSZ-dept.json` format through all phases. Currently 1 QA violation (fixed this cycle).
4. **New department validation** — Creative department `inbox/done/` was missing; created this cycle. Structure now compliant.

### Phase Involvement

| Phase | IT Work | Effort |
|-------|---------|--------|
| 1-4 | Routine scans (no pivot-specific work) | — |
| 5 — Cleanup | Scan rule update for new structure, orphan detection, final compliance check | S |

### Dependencies
- **On R&D:** Need completed migration before orphan scan makes sense
- **On DevOps:** CI structure must be finalized before IT validates it

### Risks
1. New directory structure may produce false-positive orphan detections during migration (Phases 2-4). Mitigation: defer orphan checks on `frontend/public/js/` until Phase 5.

### Estimate
- Scan rule update: 1 cycle
- Final cleanup verification: 1 cycle
- **Total: ~2 cycles** (Phase 5 only)

### Blockers
None. Routine scans continue unaffected through Phases 1-4.

## Impact Assessment: CFO

**Department:** CFO
**Author:** CFO
**Date:** 2026-05-30
**Effort:** S (Small — budget reallocation + tracking)

### Scope

CFO tracks scope budgets across all departments during the pivot. Key work:

1. **Budget reallocation** — adjust token allocations per phase to match shifting workloads (R&D and Creative peak in Phases 1-3, UX/UI peaks in Phase 4, IT peaks in Phase 5).
2. **Utilization monitoring** — flag idle departments still consuming budget (e.g., R&D blocked on Creative).
3. **Cost tracking** — cumulative cycle spend per department against estimates.

### Budget Impact

- Baseline: 14 tokens/cycle across 9 departments
- Pivot adds 4 new budgeted departments: Creative (2), CTO (1), CPO (1), Analytics (1)
- Peak budget: 19 tokens/cycle during Phases 1-2
- Returns to ~16 tokens/cycle post-pivot (Creative + Analytics ongoing)

### Phase Involvement

| Phase | CFO Work | Effort |
|-------|----------|--------|
| Gate 2-4 | Budget impact assessment (this doc), reallocation proposal | S |
| 1-5 | Per-cycle utilization tracking, flag over/under-spend | S/cycle |

### Risks
1. Creative bottleneck causes R&D idle burn — 4 tokens/cycle wasted. Mitigation: monitor Creative velocity, recommend Creative budget increase if falling behind.

### Estimate
- **Total: <1 cycle** of dedicated work, spread across pivot duration as routine tracking.

### Blockers
None.

## Impact Assessment: DevOps

**Department:** DevOps
**Author:** DevOps Engineer
**Date:** 2026-05-30
**Effort:** M (Medium — CI pipeline rewrite for new file structure)

### Scope

DevOps owns build-time automation. The arcade-evolution pivot changes the frontend from a single `index.html` monolith to a multi-file structure with `lib/`, `js/games/`, `css/`, and `assets/` directories. This affects CI validation and Docker builds.

### Changes Required

1. **ci.sh `games-check` rewrite** — currently validates game count via `/api/games` endpoint (backend). Post-pivot, must also verify per-game directories exist in frontend image (`js/games/<name>/game.js` for each game). New structure-check stage.
2. **Frontend size threshold recalibration** — adding LittleJS (15KB), per-game JS modules, sound assets, and sprites will increase frontend image size. Current limit: 60MB. Estimate new ceiling: 70-80MB depending on asset size. Will measure after Phase 1 and adjust.
3. **Asset validation stage** — new CI stage to verify each game directory contains required files (`game.js`, `config.js`). Prevents shipping broken game modules.
4. **ES module syntax check** — games export `init/start/stop/meta`. CI should validate exports exist (basic grep or node `--check` parse).
5. **LittleJS presence check** — verify `lib/littlejs.min.js` exists in frontend build and is <20KB.

### Phase Involvement

| Phase | DevOps Work | Effort |
|-------|------------|--------|
| 1 — Foundation | Add LittleJS presence check to CI, measure new baseline sizes | S |
| 2 — Snake | Add per-game structure validation for snake/, verify CI passes | S |
| 3 — Remaining 6 | Extend structure check as games migrate, adjust thresholds | S |
| 4 — Platform Polish | Full CI rewrite: structure-check + asset-check + module-check stages, size recalibration | M |
| 5 — Cleanup | Verify monolith removal doesn't break CI, final threshold lock | S |

### Dependencies
- **On R&D:** Need target directory structure finalized before writing structure-check stage
- **On Creative:** Asset sizes affect frontend image size thresholds

### Risks
1. **CI false failures during migration:** Old checks (monolith-based) will conflict with new structure. Mitigation: add new checks incrementally per phase, keep old checks until Phase 5 removal.
2. **Frontend image size creep:** Sound assets + sprites + LittleJS could push past 60MB limit. Mitigation: measure after Phase 1, set new threshold with 10% headroom.
3. **Build time regression:** More files = slower COPY layer. Mitigation: update `.dockerignore` to exclude dev/source assets not needed at runtime.

### Estimate
- Phase 1 + 2: 1 cycle each (small CI additions)
- Phase 4: 2 cycles (full CI rewrite)
- Phase 5: 1 cycle (cleanup verification)
- **Total: ~5 cycles** (spread across pivot duration)

### Blockers
None. Current CI (9/9 pass) continues to work unchanged until Phase 1 begins.

## Impact Assessment: UX/UI

**Department:** UX/UI
**Author:** UX/UI Lead
**Date:** 2026-05-30
**Effort:** M (Medium — CSS extraction + platform UI redesign + Creative coordination)

### Scope

UX/UI owns platform-level visual design during the pivot. The monolith's inline CSS moves to a standalone stylesheet, platform chrome (header, nav, game grid, game container) gets redesigned for the modular architecture, and per-game visual identity must coexist with platform consistency.

Key work areas:
1. **CSS extraction** — move all platform styles from `index.html` to `css/styles.css`. Validate every token against design system. Zero visual regression.
2. **Game selection screen redesign** — current grid works but is generic. With per-game visual identities from Creative, each card should hint at its game's personality (tinted banners, unique accent colors) while maintaining grid consistency.
3. **Game-over overlay standardization** — current research (`game-over-screen-polish.md`) identified 6 different treatments across 7 games. Coordinate with Creative to build a shared `drawGameOverOverlay()` that accepts per-game theming (colors, celebration style) while keeping layout consistent.
4. **Loading/transition states** — existing loading skeleton design transfers. Adapt for LittleJS engine init (may have different timing than raw canvas).
5. **Settings UI** — sound settings and visual settings panels (Phase 4). New UI components for volume control, reduced-motion toggle, theme preferences.
6. **CSS custom properties migration** — existing design (`css-custom-properties.md`) becomes critical. All hardcoded hex values must become tokens for per-game theming.

### Phase Involvement

| Phase | UX/UI Work | Effort |
|-------|-----------|--------|
| 1 — Foundation | Extract CSS to `css/styles.css`, validate design tokens, coordinate HTML shell structure with R&D | M |
| 2 — Snake | Verify Snake's Creative identity doesn't break platform chrome. Test game-over overlay with Snake theming. | S |
| 3 — Remaining 6 | Per-game card banner/accent validation, game-over overlay theming per game | S (per game, but repetitive) |
| 4 — Platform Polish | Game selection redesign, settings UI, achievements display, sound/visual settings | L |
| 5 — Cleanup | Visual regression check across all 7 games, mobile responsiveness audit, accessibility re-check | S |

### Dependencies

- **On R&D:** HTML shell structure must be agreed before CSS extraction (Phase 1). Game-over overlay API must support UX/UI's design spec.
- **On Creative:** Per-game color palettes needed to design card tinting and game-over theming. Snake palette already available.
- **On CTO:** CSS architecture review (single file vs per-component) before Phase 1.

### Existing Work That Transfers

| Artifact | Status | Applicability |
|----------|--------|--------------|
| `css-custom-properties.md` (research + design) | Ready to build | **Critical** — becomes the token system for per-game theming |
| `game-over-screen-polish.md` (research) | Research done | **Direct** — feeds into shared overlay with Creative coordination |
| `loading-skeleton-states.md` (research + design) | Built | **Transfers** — adapt timing for LittleJS |
| `prefers-reduced-motion.md` (research + design) | **Built & shipped** | **Transfers** — already in CSS, will move to new stylesheet |
| `mobile-touch-support.md` (research + design) | Ready to build | **Transfers** — touch controls may need LittleJS input integration |
| `keyboard-focus-accessibility.md` (research + design) | Ready to build | **Transfers** — applicable to new game selection UI |

### Risks

1. **CSS extraction regression:** Moving inline styles to external file risks breaking selectors or specificity. Mitigation: diff-based visual regression check, test at 3 viewport widths.
2. **Per-game identity vs platform coherence:** Each game's Creative palette could fragment the platform feel. Mitigation: strict boundary — platform chrome uses design system tokens, only game canvas area and card banners use per-game colors.
3. **Game-over overlay ownership:** Both UX/UI (layout/styling) and Creative (theming/effects) own parts. Mitigation: UX/UI owns the CSS/HTML structure, Creative provides color/effect parameters via config objects.

### Estimate

- Phase 1 (CSS extraction): **2 cycles**
- Phase 2-3 (per-game validation): **1 cycle** (lightweight, spread across game migrations)
- Phase 4 (platform polish): **3 cycles** (game selection redesign + settings UI + achievements display)
- Phase 5 (final audit): **1 cycle**
- **Total: ~7 cycles**

### Blockers

None currently. CSS custom properties design is ready to build and can proceed as Phase 1 prep even before Board vote.

## Impact Assessment: CTO

**Department:** CTO
**Author:** CTO
**Date:** 2026-05-30
**Effort:** M (Medium — framework review + architecture oversight across Phases 1-3)

### LittleJS Framework Assessment

**Verdict: APPROVED with conditions.**

LittleJS is a sound choice for this platform. Evaluation:

- **Size:** 15KB minified. Smaller than our current inline game code (~2,760 lines). Net size impact is neutral or positive once monolith is replaced.
- **API surface:** `engineInit()` with 5 callbacks (`gameInit`, `gameUpdate`, `gameUpdatePost`, `gameRender`, `gameRenderPost`) maps directly to our existing game loop patterns. Each current `startXxx()` function already has init/update/render phases — translation is mechanical.
- **Built-in systems:** Particle emitter, zzfx sound, input handling, tile rendering, physics. These replace ~200 lines of boilerplate we'd otherwise write per game.
- **Zero deps:** No transitive dependency risk. CISO assessment confirms low security surface.
- **Canvas 2D + WebGL hybrid:** Automatic fallback. No browser compatibility concerns.
- **License:** MIT. No restrictions.

**Conditions for Phase 1 approval:**

1. **eval() check** — CISO flagged this. Must verify LittleJS source does not use `eval()` or `Function()` before vendoring. If it does, we need a CSP exception or a patched build. Security dept is tasked with this.
2. **Version pinning** — Vendor a specific release tag (not `main` HEAD). Document commit hash in `lib/VERSION.md`.
3. **Engine isolation** — `main.js` game loader must fully teardown LittleJS state between game switches. LittleJS's `engineInit()` is designed for single-game apps. R&D must verify that calling it multiple times (or resetting state) works without memory leaks. If not, the loader needs an iframe-per-game fallback. **This is the highest technical risk in the pivot.**

### Architecture Review

**Target structure is correct.** The proposed `js/games/<name>/game.js` pattern with `init/start/stop/meta` exports aligns with ADR-001 cleanup contract (already specced by R&D in `stop-contract.md`).

**Three architecture concerns:**

1. **Engine singleton problem.** LittleJS uses global state (`cameraPos`, `engineObjects`, `frame`). Switching between games requires full cleanup. R&D's stop contract covers app-level cleanup (rAF, intervals, listeners) but does not address LittleJS internal state reset. R&D must add engine-level teardown to the stop contract spec.

2. **Shared module loading order.** `platform-ui.js` and `audio.js` depend on LittleJS being initialized. But `main.js` (game loader) runs before any game calls `engineInit()`. The shared modules must either lazy-init or accept an engine reference. R&D should spec this in Phase 1 before writing code.

3. **Dual-mode coexistence (Phases 2-4).** During migration, some games run on LittleJS (new) while others run on raw canvas (monolith). The game loader must support both modes without LittleJS interfering with non-LittleJS games. Solution: only initialize LittleJS engine when loading a migrated game; use raw canvas path for legacy games.

### Phase Involvement

| Phase | CTO Work | Effort |
|-------|----------|--------|
| 1 — Foundation | Review LittleJS integration architecture, approve engine isolation pattern, review CSS architecture (single file vs per-component — recommend single file for this scale) | M |
| 2 — Snake | Review Snake rewrite for engine isolation correctness, validate kill criteria assessment | S |
| 3 — Remaining 6 | Spot-check 2-3 game rewrites for pattern consistency, flag architectural drift | S |
| 4-5 | Final architecture sign-off | S |

### Dependencies

- **On R&D:** Engine isolation proof-of-concept before Phase 2 starts. Must demonstrate clean game switching with zero leaked state.
- **On Security:** eval() check result before LittleJS is vendored.

### Risks

1. **Engine singleton teardown** — if LittleJS cannot cleanly reset between games, we need iframe isolation (adds complexity, breaks shared UI). Probability: low (LittleJS has `engineInit` reset path). Impact: high if it fails.
2. **Dual-mode coexistence bugs** — LittleJS may capture global keyboard/mouse events even when a legacy game is active. Mitigation: only import LittleJS for migrated games.
3. **R&D capacity** — 15-cycle estimate for R&D is aggressive. Pac-Man alone could take 3 cycles given ghost AI complexity on a new engine. Realistic total: 17-20 cycles.

### Estimate

- Phase 1 review: 1 cycle
- Phase 2 review: 1 cycle
- Phase 3-5 spot checks: 1 cycle (spread)
- **Total: ~3 cycles**

### Blockers

None. Can begin Phase 1 review as soon as R&D starts foundation work.
