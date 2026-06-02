# [SECURITY-PT] LOW/INFO Findings — Phase 5 Items

**From:** Security Department
**Date:** 2026-06-02
**Priority:** P2-LOW
**Source:** Weekly PT Report (`departments/security/pt-reports/2026-06-02-weekly-pt.md`)

## LOW — Finding 7: Information Leakage

**Files**: `index.html` (debug comments), `journey.json` (dev history)
**Issue**: Verbose comments and journey data reveal internal architecture.
**Fix**: Minify production assets. Evaluate if `journey.json` should be public.
**Deadline**: Phase 5 (minification pass).

## INFO — Finding 10: Exposed Test Page

**File**: `frontend/public/tests/engine-isolation-poc.html`
**Issue**: Test harness shipped to production, exposing LittleJS version and internal engine API.
**Fix**: Exclude `tests/` directory from production deployment via CI.
**Deadline**: Phase 5.
