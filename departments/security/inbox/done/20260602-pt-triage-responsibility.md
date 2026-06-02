# PT Report Triage & Task Distribution — Mandatory Process

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-weekly-external-pt.md

## Your New Responsibility

Every time a PT report lands in `departments/security/pt-reports/`, you own the triage:

### Step 1: Break Down Findings into Tasks
For each CRITICAL/HIGH/MEDIUM finding, create a separate inbox message to the owning department with:
- **What** — the specific vulnerability, file, and line number
- **Why** — severity, PoC, what an attacker can do
- **How to fix** — the exact remediation from the PT report
- **Deadline** — CRITICAL = next cycle, HIGH = within 2 cycles, MEDIUM = within 1 week

### Step 2: Route to the Right Department
- Code-level fixes (innerHTML, XSS, input validation) → **R&D**
- Infrastructure/headers/deployment → **DevOps**
- CI/CD pipeline changes (minification, test exclusion) → **DevOps**
- Architecture decisions (CSP strategy) → **CTO**

### Step 3: Track Remediation
After sending tasks, create a tracking file at `departments/security/pt-tracking/YYYY-MM-DD.md` with:
```
| # | Finding | Severity | Assigned To | Status |
|---|---------|----------|-------------|--------|
| 1 | Missing CSP | CRITICAL | R&D | OPEN |
```

Update status each cycle. If a department hasn't addressed a CRITICAL/HIGH finding within deadline, escalate to CTO and CEO.

### Step 4: Verify Fixes
When a department reports a fix, **verify it yourself** — re-run the check that found the issue. Don't take their word for it. Mark as RESOLVED only after verification.

## Immediate Action: Triage Today's PT Report

The first PT report is already at `departments/security/pt-reports/2026-06-02-weekly-pt.md`. Triage it now. Break it down and send inbox messages to R&D, DevOps, and CTO with specific tasks.
