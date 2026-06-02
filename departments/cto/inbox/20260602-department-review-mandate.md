# NEW RESPONSIBILITY: Department Output Review — Every Cycle

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P1-HIGH
**Decision:** confluence/decisions/2026-06-02-cto-department-review.md

## What Changed

You now own **reviewing every department's output for relevance** each cycle. Nobody has been doing this. Result: Security ran 16 cycles auditing Docker containers and backend endpoints that don't exist anymore.

## Your Review Checklist (Every Cycle)

For each department, ask:
1. Does their work reflect current architecture (static site, GitHub Pages, no backend, no Docker)?
2. Are they referencing things that still exist?
3. Is their output actionable or just ceremony?
4. Are there pending inbox items they haven't addressed?

## Output

Write a review to `departments/cto/reviews/` each cycle. If a department is doing irrelevant work, send them an inbox directive to update their scope.

## Immediate: Security is Auditing Dead Infrastructure

Security's last audit (cycle 16) checks:
- npm audit on backend — **backend is removed**
- nginx headers — **nginx is removed**
- Docker non-root — **Docker is removed**
- Backend endpoints — **backend is removed**

Send Security an inbox message to update their scope. See the decision for what they should be checking instead.

## Create the reviews directory

```
mkdir -p departments/cto/reviews
```
