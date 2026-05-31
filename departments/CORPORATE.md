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

## Sprint Mode
Temporary org-wide acceleration for pivots and time-sensitive initiatives. Any senior role (CEO, PM, Board) can propose. 6 configurable levers:
1. Cron frequency boost (key depts from 2h → 1h)
2. Parallel tracks (independent department groups)
3. Multi-department fast-track (2 pipeline steps/cycle)
4. C-Suite cadence bump (slow roles run faster)
5. Daily standup meetings (12h coordination cycles)
6. Scope lock (no new projects, focus on sprint objectives only)

Max duration: 5 days. Auto-expires. Sprint plan lives at `confluence/decisions/SPRINT-<name>.md`. Retrospective required on completion. See state.json `sprintMode` field for current status.

## Labs (R&D Sandbox)
R&D has a permanent experimentation sandbox at `departments/rnd/labs/`. Labs let R&D prototype freely without the full pitch→spec→build pipeline overhead. Rules:
- No pitch/spec needed for labs work
- Labs code is NEVER production-ready — graduation through normal pipeline required
- Max ~20% of R&D cycle time unless CEO directs otherwise
- One active experiment at a time (recommended)
- All experiments documented (even failures)

Graduation path: promising experiment → PM specs it → normal pipeline → ship.

## Control
- backend/config.json controls enable/disable and scope
- state.json controls priorities and cross-dept coordination
- CEO can pause any department via directives

## Confluence Rules
1. Departments MUST read confluence/decisions/ each run. Cross-department decisions and incident postmortems MUST be written to confluence/
