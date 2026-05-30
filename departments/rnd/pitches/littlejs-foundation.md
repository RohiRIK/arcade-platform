# Pitch: LittleJS Foundation (Phase 1)

## Elevator Pitch

Extract the monolith index.html into a modular architecture with shared platform modules (UI, audio, engine lifecycle) that enable incremental LittleJS game migration — without breaking existing games.

## Gameplay Impact

No gameplay changes. This is infrastructure. All 7 existing games continue to work identically. Foundation enables Phase 2+ to add particles, sound, polish.

## Technical Fit

- **Canvas complexity:** N/A (infrastructure)
- **Estimated scope:** ~200 lines of new JS (main.js + shared modules), CSS extraction, HTML trim
- **Dependencies:** LittleJS v1.11.7 (already vendored), stop-contract spec (done), game-over design doc (done)

## Deliverables

1. `css/styles.css` — extracted platform styles
2. `js/shared/platform-ui.js` — `drawGameOverOverlay(ctx, options)`
3. `js/shared/audio.js` — `playSound(params)` with lazy zzfx init
4. `js/shared/engine-reset.js` — `resetLittleJS()`
5. `js/main.js` — dual-mode game loader (wraps current launchGame)
6. `index.html` slimmed to shell + existing games

## Architecture Diagram

```
┌────────────────────────────────────────────────┐
│                 index.html                      │
│  ┌──────────┐  ┌────────────┐  ┌───────────┐  │
│  │ Nav/Grid │  │ Canvas 600 │  │ <scripts> │  │
│  │  (HTML)  │  │   ×400     │  │           │  │
│  └──────────┘  └────────────┘  └───────────┘  │
└────────────────────────────────────────────────┘
         │              │              │
    css/styles.css   lib/littlejs   js/main.js
                                       │
                          ┌────────────┼────────────┐
                     shared/        shared/       shared/
                   platform-ui.js  audio.js   engine-reset.js
```

## Success Criteria

- [ ] All 7 existing games still work (QA regression pass)
- [ ] CSS is in separate file, page renders identically
- [ ] `drawGameOverOverlay()` callable from console without error
- [ ] `resetLittleJS()` callable after LittleJS init without crash
- [ ] No increase in page load time >100ms
- [ ] Docker rebuild succeeds, health check passes

## Risk: Zero

All existing game code stays inline. We're adding modules alongside, not replacing yet. Rollback = revert CSS link to inline style block.
