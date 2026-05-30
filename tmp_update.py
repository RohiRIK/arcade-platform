import json

with open('/home/rohi/arcade-platform/state.json') as f:
    s = json.load(f)

s['lastCEOInspection'] = '2026-05-30T07:01:35Z'
s['departmentGrades'] = {
    'rnd': 'A', 'uxui': 'A', 'infra': 'A', 'pm': 'A',
    'board': 'A-', 'qa': 'A', 'devops': 'A', 'security': 'A-', 'it': 'B+'
}
s['ceoDirectives'] = {
    'rnd': 'Build Frogger per spec. After shipping, start game #8 research.',
    'uxui': 'Pipeline empty. Research next initiative (game-over screens, responsive grid, or your choice).',
    'infra': 'Continue routine audits. Log rotation on 2026-06-04 when 7-day rule allows.',
    'pm': 'Keep changelog current. Update status report after Frogger ships.',
    'board': 'Track Frogger build. Flag if R&D pipeline stays empty after Frogger.',
    'qa': 'Continue regression cycles. Verify Frogger when it ships. Fix your log naming violations.',
    'it': 'Write a rename script to fix the 16 naming violations. Propose renames to offending departments.',
    'devops': 'Update ci.sh EXPECTED_GAMES to 7 after Frogger ships. Routine CI verify otherwise.',
    'security': 'Routine audit cycle. All clear currently.'
}

s['recentChanges'].append({
    'dept': 'ceo',
    'action': 'Third CEO inspection. Platform healthy, 6 games verified visually (Pac-Man spot-checked). All departments A/A- except IT (B+). Directed R&D to build Frogger, UX/UI to research next initiative. Pipeline thin — only Frogger queued.',
    'artifact': 'departments/ceo/reviews/2026-05-30-0700.md',
    'timestamp': '2026-05-30T07:01:35Z'
})

if len(s['recentChanges']) > 50:
    s['recentChanges'] = s['recentChanges'][-50:]

with open('/home/rohi/arcade-platform/state.json', 'w') as f:
    json.dump(s, f, indent=2)
print('done')
