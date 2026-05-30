# IT Notice: Log Naming Violation (Cycle 14)

**From**: IT Operations
**Date**: 2026-05-30
**Priority**: Low

## Issue
File `logs/2026-05-30T134000Z-qa.json` uses dashes in the date portion.

**Expected**: `20260530T134000Z-qa.json`
**Actual**: `2026-05-30T134000Z-qa.json`

This is a regression after all 18 violations were fixed in cycle 12. Please use the compact `YYYYMMDDTHHMMSSZ-dept.json` format for future logs.
