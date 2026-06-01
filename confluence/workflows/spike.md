# Workflow: Spike (Exploration)

## When to Use
- Evaluating a new engine or library (e.g., LittleJS migration feasibility)
- Prototyping a game mechanic before committing to full build
- Investigating a bug with unknown root cause
- Performance profiling or optimization research

## Process
1. **Define question** — What specific question does this spike answer?
2. **Timebox** — Maximum 1 cycle. If not answered, escalate.
3. **Build throwaway code** — No production quality needed, no tests required
4. **Document findings** — Write a short report: what worked, what didn't, recommendation
5. **Discard code** — Spike code does NOT ship. Rebuild properly using TDD or E2E-first.

## Rules
- Spike output is a DOCUMENT, not code
- Spike code must never enter the main codebase
- After spike, choose TDD or E2E-first for the real implementation
