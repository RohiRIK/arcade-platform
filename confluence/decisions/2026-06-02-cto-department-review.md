# DECISION: CTO Quarterly Department Output Review

**Date:** 2026-06-02
**Author:** CEO (Owner directive)
**Status:** Active
**Priority:** P1-HIGH
**Affects:** CTO, All departments

## Problem Statement

Departments run autonomously on their cron cycles, producing reports, audits, and outputs. **Nobody reviews whether their work is still relevant.** Example: Security has run 16 audit cycles checking Docker containers, nginx headers, and backend endpoints — all of which are dead infrastructure since the GitHub Pages migration on May 31. Nobody caught it.

This is a systemic failure: when architecture changes, departments don't update their scope, and nobody tells them to. Resources are wasted on irrelevant work while real gaps go undetected.

## Root Cause

No department has the mandate to review other departments' output for relevance. CTO owns technical oversight but has no formal review process. Board sees status summaries ("All Clean ✓") without questioning the underlying methodology.

## Decision

### CTO Department Review — Every Cycle

The CTO must review **every department's output** each cycle for:

1. **Relevance** — Is the department working on things that matter given current architecture?
2. **Staleness** — Are they checking/building against infrastructure that no longer exists?
3. **Gaps** — Are there things they SHOULD be checking but aren't?
4. **Efficiency** — Are they spending cycles on low-value work while high-value work is pending?

### Review Checklist (per department)

For each department, CTO asks:
- [ ] Does their work reflect the current architecture (static site, GitHub Pages, no backend, no Docker)?
- [ ] Are they referencing files/services/endpoints that still exist?
- [ ] Is their output actionable or just ceremony?
- [ ] Are there inbox items they haven't addressed?
- [ ] Are they following the current workflows in `confluence/workflows/`?

### Output

CTO writes a **Department Relevance Report** each cycle to `departments/cto/reviews/`. Format:

```
# Department Review — [date]

## [Department Name]
- Relevant: YES/NO
- Stale items: [list]
- Gaps: [list]
- Action needed: [what to fix]
```

If a department is doing irrelevant work, CTO sends them an inbox directive to update their scope.

### Immediate Action: Security Scope Update

Security must **immediately** stop auditing:
- ❌ `npm audit` on backend (backend is removed)
- ❌ nginx headers in `nginx.conf` (file is being deleted, GitHub Pages sets its own headers)
- ❌ Docker container permissions (Docker is removed)
- ❌ Backend endpoint review (backend is removed)

Security must **start** auditing:
- ✅ GitHub Pages response headers (what does production actually serve?)
- ✅ Client-side attack surface (DOM XSS, localStorage, postMessage, URL params)
- ✅ Third-party code integrity (LittleJS, zzfx — are they pinned? vendored? verified?)
- ✅ Game input sanitization (can crafted input break game state or leak data?)
- ✅ Information leakage in JS source (comments, debug code, internal URLs)

## Department Responsibilities

| Department | Action |
|-----------|--------|
| CTO | Add department relevance review to every cycle. Start with Security. |
| Security | Update audit scope per above. Drop dead infrastructure checks. |
| Board | Enforce CTO reviews exist. Flag if CTO skips a cycle. |
| CEO | Verify CTO is performing reviews. Escalate if departments resist scope changes. |
