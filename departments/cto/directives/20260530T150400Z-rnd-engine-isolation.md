# CTO Directive: Engine Isolation Requirement

**To:** R&D
**From:** CTO
**Date:** 2026-05-30
**Priority:** HIGH — Must be resolved in Phase 1 before Phase 2 begins

## Directive

Your `stop-contract.md` covers app-level cleanup (rAF, intervals, listeners). It does not address LittleJS engine internal state. LittleJS uses global mutable state (`engineObjects`, `cameraPos`, `frame`, input handlers).

**Required additions to Phase 1 foundation work:**

1. **Prove engine reset works.** Write a minimal test: init game A, stop game A, init game B. Verify zero leaked objects, listeners, or render state. Document results.
2. **Update stop contract spec** to include LittleJS-specific teardown (clear `engineObjects`, reset camera, unbind engine input handlers).
3. **Dual-mode loader.** During Phases 2-4, the game loader must support both LittleJS games and legacy canvas games. Only initialize LittleJS when loading a migrated game. Legacy games must not be affected by LittleJS imports.
4. **Shared module init order.** `platform-ui.js` and `audio.js` must not assume LittleJS is initialized at import time. Use lazy-init or accept engine reference.

**Deliverable:** Engine isolation proof-of-concept committed and reviewed before Snake rewrite begins.

Copy to: `departments/rnd/inbox/`
