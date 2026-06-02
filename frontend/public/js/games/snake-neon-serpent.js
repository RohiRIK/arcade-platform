/**
 * Snake — Neon Serpent (Phase 2: arcade-evolution)
 * Controls: Arrow keys to move. R to restart. Chain combos for high scores!
 * Mechanics: 8 implicit stages, combo system, particles, zzfx audio, bonus food.
 * 600x400 canvas, all procedural rendering.
 */
function startSnake(canvas, ctx) {
  // === CONSTANTS ===
  const W = canvas.width;
  const H = canvas.height;
  const CELL = 20;
  const COLS = Math.floor(W / CELL);
  const ROWS = Math.floor(H / CELL);

  const INITIAL_SPEED = 120;
  const MIN_SPEED = 50;
  const SPEED_DECREMENT = 5;
  const SPEED_UP_EVERY = 5;

  const POINTS_PER_FOOD = 10;
  const POINTS_PER_FOOD_STAGE8 = 15;
  const BONUS_FOOD_POINTS = 50;
  const BONUS_FOOD_INTERVAL = 10;
  const BONUS_FOOD_TIMEOUT = 5000;

  const COMBO_WINDOW = 2000;
  const COMBO_TIERS = [1, 2, 3, 5, 8];

  const MAX_PARTICLES = 150;
  const AMBIENT_FREQ = 80;
  const HEARTBEAT_FREQ = 60;
  const HEARTBEAT_INTERVAL = 1000;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === DATA STRUCTURES ===
  let snake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = null;

  let score = 0;
  let highScore = Math.max(0, Math.min(999999, parseInt(localStorage.getItem('arcade_snake_highscore')) || 0));
  let zoneReached = localStorage.getItem('arcade_snake_zone_reached') === 'true';
  let foodEaten = 0;
  let running = false;
  let waitingToStart = true;
  let gameOver = false;
  let currentStage = 1;
  let previousStage = 1;
  let stageTransitionT = 1;
  let prevStageCfg = null;

  let food = { x: 0, y: 0 };
  let bonusFood = { x: 0, y: 0, active: false, spawnTime: 0 };

  let comboTier = 0;
  let lastEatTime = 0;
  let maxComboReached = 0;

  let particles = [];
  let floatingTexts = [];
  let fireflies = [];

  let lastTime = 0;
  let tickAccumulator = 0;
  let currentSpeed = INITIAL_SPEED;
  let rafId = null;

  let audioCtx = null;
  let ambientOsc = null;
  let ambientGain = null;
  let heartbeatTimeout = null;
  let audioInited = false;

  // === STAGE CONFIG ===
  const STAGES = [
    { min: 0,  bg: '#0a0a1a', grid: '#141428', gridOp: 0.3, speed: 120, flies: 0,  vignette: false, wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 5,  bg: '#0a0a1a', grid: '#1e1e3c', gridOp: 0.5, speed: 115, flies: 0,  vignette: false, wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 10, bg: '#0a0a1a', grid: '#1e1e3c', gridOp: 0.5, speed: 110, flies: 5,  vignette: false, wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 15, bg: '#0a0a1a', grid: '#1e1e3c', gridOp: 0.5, speed: 105, flies: 10, vignette: false, wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 20, bg: '#08081a', grid: '#1a1a40', gridOp: 0.4, speed: 100, flies: 10, vignette: true,  wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 25, bg: '#08081a', grid: '#1a1a40', gridOp: 0.4, speed: 95,  flies: 10, vignette: true,  wave: false, heartbeat: false, afterimage: false, foodPts: 10 },
    { min: 35, bg: '#050510', grid: '#141428', gridOp: 0.2, speed: 85,  flies: 0,  vignette: true,  wave: true,  heartbeat: true,  afterimage: false, foodPts: 10 },
    { min: 45, bg: '#030308', grid: '#000000', gridOp: 0.0, speed: 50,  flies: 0,  vignette: true,  wave: false, heartbeat: true,  afterimage: true,  foodPts: 15 },
  ];

  function getStageConfig(fe) {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (fe >= STAGES[i].min) return { ...STAGES[i], index: i + 1 };
    }
    return { ...STAGES[0], index: 1 };
  }

  // === UTILITIES ===
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function lerpColor(a, b, t) {
    const ca = hexToRgb(a), cb = hexToRgb(b);
    const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
    const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
    const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }

  function randomFreeCell() {
    const occupied = new Set(snake.map(s => s.x + ',' + s.y));
    occupied.add(food.x + ',' + food.y);
    if (bonusFood.active) occupied.add(bonusFood.x + ',' + bonusFood.y);
    let x, y, attempts = 0;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      attempts++;
    } while (occupied.has(x + ',' + y) && attempts < 300);
    return { x, y };
  }

  // === AUDIO ===
  function initAmbientAudio() {
    if (audioInited) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      ambientOsc = audioCtx.createOscillator();
      ambientGain = audioCtx.createGain();
      ambientOsc.type = 'sine';
      ambientOsc.frequency.value = AMBIENT_FREQ;
      ambientGain.gain.value = 0;
      ambientOsc.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);
      ambientOsc.start();
      audioInited = true;
    } catch (e) { /* audio not available */ }
  }

  function updateAudio() {
    if (!audioCtx || !ambientGain) return;
    const cfg = getStageConfig(foodEaten);
    const now = audioCtx.currentTime;
    if (cfg.heartbeat) {
      ambientOsc.frequency.value = HEARTBEAT_FREQ;
      // Pulse effect
      const cycle = (Date.now() % HEARTBEAT_INTERVAL) / HEARTBEAT_INTERVAL;
      const vol = cycle < 0.1 ? 0.15 : 0.02;
      ambientGain.gain.linearRampToValueAtTime(vol, now + 0.05);
    } else {
      ambientOsc.frequency.value = AMBIENT_FREQ;
      let targetGain = 0.02;
      if (cfg.index >= 2) targetGain = 0.05;
      if (cfg.index >= 3) targetGain = 0.07;
      if (cfg.index >= 5) targetGain = 0.10;
      ambientGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    }
  }

  // zzfx sound helpers
  function sfxPickup() { try { playSound([.3,,200,.01,.02,.05,1,1.5,8]); } catch(e){} }
  function sfxBonus() { try { playSound([.5,,500,.05,.15,.3,1,2]); } catch(e){} }
  function sfxDeath() { try { playSound([.8,,80,.05,.3,.4,4,.5]); } catch(e){} }
  function sfxLevelUp() { try { playSound([.4,,300,.02,.1,.15,1,1.8,,,200,.05]); } catch(e){} }
  function sfxCombo() { try { playSound([.2,,600,.01,.03,.08,1,2.5]); } catch(e){} }
  function sfxStart() { try { playSound([.1,,150,.05,.1,.2,,1.5]); } catch(e){} }
  function sfxHeartbeat() { try { playSound([.3,,60,.01,.05,.05,4,.5]); } catch(e){} }

  // === PARTICLES ===
  function spawnParticles(type, cx, cy) {
    const configs = {
      food_burst: { count: 12, size: [2, 4], life: 400, color: '#e94560', vel: 2 },
      star_burst: { count: 20, size: [2, 5], life: 600, color: '#ffea00', vel: 3 },
      death_sparks: { count: 30, size: [2, 3], life: 800, color: '#ff1744', vel: 4 },
      ring_pulse: { count: 1, size: [0, 0], life: 500, color: '#39ff14', vel: 0, ring: true },
      trail_glow: { count: 1, size: [3, 3], life: 300, color: '#39ff14', vel: 0, alpha: 0.2 },
      afterimage: { count: snake.length, size: [2, 2], life: 1500, color: '#39ff14', vel: 0, alpha: 0.15 },
    };
    const cfg = configs[type];
    if (!cfg) return;

    if (cfg.ring) {
      particles.push({ x: cx, y: cy, vx: 0, vy: 0, life: cfg.life, maxLife: cfg.life, size: 0, maxSize: 100, color: cfg.color, type: 'ring', alpha: 0.3 });
    } else if (type === 'afterimage') {
      for (let i = 0; i < snake.length; i++) {
        particles.push({ x: snake[i].x * CELL + CELL / 2, y: snake[i].y * CELL + CELL / 2, vx: 0, vy: 0, life: cfg.life, maxLife: cfg.life, size: cfg.size[0], color: cfg.color, type: 'afterimage', alpha: cfg.alpha });
      }
    } else {
      for (let i = 0; i < cfg.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.5 + 0.5) * cfg.vel;
        const sz = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: cfg.life * (0.7 + Math.random() * 0.3), maxLife: cfg.life, size: sz, color: type === 'death_sparks' && i % 3 === 0 ? '#39ff14' : cfg.color, type: type, alpha: cfg.alpha || 1 });
      }
    }
    while (particles.length > MAX_PARTICLES) particles.shift();
  }

  function updateParticles(delta) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * (delta / 16);
      p.y += p.vy * (delta / 16);
      p.life -= delta;
      if (p.type === 'ring') p.size = p.maxSize * (1 - p.life / p.maxLife);
      if (p.life <= 0) particles.splice(i, 1);
    }
    while (particles.length > MAX_PARTICLES) particles.shift();
  }

  // === FLOATING TEXTS ===
  function spawnFloatingText(text, x, y, color, fontSize) {
    floatingTexts.push({ text, x, y, startY: y, color, life: 600, maxLife: 600, fontSize: fontSize || 16 });
  }

  function updateFloatingTexts(delta) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.life -= delta;
      if (!reducedMotion) ft.y = ft.startY - 60 * (1 - ft.life / ft.maxLife);
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }
  }

  // === FIREFLIES ===
  function initFireflies(count) {
    fireflies = [];
    for (let i = 0; i < count; i++) {
      fireflies.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
    }
  }

  function updateFireflies(delta) {
    const cfg = getStageConfig(foodEaten);
    while (fireflies.length < cfg.flies) {
      fireflies.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
    }
    while (fireflies.length > cfg.flies) fireflies.pop();
    for (const f of fireflies) {
      f.x += f.vx * (delta / 16);
      f.y += f.vy * (delta / 16);
      if (f.x < 0 || f.x > W) f.vx *= -1;
      if (f.y < 0 || f.y > H) f.vy *= -1;
    }
  }

  // === COMBO ===
  function updateCombo() {
    if (lastEatTime > 0 && performance.now() - lastEatTime > COMBO_WINDOW) {
      comboTier = 0;
    }
  }

  // === SNAKE UPDATE ===
  function updateSnake() {
    if (gameOver) return;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = snake.some(s => s.x === head.x && s.y === head.y);

    if (hitWall || hitSelf) {
      gameOver = true;
      running = false;
      sfxDeath();
      spawnParticles('death_sparks', snake[0].x * CELL + CELL / 2, snake[0].y * CELL + CELL / 2);
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('arcade_snake_highscore', highScore);
      }
      if (currentStage >= 8 && !zoneReached) {
        zoneReached = true;
        localStorage.setItem('arcade_snake_zone_reached', 'true');
      }
      return;
    }

    snake.unshift(head);
    // Trail glow particle at head
    spawnParticles('trail_glow', head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);

    if (head.x === food.x && head.y === food.y) {
      foodEaten++;
      const now = performance.now();
      const cfg = getStageConfig(foodEaten);

      // Combo
      if (now - lastEatTime <= COMBO_WINDOW && lastEatTime > 0) {
        comboTier = Math.min(comboTier + 1, COMBO_TIERS.length - 1);
        if (comboTier >= 1) sfxCombo();
        if (comboTier >= 4) {
          spawnFloatingText('MEGA COMBO', head.x * CELL, head.y * CELL - 10, '#ffea00', 22);
          spawnParticles('star_burst', head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);
        }
      } else {
        comboTier = 0;
      }
      lastEatTime = now;
      if (comboTier > maxComboReached) maxComboReached = comboTier;

      const multiplier = COMBO_TIERS[comboTier];
      const pts = cfg.foodPts * multiplier;
      score += pts;

      sfxPickup();
      spawnParticles(cfg.index >= 8 ? 'star_burst' : 'food_burst', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2);
      spawnFloatingText('+' + pts + (multiplier > 1 ? ' ×' + multiplier : ''), food.x * CELL, food.y * CELL - 5, multiplier > 1 ? '#ffea00' : '#fff', 14 + comboTier * 2);

      // Ring pulse every 5th food
      if (foodEaten % 5 === 0) {
        spawnParticles('ring_pulse', head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);
      }

      // Speed update
      currentSpeed = cfg.speed;
      if (cfg.index === 6) currentSpeed = 95 - (foodEaten - 25) * 0.5;
      if (cfg.index === 7) currentSpeed = 85 - (foodEaten - 35) * 0.5;
      currentSpeed = Math.max(MIN_SPEED, currentSpeed);

      // Stage check
      const newStage = cfg.index;
      if (newStage !== currentStage) {
        prevStageCfg = getStageConfig(foodEaten - 1);
        previousStage = currentStage;
        currentStage = newStage;
        stageTransitionT = 0;
        sfxLevelUp();
      }

      // Bonus food
      if (foodEaten % BONUS_FOOD_INTERVAL === 0 && foodEaten > 0) {
        const pos = randomFreeCell();
        bonusFood.active = true;
        bonusFood.x = pos.x;
        bonusFood.y = pos.y;
        bonusFood.spawnTime = performance.now();
      }

      // Place new food
      const fpos = randomFreeCell();
      food.x = fpos.x;
      food.y = fpos.y;
    } else {
      snake.pop();
    }

    // Bonus food pickup
    if (bonusFood.active && head.x === bonusFood.x && head.y === bonusFood.y) {
      const bpts = BONUS_FOOD_POINTS * COMBO_TIERS[comboTier];
      score += bpts;
      sfxBonus();
      spawnParticles('star_burst', bonusFood.x * CELL + CELL / 2, bonusFood.y * CELL + CELL / 2);
      spawnFloatingText('+' + bpts + ' BONUS', bonusFood.x * CELL, bonusFood.y * CELL - 5, '#ffea00', 18);
      bonusFood.active = false;
    }

    // Bonus food timeout
    if (bonusFood.active && performance.now() - bonusFood.spawnTime > BONUS_FOOD_TIMEOUT) {
      bonusFood.active = false;
    }
  }

  // === STAGE TRANSITION ===
  function updateStageTransition(delta) {
    if (stageTransitionT < 1) {
      stageTransitionT = Math.min(1, stageTransitionT + delta / 500);
    }
  }

  // === AFTERIMAGE TIMER ===
  let lastAfterimageTime = 0;

  // === RESET ===
  function resetGame() {
    snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
    direction = { x: 1, y: 0 };
    nextDirection = null;
    score = 0;
    foodEaten = 0;
    running = false;
    waitingToStart = true;
    gameOver = false;
    currentStage = 1;
    previousStage = 1;
    stageTransitionT = 1;
    comboTier = 0;
    lastEatTime = 0;
    maxComboReached = 0;
    currentSpeed = INITIAL_SPEED;
    particles.length = 0;
    floatingTexts.length = 0;
    fireflies.length = 0;
    bonusFood.active = false;
    lastTime = 0;
    tickAccumulator = 0;
    lastAfterimageTime = 0;
    const pos = randomFreeCell();
    food.x = pos.x;
    food.y = pos.y;
    sfxStart();
    if (!rafId) { rafId = requestAnimationFrame(gameLoop); }
  }

  // === GAME LOOP ===
  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = Math.min(timestamp - lastTime, 100);
    lastTime = timestamp;

    if (running && !gameOver) {
      tickAccumulator += delta;
      while (tickAccumulator >= currentSpeed) {
        if (nextDirection) { direction = nextDirection; nextDirection = null; }
        updateSnake();
        tickAccumulator -= currentSpeed;
        if (gameOver) break;
      }
      updateParticles(delta);
      updateCombo();
      updateFloatingTexts(delta);
      updateStageTransition(delta);
      updateFireflies(delta);
      updateAudio();

      // Afterimage for stage 8
      const cfg = getStageConfig(foodEaten);
      if (cfg.afterimage && timestamp - lastAfterimageTime > 500) {
        spawnParticles('afterimage', 0, 0);
        lastAfterimageTime = timestamp;
      }
    } else if (gameOver) {
      updateParticles(delta);
      updateFloatingTexts(delta);
    }

    draw();
    rafId = requestAnimationFrame(gameLoop);
  }

  // Continued in draw/HUD/input/cleanup below...
  // === DRAWING ===
  function draw() {
    const cfg = getStageConfig(foodEaten);
    let bgColor = cfg.bg;
    let gridColor = cfg.grid;
    let gridOp = cfg.gridOp;

    if (stageTransitionT < 1 && prevStageCfg) {
      bgColor = lerpColor(prevStageCfg.bg, cfg.bg, stageTransitionT);
      gridColor = lerpColor(prevStageCfg.grid, cfg.grid, stageTransitionT);
      gridOp = prevStageCfg.gridOp + (cfg.gridOp - prevStageCfg.gridOp) * stageTransitionT;
    }

    drawBackground(bgColor, gridColor, gridOp, cfg);
    drawFirefliesRender(cfg);
    if (cfg.vignette) drawVignette();
    drawParticlesOfType('afterimage');
    drawParticlesOfType('trail_glow');
    drawSnakeBody(cfg);
    drawFood(cfg);
    if (bonusFood.active) drawBonusFood();
    drawParticlesRender();
    drawRingPulse();
    drawHUD(cfg);
    drawFloatingTextsRender();

    if (gameOver) {
      drawGameOverOverlay(ctx, {
        score: score,
        highScore: highScore,
        isNewBest: score === highScore && score > 0,
        accent: '#39ff14'
      });
    }

    if (waitingToStart) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 400);
      ctx.fillStyle = `rgba(57, 255, 20, ${pulse})`;
      ctx.font = 'bold 28px monospace';
      ctx.fillText('NEON SERPENT', W / 2, H / 2 - 40);
      ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.font = '18px monospace';
      ctx.fillText('Press any key to start', W / 2, H / 2 + 10);
      ctx.font = '13px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('Arrow keys to move', W / 2, H / 2 + 45);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }
  }

  function drawBackground(bgColor, gridColor, gridOp, cfg) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    if (gridOp > 0) {
      ctx.strokeStyle = gridColor;
      let actualOp = gridOp;
      if (cfg.index === 4) {
        actualOp = gridOp + 0.1 * Math.sin(Date.now() / 2000);
      }
      ctx.globalAlpha = actualOp;
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += CELL) {
        ctx.beginPath();
        if (cfg.wave) {
          ctx.moveTo(0, y);
          for (let x = 0; x <= W; x += 4) {
            const offset = Math.sin((x + Date.now() * 0.5) / 600 * Math.PI * 2) * 2;
            ctx.lineTo(x, y + offset);
          }
        } else {
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawVignette() {
    const grad = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function drawFirefliesRender(cfg) {
    const color = cfg.index >= 6 ? '#ff1744' : '#39ff14';
    ctx.globalAlpha = 0.08;
    for (const f of fireflies) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawSnakeBody(cfg) {
    const now = Date.now();
    for (let i = snake.length - 1; i >= 0; i--) {
      const s = snake[i];
      const px = s.x * CELL + 2;
      const py = s.y * CELL + 2;
      const sz = CELL - 4;
      const isHead = i === 0;

      // Combo flash at tier 3+
      let color = '#39ff14';
      if (cfg.index >= 6 && comboTier >= 2 && !isHead) {
        color = Math.floor(now / 200) % 2 === 0 ? '#39ff14' : '#7dff6b';
      }

      if (isHead) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#39ff14';
      } else if (cfg.index >= 4) {
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#2acc0e';
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(px, py, sz, sz, 3);
      ctx.fill();

      ctx.strokeStyle = isHead ? '#7dff6b' : '#2acc0e';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }
  }

  function drawFood(cfg) {
    const pulse = 0.85 + 0.15 * Math.sin(Date.now() / 400);
    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    const sz = (CELL / 2 - 2) * pulse;
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(cx, cy, sz, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBonusFood() {
    const cx = bonusFood.x * CELL + CELL / 2;
    const cy = bonusFood.y * CELL + CELL / 2;
    const elapsed = performance.now() - bonusFood.spawnTime;
    const remaining = (BONUS_FOOD_TIMEOUT - elapsed) / 1000;
    const rot = Date.now() / 1000 * Math.PI;

    // Shrink in last second
    let scale = 1;
    if (elapsed > BONUS_FOOD_TIMEOUT - 1000) {
      scale = (BONUS_FOOD_TIMEOUT - elapsed) / 1000;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(6, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Timer
    if (remaining > 0) {
      ctx.font = '12px monospace';
      ctx.fillStyle = '#ffea00';
      let alpha = 1 - (elapsed / BONUS_FOOD_TIMEOUT) * 0.7;
      if (remaining < 1.5 && !reducedMotion) {
        alpha = Math.floor(Date.now() / 125) % 2 === 0 ? alpha : 0.3;
      }
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.fillText(remaining.toFixed(1) + 's', cx, cy + 18);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }
  }

  function drawParticlesOfType(type) {
    for (const p of particles) {
      if (p.type !== type) continue;
      const progress = 1 - p.life / p.maxLife;
      ctx.globalAlpha = (p.alpha || 1) * (p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawParticlesRender() {
    for (const p of particles) {
      if (p.type === 'ring' || p.type === 'trail_glow' || p.type === 'afterimage') continue;
      ctx.globalAlpha = (p.alpha || 1) * (p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawRingPulse() {
    for (const p of particles) {
      if (p.type !== 'ring') continue;
      ctx.globalAlpha = (p.alpha || 0.3) * (p.life / p.maxLife);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawHUD(cfg) {
    // Score
    ctx.font = '14px monospace';
    ctx.fillStyle = '#e0e0e0';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE ' + score, 12, 20);

    // High score
    if (highScore > 0) {
      ctx.textAlign = 'left';
      if (score > highScore) {
        ctx.fillStyle = '#4ade80';
        ctx.fillText('\u2605 NEW BEST ' + score, 420, 20);
      } else {
        ctx.fillStyle = '#888';
        ctx.fillText('HI ' + highScore, 420, 20);
      }
    }

    // Combo
    if (comboTier >= 1) {
      const mult = COMBO_TIERS[comboTier];
      const colors = ['#ffea00', '#ffea00', '#f97316', '#e94560', '#e94560'];
      ctx.fillStyle = colors[Math.min(comboTier, colors.length - 1)];
      const fontSize = 14 + comboTier * 2;
      ctx.font = 'bold ' + fontSize + 'px monospace';
      ctx.textAlign = 'right';
      if (comboTier >= 4 && !reducedMotion) {
        ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 100));
      }
      ctx.fillText('\u00d7' + mult + ' COMBO', 588, 20);
      ctx.globalAlpha = 1;
    }

    // Stage
    ctx.font = '12px monospace';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'right';
    ctx.fillText('STAGE ' + currentStage, 588, H - 8);
    ctx.textAlign = 'left';
  }

  function drawFloatingTextsRender() {
    for (const ft of floatingTexts) {
      ctx.globalAlpha = ft.life / ft.maxLife;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold ' + ft.fontSize + 'px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  // === INPUT ===
  const onKey = (e) => {
    if (waitingToStart) {
      waitingToStart = false;
      running = true;
      // Accept first keypress direction if safe (>5 cells runway)
      // Fallback to RIGHT if direction would cause quick death
      const dirMap = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }
      };
      const requestedDir = dirMap[e.key];
      if (requestedDir) {
        const head = snake[0];
        let runway = 0;
        if (requestedDir.x === 1) runway = COLS - 1 - head.x;
        else if (requestedDir.x === -1) runway = head.x;
        else if (requestedDir.y === 1) runway = ROWS - 1 - head.y;
        else if (requestedDir.y === -1) runway = head.y;
        if (runway > 5) {
          direction = requestedDir;
          nextDirection = null;
        }
        // else keep default direction (RIGHT from resetGame)
      }
      if (!audioInited) initAmbientAudio();
      e.preventDefault();
      return;
    }
    if (gameOver && e.key === 'r') { resetGame(); return; }
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }
    };
    const nd = map[e.key];
    if (nd && !(nd.x === -direction.x && nd.y === -direction.y)) {
      nextDirection = nd;
      e.preventDefault();
    }
    if (!audioInited) initAmbientAudio();
  };
  document.addEventListener('keydown', onKey);

  // === INIT ===
  resetGame();

  return {
    controls: 'Arrow keys to move. R to restart. Chain combos for high scores!',
    cleanup: () => {
      cancelAnimationFrame(rafId);
      rafId = null;
      document.removeEventListener('keydown', onKey);
      if (ambientOsc) { try { ambientOsc.stop(); ambientOsc.disconnect(); } catch (e) {} }
      if (ambientGain) { try { ambientGain.disconnect(); } catch (e) {} }
      if (audioCtx) { try { audioCtx.close(); } catch (e) {} }
      if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
      particles.length = 0;
      floatingTexts.length = 0;
    }
  };
}
