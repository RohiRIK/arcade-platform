# Design: Local CI Pipeline — 2026-05-29

## Problem
No CI pipeline exists. Builds are manual `docker compose up --build`. No automated checks before deploy.

## Design: `ci.sh` — Local CI Script

A shell script at project root that runs pre-deploy checks in sequence. Fails fast on first error.

### Stages

1. **Lint Dockerfiles** — `hadolint` (if available) or syntax check via `docker build --check`
2. **Dependency audit** — `npm audit` inside backend container (catches known CVEs)
3. **Build images** — `docker compose build` with build timing
4. **Size check** — Verify backend < 150MB, frontend < 60MB (reject bloat regressions)
5. **Smoke test** — Start containers, hit health endpoint, verify 5 games returned from `/api/games`
6. **Security check** — Verify both containers run as non-root
7. **Report** — Print pass/fail summary with metrics

### Exit Codes
- 0: all checks pass
- 1: any check fails (with specific failure message)

### Usage
```bash
./ci.sh          # full pipeline
./ci.sh build    # build-only (stages 1-4)
./ci.sh test     # test-only (stages 5-6, assumes images exist)
```

## Image Size Thresholds
| Image | Max Size | Current |
|-------|----------|---------|
| backend | 150 MB | 138 MB |
| frontend | 60 MB | 54 MB |

Thresholds set ~10% above current to catch regressions without false positives.

## Dependencies
- docker, docker compose (already installed)
- curl (already installed)
- jq (for JSON parsing in smoke tests)

## Next Step
Implement `ci.sh` in next cycle.
