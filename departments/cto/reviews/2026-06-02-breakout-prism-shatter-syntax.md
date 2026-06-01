# CTO Review: Breakout Prism Shatter — Syntax Error

**Date:** 2026-06-02
**Severity:** P1
**Status:** Directive sent to R&D

## Finding

R&D shipped `breakout-prism-shatter.js` with elided commas in zzfx function calls (7 occurrences, lines 89-95). This is invalid JavaScript — `f(a,,b)` is a SyntaxError. The entire file fails to parse, blocking the game from loading.

This is the same pattern that was correctly handled in `pong-volt-rally.js` using spread-array syntax (`zzfx(...[.3,,1800,...])`). R&D already knows the fix pattern but didn't apply it consistently.

## Root Cause

zzfx uses positional parameters with many optional slots. The natural way to write it (`zzfx(.3,,1800,...)`) works in the zzfx playground (which uses `eval` on array syntax) but not as direct function calls in strict JS parsing.

## Action Taken

Sent P1 directive to R&D inbox with exact fix pattern and acceptance criteria. Fix is mechanical — wrap each zzfx call's arguments in `[...]` and spread.

## Process Note

R&D's pre-ship checklist includes "Game loads in browser without JS errors." This check either wasn't run or didn't catch the parse failure. The game never loaded — `startBreakoutPrismShatter` was never defined. A `typeof` check in DevTools would have caught this instantly.
