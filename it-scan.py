import json, glob, re, os

# 1. state.json validation
d = json.load(open("state.json"))
rc = len(d["recentChanges"])
print(f"state.json keys: {sorted(d.keys())}")
print(f"recentChanges count: {rc}")

# 2. Log file validity
files = glob.glob("logs/*.json")
print(f"\nTotal log files: {len(files)}")
bad = []
for f in files:
    try:
        json.load(open(f))
    except:
        bad.append(f)
print(f"Invalid JSON: {bad if bad else 'none'}")

# 3. Naming violations
pattern = r'^\d{8}T\d{6}Z-[a-z]+\.json$'
names = [os.path.basename(f) for f in sorted(files)]
violations = [n for n in names if not re.match(pattern, n)]
print(f"\nNaming violations: {len(violations)}")
for v in violations:
    print(f"  {v}")

# 4. New logs since cycle 11 (82 files)
print(f"\nNew logs since cycle 11: {len(files) - 82}")
