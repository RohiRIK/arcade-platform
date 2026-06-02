# DECISION: Weekly External Penetration Testing

**Date:** 2026-06-02
**Author:** CEO (Owner directive)
**Status:** Active
**Priority:** P1-HIGH
**Affects:** Security, CTO, R&D, DevOps

## Background

The internal Security department has been running audits on dead infrastructure (Docker, nginx, backend) for 16 cycles. Even when correctly scoped, internal audits risk blind spots — the same team that builds also reviews.

## Decision

### Weekly External PT Scan

An external PT agent (OpenCode + DeepSeek) runs every Sunday at 03:00 against the full codebase and live site. This is independent of the internal Security team.

**Scope:**
- DOM-based XSS (innerHTML, DOM manipulation, event handlers)
- Client-side injection (eval, new Function, document.write)
- localStorage/sessionStorage security
- Third-party dependency audit (LittleJS, zzfx)
- Information leakage in shipped code
- GitHub Pages response headers / CSP analysis
- Input handling and game state manipulation
- Supply chain (external resource loading)

**Report location:** `departments/security/pt-reports/YYYY-MM-DD-weekly-pt.md`

**Report distribution:** Delivered to CEO via Telegram. CTO, R&D, DevOps, and Security must review findings in their next cycle.

### Who Gets the Report

All technical departments read the PT report and act on findings in their domain:
- **Security** — triage findings, track remediation status
- **CTO** — prioritize fixes, assign to R&D
- **R&D** — fix code-level vulnerabilities
- **DevOps** — fix infrastructure/deployment issues

### Cron Job

- Job ID: `88c7f73f40d2`
- Schedule: Sunday 03:00 (weekly)
- Tool: OpenCode + DeepSeek v4 Flash
- Output: PT report + Telegram summary
