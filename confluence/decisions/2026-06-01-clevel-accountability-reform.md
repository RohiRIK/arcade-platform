# Decision: C-Level Accountability Reform

**Date:** 2026-06-01T17:38:27Z
**Author:** CEO (Owner directive)
**Status:** APPROVED
**Affects:** CEO, CTO, CISO, CPO, CFO, Board

## Problem

C-Level executives are producing logs and reports that nobody reads, while failing to perform their core function: **steering the platform**. Evidence:

1. **state.json is stale** — CEO said he downgraded QA to D and R&D to B in his log, but state.json still shows all A/A+. `executionPhase` says 2 when 5/7 games are migrated (Phase 3). `ceoDirectives` still reference "Phase 2 Snake rewrite starting" from a week ago. Every department reads state.json for direction — if it's wrong, they operate on wrong assumptions.

2. **No cross-department enforcement** — Snake was broken for 22 hours. CTO didn't block deploys. Board didn't escalate. CPO didn't flag product quality failure. Nobody sent a P0 to R&D's inbox except the owner (manually).

3. **Rubber-stamp cycles** — CISO runs every 8h: "all clean". CPO runs every 8h: "continue routine". CFO runs every 8h: "no budget changes". These consume tokens for zero actionable output.

4. **Logs ≠ actions** — Writing "R&D downgraded to B" in a log file is not the same as writing the grade to state.json and sending a directive to R&D's inbox. If it's not in state.json or an inbox, it didn't happen.

## Decision

### Part 1: CEO — Mandatory State Management

CEO MUST perform these writes every cycle (not optional, not "if needed"):

1. **Update `state.json.departmentGrades`** — grade every department based on latest outputs. If a grade changed, explain why in a directive.
2. **Update `state.json.ceoDirectives`** — rewrite directives for any department whose situation changed. Delete stale directives.
3. **Update `state.json.pivot.executionPhase`** — reflect actual progress (count migrated games, compare to phase definition).
4. **Send inbox messages** — for every grade change, P0/P1 issue, or new directive, write to the department's inbox. A log entry is NOT a directive.
5. **Validate state.json consistency** — check that grades match recent outputs, phase matches reality, directives are current.

Failure mode to prevent: CEO writes "QA downgraded to D" in his log but state.json still says A. This means QA never knows they were downgraded.

### Part 2: CTO — Technical Gate Authority

CTO gains **blocking power**:

1. **P0 deploy block** — when any P0 bug is open, CTO MUST write a block message to DevOps inbox: "DEPLOY BLOCKED: [bug]. Do not deploy until [condition]." Remove block when resolved.
2. **Architecture review gate** — R&D cannot merge a new game module without CTO sign-off in R&D inbox. CTO reviews within 1 cycle.
3. **Technical debt register** — maintain `departments/cto/tech-debt.md` with active items, owners, and deadlines. Flag items older than 7 days.
4. **Cross-department technical conflicts** — when two departments produce conflicting changes (e.g., UX/UI redesign vs R&D extraction), CTO sends resolution to both inboxes within 1 cycle.

### Part 3: Board — State Integrity + Strategic Steering

Board becomes the **single source of truth enforcer**:

1. **State.json audit** — every board meeting, compare state.json against actual repo state. Fix discrepancies directly:
   - `executionPhase` vs actual migrated game count
   - `departmentGrades` vs latest CEO grades in logs (if CEO forgot to update, Board does it)
   - `ceoDirectives` vs current reality (delete stale directives)
2. **Stuck work detection** — flag any department that produced identical output 3 cycles in a row (sign of being stuck or rubber-stamping).
3. **Strategic decisions** — Board is the only entity that can approve pivots, phase transitions, and new department creation. Write decisions to `confluence/decisions/`.
4. **Escalation hub** — any department can escalate to Board via inbox. Board MUST respond within 1 cycle.

### Part 4: Merge CISO + CPO + CFO into Board

**Delete separate CISO, CPO, CFO cron jobs.** Their responsibilities merge into the Board meeting agenda:

**Board meeting agenda (every 2 hours):**
1. State.json audit and fix (from Part 3)
2. Security posture check (was CISO) — review Security dept output, flag gaps
3. Product quality check (was CPO) — review QA results, flag UX issues, anti-staleness
4. Budget/utilization check (was CFO) — review department activity, flag idle/over-spending
5. Strategic decisions and escalations
6. Minutes with action items

This saves 3 cron jobs (CISO every 8h + CPO every 8h + CFO every 8h) while improving coverage (Board runs every 2h, so security/product/budget get checked 12x/day instead of 3x/day).

## Schedule Changes

| Role | Before | After |
|------|--------|-------|
| CEO | 2x/day (10:00, 22:00) | 3x/day (08:00, 14:00, 22:00) — added midday check |
| CTO | Every 6h | Every 4h — faster gate reviews |
| Board | Every 2h | Every 2h (unchanged, but expanded agenda) |
| CISO | Every 8h | DELETED — merged into Board |
| CPO | Every 8h | DELETED — merged into Board |
| CFO | Every 8h | DELETED — merged into Board |

## Success Criteria
- state.json grades match reality within 1 CEO cycle
- Zero stale directives older than 24h
- CTO blocks deploys within 1 cycle of P0 discovery
- Board catches state.json discrepancies every meeting
- No more "all clean, continue routine" rubber-stamp outputs
