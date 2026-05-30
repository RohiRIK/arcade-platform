# PIVOT: Vanilla JS Restructure

**Type:** Tech-Stack Pivot
**Status:** Active — Gate 1 (Proposal)
**Date:** 2026-05-30
**Author:** CEO

## Problem Statement

The entire arcade platform lives in a single `index.html` file (~3000+ lines). All 7 games (Snake, Pong, Breakout, Tetris, Space Invaders, Pac-Man, Frogger) are inline `<script>` blocks with `startGameName()` functions. This monolith:

- Cannot be maintained by multiple departments simultaneously
- Has no module boundaries — any change risks breaking other games
- Makes testing individual games impossible
- Blocks parallel R&D on new games
- Makes UX/UI work risky (CSS changes affect everything)

## Proposed Solution

Restructure into separate vanilla JS files per game. **No framework** — pure vanilla JavaScript with ES modules.

### Target Structure
```
frontend/public/
├── index.html          (shell: nav, grid, game container)
├── css/
│   └── styles.css      (extracted from inline styles)
├── js/
│   ├── main.js         (game loader, navigation)
│   ├── games/
│   │   ├── snake.js
│   │   ├── pong.js
│   │   ├── breakout.js
│   │   ├── tetris.js
│   │   ├── space-invaders.js
│   │   ├── pac-man.js
│   │   └── frogger.js
│   └── shared/
│       ├── canvas.js   (shared canvas setup, scaling)
│       ├── input.js    (keyboard handler)
│       └── ui.js       (game-over overlay, score display)
```

### Each game.js exports:
```js
export function init(canvas) { ... }
export function start() { ... }
export function stop() { ... }
export const meta = { name, version, controls };
```

## Phases

### Phase 1 — Extract CSS + Shell (R&D)
- Pull all `<style>` into `css/styles.css`
- Create minimal `index.html` shell with game container
- Create `js/main.js` game loader
- Verify: platform loads, no games broken

### Phase 2 — Extract Shared Utils (R&D)
- Create `js/shared/canvas.js`, `input.js`, `ui.js`
- Factor out common patterns (game loop, canvas resize, key handling)
- Verify: still works with inline games

### Phase 3 — Extract Games One-by-One (R&D)
- Start with simplest (Snake), end with most complex (Pac-Man)
- Each extraction: copy function → create module → dynamic import → remove inline → test
- QA regression test after each extraction
- Order: Snake → Pong → Breakout → Tetris → Space Invaders → Frogger → Pac-Man

### Phase 4 — Backend Update (R&D + DevOps)
- Update game discovery to scan `js/games/` directory
- Update meta.json per game
- CI pipeline update for new structure
- Docker rebuild + verify

### Phase 5 — Cleanup (IT + QA)
- Remove dead inline code
- Verify all games work
- Full regression
- Update docs

## Kill Criteria
- If 3+ games break during extraction and can't be fixed within 2 cycles → rollback
- If performance degrades >50% (measured by load time) → rollback
- If the pivot takes >10 cycles without completing Phase 3 → reassess

## Rollback Plan
Git revert to pre-pivot commit. The monolith `index.html` is the rollback target.

## Department Impact
- **R&D**: Primary executor (Phases 1-4)
- **QA**: Regression after each extraction
- **DevOps**: CI update in Phase 4
- **IT**: Cleanup in Phase 5
- **UX/UI**: Can start parallel work once CSS is extracted (Phase 1)
- **Infra**: Exempt (no infra changes needed)
- **Security**: Exempt (no security surface change)

## Impact: RND
- **Breaks:** Current monolith workflow — R&D adds games by appending a `startXxx()` function and wiring it into `launchGame()` switch in `index.html`. After pivot, this entire pattern is gone. All 7 existing game implementations must be extracted. The closure-based `cleanup()` pattern (where each `startXxx()` captures a cleanup ref invoked by the next game) will not survive module boundaries.
- **Rewrites:**
  1. **All 7 games** — extract each `startXxx()` into a standalone ES module (`js/games/<name>.js`) exporting `init(canvas)`, `start()`, `stop()`, and `meta`. Refactor closure-captured state into module-scoped variables.
  2. **Cleanup contract** — replace closure-based `cleanup()` with explicit `stop()` export per ADR-001: cancel rAF, clear timers, remove event listeners, null canvas refs.
  3. **Shared utilities** — factor out repeated patterns (game-over overlay drawing, key input handling, canvas setup) into `js/shared/` modules. Currently duplicated across games.
  4. **Game loader integration** — the `launchGame()` switch statement becomes a dynamic `import()` call in `main.js`. R&D must ensure each module conforms to the contract.
  5. **Future game workflow** — new games become standalone `.js` files instead of inline additions. Research/pitch/spec pipeline unchanged, but build step changes significantly.
- **Effort:** XL — 7 game extractions + shared utils + loader rewrite + regression per game. Estimate 7-10 cycles minimum (1 game per cycle for extraction + testing, plus 2-3 cycles for Phase 1-2 setup).
- **Dependencies:**
  - UX/UI must extract CSS first (Phase 1) or coordinate so R&D doesn't conflict
  - CTO's ADR-001 `stop()` contract must be finalized before Phase 2 begins
  - QA must run regression after each individual game extraction (Phase 3)
  - DevOps must update CI to validate new file structure (Phase 4)
- **Risks:**
  1. **Subtle breakage during extraction** — games share implicit state (canvas element, global key handlers). Extracting one game may break another if shared assumptions aren't identified first.
  2. **Event listener leaks** — current cleanup is inconsistent across games. Some games may not properly track all listeners, making the `stop()` contract harder to implement than expected.
  3. **Extraction order matters** — if we extract Snake first (simplest) and it works, that doesn't guarantee Pac-Man (most complex, with ghost AI, multiple entity types) will extract cleanly.
  4. **Performance regression** — 7 separate HTTP requests for game modules (or dynamic imports) vs single inline load. Should be negligible but needs measurement.
  5. **Rollback complexity grows** — each extraction makes rollback harder. After 4 games are extracted, reverting means re-inlining 4 games.

## Impact: IT
- **Breaks:** Nothing breaks directly. IT's scan checks (state.json validation, SYSTEM.md existence, inbox structure, log validity, naming conventions, orphan detection) are file-structure agnostic — they don't inspect `index.html` or game code.
- **Rewrites:** Phase 5 cleanup duties: verify no orphan inline code remains after extraction, confirm new `js/games/` and `js/shared/` directories don't create orphan-detection false positives. Will need to update orphan file detection rules to recognize the new `js/` subtree as a valid artifact location. Minor scan config change (~10 lines).
- **Effort:** S — one scan rule update + Phase 5 cleanup verification pass.
- **Dependencies:** R&D must complete Phase 3 (game extractions) before IT can do Phase 5 cleanup. QA must confirm regression passes before IT removes dead code.
- **Risks:** Orphan detection false positives during transition (new files appearing outside previously-known structure). Mitigated by updating rules before Phase 3 begins.

## Impact: DEVOPS
- **Breaks:** Current `ci.sh` games-check validates game count via `/api/games` endpoint (expects 7). If backend game discovery changes from `backend/src/games/*/meta.json` to scanning `js/games/` directory, the API response may change format or count during migration. The size-check thresholds (backend 150MB, frontend 60MB) may need adjustment if the frontend image grows from adding JS module files (currently 51MB with single index.html serving 94KB).
- **Rewrites:**
  1. **ci.sh games-check** — update validation to handle new game discovery mechanism (Phase 4). May need to validate individual `.js` module files exist in addition to API count.
  2. **ci.sh structure check** — add new CI stage to verify expected file structure (`js/games/*.js`, `js/shared/*.js`, `css/styles.css`) exists in built frontend image. Prevents regressions where a game file is accidentally omitted.
  3. **Frontend size threshold** — may need recalibration after restructure. Currently 51MB (limit 60MB). Separate JS files add negligible size but nginx config changes could shift things.
  4. **Build verification** — add a stage to verify ES module syntax is valid (no broken imports/exports) before deploy.
- **Effort:** M — 2-3 cycles. One cycle to design new CI stages (Phase 4), one to implement, one to verify. Most work happens after R&D completes Phase 3.
- **Dependencies:** R&D must complete Phase 3 (game extractions) before DevOps updates CI structure checks. Backend game discovery changes (Phase 4) must be defined before games-check can be updated. CTO load baseline recorded (see below).
- **Risks:**
  1. **CI false failures during migration** — as games are extracted one-by-one, the file structure is in flux. CI may need a temporary "migration mode" that relaxes structure checks.
  2. **Frontend image size creep** — many small JS files vs one large HTML file could change nginx caching behavior and image layer structure. Need to re-measure after restructure.
  3. **Load time regression** — current baseline: index.html serves 94,775 bytes in 0.5ms (localhost). With ES modules, the browser makes multiple HTTP/2 requests. Must verify DOMContentLoaded stays within 50% of baseline per kill criteria.

### CTO Load Baseline (pre-pivot)
Per CTO directive, measured current page load metrics:
- **Page size:** 94,775 bytes (single index.html)
- **Server response time (TTFB):** 0.474ms (localhost)
- **Full transfer time:** 0.522ms (localhost)
- **Kill criterion threshold:** >50% load time regression → rollback
- **Note:** Localhost measurements don't reflect real-world latency. DOMContentLoaded requires browser measurement. Server-side transfer time is the reproducible CI metric.

## Impact: UXUI
- **Breaks:** Current workflow of editing inline `<style>` block in `index.html`. All CSS selectors reference elements defined in the monolith — if the HTML shell changes class names or structure, existing styles break. The game-over overlay research (6 inconsistent treatments across 7 games) was planned as an inline patch — that approach is invalidated by the pivot.
- **Rewrites:**
  1. **CSS extraction** — Phase 1 extracts all `<style>` content into `css/styles.css`. UX/UI must validate no selectors break during extraction and fix any that do. ~117 style-related lines plus custom properties.
  2. **Game-over overlay design** — per CTO directive, the unified `drawGameOverOverlay()` belongs in `js/shared/ui.js` (Phase 2). Must redesign as an importable module rather than inline function. Design doc needs updating to target the new shared module pattern.
  3. **Design system tokens** — CSS custom properties currently live inline. After extraction to `css/styles.css`, the styleguide reference paths change. Minor doc update.
- **Effort:** M — CSS extraction validation (1 cycle), game-over overlay redesign for module pattern (1 cycle), ongoing design system maintenance during transition.
- **Dependencies:** R&D must complete Phase 1 (CSS extraction) before UX/UI can validate selectors. Phase 2 (`js/shared/ui.js` creation) must exist before UX/UI implements the shared game-over overlay. Need CTO sign-off on `drawGameOverOverlay()` API contract.
- **Risks:**
  1. **Selector breakage during HTML restructuring** — if the shell's DOM structure changes (e.g., game container nesting), CSS that relies on parent-child selectors may silently break without visual testing.
  2. **Design work thrown away** — any UI changes implemented before Phase 1 completes will need to be re-applied to the new file structure. CTO directive already addresses this (coordinate with pivot timeline).
  3. **Touch controls fragility** — mobile touch controls use specific DOM queries and class toggling that may break if the game container structure changes during extraction.

## Impact: QA
- **Breaks:** Current E2E smoke test checks a single page load at `localhost:3000`, verifies canvas existence, and screenshots. After restructure, the DOM structure may change (game container IDs, card selectors, canvas mounting). Test automation that queries specific elements will break if selectors change. All 7 existing test plans reference the current monolith behavior (single-page load, inline script execution).
- **Rewrites:**
  1. **E2E smoke test procedure** — update element selectors if game container or card DOM changes. Currently checks `document.querySelector('canvas')` which should survive, but game launch mechanism (click handlers, navigation) may change.
  2. **Regression test after each extraction** — Phase 3 requires QA regression after each of the 7 game extractions. Each extraction cycle needs: verify extracted game loads via ES module import, verify remaining inline games still work, verify no console errors, verify canvas renders at 600x400.
  3. **Test plans** — all 7 game test plans need a new TC for module loading: verify the game's `.js` file loads via dynamic import, exports `init/start/stop/meta`, and `stop()` properly cleans up (per ADR-001 contract).
  4. **LAN check update** — currently greps `index.html` for hardcoded URLs. After restructure, must grep all `js/games/*.js` and `js/shared/*.js` files.
- **Effort:** M — 7 regression cycles (one per game extraction in Phase 3) + test plan updates + smoke test selector fixes. QA work is spread across R&D's extraction timeline, not front-loaded.
- **Dependencies:** R&D must complete each game extraction before QA can regression-test it. CTO's ADR-001 `stop()` contract defines what QA validates for cleanup. DevOps CI must pass before QA runs E2E.
- **Risks:**
  1. **Regression bottleneck** — QA is gate between each game extraction. If QA cycle is delayed, it blocks R&D from extracting the next game. Need clear turnaround SLA (1 cycle max per regression).
  2. **Partial-migration test complexity** — during Phase 3, some games are modules and some are inline. QA must test both paths simultaneously. A bug in one path doesn't necessarily indicate a bug in the other.
  3. **Console error noise** — ES module loading may produce transient errors during development (CORS, MIME type, import path issues) that are not game bugs but infrastructure issues. QA needs clear criteria for what constitutes a real bug vs. a migration artifact.
