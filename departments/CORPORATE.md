# Corporate-on-Demand — Autonomous Platform Operations

## What This Is
A multi-agent cron system where specialized departments autonomously develop, maintain, and evolve the Arcade Platform. Each department runs on a staggered 2-hour cycle, with CEO oversight twice daily.

## Execution Order (per 2h window)
```
:00  Board Meeting  — synthesize, coordinate, surface risks
:25  R&D            — research, pitch, spec, build games
:50  Infrastructure — monitor, fix, optimize Docker/ops
:15  UX/UI          — research, design, implement UI changes
:40  PM             — document, standardize, report
```
CEO inspections at 10:00 and 22:00 — reviews all departments, grades output, sets direction.

## Pipeline Enforcement
No department ships work without following their pipeline:

### R&D Pipeline
```
research/ → pitches/ → specs/ → BUILD → log
```
You cannot build a game without a spec. You cannot spec without a pitch. You cannot pitch without research.

### UX/UI Pipeline  
```
research/ → designs/ → BUILD → log
```
You cannot implement a UI change without a design doc.

### Infra Pipeline
```
audit → runbook (if new procedure) → EXECUTE → log
```

### PM Pipeline
```
review logs → changelogs/ or standards/ or reports/ → log
```

## Cross-Department Communication
All via inbox files. Format in DELEGATION.md.
Departments check inbox FIRST every run. CEO directives override local priorities.

## State Coordination
state.json is the shared brain:
- CEO writes directives and priorities
- Board writes meeting outcomes
- All departments read it for context

## Anti-Slop Contract
Every department SYSTEM.md contains anti-slop rules. The CEO grades compliance.
Repeated slop → CEO writes corrective directives.

## Confluence
Knowledge management system. Four categories:
- `confluence/decisions/` — Architecture decisions, pivot proposals, board votes
- `confluence/technical/` — Technical docs, API specs, integration guides
- `confluence/runbooks/` — Operational procedures, incident playbooks
- `confluence/postmortems/` — Incident reviews, pivot retrospectives

Every significant decision gets a decision doc. Every incident gets a postmortem.

## Pivoting
Strategic direction changes follow the 7-gate pivot flow (see impl-pivoting.md):
1. Pivot Proposal → 2. Impact Assessment → 3. Pivot Plan → 4. Board Vote → 5. Pipeline Freeze → 6. Phased Execution → 7. Completion

All pivots require a formal proposal in `confluence/decisions/PIVOT-<name>.md`.
No department starts pivot work without Board approval at Gate 4.

## Control
- backend/config.json controls enable/disable and scope
- state.json controls priorities and cross-dept coordination
- CEO can pause any department via directives
