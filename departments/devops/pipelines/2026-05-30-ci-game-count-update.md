# CI Update: Game Count Threshold — 2026-05-30

## What
Updated `ci.sh` EXPECTED_GAMES from 5 to 6. Pac-Man was added to the platform by R&D, causing the smoke test games-check to validate against the new count.

## Change
- `ci.sh` line 11: `EXPECTED_GAMES=5` → `EXPECTED_GAMES=6`

## Full Pipeline Results (post-fix)
```
9 passed, 0 failed, 0 skipped
- dockerfile-lint: PASS (syntax OK)
- npm-audit: PASS (0 vulnerabilities)
- build: PASS (3s)
- size-backend: PASS (131MB, limit 150MB)
- size-frontend: PASS (51MB, limit 60MB)
- health-check: PASS (HTTP 200)
- games-check: PASS (6 games)
- nonroot-backend: PASS (app user)
- nonroot-frontend: PASS (nginx user)
```

## Image Sizes (stable)
| Image | Size | Limit |
|-------|------|-------|
| backend | 131MB | 150MB |
| frontend | 51MB | 60MB |
