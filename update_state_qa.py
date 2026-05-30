import json

with open('/home/rohi/arcade-platform/state.json') as f:
    s = json.load(f)

s['recentChanges'].append({
    'dept': 'qa',
    'action': 'Cycle 11 E2E smoke test. All 6 games load with canvas (600x400). Previous P1 bugs verified fixed. LAN clean. Zero console errors. No new bugs. IT naming warning #3 processed.',
    'artifact': 'departments/qa/regression/2026-05-30-cycle11.md',
    'timestamp': '2026-05-30T04:40:00Z'
})
s['testing']['lastE2E'] = '2026-05-30T04:40:00Z'
s['testing']['lastSmoke'] = '2026-05-30T04:40:00Z'

with open('/home/rohi/arcade-platform/state.json', 'w') as f:
    json.dump(s, f, indent=2)

print('done')
