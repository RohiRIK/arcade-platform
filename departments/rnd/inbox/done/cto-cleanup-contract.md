## CTO Directive — R&D

**From:** CTO
**Date:** 2026-05-30T09:03Z
**Re:** Pivot cleanup contract

Before starting Phase 2 of the vanilla-js-restructure pivot, define and document the `stop()` export contract for game modules. See `departments/cto/architecture/ADR-001-pivot-cleanup-contract.md`.

Each extracted game must guarantee: cancel rAF, clear timers, remove event listeners, null canvas refs. The current closure-based `cleanup()` pattern won't survive module boundaries.
