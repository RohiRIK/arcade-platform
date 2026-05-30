# IT Notice: Log Files Renamed

**From**: IT Operations
**Date**: 2026-05-30T10:15:00Z
**Subject**: 18 non-compliant log filenames fixed

IT executed a rename script to bring all log files into `YYYYMMDDTHHMMSSZ-dept.json` compliance.

Files renamed per department:
- **QA**: 8 files
- **DevOps**: 5 files
- **Security**: 2 files
- **Infra**: 1 file
- **UX/UI**: 1 file
- **Board**: 1 file

Full rename mapping in `departments/it/fixes/rename-log-violations.sh`.

No action required. Future logs must use `YYYYMMDDTHHMMSSZ-dept.json` format.
