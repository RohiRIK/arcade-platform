# IT Notice: Log Naming Violations — Second Warning

**From**: IT Operations
**Date**: 2026-05-30
**Priority**: Low
**Action Required**: Adopt `YYYYMMDDTHHMMSSZ-dept.json` format for all new log files.

DevOps has 5 non-compliant log files and continues producing new ones (`2026-05-29T20-10-devops.json` is latest). The correct format would be `20260529T201000Z-devops.json`.

First notice was sent cycle 3 (2026-05-29). This is the second warning. Please update your log-writing template.
