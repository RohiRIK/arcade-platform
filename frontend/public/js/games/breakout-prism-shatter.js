/**
 * Breakout — Prism Shatter (Phase 3: arcade-evolution)
 * Controls: Arrow Left/Right or mouse to move paddle. Space/Click to launch. R to restart.
 * Mechanics: 5 designed levels, combo multipliers (up to 3.0x), 3 power-up types (wide, multi, slow),
 * 3 brick types (standard, multi-hit, indestructible), crystal shatter particles, prismatic clear explosion.
 * 7 zzfx sounds, ball trail from level 4+, hard mode loop after level 5.
 * 600x400 canvas, all procedural rendering.
 */
function startBreakoutPrismShatter(canvas, ctx) {
  // === CONSTANTS ===
  const W = 600, H = 400;
  const BRICK_COLS = 10;
  const BRICK_W = 54, BRICK_H = 18;
  const BRICK_GAP = 2;
  const BRICK_OFFSET_X = 15;
  const BRICK_OFFSET_Y = 40;
  const PADDLE_W = 80, PADDLE_H = 12, PADDLE_Y = H - 30;
  const PADDLE_SPEED = 7;
  const BALL_RADIUS = 7;
  const BALL_SPEEDS = [3.5, 4.0, 4.5, 5.0, 5.5];
  const MAX_BALL_SPEED = 6.0;
  const LIVES_START = 3;
  const COMBO_MAX_MULT = 3.0;
  const COMBO_MULT_STEP = 0.25;
  const POWERUP_DROP_CHANCE = 0.10;
  const POWERUP_FALL_SPEED = 1.5;
  const POWERUP_WIDE_DURATION = 15000;
  const POWERUP_SLOW_DURATION = 10000;
  const POWERUP_WIDE_WIDTH = 120;
  const POWERUP_SLOW_FACTOR = 0.6;
  const POWERUP_SIZE = 10;
  const PARTICLE_CAP = 120;
  const TRAIL_LENGTH = 3;
  const BG_COLOR = '#0d0015';
  const PADDLE_COLOR = '#c0c0c0';
  const BALL_COLOR_NORMAL = '#f0f0ff';
  const BALL_COLOR_COMBO3 = '#ffd54f';
  const BALL_COLOR_COMBO6 = '#ff6e40';
  const ROW_COLORS = ['#e040fb', '#7c4dff', '#448aff', '#00e676', '#ffea00'];
  const ROW_POINTS = [30, 25, 20, 15, 10];
  const INDESTRUCTIBLE_COLOR = '#505050';
  const CLEAR_BONUS = [500, 1000, 1500, 2000, 2500];

  // === LEVEL LAYOUTS ===
  // 0=empty, 1=standard, 2=multi-hit, 'X'=indestructible
  const LEVEL_1 = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ];
  const LEVEL_2 = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,'X',1,1,'X',1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ];
  const LEVEL_3 = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,'X',1,1,1,1,'X',1,1],
    [1,1,1,1,'X','X',1,1,1,1],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [1,1,1,1,1,1,1,1,1,1],
  ];
  const LEVEL_4 = [
    [2,1,2,1,2,2,1,2,1,2],
    [1,'X',1,'X',1,1,'X',1,'X',1],
    [1,1,1,1,1,'X',1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ];
  const LEVEL_5 = [
    [1,'X','X','X','X','X','X','X','X',1],
    [1,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ];
  const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];

  // === SOUND EFFECTS (7 zzfx sounds) ===
  const SFX = {
    glass_clink:     function(pitch) { try { zzfx(.3,,pitch||1800,.01,.02,.05,1,2,,,,,,,,,,.3,.01); } catch(e){} },
    mirror_ping:     function() { try { zzfx(.2,,880,.01,.01,.04,1,1,,,,,,,,,,.3,.01); } catch(e){} },
    drop_womp:       function() { try { zzfx(.4,,400,.02,.1,.15,2,1,-10,,,,,,,,,.5,.05); } catch(e){} },
    chime_cascade:   function() { try { zzfx(.3,,1200,.01,.15,.1,1,1,,,,,,,,,,.4,.02); } catch(e){} },
    heat_sizzle:     function() { try { zzfx(.2,,0,.01,.1,.05,4,2,,,,,,,,,,.2,.01); } catch(e){} },
    victory_cascade: function() { try { zzfx(.5,,523,.02,.3,.2,1,1,,,,,,,,,,.8,.1); } catch(e){} },
    gem_pickup:      function() { try { zzfx(.3,,660,.01,.05,.05,1,1,,,990,,,,,,,,,.02); } catch(e){} },
  };

  // === GAME STATE ===
  let bricks = [];
  let ball = { x: 0, y: 0, dx: 0, dy: 0, speed: 3.5, launched: false, trail: [] };
  let extraBalls = [];
  let paddle = { x: W / 2 - PADDLE_W / 2, width: PADDLE_W };
  let powerUps = [];
  let particles = [];
  let floatingTexts = [];
  let state = {
    level: 1, score: 0, highScore: 0, lives: LIVES_START,
    combo: 0, phase: 'ready',
    powerUpTimers: { wide: 0, slow: 0 },
    showTrail: false, hardModeOffset: 0
  };
  let keysDown = {};
  let mouseX = W / 2;
  let animFrame = null;
  let transitionTimer = 0;
  let lastTime = 0;
  let materializeProgress = 0;
  let materializeActive = false;

  // Load high score
  try { state.highScore = parseInt(localStorage.getItem('arcade_breakout_highscore')) || 0; } catch(e) {}

  // === LEVEL BUILDER ===
  function buildLevel(levelNum) {
    var tpl = LEVELS[(levelNum - 1) % LEVELS.length];
    bricks = [];
    for (var row = 0; row < tpl.length; row++) {
      for (var col = 0; col < BRICK_COLS; col++) {
        var cell = tpl[row][col];
        if (cell === 0) continue;
        var type = cell === 'X' ? 'indestructible' : cell === 2 ? 'multi' : 'standard';
        var maxHits = type === 'indestructible' ? Infinity : type === 'multi' ? 2 : 1;
        var color = type === 'indestructible' ? INDESTRUCTIBLE_COLOR : ROW_COLORS[row % ROW_COLORS.length];
        bricks.push({
          type: type, hits: 0, maxHits: maxHits, row: row, col: col, color: color,
          x: BRICK_OFFSET_X + col * (BRICK_W + BRICK_GAP),
          y: BRICK_OFFSET_Y + row * (BRICK_H + BRICK_GAP),
          width: BRICK_W, height: BRICK_H, alive: true
        });
      }
    }
    var baseSpeed = BALL_SPEEDS[Math.min(levelNum - 1, BALL_SPEEDS.length - 1)];
    ball.speed = Math.min(baseSpeed + state.hardModeOffset, MAX_BALL_SPEED + state.hardModeOffset);
    ball.x = W / 2; ball.y = PADDLE_Y - BALL_RADIUS - 2;
    ball.dx = 0; ball.dy = 0; ball.launched = false; ball.trail = [];
    extraBalls = []; powerUps = [];
    state.combo = 0;
    state.showTrail = (levelNum >= 4);
    state.phase = 'ready';
    paddle.x = W / 2 - paddle.width / 2;
    materializeProgress = 0;
    materializeActive = true;
  }

  // === PARTICLE SPAWNING ===
  function spawnParticles(x, y, color, count, speed, gravity) {
    for (var i = 0; i < count; i++) {
      if (particles.length >= PARTICLE_CAP) particles.shift();
      var angle = Math.random() * Math.PI * 2;
      var spd = (Math.random() * 0.7 + 0.3) * (speed || 2);
      particles.push({
        x: x, y: y, dx: Math.cos(angle) * spd, dy: Math.sin(angle) * spd,
        size: Math.random() * 3 + 1, color: color,
        life: 1.0, maxLife: 0.4 + Math.random() * 0.4, gravity: gravity || 0
      });
    }
  }

  function addFloatingText(text, x, y, color, size) {
    floatingTexts.push({ text: text, x: x, y: y, vy: -1.2, life: 1.0, maxLife: 1.0, color: color, size: size || 14 });
  }

  // === LAUNCH BALL ===
  function launchBall() {
    if (state.phase !== 'ready') return;
    state.phase = 'playing';
    var angle = (Math.random() * 0.4 - 0.2);
    ball.dx = Math.sin(angle);
    ball.dy = -Math.cos(angle);
    ball.launched = true;
  }

  // === POWER-UP COLLECTION ===
  function collectPowerUp(type) {
    SFX.gem_pickup();
    if (type === 'wide') {
      paddle.width = POWERUP_WIDE_WIDTH;
      state.powerUpTimers.wide = POWERUP_WIDE_DURATION;
      addFloatingText('WIDE PADDLE', W / 2, H / 2, '#448aff', 16);
    } else if (type === 'slow') {
      state.powerUpTimers.slow = POWERUP_SLOW_DURATION;
      addFloatingText('SLOW BALL', W / 2, H / 2, '#ffea00', 16);
    } else if (type === 'multi') {
      for (var i = 0; i < 2; i++) {
        var a = (i === 0 ? -1 : 1) * Math.PI / 6;
        extraBalls.push({
          x: ball.x, y: ball.y,
          dx: ball.dx * Math.cos(a) - ball.dy * Math.sin(a),
          dy: ball.dx * Math.sin(a) + ball.dy * Math.cos(a),
          speed: ball.speed, trail: []
        });
      }
      addFloatingText('MULTI-BALL', W / 2, H / 2, '#00e676', 16);
    }
  }

  // === HIT BRICK ===
  function hitBrick(brick) {
    brick.hits++;
    if (brick.type === 'indestructible') {
      SFX.glass_clink(220);
      spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, '#888', 2, 1);
      return;
    }
    if (brick.hits >= brick.maxHits) {
      brick.alive = false;
      state.combo++;
      var multiplier = Math.min(COMBO_MAX_MULT, 1.0 + state.combo * COMBO_MULT_STEP);
      var points = Math.round(ROW_POINTS[brick.row % ROW_POINTS.length] * multiplier);
      state.score += points;
      var pitchByRow = 2200 - (brick.row * 200);
      SFX.glass_clink(Math.max(1400, pitchByRow));
      spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, 6, 2.5);
      if (state.combo === 3) {
        SFX.heat_sizzle();
        spawnParticles(ball.x, ball.y, BALL_COLOR_COMBO3, 4, 3);
      }
      if (state.combo === 6) {
        SFX.heat_sizzle();
        spawnParticles(ball.x, ball.y, BALL_COLOR_COMBO6, 8, 3.5);
      }
      if (state.combo >= 3) {
        addFloatingText('x' + multiplier.toFixed(2), brick.x + brick.width / 2, brick.y, '#ffea00', 12);
      }
      addFloatingText('+' + points, brick.x + brick.width / 2, brick.y + 10, '#fff', 11);
      // Power-up drop
      if (Math.random() < POWERUP_DROP_CHANCE) {
        var types = ['wide', 'multi', 'slow'];
        var puType = types[Math.floor(Math.random() * types.length)];
        var puColors = { wide: '#448aff', multi: '#00e676', slow: '#ffea00' };
        powerUps.push({
          x: brick.x + brick.width / 2, y: brick.y + brick.height / 2,
          type: puType, color: puColors[puType], rotation: 0
        });
      }
      // Check row clear
      var rowBricks = bricks.filter(function(b) { return b.row === brick.row && b.type !== 'indestructible'; });
      if (rowBricks.every(function(b) { return !b.alive; })) {
        SFX.chime_cascade();
        for (var i = 0; i < BRICK_COLS; i++) {
          var lx = BRICK_OFFSET_X + i * (BRICK_W + BRICK_GAP) + BRICK_W / 2;
          spawnParticles(lx, brick.y, '#fff', 2, 4, -0.5);
        }
      }
    } else {
      // Multi-hit first hit
      SFX.glass_clink(900);
    }
  }

  // === BALL LOST ===
  function onBallLost(ballRef, isExtra, idx) {
    if (isExtra) { extraBalls.splice(idx, 1); return; }
    if (extraBalls.length > 0) {
      var promoted = extraBalls.shift();
      ball.x = promoted.x; ball.y = promoted.y;
      ball.dx = promoted.dx; ball.dy = promoted.dy;
      ball.speed = promoted.speed; ball.trail = promoted.trail;
      return;
    }
    state.lives--;
    SFX.drop_womp();
    if (state.lives <= 0) {
      state.phase = 'gameOver';
      try {
        if (state.score > state.highScore) {
          state.highScore = state.score;
          localStorage.setItem('arcade_breakout_highscore', state.highScore);
        }
      } catch(e) {}
    } else {
      ball.x = W / 2; ball.y = PADDLE_Y - BALL_RADIUS - 2;
      ball.dx = 0; ball.dy = 0; ball.launched = false; ball.trail = [];
      state.phase = 'ready';
      state.combo = 0;
    }
  }

  // === BALL-BRICK COLLISION (AABB) ===
  function ballBrickAABB(bx, by, brick) {
    var cx = Math.max(brick.x, Math.min(bx, brick.x + brick.width));
    var cy = Math.max(brick.y, Math.min(by, brick.y + brick.height));
    var ddx = bx - cx, ddy = by - cy;
    return ddx * ddx + ddy * ddy <= BALL_RADIUS * BALL_RADIUS;
  }

  // === UPDATE SINGLE BALL ===
  function updateBall(b, isExtra, idx) {
    if (state.showTrail || state.combo >= 6) {
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > TRAIL_LENGTH) b.trail.shift();
    } else { b.trail = []; }
    var effectiveSpeed = b.speed * (state.powerUpTimers.slow > 0 ? POWERUP_SLOW_FACTOR : 1.0);
    b.x += b.dx * effectiveSpeed;
    b.y += b.dy * effectiveSpeed;
    // Walls
    if (b.x - BALL_RADIUS <= 0) { b.x = BALL_RADIUS; b.dx = Math.abs(b.dx); }
    if (b.x + BALL_RADIUS >= W) { b.x = W - BALL_RADIUS; b.dx = -Math.abs(b.dx); }
    if (b.y - BALL_RADIUS <= 0) { b.y = BALL_RADIUS; b.dy = Math.abs(b.dy); }
    // Floor
    if (b.y + BALL_RADIUS >= H) { onBallLost(b, isExtra, idx); return; }
    // Paddle
    if (b.dy > 0 && b.y + BALL_RADIUS >= PADDLE_Y && b.y + BALL_RADIUS <= PADDLE_Y + PADDLE_H &&
        b.x >= paddle.x && b.x <= paddle.x + paddle.width) {
      var offset = (b.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      offset = Math.max(-1, Math.min(1, offset));
      var angle = offset * (Math.PI / 3);
      b.dx = Math.sin(angle); b.dy = -Math.cos(angle);
      b.y = PADDLE_Y - BALL_RADIUS;
      state.combo = 0;
      SFX.mirror_ping();
      spawnParticles(b.x, PADDLE_Y, '#fff', 3, 1.5);
    }
    // Bricks
    for (var i = 0; i < bricks.length; i++) {
      var brick = bricks[i];
      if (!brick.alive) continue;
      if (ballBrickAABB(b.x, b.y, brick)) {
        var overlapLeft = (b.x + BALL_RADIUS) - brick.x;
        var overlapRight = (brick.x + brick.width) - (b.x - BALL_RADIUS);
        var overlapTop = (b.y + BALL_RADIUS) - brick.y;
        var overlapBottom = (brick.y + brick.height) - (b.y - BALL_RADIUS);
        var minX = Math.min(overlapLeft, overlapRight);
        var minY = Math.min(overlapTop, overlapBottom);
        if (minX < minY) { b.dx *= -1; } else { b.dy *= -1; }
        hitBrick(brick);
        break;
      }
    }
  }

  // === MAIN UPDATE ===
  function updateGame(dt, now) {
    // Materialize animation
    if (materializeActive) {
      materializeProgress += dt / 600;
      if (materializeProgress >= 1) { materializeProgress = 1; materializeActive = false; }
    }
    if (state.phase !== 'playing' && state.phase !== 'ready') return;
    if (state.phase === 'ready') {
      // Ball follows paddle
      ball.x = paddle.x + paddle.width / 2;
      ball.y = PADDLE_Y - BALL_RADIUS - 2;
    }
    // Paddle input
    if (keysDown['ArrowLeft'] || keysDown['a'] || keysDown['A']) paddle.x -= PADDLE_SPEED;
    if (keysDown['ArrowRight'] || keysDown['d'] || keysDown['D']) paddle.x += PADDLE_SPEED;
    paddle.x = mouseX - paddle.width / 2;
    paddle.x = Math.max(0, Math.min(W - paddle.width, paddle.x));
    // Power-up timers
    if (state.powerUpTimers.wide > 0) {
      state.powerUpTimers.wide -= dt;
      if (state.powerUpTimers.wide <= 0) { paddle.width = PADDLE_W; state.powerUpTimers.wide = 0; }
    }
    if (state.powerUpTimers.slow > 0) {
      state.powerUpTimers.slow -= dt;
      if (state.powerUpTimers.slow <= 0) state.powerUpTimers.slow = 0;
    }
    if (state.phase !== 'playing') return;
    // Update main ball
    updateBall(ball, false, -1);
    // Update extra balls (iterate backwards for safe removal)
    for (var i = extraBalls.length - 1; i >= 0; i--) {
      updateBall(extraBalls[i], true, i);
    }
    // Power-ups fall
    for (var j = powerUps.length - 1; j >= 0; j--) {
      var pu = powerUps[j];
      pu.y += POWERUP_FALL_SPEED;
      pu.rotation += 90 * dt / 1000;
      if (pu.y > H) { powerUps.splice(j, 1); continue; }
      if (pu.x >= paddle.x && pu.x <= paddle.x + paddle.width &&
          pu.y + POWERUP_SIZE >= PADDLE_Y && pu.y - POWERUP_SIZE <= PADDLE_Y + PADDLE_H) {
        collectPowerUp(pu.type);
        powerUps.splice(j, 1);
      }
    }
    // Particles
    for (var k = particles.length - 1; k >= 0; k--) {
      var p = particles[k];
      p.x += p.dx; p.y += p.dy;
      p.dy += (p.gravity || 0.05);
      p.life -= dt / 1000 / p.maxLife;
      if (p.life <= 0) particles.splice(k, 1);
    }
    // Floating texts
    for (var m = floatingTexts.length - 1; m >= 0; m--) {
      var ft = floatingTexts[m];
      ft.y += ft.vy;
      ft.life -= dt / 1000 / ft.maxLife;
      if (ft.life <= 0) floatingTexts.splice(m, 1);
    }
    // Level clear check
    var destructible = bricks.filter(function(b) { return b.type !== 'indestructible'; });
    if (destructible.length > 0 && destructible.every(function(b) { return !b.alive; })) {
      state.phase = 'levelClear';
      SFX.victory_cascade();
      // Prismatic explosion
      for (var c = 0; c < ROW_COLORS.length; c++) {
        spawnParticles(W / 2, H / 2, ROW_COLORS[c], 10, 5, -0.1);
      }
      var bonus = CLEAR_BONUS[Math.min(state.level - 1, CLEAR_BONUS.length - 1)];
      state.score += bonus;
      addFloatingText('LEVEL ' + state.level + ' CLEAR!', W / 2, H / 2 - 30, '#ffea00', 24);
      addFloatingText('+' + bonus + 'pts', W / 2, H / 2 + 10, '#e040fb', 20);
      transitionTimer = 1500;
    }
  }

  // === RENDER ===
  function renderGame() {
    // 1. Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);
    // 2. Radial gradient on level 4+
    if (state.level >= 4 && ball.launched) {
      var grad = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, 150);
      grad.addColorStop(0, 'rgba(26,0,48,0.3)');
      grad.addColorStop(1, 'rgba(13,0,21,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
    // 3. Bricks
    for (var i = 0; i < bricks.length; i++) {
      var brick = bricks[i];
      if (!brick.alive) continue;
      // Materialize animation
      var alpha = materializeActive ? Math.min(1, materializeProgress * (bricks.length / (brick.row + 1))) : 1;
      ctx.globalAlpha = Math.min(1, alpha);
      // Rounded rect
      var r = 3;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.moveTo(brick.x + r, brick.y);
      ctx.lineTo(brick.x + brick.width - r, brick.y);
      ctx.quadraticCurveTo(brick.x + brick.width, brick.y, brick.x + brick.width, brick.y + r);
      ctx.lineTo(brick.x + brick.width, brick.y + brick.height - r);
      ctx.quadraticCurveTo(brick.x + brick.width, brick.y + brick.height, brick.x + brick.width - r, brick.y + brick.height);
      ctx.lineTo(brick.x + r, brick.y + brick.height);
      ctx.quadraticCurveTo(brick.x, brick.y + brick.height, brick.x, brick.y + brick.height - r);
      ctx.lineTo(brick.x, brick.y + r);
      ctx.quadraticCurveTo(brick.x, brick.y, brick.x + r, brick.y);
      ctx.closePath();
      ctx.fill();
      // Crystal facet highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(brick.x + 1, brick.y + 1, brick.width - 2, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(brick.x + 1, brick.y + 1, 2, brick.height - 2);
      // Multi-hit crack overlay
      if (brick.type === 'multi' && brick.hits > 0) {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(brick.x + brick.width * 0.3, brick.y);
        ctx.lineTo(brick.x + brick.width * 0.7, brick.y + brick.height);
        ctx.moveTo(brick.x + brick.width * 0.6, brick.y);
        ctx.lineTo(brick.x + brick.width * 0.4, brick.y + brick.height);
        ctx.stroke();
      }
      // Indestructible metallic sheen
      if (brick.type === 'indestructible') {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(brick.x, brick.y, brick.width, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(brick.x, brick.y + brick.height - 1, brick.width, 1);
      }
      ctx.globalAlpha = 1;
    }
    // 4. Paddle
    ctx.fillStyle = PADDLE_COLOR;
    var pr = 6;
    ctx.beginPath();
    ctx.moveTo(paddle.x + pr, PADDLE_Y);
    ctx.lineTo(paddle.x + paddle.width - pr, PADDLE_Y);
    ctx.quadraticCurveTo(paddle.x + paddle.width, PADDLE_Y, paddle.x + paddle.width, PADDLE_Y + pr);
    ctx.lineTo(paddle.x + paddle.width, PADDLE_Y + PADDLE_H - pr);
    ctx.quadraticCurveTo(paddle.x + paddle.width, PADDLE_Y + PADDLE_H, paddle.x + paddle.width - pr, PADDLE_Y + PADDLE_H);
    ctx.lineTo(paddle.x + pr, PADDLE_Y + PADDLE_H);
    ctx.quadraticCurveTo(paddle.x, PADDLE_Y + PADDLE_H, paddle.x, PADDLE_Y + PADDLE_H - pr);
    ctx.lineTo(paddle.x, PADDLE_Y + pr);
    ctx.quadraticCurveTo(paddle.x, PADDLE_Y, paddle.x + pr, PADDLE_Y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(paddle.x + 2, PADDLE_Y + 1, paddle.width - 4, 1);

    // 5-7. Ball trail + ball (main + extras)
    function drawBall(b) {
      var ballColor = state.combo >= 6 ? BALL_COLOR_COMBO6 : state.combo >= 3 ? BALL_COLOR_COMBO3 : BALL_COLOR_NORMAL;
      var glowSize = state.combo >= 6 ? 7 : state.combo >= 3 ? 5 : 3;
      // Trail
      if (b.trail.length > 0 && (state.showTrail || state.combo >= 6)) {
        for (var t = 0; t < b.trail.length; t++) {
          var a = [0.1, 0.3, 0.6][t] || 0.1;
          ctx.globalAlpha = a;
          ctx.fillStyle = ballColor;
          ctx.beginPath();
          ctx.arc(b.trail[t].x, b.trail[t].y, BALL_RADIUS * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ctx.save();
      ctx.shadowColor = ballColor;
      ctx.shadowBlur = glowSize;
      ctx.fillStyle = ballColor;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawBall(ball);
    for (var eb = 0; eb < extraBalls.length; eb++) drawBall(extraBalls[eb]);

    // 8. Power-up gems
    for (var pi = 0; pi < powerUps.length; pi++) {
      var pu = powerUps[pi];
      ctx.save();
      ctx.translate(pu.x, pu.y);
      ctx.rotate(pu.rotation * Math.PI / 180);
      ctx.shadowColor = pu.color; ctx.shadowBlur = 6;
      ctx.fillStyle = pu.color;
      ctx.beginPath();
      ctx.moveTo(0, -POWERUP_SIZE);
      ctx.lineTo(POWERUP_SIZE, 0);
      ctx.lineTo(0, POWERUP_SIZE);
      ctx.lineTo(-POWERUP_SIZE, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // 9. Particles
    for (var pp = 0; pp < particles.length; pp++) {
      var pa = particles[pp];
      ctx.globalAlpha = Math.max(0, pa.life);
      ctx.fillStyle = pa.color;
      ctx.fillRect(pa.x - pa.size / 2, pa.y - pa.size / 2, pa.size, pa.size);
    }
    ctx.globalAlpha = 1;
    // 10. Floating texts
    for (var fi = 0; fi < floatingTexts.length; fi++) {
      var ft = floatingTexts[fi];
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.fillStyle = ft.color;
      ctx.font = ft.size + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // === HUD ===
  function renderHUD() {
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE: ' + state.score, 10, 22);
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL ' + state.level, W / 2, 22);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#7c4dff';
    ctx.font = '14px monospace';
    ctx.fillText('HI: ' + state.highScore, W - 10, 22);
    // Combo display
    if (state.combo >= 3) {
      var mult = Math.min(COMBO_MAX_MULT, 1.0 + state.combo * COMBO_MULT_STEP);
      var pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#ffea00';
      ctx.font = '14px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('COMBO x' + mult.toFixed(2), W - 10, 38);
      ctx.globalAlpha = 1;
    }
    // Lives
    ctx.textAlign = 'left';
    for (var l = 0; l < state.lives; l++) {
      ctx.fillStyle = '#f0f0ff';
      ctx.beginPath();
      ctx.arc(16 + l * 18, H - 12, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    // Ready prompt
    if (state.phase === 'ready') {
      var readyPulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
      ctx.globalAlpha = readyPulse;
      ctx.fillStyle = '#e0e0e0';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK or SPACE to launch', W / 2, H / 2 + 60);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = 'left';
  }

  // === GAME OVER OVERLAY ===
  function renderGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e040fb';
    ctx.font = '28px monospace';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '20px monospace';
    ctx.fillText('Score: ' + state.score, W / 2, H / 2 + 5);
    ctx.fillStyle = '#7c4dff';
    ctx.font = '16px monospace';
    ctx.fillText('High Score: ' + state.highScore, W / 2, H / 2 + 30);
    var rPulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = rPulse;
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px monospace';
    ctx.fillText('Press R to restart', W / 2, H / 2 + 60);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // === GAME LOOP ===
  function gameLoop(timestamp) {
    var dt = lastTime ? Math.min(timestamp - lastTime, 33) : 16;
    lastTime = timestamp;
    // Transition timer (level clear)
    if (state.phase === 'levelClear') {
      transitionTimer -= dt;
      // Still update particles/texts during transition
      for (var k = particles.length - 1; k >= 0; k--) {
        var p = particles[k];
        p.x += p.dx; p.y += p.dy; p.dy += (p.gravity || 0.05);
        p.life -= dt / 1000 / p.maxLife;
        if (p.life <= 0) particles.splice(k, 1);
      }
      for (var m = floatingTexts.length - 1; m >= 0; m--) {
        var ft = floatingTexts[m];
        ft.y += ft.vy; ft.life -= dt / 1000 / ft.maxLife;
        if (ft.life <= 0) floatingTexts.splice(m, 1);
      }
      if (transitionTimer <= 0) {
        if (state.level >= 5) {
          state.hardModeOffset += 1.0;
          state.level = 1;
        } else {
          state.level++;
        }
        buildLevel(state.level);
      }
    }
    if (state.phase === 'gameOver') {
      // Animate remaining particles
      for (var gk = particles.length - 1; gk >= 0; gk--) {
        var gp = particles[gk];
        gp.x += gp.dx; gp.y += gp.dy; gp.dy += 0.05;
        gp.life -= dt / 1000 / gp.maxLife;
        if (gp.life <= 0) particles.splice(gk, 1);
      }
    }
    updateGame(dt, timestamp);
    renderGame();
    renderHUD();
    if (state.phase === 'levelClear') {
      // Fade overlay during last 300ms
      if (transitionTimer < 300) {
        ctx.fillStyle = 'rgba(13,0,21,' + ((300 - transitionTimer) / 300 * 0.8) + ')';
        ctx.fillRect(0, 0, W, H);
      }
    }
    if (state.phase === 'gameOver') renderGameOver();
    animFrame = requestAnimationFrame(gameLoop);
  }

  // === INPUT SETUP ===
  var onKeyDown = function(e) {
    keysDown[e.key] = true;
    if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); launchBall(); }
    if ((e.key === 'r' || e.key === 'R') && state.phase === 'gameOver') {
      state.score = 0; state.lives = LIVES_START; state.level = 1;
      state.hardModeOffset = 0; state.combo = 0;
      paddle.width = PADDLE_W;
      state.powerUpTimers = { wide: 0, slow: 0 };
      particles = []; floatingTexts = []; powerUps = []; extraBalls = [];
      buildLevel(1);
    }
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  };
  var onKeyUp = function(e) { keysDown[e.key] = false; };
  var onMouseMove = function(e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (W / rect.width);
  };
  var onClick = function() { launchBall(); };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onClick);

  // === START ===
  buildLevel(1);
  animFrame = requestAnimationFrame(gameLoop);

  return {
    controls: '← → Move | Space Launch | R Restart',
    cleanup: function() {
      cancelAnimationFrame(animFrame);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      bricks = []; particles = []; powerUps = []; extraBalls = []; floatingTexts = [];
    }
  };
}
