# Development Workflows

Company-wide workflow library. All departments must follow documented workflows for repeatable processes.

**Owner:** PM department (review, expand, maintain)

## Development Workflows

For R&D — every code task must follow one of these.

| Workflow | File | Use When |
|----------|------|----------|
| TDD | [tdd.md](tdd.md) | Bug fixes, new mechanics, refactoring, shared modules |
| E2E-First | [e2e-first.md](e2e-first.md) | New games, UI changes, user-facing features |
| Spike | [spike.md](spike.md) | Research, prototyping, unknown root causes |
| Creative Pipeline | [creative-pipeline.md](creative-pipeline.md) | Game migrations with creative polish |

### Selection Rules
1. **Bug fix?** → TDD (prove the bug, then fix it)
2. **New game or UI change?** → E2E-First
3. **Don't know how to approach it?** → Spike first, then TDD or E2E-First
4. **Game migration with creative direction?** → Creative Pipeline (which includes TDD/E2E-First in build phase)

## QA Workflows

For QA — standard procedures for testing, bug filing, and release approval.

| Workflow | File | Use When |
|----------|------|----------|
| Game Verification | [qa-game-verification.md](qa-game-verification.md) | Every QA cycle, after any game/platform change |
| Bug Report | [qa-bug-report.md](qa-bug-report.md) | Any defect found during verification |
| Release Gate | [qa-release-gate.md](qa-release-gate.md) | Before any merge to main or deploy to production |

## Infrastructure & Deployment Workflows

For DevOps, R&D, and QA — the build-test-deploy pipeline.

| Workflow | File | Use When |
|----------|------|----------|
| Local Dev Server | [local-dev-server.md](local-dev-server.md) | Any code change — start here, test before push |
| Build → Test → Deploy | [build-test-deploy.md](build-test-deploy.md) | Full pipeline: localhost → QA approve → push → production verify |

### Selection Rules
1. **Editing game code?** → Start local dev server, self-test, hand to QA
2. **QA approved on localhost?** → Follow build-test-deploy pipeline to push
3. **Never push without QA approval on localhost**

## Identified Gaps (Future Workflows Needed)

| Workflow | Department(s) | Why |
|----------|---------------|-----|
| Hotfix | R&D, DevOps, QA | P1 bugs need a fast-track path (skip pitch/spec, straight to fix + verify) |
| Rollback | DevOps, QA | Documented procedure for reverting a bad deploy |
| Card Identity | UX/UI, Creative | Repeatable process for per-game CSS card banners (done 7 times, never documented) |
| Security Audit | Security, CISO | Routine scan procedure (runs every cycle, should be formalized) |
| Infrastructure Audit | Infra | Container health check procedure (runs every cycle) |

## Hard Rule
"I just did it" is NOT a valid approach for any department. Every repeatable process should have a documented workflow.
