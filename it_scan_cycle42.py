import json, os, glob, re, stat, datetime

os.chdir('/home/rohi/arcade-platform')

# 1. state.json
s = json.load(open('state.json'))
required = ['version','system','lastBoardMeeting','lastCEOInspection','ceoDirectives','departmentGrades','pendingEscalations','recentChanges','blockedTasks','pipeline']
missing = [f for f in required if f not in s]
print(f'state.json missing: {missing}')
print(f'recentChanges: {len(s["recentChanges"])}')

# 2. Depts
depts = sorted([d for d in os.listdir('departments') if os.path.isdir(f'departments/{d}')])
for d in depts:
    smd = os.path.exists(f'departments/{d}/SYSTEM.md')
    inbox = os.path.isdir(f'departments/{d}/inbox')
    done = os.path.isdir(f'departments/{d}/inbox/done')
    if not smd or not inbox or not done:
        print(f'STRUCT: {d} smd={smd} inbox={inbox} done={done}')
print(f'Departments: {len(depts)}')

# 3. Logs
logs = glob.glob('logs/*.json')
pat = re.compile(r'^\d{8}T\d{6}Z-[a-z]+\.json$')
bad_json = []
bad_name = []
for l in logs:
    fn = os.path.basename(l)
    if not pat.match(fn):
        bad_name.append(fn)
    try:
        json.load(open(l))
    except:
        bad_json.append(fn)
print(f'Logs: {len(logs)}, invalid JSON: {bad_json}, bad names: {bad_name}')

# 4. Root orphans
known = {'state.json','package.json','package-lock.json','improve.sh','ci.sh','.gitignore','README.md','AGENTS.md','MARKETING-PLAYBOOK.md','MIGRATION-LOG.md','it_scan_cycle42.py'}
orphans = [f for f in os.listdir('.') if os.path.isfile(f) and f not in known]
print(f'Root orphans: {orphans}')

# 5. .sh perms
sh = glob.glob('**/*.sh', recursive=True)
noexec = [f for f in sh if not os.stat(f).st_mode & stat.S_IXUSR]
print(f'Non-exec .sh: {noexec}')

# 6. Inbox watchdog
print('--- INBOX WATCHDOG ---')
now = datetime.datetime.now().timestamp()
for d in depts:
    idir = f'departments/{d}/inbox'
    for item in os.listdir(idir):
        fp = f'{idir}/{item}'
        if os.path.isdir(fp):
            continue
        content = open(fp).read()
        if any(x in content.upper() for x in ['PRIORITY: P0','PRIORITY: P1','P0-CRITICAL','P1-HIGH','P1-URGENT']):
            age = (now - os.path.getmtime(fp)) / 3600
            print(f'  {d}/{item}: {age:.1f}h old, has P0/P1')

# 7. Cross-dept sync
ep = s['pivot']['executionPhase']
neon_games = [g for g in s['pipeline']['built'] if 'neon' in g or 'volt' in g or 'prism' in g or 'cascade' in g or 'frequency' in g or 'crossing' in g]
print(f'executionPhase={ep}, migrated neon games={len(neon_games)}: {neon_games}')

# 8. npm outdated
print('--- NPM ---')
