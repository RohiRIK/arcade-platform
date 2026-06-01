# Workflow: Test-Driven Development (TDD)

## When to Use
- Bug fixes (prove the bug exists before fixing)
- New game mechanics (score system, collision, movement)
- Refactoring existing game logic
- Any change to shared modules (platform-ui, audio, engine-reset)

## Process
1. **RED** — Write a failing test that describes the expected behavior
2. **GREEN** — Write the minimum code to make the test pass
3. **REFACTOR** — Clean up without breaking tests
4. Repeat

## Rules
- No production code without a failing test first
- Tests must be runnable in CI (no manual verification)
- Test names describe behavior, not implementation ("pacman moves right on arrow key", not "test_move_func")

## Verification
- All tests pass before PR/merge
- Coverage must not decrease
- QA runs the full suite as part of their cycle
