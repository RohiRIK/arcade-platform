# Research: LittleJS Foundation Architecture (Phase 1)

## Context

Phase 1 of the arcade-evolution pivot. CTO signed off all 3 pre-conditions (2026-05-31). This doc covers the platform foundation that all LittleJS games will run on.

## Current Architecture Analysis

The current platform is a **2807-line monolith** (`frontend/public/index.html`) containing:
- HTML shell (nav, game grid, canvas container)
- CSS styles (inline `<style>` block)
- 7 game implementations as `startXxx()` functions
- Game launcher with `launchGame(name)` routing
- Canvas 600×400 standard
- Per-game `cleanup()` closures (not exported)

### Problems to Solve
1. **Monolith** — all games in one file, can't lazy-load
2. **No engine** — each game reinvents rendering, input, audio
3. **No modularity** — shared patterns (game-over, score) duplicated 7 times
4. **No creative polish** — plain canvas with no particles, sound, or progression

## LittleJS v1.11.7 Analysis

**What it provides:**
- 2D rendering with WebGL acceleration (falls back to canvas)
- Built-in particle system (`ParticleEmitter`)
- Tile-based rendering + sprite atlas support
- `zzfx` sound synthesis (procedural audio, no files needed)
- Input handling (keyboard, mouse, gamepad)
- Physics (simple 2D)
- Camera system
- Engine object lifecycle (`EngineObject` class)
- 55KB minified, zero dependencies, MIT license

**What it does NOT provide:**
- Game selection UI (we keep our own)
- Score/high-score persistence (we handle via localStorage)
- Game-over overlay (shared module)
- Multi-game lifecycle (our dual-mode loader handles)

**Integration mode:** Include as global script (`<script src="lib/littlejs.min.js">`). LittleJS exposes globals (`engineInit`, `EngineObject`, `vec2`, `zzfx`, etc.). No bundler required.

## Target Architecture (Phase 1 Output)

```
frontend/public/
├── index.html          ← Slim HTML shell only (nav + grid + canvas + script tags)
├── css/
│   └── styles.css      ← Extracted from index.html
├── js/
│   ├── main.js         ← Game loader, routing, dual-mode lifecycle
│   ├── games/          ← Per-game modules (Phase 2+)
│   │   └── snake.js    ← First LittleJS game (Phase 2)
│   └── shared/
│       ├── platform-ui.js   ← drawGameOverOverlay(), score HUD, high-score
│       ├── audio.js         ← zzfx wrapper, lazy-init pattern
│       └── engine-reset.js  ← resetLittleJS() per stop-contract spec
├── lib/
│   ├── littlejs.min.js      ← Vendored v1.11.7 (already done)
│   └── LITTLEJS_VERSION.md  ← Already done
└── tests/
    └── engine-isolation-poc.html  ← Already done (7/7 pass)
```

## Migration Strategy (Coexistence)

During Phases 2-4, both legacy (inline `startXxx()`) and LittleJS games coexist:
- Legacy games remain as-is in index.html until individually migrated
- `main.js` dual-mode loader (from stop-contract spec) routes to either
- LittleJS script loaded globally but engine only initialized for LittleJS games
- Canvas shared — LittleJS uses same 600×400 canvas element

## Key Technical Decisions

1. **No bundler** — LittleJS is small enough as a global. Game modules use native ES modules or inline scripts initially. Keeps Docker build simple.
2. **Incremental extraction** — Don't refactor all 7 games at once. Phase 1 sets up the shell; games migrate one at a time starting Phase 2.
3. **CSS extraction first** — Cleanest separation; styles rarely change and unblock UX/UI department.
4. **Shared modules are plain JS** — `platform-ui.js` and `audio.js` work with both legacy canvas context and LittleJS render pipeline.

## Risks

| Risk | Mitigation |
|------|------------|
| LittleJS WebGL overlay conflicts with legacy canvas games | `resetLittleJS()` destroys glCanvas; dual-mode loader handles transitions |
| CSS extraction breaks layout | QA regression immediately after |
| Inline games reference shared styles | Extract only platform CSS; game draw calls unchanged |
| Script load order issues | LittleJS loaded before main.js; main.js loaded after DOM ready |

## Scope for Phase 1

**Include:**
- Extract CSS to `css/styles.css`
- Extract HTML to slim shell (keep all games inline for now)
- Create `js/main.js` (initially just re-exports current `launchGame`)
- Create `js/shared/platform-ui.js` (drawGameOverOverlay per UX/UI design doc)
- Create `js/shared/audio.js` (zzfx lazy wrapper)
- Create `js/shared/engine-reset.js` (per stop-contract spec)

**Exclude (later phases):**
- Actual game migration (Phase 2+)
- Per-game directories (Phase 2+)
- Sprite assets (Phase 2+)
- Achievement system (Phase 4)

## Estimated Complexity: L (3 cycles as per Gate 3 plan)
