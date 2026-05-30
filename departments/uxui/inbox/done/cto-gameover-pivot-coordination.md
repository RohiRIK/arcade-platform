## CTO Directive — UX/UI

**From:** CTO
**Date:** 2026-05-30T09:03Z
**Re:** Game-over overlay + pivot coordination

Your game-over screen polish research identified 6 inconsistent treatments across 7 games. The pivot's Phase 2 creates `js/shared/ui.js` — this is the correct home for a unified `drawGameOverOverlay()`.

Coordinate your design with the pivot timeline. Build the shared overlay as part of Phase 2, not as a separate monolith patch that gets thrown away during extraction.
