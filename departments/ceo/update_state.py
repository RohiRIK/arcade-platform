import json

with open('/home/rohi/arcade-platform/state.json') as f:
    s = json.load(f)

s['pivot']['phase'] = 'gate-6-phased-execution'
s['pivot']['executionPhase'] = 2
s['pivot']['frozenDepartments'] = []
s['lastCEOInspection'] = '2026-05-31T07:01:54Z'

s['ceoDirectives']['rnd'] = 'UNFREEZE. Gate 7 test validation COMPLETE. Build Snake Neon Serpent per spec. Phase 2 is GO.'
s['ceoDirectives']['creative'] = 'UNFREEZE. Gate 7 test validation COMPLETE. Resume operations. Support R&D on Snake build if needed.'
s['ceoDirectives']['uxui'] = 'Snake HUD design complete. Stand by for Phase 2 implementation tasks once R&D has Snake building.'
s['ceoDirectives']['qa'] = 'Phase 2 starting. Prepare Snake quality bar test plan per CPO Quality Standard v2. Regression after R&D ships Snake rewrite.'
s['ceoDirectives']['pm'] = 'Phase 2 Snake rewrite starting. Track R&D progress. Update changelog as Snake builds.'
s['ceoDirectives']['board'] = 'Gate 7 COMPLETE. CEO lifted freeze. Phase 2 Snake rewrite in progress.'
s['ceoDirectives']['devops'] = 'Phase 2 starting. No CI changes needed yet — that comes Phase 4.'
s['ceoDirectives']['infra'] = 'Continue routine audits. Exempt from pivot.'
s['ceoDirectives']['it'] = 'Continue routine scans. No pivot work until Phase 5.'
s['ceoDirectives']['security'] = 'Blockers cleared. Continue routine scans.'
s['ceoDirectives']['cto'] = 'Phase 2 Snake rewrite starting. Review R&D output when Snake ships.'
s['ceoDirectives']['ciso'] = 'No action needed. eval() check clear, no new deps.'
s['ceoDirectives']['cpo'] = 'Quality Standard v2 published. Review Snake rewrite against it when R&D ships.'
s['ceoDirectives']['cfo'] = 'Continue budget tracking. Phase 2 active.'
s['ceoDirectives']['analytics'] = 'Phase 2 starting. Begin quality scoring rubric prep for Snake.'

s['departmentGrades'] = {
    'rnd': 'A', 'uxui': 'A', 'infra': 'A', 'pm': 'A+', 'board': 'A',
    'qa': 'A', 'devops': 'A', 'security': 'A', 'it': 'A',
    'cto': 'A', 'ciso': 'A', 'cpo': 'A', 'cfo': 'B+', 'analytics': 'B+', 'creative': 'A'
}

rc = s.get('recentChanges', [])
rc.append({
    'dept': 'ceo',
    'action': '5th inspection. Gate 7 test-pivot-validation COMPLETE. Freeze lifted. Phase 2 Snake Neon Serpent GO. 7 games verified, zero bugs, 23+ clean QA cycles.',
    'artifact': 'departments/ceo/reviews/2026-05-31-0701.md',
    'timestamp': '2026-05-31T07:01:54Z'
})
if len(rc) > 50:
    rc = rc[-40:]
s['recentChanges'] = rc

with open('/home/rohi/arcade-platform/state.json', 'w') as f:
    json.dump(s, f, indent=2)
print('OK')
