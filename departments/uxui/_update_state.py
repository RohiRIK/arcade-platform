import json

with open('/home/rohi/arcade-platform/state.json') as f:
    s = json.load(f)

s['recentChanges'].append({
    'dept': 'uxui',
    'action': 'BUILD: prefers-reduced-motion accessibility. Added @media block neutralizing infinite animations and hover transforms for reduced-motion users. CSS-only, WCAG compliant. Frontend rebuilt.',
    'artifact': 'frontend/public/index.html',
    'timestamp': '2026-05-30T06:15:00Z'
})

if len(s['recentChanges']) > 50:
    s['recentChanges'] = s['recentChanges'][-50:]

with open('/home/rohi/arcade-platform/state.json', 'w') as f:
    json.dump(s, f, indent=2)

print('OK', len(s['recentChanges']))
