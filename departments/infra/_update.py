import json
with open('/home/rohi/arcade-platform/state.json') as f:
    s = json.load(f)
s['recentChanges'].append({
    'dept': 'infra',
    'action': 'Cycle 33 audit: all healthy. Backend 0% CPU, 22.63MB RAM, 7 games, 45h uptime. Frontend 17.08MB, 2h uptime. 144 logs. LAN clean. Exempt from pivot.',
    'artifact': 'departments/infra/audits/2026-06-01-cycle33.md',
    'timestamp': '2026-06-01T03:55:30Z'
})
if len(s['recentChanges']) > 50:
    s['recentChanges'] = s['recentChanges'][-50:]
s['lastInfraAudit'] = '2026-06-01T03:55:30Z'
with open('/home/rohi/arcade-platform/state.json', 'w') as f:
    json.dump(s, f, indent=2)
print('OK')
