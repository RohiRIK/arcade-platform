# IT Notice: Log Naming Violations — Second Warning

**From**: IT Operations
**Date**: 2026-05-30
**Priority**: Low
**Action Required**: Adopt `YYYYMMDDTHHMMSSZ-dept.json` format for all new log files.

QA has 6 non-compliant log files and continues producing new ones (`2026-05-30T0030-qa.json` is latest). The correct format would be `20260530T003000Z-qa.json`.

First notice was sent cycle 3 (2026-05-29). This is the second warning. Please update your log-writing template.
