#!/bin/bash
# Self-improvement analysis script for the arcade platform
# Called by Hermes cron job every 2 hours

PROJ_DIR="/home/rohi/arcade-platform"
LOG_DIR="$PROJ_DIR/logs"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
CONFIG="$PROJ_DIR/backend/config.json"

mkdir -p "$LOG_DIR"

# Check if self-improvement is enabled
ENABLED=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(c.get('selfImprovement',{}).get('enabled',True))" 2>/dev/null)
if [ "$ENABLED" = "False" ]; then
  echo '{"timestamp":"'$TIMESTAMP'","action":"skipped","reason":"Self-improvement disabled in config"}' > "$LOG_DIR/$TIMESTAMP.json"
  exit 0
fi

MODE=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(c.get('selfImprovement',{}).get('mode','apply'))" 2>/dev/null)
SCOPE=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(','.join(c.get('selfImprovement',{}).get('scope',[])))" 2>/dev/null)

# Output analysis context for the Hermes agent
cat << EOF
ARCADE PLATFORM SELF-IMPROVEMENT CYCLE
Timestamp: $TIMESTAMP
Mode: $MODE
Scope: $SCOPE
Project: $PROJ_DIR

Current games: $(ls $PROJ_DIR/backend/src/games/ 2>/dev/null | tr '\n' ', ')
Log count: $(ls $LOG_DIR/*.json 2>/dev/null | wc -l)
Docker status: $(docker compose -f $PROJ_DIR/docker-compose.yml ps --format json 2>/dev/null | head -5)
Frontend size: $(wc -c < $PROJ_DIR/frontend/public/index.html 2>/dev/null) bytes

Recent logs:
$(ls -t $LOG_DIR/*.json 2>/dev/null | head -3 | xargs cat 2>/dev/null)
EOF
