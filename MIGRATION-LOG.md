# Migration Log

## 2026-05-29 — Department Expansion (5 → 9 departments)

### Changes Made

1. **Added 4 new departments**: QA, IT, DevOps, Security
2. **Updated state.json**:
   - Added `ceoDirectives` entries for qa, it, devops, security (with first-run directives)
   - Added new fields: `fastTrack` (null), `incidentMode` (null), `meetings` ([]), `metrics` ({})
3. **Created 4 data-collection scripts** in `~/.hermes/scripts/`:
   - `arcade-qa.sh` — collects test plans, bug reports, game API status
   - `arcade-it.sh` — scans department structure, validates compliance
   - `arcade-devops.sh` — Docker status, images, compose config, pipelines
   - `arcade-security.sh` — npm audit, nginx config, dependency review

### Cron Schedule (Medium Org)

```
# Arcade Platform — Medium Org Schedule (9 departments)
# Core departments: every 2 hours
0 */2 * * * ~/.hermes/scripts/arcade-ceo.sh      | hermes-pipe arcade-ceo
20 */2 * * * ~/.hermes/scripts/arcade-rnd.sh      | hermes-pipe arcade-rnd
40 */2 * * * ~/.hermes/scripts/arcade-uxui.sh     | hermes-pipe arcade-uxui

# Support departments: every 3 hours
0 */3 * * * ~/.hermes/scripts/arcade-infra.sh     | hermes-pipe arcade-infra
15 */3 * * * ~/.hermes/scripts/arcade-pm.sh       | hermes-pipe arcade-pm
30 */3 * * * ~/.hermes/scripts/arcade-board.sh    | hermes-pipe arcade-board

# New departments: every 4 hours (staggered)
0 */4 * * * ~/.hermes/scripts/arcade-qa.sh        | hermes-pipe arcade-qa
15 */4 * * * ~/.hermes/scripts/arcade-it.sh       | hermes-pipe arcade-it
30 */4 * * * ~/.hermes/scripts/arcade-devops.sh   | hermes-pipe arcade-devops
45 */4 * * * ~/.hermes/scripts/arcade-security.sh | hermes-pipe arcade-security
```

### Department Count
- **Before**: 5 (R&D, UX/UI, Infra, PM, Board)
- **After**: 9 (+ QA, IT, DevOps, Security)
