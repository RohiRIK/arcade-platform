/**
 * Pong — Volt Rally (Phase 3: arcade-evolution)
 * Controls: Arrow Up/Down or W/S to move paddle (held keys). R to restart after match.
 * Mechanics: 4 rally stages, deuce at 10-10 (win by 2, cap 15), lightning arcs,
 * ambient electric hum, 7 zzfx sounds, particle effects, overcharge mode at rally 20+.
 * 600x400 canvas, all procedural rendering.
 */
function startPongVoltRally(canvas, ctx) {
  // === CONSTANTS ===
  const W = 600, H = 400;
  const WIN_SCORE = 11;
  const DEUCE_CAP = 15;
  const BALL_BASE_SPEED = 4;
  const BALL_STAGE_SPEEDS = [4, 5.5, 7, 8];
  const BALL_BASE_RADIUS = 8;
  const BALL_OVERCHARGE_RADIUS = 12;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const PADDLE_SPEED = 5;
  const PADDLE_X_PLAYER = 10;
  const PADDLE_X_CPU = W - 20;
  const CPU_BASE_DELAY = 60;
  const CPU_DELAY_REDUCTION = 5;
  const CPU_MIN_DELAY = 20;
  const CPU_SPEED_FACTOR = 0.85;
  const PARTICLE_CAP = 150;
  const STAGE_THRESHOLDS = [0, 5, 10, 20];
  const RALLY_BONUS = [1, 1, 3, 5];
  const TRAIL_LENGTHS = [3, 4, 6, 8];
  const BG_COLOR = '#050510';
  const PLAYER_COLOR = '#60a5fa';
  const CPU_COLOR = '#e94560';
  const BALL_COLOR = '#ffffff';

  // === SOUND EFFECTS ===
  const SFX = {
    paddle_hit:       () => { try { zzfx(...[.3,undefined,200,.01,.01,.05,1,2,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.5,.01]); } catch(e){} },
    wall_bounce:      () => { try { zzfx(...[.2,undefined,300,.01,.01,.03,1,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.3,.01]); } catch(e){} },
    score:            () => { try { zzfx(...[.5,undefined,150,.02,.1,.1,2,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.1,.5,.02]); } catch(e){} },
    rally_charge:     () => { try { zzfx(...[.3,undefined,200,.01,.15,undefined,1,2,undefined,undefined,800,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.1]); } catch(e){} },
    rally_overcharge: () => { try { zzfx(...[.5,undefined,130,.02,.2,.1,3,2,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.2,.5,.05]); } catch(e){} },
    win_fanfare:      () => { try { zzfx(...[.6,undefined,400,.02,.3,.2,1,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,.8,.1]); } catch(e){} },
  };

  // === STATE ===
  let player = { y: H / 2 - PADDLE_HEIGHT / 2, score: 0 };
  let cpu = { y: H / 2 - PADDLE_HEIGHT / 2, score: 0, lastUpdate: 0, targetY: H / 2 };
  let ball = { x: W / 2, y: H / 2, vx: BALL_BASE_SPEED, vy: 3, radius: BALL_BASE_RADIUS, trail: [] };
  let rallyCount = 0;
  let particles = [];
  let lightningArcs = [];
  let floatingTexts = [];
  let matchOver = false;
  let winner = null;
  let lateGame = false;
  let deuce = false;
  let keysDown = {};
  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;
  let animFrameId = null;
  let lastTime = 0;
  let lastLightningTime = 0;
  let victoryFlashCount = 0;
  let victoryFlashTimer = 0;
  let pendingTimeouts = [];

  // === HELPER FUNCTIONS ===

  function getCurrentStage() {
    if (lateGame) {
      if (rallyCount >= 20) return 3;
      if (rallyCount >= 7) return 2;
      if (rallyCount >= 3) return 1;
      return 0;
    }
    if (rallyCount >= 20) return 3;
    if (rallyCount >= 10) return 2;
    if (rallyCount >= 5) return 1;
    return 0;
  }

  function getCurrentBallSpeed() {
    const stage = getCurrentStage();
    if (lateGame && stage === 0) return 5;
    return BALL_STAGE_SPEEDS[stage];
  }

  function spawnParticles(x, y, count, color, spread) {
    spread = spread || 3;
    for (let i = 0; i < count; i++) {
      if (particles.length >= PARTICLE_CAP) break;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * spread * 2,
        vy: (Math.random() - 0.5) * spread * 2,
        life: 500 + Math.random() * 300,
        maxLife: 800,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  function spawnLightningArc() {
    const stage = getCurrentStage();
    const colors = ['#4488ff', '#6699ff', '#88aaff', '#ffffff'];
    const segments = 3 + Math.floor(Math.random() * 3);
    const pts = [];
    const startSide = Math.random() < 0.5;
    const x1 = startSide ? 0 : W;
    const y1 = Math.random() * H;
    const x2 = startSide ? W : 0;
    const y2 = Math.random() * H;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      pts.push({
        x: x1 + (x2 - x1) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 80 : 0),
        y: y1 + (y2 - y1) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 60 : 0)
      });
    }
    lightningArcs.push({
      points: pts,
      life: 150,
      maxLife: 150,
      color: colors[Math.min(stage, colors.length - 1)]
    });
  }

  function onScore(scorer) {
    const stage = getCurrentStage();
    const bonus = RALLY_BONUS[stage];

    if (scorer === 'player') {
      player.score += bonus;
      if (bonus > 1) {
        floatingTexts.push({ text: '+' + bonus, x: W / 4, y: H / 2, vy: -1, life: 1000, maxLife: 1000, color: PLAYER_COLOR, size: 20 });
      }
      spawnParticles(ball.x, ball.y, 16, PLAYER_COLOR, 4);
    } else {
      cpu.score += bonus;
      if (bonus > 1) {
        floatingTexts.push({ text: '+' + bonus, x: 3 * W / 4, y: H / 2, vy: -1, life: 1000, maxLife: 1000, color: CPU_COLOR, size: 20 });
      }
      spawnParticles(ball.x, ball.y, 16, CPU_COLOR, 4);
    }

    SFX.score();
    rallyCount = 0;

    // Reset ball — serve toward the side that was scored on
    ball.x = W / 2;
    ball.y = H / 2;
    ball.trail = [];
    const serveDir = scorer === 'player' ? 1 : -1; // serve toward CPU if player scored
    lateGame = player.score >= 8 && cpu.score >= 8;
    const startSpeed = lateGame ? 5 : BALL_BASE_SPEED;
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    ball.vx = Math.cos(angle) * startSpeed * serveDir;
    ball.vy = Math.sin(angle) * startSpeed;
    ball.radius = BALL_BASE_RADIUS;

    deuce = player.score >= 10 && cpu.score >= 10 && player.score === cpu.score;

    // Check match end
    const scorerScore = scorer === 'player' ? player.score : cpu.score;
    const otherScore = scorer === 'player' ? cpu.score : player.score;
    if (scorerScore >= WIN_SCORE) {
      if (scorerScore >= DEUCE_CAP) {
        endMatch(scorer);
      } else if (scorerScore - otherScore >= 2) {
        endMatch(scorer);
      } else if (otherScore < 10) {
        endMatch(scorer);
      }
      // else deuce continues
    }

    // Save high score (winning margin)
    try {
      const margin = Math.abs(player.score - cpu.score);
      const prev = parseInt(localStorage.getItem('arcade_pong_highscore') || '0', 10);
      if (margin > prev) localStorage.setItem('arcade_pong_highscore', String(margin));
    } catch (e) { /* storage unavailable */ }
  }

  function endMatch(who) {
    matchOver = true;
    winner = who;
    SFX.win_fanfare();
    const wx = winner === 'player' ? PADDLE_X_PLAYER + PADDLE_WIDTH / 2 : PADDLE_X_CPU + PADDLE_WIDTH / 2;
    spawnParticles(wx, H / 2, 30, winner === 'player' ? PLAYER_COLOR : CPU_COLOR, 6);
    victoryFlashCount = 0;
    victoryFlashTimer = 0;
    if (deuce) {
      floatingTexts.push({ text: 'CLUTCH', x: W / 2, y: H / 2 - 40, vy: -0.5, life: 2000, maxLife: 2000, color: '#ffea00', size: 24 });
    }
  }

  // === 8 NAMED FUNCTIONS ===

  // 1. startPongVoltRally (this outer function)

  // 2. updateBall
  function updateBall(dt) {
    if (matchOver) return;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounce
    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
      SFX.wall_bounce();
    }
    if (ball.y + ball.radius >= H) {
      ball.y = H - ball.radius;
      ball.vy = -Math.abs(ball.vy);
      SFX.wall_bounce();
    }

    // Trail
    const stage = getCurrentStage();
    const maxTrail = TRAIL_LENGTHS[stage];
    ball.trail.push({ x: ball.x, y: ball.y });
    while (ball.trail.length > maxTrail) ball.trail.shift();

    // Overcharge radius
    ball.radius = stage >= 3 ? BALL_OVERCHARGE_RADIUS : BALL_BASE_RADIUS;

    // Score detection
    if (ball.x < 0) onScore('cpu');
    if (ball.x > W) onScore('player');
  }

  // 3. updatePaddles
  function updatePaddles(dt, now) {
    if (matchOver) return;

    // Player — held key smooth movement
    if (keysDown['ArrowUp'] || keysDown['w'] || keysDown['W']) {
      player.y -= PADDLE_SPEED;
    }
    if (keysDown['ArrowDown'] || keysDown['s'] || keysDown['S']) {
      player.y += PADDLE_SPEED;
    }
    player.y = Math.max(0, Math.min(H - PADDLE_HEIGHT, player.y));

    // CPU AI
    const delay = Math.max(CPU_MIN_DELAY, CPU_BASE_DELAY - cpu.score * CPU_DELAY_REDUCTION);
    if (now - cpu.lastUpdate > delay) {
      cpu.targetY = ball.y - PADDLE_HEIGHT / 2;
      cpu.lastUpdate = now;
    }
    const cpuSpeed = getCurrentBallSpeed() * CPU_SPEED_FACTOR;
    const diff = cpu.targetY - cpu.y;
    if (Math.abs(diff) > 1) {
      cpu.y += Math.sign(diff) * Math.min(Math.abs(diff), cpuSpeed);
    }
    cpu.y = Math.max(0, Math.min(H - PADDLE_HEIGHT, cpu.y));
  }

  // 4. checkCollisions
  function checkCollisions() {
    if (matchOver) return;
    const speed = getCurrentBallSpeed();

    // Player paddle collision
    if (ball.x - ball.radius <= PADDLE_X_PLAYER + PADDLE_WIDTH && ball.x > PADDLE_X_PLAYER &&
        ball.y >= player.y && ball.y <= player.y + PADDLE_HEIGHT) {
      const offset = Math.max(-1, Math.min(1, (ball.y - (player.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2)));
      const angle = offset * (Math.PI / 3);
      ball.vx = Math.cos(angle) * speed;
      ball.vy = Math.sin(angle) * speed;
      ball.x = PADDLE_X_PLAYER + PADDLE_WIDTH + ball.radius;
      rallyCount++;
      SFX.paddle_hit();
      spawnParticles(ball.x, ball.y, 8, PLAYER_COLOR, 3);
      checkStageTransition();
    }

    // CPU paddle collision
    if (ball.x + ball.radius >= PADDLE_X_CPU && ball.x < PADDLE_X_CPU + PADDLE_WIDTH &&
        ball.y >= cpu.y && ball.y <= cpu.y + PADDLE_HEIGHT) {
      const offset = Math.max(-1, Math.min(1, (ball.y - (cpu.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2)));
      const angle = offset * (Math.PI / 3);
      ball.vx = -Math.cos(angle) * speed;
      ball.vy = Math.sin(angle) * speed;
      ball.x = PADDLE_X_CPU - ball.radius;
      rallyCount++;
      SFX.paddle_hit();
      spawnParticles(ball.x, ball.y, 8, CPU_COLOR, 3);
      checkStageTransition();
    }
  }

  function checkStageTransition() {
    if (rallyCount === 5) SFX.rally_charge();
    if (rallyCount === 10) SFX.rally_charge();
    if (rallyCount === 20) SFX.rally_overcharge();
  }

  // 5. updateParticles
  function updateParticles(dt, now) {
    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Lightning arcs
    for (let i = lightningArcs.length - 1; i >= 0; i--) {
      lightningArcs[i].life -= dt;
      if (lightningArcs[i].life <= 0) lightningArcs.splice(i, 1);
    }

    // Floating texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= dt;
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    // Spawn lightning arcs based on stage
    const stage = getCurrentStage();
    if (!matchOver) {
      let interval = Infinity;
      if (stage >= 3) interval = 300;
      else if (stage >= 2) interval = lateGame && rallyCount >= 7 ? 350 : 500;

      if (now - lastLightningTime > interval) {
        spawnLightningArc();
        lastLightningTime = now;
      }
    }
  }

  // 6. updateAudio
  function updateAudio() {
    if (!audioCtx || !oscillator || !gainNode) return;
    let targetGain = 0.05;
    let targetFreq = 55;

    if (player.score >= 4 || cpu.score >= 4) { targetGain = 0.08; }
    if (lateGame) { targetGain = 0.10; targetFreq = 105; }
    if (deuce) { targetGain = 0.15; targetFreq = 105; }

    // Match point — silence for tension
    const pMatchPoint = player.score >= WIN_SCORE - 1 && player.score > cpu.score;
    const cMatchPoint = cpu.score >= WIN_SCORE - 1 && cpu.score > player.score;
    if (pMatchPoint || cMatchPoint) { targetGain = 0; }
    if (matchOver) { targetGain = 0; }

    const t = audioCtx.currentTime + 0.1;
    oscillator.frequency.linearRampToValueAtTime(targetFreq, t);
    gainNode.gain.linearRampToValueAtTime(targetGain, t);
  }

  // 7. renderGame
  function renderGame(now) {
    const stage = getCurrentStage();

    // 1. Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // 2. Court border
    let borderColor = '#1a1a3a';
    let borderWidth = 1;
    if (stage === 1) borderColor = '#2a2a4a';
    else if (stage === 2) borderColor = '#3a3a6a';
    else if (stage >= 3) {
      const pulse = Math.sin(now / 400) * 0.3 + 0.7;
      const v = Math.floor(58 + pulse * 100);
      borderColor = `rgb(${v},${v},${Math.min(255, v + 80)})`;
    }
    if (lateGame && !deuce) borderColor = '#2a2a5a';
    if (deuce) {
      const pulse = Math.sin(now / 250) * 0.5 + 0.5;
      const r = Math.floor(255 * pulse);
      borderColor = `rgb(${r},23,68)`;
      borderWidth = 2;
    }
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // 3. Center line
    const lineOpacity = [0.2, 0.3, 0.5, 0.5][stage];
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Lightning arcs
    for (const arc of lightningArcs) {
      const alpha = arc.life / arc.maxLife;
      ctx.save();
      ctx.strokeStyle = arc.color;
      ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = arc.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let i = 0; i < arc.points.length; i++) {
        if (i === 0) ctx.moveTo(arc.points[i].x, arc.points[i].y);
        else ctx.lineTo(arc.points[i].x, arc.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 5. Ball trail
    for (let i = 0; i < ball.trail.length; i++) {
      const t = ball.trail[i];
      const alpha = (i + 1) / (ball.trail.length + 1) * 0.4;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, ball.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Ball
    ctx.save();
    ctx.shadowColor = BALL_COLOR;
    ctx.shadowBlur = 6 + stage * 4;
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Paddles
    const playerGlow = 4 + stage * 3;
    const cpuGlow = 4 + stage * 3;
    ctx.save();
    ctx.shadowColor = PLAYER_COLOR;
    ctx.shadowBlur = playerGlow;
    ctx.fillStyle = PLAYER_COLOR;
    const pVibX = stage >= 3 ? (Math.random() - 0.5) * 2 : 0;
    ctx.fillRect(PADDLE_X_PLAYER + pVibX, player.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.restore();

    ctx.save();
    ctx.shadowColor = CPU_COLOR;
    ctx.shadowBlur = cpuGlow;
    ctx.fillStyle = CPU_COLOR;
    const cVibX = stage >= 3 ? (Math.random() - 0.5) * 2 : 0;
    ctx.fillRect(PADDLE_X_CPU + cVibX, cpu.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.restore();

    // 8. Score
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(player.score + ' : ' + cpu.score, W / 2, 30);
    ctx.textAlign = 'left';

    // 9. Rally counter
    if (rallyCount >= 5) {
      const pulse = 0.9 + Math.sin(now / 300) * 0.1;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = Math.floor(14 * pulse) + 'px monospace';
      ctx.fillStyle = '#ffab00';
      let rallyText = '\u26A1 RALLY: ' + rallyCount + ' \u26A1';
      const bonus = RALLY_BONUS[stage];
      if (bonus > 1) rallyText += ' [' + bonus + '\u00D7]';
      ctx.fillText(rallyText, W / 2, H - 20);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // 10. Floating texts
    for (const ft of floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold ' + ft.size + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // 11. Particles
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();
    }

    // 12. Deuce indicator
    if (deuce && !matchOver) {
      const flicker = Math.sin(now / 100) > 0 ? 1 : 0.5;
      ctx.save();
      ctx.globalAlpha = flicker;
      ctx.fillStyle = '#ff1744';
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DEUCE', W / 2, 55);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // 13. Match over screen
    if (matchOver) {
      // Victory flash on winner's paddle
      victoryFlashTimer += 16.67;
      if (victoryFlashTimer > 150 && victoryFlashCount < 6) {
        victoryFlashCount++;
        victoryFlashTimer = 0;
      }
      if (victoryFlashCount < 6 && victoryFlashCount % 2 === 0) {
        const wx = winner === 'player' ? PADDLE_X_PLAYER : PADDLE_X_CPU;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(wx, winner === 'player' ? player.y : cpu.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      }

      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, H / 2 - 60, W, 120);
      ctx.fillStyle = winner === 'player' ? PLAYER_COLOR : CPU_COLOR;
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(winner === 'player' ? 'YOU WIN!' : 'CPU WINS', W / 2, H / 2 - 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(player.score + ' - ' + cpu.score, W / 2, H / 2 + 15);
      ctx.fillStyle = '#888888';
      ctx.font = '14px monospace';
      ctx.fillText('Press R to play again', W / 2, H / 2 + 45);
      ctx.textAlign = 'left';
      ctx.restore();
    }
  }

  // 8. cleanup
  function cleanup() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (audioCtx) {
      try {
        if (oscillator) oscillator.stop();
        audioCtx.close();
      } catch (e) { /* ignore */ }
    }
    for (const t of pendingTimeouts) clearTimeout(t);
    pendingTimeouts = [];
  }

  // === INPUT ===
  function onKeyDown(e) {
    keysDown[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(e.key)) e.preventDefault();
    if ((e.key === 'r' || e.key === 'R') && matchOver) {
      restartMatch();
    }
    // Touch control support
    if (e.key === 'up') keysDown['ArrowUp'] = true;
    if (e.key === 'down') keysDown['ArrowDown'] = true;
  }

  function onKeyUp(e) {
    keysDown[e.key] = false;
    if (e.key === 'up') keysDown['ArrowUp'] = false;
    if (e.key === 'down') keysDown['ArrowDown'] = false;
  }

  function restartMatch() {
    player.y = H / 2 - PADDLE_HEIGHT / 2;
    player.score = 0;
    cpu.y = H / 2 - PADDLE_HEIGHT / 2;
    cpu.score = 0;
    cpu.lastUpdate = 0;
    cpu.targetY = H / 2;
    ball.x = W / 2;
    ball.y = H / 2;
    ball.vx = BALL_BASE_SPEED;
    ball.vy = 3;
    ball.radius = BALL_BASE_RADIUS;
    ball.trail = [];
    rallyCount = 0;
    particles = [];
    lightningArcs = [];
    floatingTexts = [];
    matchOver = false;
    winner = null;
    lateGame = false;
    deuce = false;
    victoryFlashCount = 0;
    victoryFlashTimer = 0;
  }

  // === AUDIO SETUP ===
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(55, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
  } catch (e) {
    audioCtx = null;
    oscillator = null;
    gainNode = null;
  }

  // === EVENT LISTENERS ===
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // === GAME LOOP ===
  const FIXED_DT = 16.67;
  let accumulator = 0;

  function gameLoop(timestamp) {
    animFrameId = requestAnimationFrame(gameLoop);
    if (!lastTime) { lastTime = timestamp; return; }
    const elapsed = Math.min(timestamp - lastTime, 100);
    lastTime = timestamp;
    accumulator += elapsed;

    while (accumulator >= FIXED_DT) {
      updateBall(FIXED_DT);
      updatePaddles(FIXED_DT, timestamp);
      checkCollisions();
      updateParticles(FIXED_DT, timestamp);
      updateAudio();
      accumulator -= FIXED_DT;
    }

    renderGame(timestamp);
  }

  animFrameId = requestAnimationFrame(gameLoop);

  return {
    controls: 'Arrow Up/Down or W/S to move paddle. R to restart after match.',
    cleanup
  };
}
