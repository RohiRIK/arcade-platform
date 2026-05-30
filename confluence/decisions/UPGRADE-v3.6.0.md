# Project Upgrade — v3.5.0 → v3.6.0

**Date**: 2026-05-31
**Skill Version**: 3.6.0
**Project**: Arcade Platform

## What Changed in v3.6.0

- Sprint Mode (`impl-sprint-mode.md`) — temporary org-wide acceleration with 6 levers

## Upgrade Actions Performed

### state.json
- Added `sprintMode: null` field
- Added `skillVersion: "3.6.0"` field

### SYSTEM.md Updates
- **CEO, PM, Board** (3 depts) — full Sprint Mode sections with propose/activate/veto authority
- **13 operational depts** (rnd, uxui, infra, devops, qa, it, security, analytics, cto, ciso, cpo, cfo, creative) — Sprint Mode reader section (parallel tracks, fast-track, scope lock awareness)
- **Creative** — added missing Confluence section (was 15/16, now 16/16)

### Coverage After Upgrade
| Feature | Coverage |
|---------|----------|
| Sprint Mode | 16/16 departments |
| Confluence | 16/16 departments |
| Pivoting | 1/1 (CEO only, by design) |

### R&D Labs
- Added `departments/rnd/labs/` directory
- Added Labs (Skunkworks) section to R&D SYSTEM.md — experimentation sandbox with graduation path
- Added `labs` tracking object to state.json

## Validation
- state.json: valid JSON, sprintMode and skillVersion present
- All 16 SYSTEM.md files contain Sprint Mode section
- All 16 SYSTEM.md files contain Confluence section
