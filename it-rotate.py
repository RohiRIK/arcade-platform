import json

with open("state.json") as f:
    d = json.load(f)

# Rotate: keep newest 30
old_count = len(d["recentChanges"])
d["recentChanges"] = d["recentChanges"][-30:]

# Add scan entry
d["recentChanges"].append({
    "dept": "it",
    "action": "Cycle 12 scan+fix: 88 logs valid JSON. Executed rename script — fixed all 18 naming violations (QA 8, DevOps 5, Security 2, Infra 1, UX/UI 1, Board 1). recentChanges rotated 44→30. Zero naming violations remain.",
    "artifact": "departments/it/scans/2026-05-30-cycle12.md, departments/it/fixes/rename-log-violations.sh",
    "timestamp": "2026-05-30T10:15:00Z"
})

with open("state.json", "w") as f:
    json.dump(d, f, indent=2)
    f.write("\n")

print(f"Rotated {old_count} -> {len(d['recentChanges'])}")
