/**
 * Frogger — Neon Crossing (Phase 3: arcade-evolution)
 * Controls: Arrow keys to move drone, Space for boost (L4+), R to restart.
 * Mechanics: 5 levels, rain system, cargo drone diving, fly-by bonus,
 * perfect crossing, emergency boost, storm surge, 7 zzfx sounds,
 * neon city aesthetic, procedural sprites.
 * 600x400 canvas, all procedural rendering.
 */
function startFroggerNeonCrossing(canvas, ctx) {
  // === CONSTANTS ===
  const W = 600, H = 400;
  const COLS = 14, ROWS = 13;
  const CELL_W = W / COLS;
  const CELL_H = H / ROWS;

  const BG_ROAD = '#0c0c1a';
  const BG_SKY = '#060618';
  const LANE_DIVIDER = '#1a1a30';
  const SAFE_ZONE = '#121228';
  const DRONE_COLOR = '#76ff03';
  const DRONE_GLOW = 3;
  const DRONE_SIZE = 16;
  const CAR_COLOR = '#ff1744';
  const TRUCK_COLOR = '#ff6d00';
  const BIKE_COLOR = '#e040fb';
  const HOVERBUS_COLOR = '#ffab00';
  const SKYTRAIN_COLOR = '#00e5ff';
  const ADBOARD_COLOR = '#ffd600';
  const CARGO_DRONE_COLOR = '#69f0ae';
  const HOME_SLOT_COLOR = '#1a237e';
  const HOME_FILLED_COLOR = '#76ff03';
  const RAIN_COLOR = '#4fc3f7';
  const SCORE_COLOR = '#b0bec5';

  const ROW_HOME = 0;
  const ROW_SKY_START = 1;
  const ROW_SKY_END = 5;
  const ROW_MEDIAN = 6;
  const ROW_ROAD_START = 7;
  const ROW_ROAD_END = 11;
  const ROW_START = 12;

  const HOME_SLOTS = 5;
  const HOME_SLOT_COLS = [1, 4, 7, 10, 13];
  const HOME_SLOT_WIDTH = 1.5;

  const STARTING_LIVES = 3;
  const SCORE_HOP_FORWARD = 10;
  const SCORE_HOME_BASE = 200;
  const SCORE_ALL_HOME = 1000;
  const SCORE_PERFECT = 2000;
  const SCORE_FLYBY = 25;
  const EXTRA_LIFE_SCORE = 10000;
  const PARTICLE_CAP = 150;
  const BOOST_COOLDOWN = 480;

  const LEVEL_CONFIG = [
    { speedMult: 1.0,  timer: 30, rainCount: 20, diveInterval: 240, diveDuration: 90  },
    { speedMult: 1.1,  timer: 27, rainCount: 30, diveInterval: 240, diveDuration: 90  },
    { speedMult: 1.2,  timer: 24, rainCount: 40, diveInterval: 240, diveDuration: 90  },
    { speedMult: 1.33, timer: 21, rainCount: 50, diveInterval: 180, diveDuration: 90  },
    { speedMult: 1.47, timer: 18, rainCount: 70, diveInterval: 150, diveDuration: 120 },
  ];

  const BASE_ROAD_LANES = [
    { row: 7,  type: 'car',   dir: -1, speed: 1.5, objW: 30, objH: 16, color: CAR_COLOR,   gap: 80  },
    { row: 8,  type: 'truck', dir:  1, speed: 1.2, objW: 50, objH: 16, color: TRUCK_COLOR,  gap: 120 },
    { row: 9,  type: 'bike',  dir: -1, speed: 2.0, objW: 20, objH: 12, color: BIKE_COLOR,   gap: 90  },
    { row: 10, type: 'truck', dir:  1, speed: 1.8, objW: 50, objH: 16, color: TRUCK_COLOR,  gap: 110 },
    { row: 11, type: 'car',   dir: -1, speed: 1.2, objW: 30, objH: 16, color: CAR_COLOR,   gap: 100 },
  ];

  const BASE_SKY_LANES = [
    { row: 1, type: 'skytrain',    dir:  1, speed: 1.0, objW: 80, objH: 16, color: SKYTRAIN_COLOR,    gap: 120 },
    { row: 2, type: 'cargo_drone', dir: -1, speed: 1.0, objW: 24, objH: 16, color: CARGO_DRONE_COLOR, gap: 70,  diving: true },
    { row: 3, type: 'skytrain',    dir:  1, speed: 1.2, objW: 80, objH: 16, color: SKYTRAIN_COLOR,    gap: 100 },
    { row: 4, type: 'adboard',     dir: -1, speed: 0.8, objW: 40, objH: 14, color: ADBOARD_COLOR,     gap: 60  },
    { row: 5, type: 'cargo_drone', dir:  1, speed: 1.0, objW: 24, objH: 16, color: CARGO_DRONE_COLOR, gap: 80,  diving: false },
  ];

  // === SOUNDS ===
  const SFX = {
    hop_blip:      function() { try { zzfx(.3,0,500,.01,.02,.02,1,1.5,0,0,0,0,0,0,0,0,.01); } catch(e){} },
    crash_static:  function() { try { zzfx(.5,0,600,.02,.15,.25,4,2,0,-1,0,0,0,0,0,0,.05,.5); } catch(e){} },
    splash_drop:   function() { try { zzfx(.3,0,200,.02,.1,.2,4,.5,0,0,0,0,0,0,0,0,.1,.3); } catch(e){} },
    dock_chime:    function() { try { zzfx(.4,0,660,.01,.08,.1,1,0,0,0,880,.05); } catch(e){} },
    level_clear:   function() { try { zzfx(.5,0,523,.02,.1,.12,1); setTimeout(function(){try{zzfx(.5,0,659,.02,.1,.12,1)}catch(e){}},120); setTimeout(function(){try{zzfx(.5,0,784,.02,.1,.12,1)}catch(e){}},240); setTimeout(function(){try{zzfx(.5,0,1047,.02,.15,.2,1)}catch(e){}},360); } catch(e){} },
    tick_urgent:   function() { try { zzfx(.2,0,1000,.01,.04,.06,2); } catch(e){} },
    perfect_chord: function() { try { zzfx(.4,0,131,.05,.3,.6,1); zzfx(.4,0,165,.05,.3,.6,1); zzfx(.4,0,196,.05,.3,.6,1); } catch(e){} },
  };

  // === GAME STATE ===
  let score = 0, hiScore = 0, lives = STARTING_LIVES, level = 1;
  let timeRemaining = 30;
  let gameOver = false;
  let gameState = 'playing';
  let extraLifeAwarded = false;
  let perfectCrossingPossible = true;
  let animId = null;
  let lastTime = 0;
  let frameCount = 0;

  try { hiScore = Math.max(0, Math.min(999999, parseInt(localStorage.getItem('froggerNeonCrossing_hiScore')) || 0)); } catch(e) {}

  // === DRONE ===
  let drone = { gridX: 7, gridY: ROW_START, pixelX: 7 * CELL_W, pixelY: ROW_START * CELL_H, alive: true, highestRow: ROW_START, ridingLane: null, deathsThisLevel: 0, boostCooldown: 0 };

  let homeSlots = [false, false, false, false, false];
  let frogsHome = 0;
  let roadLanes = [];
  let skyLanes = [];
  let particles = [];
  let raindrops = [];
  let textPopups = [];

  // Neon signs
  let neonSigns = [];
  for (let i = 0; i < 6; i++) neonSigns.push({ x: i < 3 ? 2 : W - 12, y: 40 + i * 60, w: 10, h: 30, hue: Math.random() * 360, flickerTimer: 0 });

  let stormSurgeActive = false, stormSurgeTimer = 0, stormWarning = false, stormWarningTimer = 0;
  let lightningTimer = 0, lightningFlash = false, lightningDuration = 0;

  // === INPUT ===
  let keys = {};
  let lastHopTime = 0;
  function onKeyDown(e) {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','r','R'].includes(e.key)) e.preventDefault();
    keys[e.key] = true;
  }
  function onKeyUp(e) { keys[e.key] = false; }
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // === HELPERS ===
  function getLevelConfig() {
    var idx = Math.min(level - 1, LEVEL_CONFIG.length - 1);
    var cfg = Object.assign({}, LEVEL_CONFIG[idx]);
    if (level > 5) cfg.speedMult = LEVEL_CONFIG[4].speedMult * Math.pow(1.05, level - 5);
    return cfg;
  }

  function initLanes() {
    var cfg = getLevelConfig();
    roadLanes = [];
    BASE_ROAD_LANES.forEach(function(l) {
      var laneConf = Object.assign({}, l);
      // Level 3+: row 10 becomes hover-bus
      if (level >= 3 && laneConf.row === 10) { laneConf.type = 'hoverbus'; laneConf.objW = 70; laneConf.color = HOVERBUS_COLOR; laneConf.speed = 1.5; }
      // Level 4+: row 9 becomes speed-bike
      if (level >= 4 && laneConf.row === 9) { laneConf.type = 'speedbike'; laneConf.speed = 3.5; laneConf.objW = 20; laneConf.color = BIKE_COLOR; }
      // Level 5+: row 11 also speed-bike, row 8 hover-bus
      if (level >= 5 && laneConf.row === 11) { laneConf.type = 'speedbike'; laneConf.speed = 3.5; laneConf.objW = 20; laneConf.color = BIKE_COLOR; }
      if (level >= 5 && laneConf.row === 8) { laneConf.type = 'hoverbus'; laneConf.objW = 70; laneConf.color = HOVERBUS_COLOR; laneConf.speed = 1.3; }
      var lane = { config: laneConf, objects: [] };
      var count = Math.ceil(W / laneConf.gap) + 1;
      for (var j = 0; j < count; j++) {
        lane.objects.push({ x: j * laneConf.gap * (laneConf.dir > 0 ? 1 : -1) + (laneConf.dir > 0 ? -laneConf.objW : W), y: laneConf.row * CELL_H + (CELL_H - laneConf.objH) / 2, w: laneConf.objW, h: laneConf.objH, color: laneConf.color });
      }
      roadLanes.push(lane);
    });
    skyLanes = [];
    BASE_SKY_LANES.forEach(function(l) {
      var laneConf = Object.assign({}, l);
      var lane = { config: laneConf, objects: [], diveTimer: 0, submerged: false };
      var count = Math.ceil(W / laneConf.gap) + 1;
      for (var j = 0; j < count; j++) {
        lane.objects.push({ x: j * laneConf.gap + (laneConf.dir > 0 ? -laneConf.objW - j * 20 : W + j * 20), y: laneConf.row * CELL_H + (CELL_H - laneConf.objH) / 2, w: laneConf.objW, h: laneConf.objH, color: laneConf.color });
      }
      skyLanes.push(lane);
    });
  }

  function initRain() {
    var cfg = getLevelConfig();
    raindrops = [];
    for (var i = 0; i < cfg.rainCount; i++) {
      raindrops.push({ x: Math.random() * W, y: Math.random() * H, speed: 6 + Math.random() * 4, opacity: 0.1 + Math.random() * 0.1 });
    }
  }

  function resetDrone() {
    drone.gridX = 7; drone.gridY = ROW_START;
    drone.pixelX = 7 * CELL_W; drone.pixelY = ROW_START * CELL_H;
    drone.alive = true; drone.highestRow = ROW_START; drone.ridingLane = null;
    var cfg = getLevelConfig();
    timeRemaining = cfg.timer;
  }

  function spawnParticle(x, y, color, count, spread, gravity) {
    for (var i = 0; i < count; i++) {
      if (particles.length >= PARTICLE_CAP) break;
      particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * spread, vy: (Math.random() - 0.5) * spread - 1, life: 1, maxLife: 40 + Math.random() * 20, color: color, size: 2 + Math.random() * 3, gravity: gravity || 0.05 });
    }
  }

  function addTextPopup(x, y, text, color) {
    textPopups.push({ x: x, y: y, text: text, life: 60, maxLife: 60, color: color || '#fff' });
  }

  function getHomeSlot(gx) {
    for (var i = 0; i < HOME_SLOT_COLS.length; i++) {
      if (Math.abs(gx - HOME_SLOT_COLS[i]) <= HOME_SLOT_WIDTH / 2) return i;
    }
    return -1;
  }

  function killDrone(type) {
    if (!drone.alive) return;
    drone.alive = false;
    drone.deathsThisLevel++;
    perfectCrossingPossible = false;
    var px = drone.gridX * CELL_W + CELL_W / 2;
    var py = drone.gridY * CELL_H + CELL_H / 2;
    if (type === 'crash') {
      SFX.crash_static();
      spawnParticle(px, py, '#fff', 6, 4, 0.08);
      spawnParticle(px, py, CAR_COLOR, 4, 3, 0.08);
    } else {
      SFX.splash_drop();
      spawnParticle(px, py, RAIN_COLOR, 8, 3, 0.1);
    }
    gameState = 'dying';
    setTimeout(function() {
      lives--;
      if (lives <= 0) {
        gameState = 'gameOver';
        gameOver = true;
        if (score > hiScore) { hiScore = score; try { localStorage.setItem('froggerNeonCrossing_hiScore', hiScore); } catch(e) {} }
      } else {
        resetDrone();
        gameState = 'playing';
      }
    }, 500);
  }

  function advanceLevel() {
    level++;
    frogsHome = 0;
    homeSlots = [false, false, false, false, false];
    perfectCrossingPossible = true;
    drone.deathsThisLevel = 0;
    SFX.level_clear();
    initLanes();
    initRain();
    resetDrone();
    stormSurgeActive = false; stormSurgeTimer = 0;
  }

  // === MAIN GAME LOOP ===
  function gameLoop(ts) {
    animId = requestAnimationFrame(gameLoop);
    if (!lastTime) { lastTime = ts; return; }
    var dtMs = Math.min(ts - lastTime, 33);
    lastTime = ts;
    var dt = dtMs / 16.667; // normalize to 60fps
    frameCount++;

    // === GAME OVER ===
    if (gameState === 'gameOver') {
      render();
      if (keys['r'] || keys['R']) restartGame();
      keys['r'] = false; keys['R'] = false;
      return;
    }
    if (gameState === 'dying') { updateParticles(dt); updateRain(dt); render(); return; }

    // === INPUT ===
    var now = performance.now();
    if (now - lastHopTime > 100) {
      if (keys['ArrowUp'] && drone.gridY > ROW_HOME) { drone.gridY--; SFX.hop_blip(); lastHopTime = now; keys['ArrowUp'] = false; }
      else if (keys['ArrowDown'] && drone.gridY < ROW_START) { drone.gridY++; SFX.hop_blip(); lastHopTime = now; keys['ArrowDown'] = false; }
      else if (keys['ArrowLeft'] && drone.gridX > 0) { drone.gridX--; SFX.hop_blip(); lastHopTime = now; keys['ArrowLeft'] = false; }
      else if (keys['ArrowRight'] && drone.gridX < COLS - 1) { drone.gridX++; SFX.hop_blip(); lastHopTime = now; keys['ArrowRight'] = false; }
    }
    // Emergency boost (level 4+)
    if (level >= 4 && (keys[' ']) && drone.boostCooldown <= 0 && drone.gridY > ROW_HOME + 1) {
      drone.gridY = Math.max(ROW_HOME, drone.gridY - 2);
      drone.boostCooldown = BOOST_COOLDOWN;
      spawnParticle(drone.gridX * CELL_W + CELL_W/2, drone.gridY * CELL_H + CELL_H, DRONE_COLOR, 4, 2, 0.02);
      keys[' '] = false;
    }
    if (drone.boostCooldown > 0) drone.boostCooldown -= dt;

    // Forward-hop scoring
    if (drone.gridY < drone.highestRow) {
      score += SCORE_HOP_FORWARD;
      drone.highestRow = drone.gridY;
    }
    drone.pixelX = drone.gridX * CELL_W;
    drone.pixelY = drone.gridY * CELL_H;

    // === MOVE LANE OBJECTS ===
    var cfg = getLevelConfig();
    var surgeMult = stormSurgeActive ? 1.5 : 1.0;
    roadLanes.forEach(function(lane) {
      lane.objects.forEach(function(obj) {
        obj.x += lane.config.dir * lane.config.speed * cfg.speedMult * surgeMult * dt;
        if (lane.config.dir > 0 && obj.x > W + 10) obj.x = -obj.w - 10;
        if (lane.config.dir < 0 && obj.x < -obj.w - 10) obj.x = W + 10;
      });
    });
    skyLanes.forEach(function(lane) {
      lane.objects.forEach(function(obj) {
        obj.x += lane.config.dir * lane.config.speed * cfg.speedMult * dt;
        if (lane.config.dir > 0 && obj.x > W + 10) obj.x = -obj.w - 10;
        if (lane.config.dir < 0 && obj.x < -obj.w - 10) obj.x = W + 10;
      });
      // Cargo drone diving
      if (lane.config.diving) {
        lane.diveTimer += dt;
        if (lane.diveTimer >= cfg.diveInterval && !lane.submerged) lane.submerged = true;
        if (lane.diveTimer >= cfg.diveInterval + cfg.diveDuration) { lane.submerged = false; lane.diveTimer = 0; }
      }
    });

    // === SKY RIDING ===
    if (drone.gridY >= ROW_SKY_START && drone.gridY <= ROW_SKY_END) {
      var onPlatform = false;
      var dx = drone.gridX * CELL_W, dy = drone.gridY * CELL_H;
      for (var si = 0; si < skyLanes.length; si++) {
        var sl = skyLanes[si];
        if (sl.config.row !== drone.gridY) continue;
        for (var oi = 0; oi < sl.objects.length; oi++) {
          var o = sl.objects[oi];
          if (dx + CELL_W > o.x && dx < o.x + o.w) {
            if (sl.submerged) { killDrone('splash'); return; }
            onPlatform = true;
            drone.pixelX += sl.config.dir * sl.config.speed * cfg.speedMult * dt;
            drone.gridX = Math.round(drone.pixelX / CELL_W);
            if (drone.gridX < 0 || drone.gridX >= COLS) { killDrone('splash'); return; }
            break;
          }
        }
        if (onPlatform) break;
      }
      if (!onPlatform) { killDrone('splash'); return; }
    }

    // === ROAD COLLISION ===
    if (drone.gridY >= ROW_ROAD_START && drone.gridY <= ROW_ROAD_END) {
      var dpx = drone.gridX * CELL_W, dpy = drone.gridY * CELL_H;
      for (var ri = 0; ri < roadLanes.length; ri++) {
        var rl = roadLanes[ri];
        if (rl.config.row !== drone.gridY) continue;
        for (var rj = 0; rj < rl.objects.length; rj++) {
          var rv = rl.objects[rj];
          if (dpx + CELL_W - 4 > rv.x && dpx + 4 < rv.x + rv.w) { killDrone('crash'); return; }
          // Fly-by bonus (level 3+)
          if (level >= 3) {
            var dist = Math.min(Math.abs(dpx - (rv.x + rv.w)), Math.abs(dpx + CELL_W - rv.x));
            if (dist < 6 && dist > 0) { score += SCORE_FLYBY; addTextPopup(dpx, dpy - 10, 'CLOSE!', BIKE_COLOR); }
          }
        }
      }
    }

    // === HOME SLOT CHECK ===
    if (drone.gridY === ROW_HOME) {
      var slotIdx = getHomeSlot(drone.gridX);
      if (slotIdx >= 0 && !homeSlots[slotIdx]) {
        homeSlots[slotIdx] = true;
        frogsHome++;
        score += SCORE_HOME_BASE * level;
        score += Math.floor(timeRemaining) * 10;
        SFX.dock_chime();
        spawnParticle(HOME_SLOT_COLS[slotIdx] * CELL_W + CELL_W/2, CELL_H/2, DRONE_COLOR, 6, 3, 0.05);
        if (frogsHome >= 5) {
          if (perfectCrossingPossible && drone.deathsThisLevel === 0) { score += SCORE_PERFECT; SFX.perfect_chord(); addTextPopup(W/2, H/2, '+PERFECT 2000', '#ffd600'); }
          score += SCORE_ALL_HOME;
          advanceLevel();
        } else {
          resetDrone();
        }
      } else {
        killDrone('crash');
        return;
      }
    }

    // === TIMER ===
    timeRemaining -= dtMs / 1000;
    if (timeRemaining <= 0) { killDrone('crash'); return; }
    if (timeRemaining <= cfg.timer * 0.25 && frameCount % 30 === 0) SFX.tick_urgent();

    // Extra life
    if (score >= EXTRA_LIFE_SCORE && !extraLifeAwarded) { lives++; extraLifeAwarded = true; }

    // Storm surge (level 5+)
    if (level >= 5) {
      stormSurgeTimer += dt;
      if (!stormSurgeActive && !stormWarning && stormSurgeTimer >= 600 - 30) { stormWarning = true; stormWarningTimer = 30; }
      if (stormWarning) { stormWarningTimer -= dt; if (stormWarningTimer <= 0) { stormWarning = false; stormSurgeActive = true; stormSurgeTimer = 0; } }
      if (stormSurgeActive && stormSurgeTimer >= 120) { stormSurgeActive = false; stormSurgeTimer = 0; }
    }

    // Lightning (level 3+)
    if (level >= 3) {
      lightningTimer += dt;
      if (lightningTimer > 900 + Math.random() * 300) { lightningFlash = true; lightningDuration = 5; lightningTimer = 0; }
      if (lightningFlash) { lightningDuration -= dt; if (lightningDuration <= 0) lightningFlash = false; }
    }

    updateParticles(dt);
    updateRain(dt);
    render();
  }

  function updateParticles(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.gravity * dt;
      p.life -= dt / p.maxLife;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (var t = textPopups.length - 1; t >= 0; t--) {
      textPopups[t].life -= dt;
      textPopups[t].y -= 0.5 * dt;
      if (textPopups[t].life <= 0) textPopups.splice(t, 1);
    }
  }

  function updateRain(dt) {
    raindrops.forEach(function(r) {
      r.y += r.speed * dt;
      if (r.y > H) { r.y = -5; r.x = Math.random() * W; }
    });
  }

  // === RENDER ===
  function render() {
    // Background
    ctx.fillStyle = lightningFlash ? LANE_DIVIDER : BG_ROAD;
    ctx.fillRect(0, ROW_ROAD_START * CELL_H, W, (ROW_ROAD_END - ROW_ROAD_START + 1) * CELL_H);
    ctx.fillStyle = lightningFlash ? '#121230' : BG_SKY;
    ctx.fillRect(0, 0, W, ROW_ROAD_START * CELL_H);

    // Safe zones
    ctx.fillStyle = SAFE_ZONE;
    ctx.fillRect(0, ROW_START * CELL_H, W, CELL_H);
    ctx.fillRect(0, ROW_MEDIAN * CELL_H, W, CELL_H);

    // Lane dividers
    ctx.strokeStyle = LANE_DIVIDER; ctx.lineWidth = 1; ctx.setLineDash([6, 8]);
    for (var r = ROW_ROAD_START; r <= ROW_ROAD_END; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * CELL_H); ctx.lineTo(W, r * CELL_H); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Neon signs
    var neonOpacity = level >= 5 ? 0.3 : 0.1;
    neonSigns.forEach(function(ns) {
      if (level >= 4 && Math.random() < 0.01) return; // flicker
      ns.hue = level >= 3 ? (ns.hue + 0.5) % 360 : ns.hue;
      ctx.globalAlpha = gameState === 'gameOver' ? 0.05 : neonOpacity;
      ctx.fillStyle = 'hsl(' + ns.hue + ',100%,60%)';
      ctx.fillRect(ns.x, ns.y, ns.w, ns.h);
      ctx.globalAlpha = 1;
    });

    // Home slots
    for (var hi = 0; hi < HOME_SLOTS; hi++) {
      var hx = HOME_SLOT_COLS[hi] * CELL_W - CELL_W * 0.25;
      ctx.fillStyle = homeSlots[hi] ? HOME_FILLED_COLOR : HOME_SLOT_COLOR;
      ctx.globalAlpha = homeSlots[hi] ? 0.8 : 0.4;
      ctx.fillRect(hx, 2, CELL_W * 1.5, CELL_H - 4);
      ctx.globalAlpha = 1;
    }

    // Road vehicles
    roadLanes.forEach(function(lane) {
      lane.objects.forEach(function(obj) {
        ctx.fillStyle = obj.color;
        roundRect(ctx, obj.x, obj.y, obj.w, obj.h, 3);
        // Neon trim
        ctx.fillStyle = obj.color; ctx.globalAlpha = 0.6;
        ctx.fillRect(obj.x, obj.y, obj.w, 1);
        ctx.globalAlpha = 1;
        // Headlights
        var hx2 = lane.config.dir > 0 ? obj.x + obj.w - 3 : obj.x + 1;
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.8;
        ctx.fillRect(hx2, obj.y + 3, 2, 2);
        ctx.fillRect(hx2, obj.y + obj.h - 5, 2, 2);
        ctx.globalAlpha = 1;
        // Level 2+ reflections
        if (level >= 2) {
          ctx.globalAlpha = 0.06;
          ctx.fillStyle = obj.color;
          ctx.fillRect(obj.x, obj.y + obj.h + 2, obj.w, obj.h / 2);
          ctx.globalAlpha = 1;
        }
      });
      // Storm warning flash
      if (stormWarning && frameCount % 10 < 5) {
        ctx.fillStyle = CAR_COLOR; ctx.globalAlpha = 0.03;
        ctx.fillRect(0, lane.config.row * CELL_H, W, CELL_H);
        ctx.globalAlpha = 1;
      }
    });

    // Sky platforms
    skyLanes.forEach(function(lane) {
      if (lane.submerged && lane.config.diving) return; // invisible when submerged
      // Blink before dive
      if (lane.config.diving) {
        var cfg2 = getLevelConfig();
        var timeUntilDive = cfg2.diveInterval - lane.diveTimer;
        if (timeUntilDive > 0 && timeUntilDive < 36 && Math.floor(lane.diveTimer / 6) % 2 === 0) return;
      }
      lane.objects.forEach(function(obj) {
        ctx.fillStyle = obj.color;
        if (lane.config.type === 'skytrain') {
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
          for (var wi = 0; wi < Math.floor(obj.w / 9); wi++) ctx.fillRect(obj.x + 4 + wi * 9, obj.y + 4, 3, 3);
          ctx.globalAlpha = 1;
        } else if (lane.config.type === 'adboard') {
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          var borderHue = (frameCount * 2) % 360;
          ctx.strokeStyle = 'hsl(' + borderHue + ',100%,50%)'; ctx.lineWidth = 1;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        } else {
          // Cargo drone: 3 circles in triangle
          var cx2 = obj.x + obj.w / 2, cy2 = obj.y + obj.h / 2;
          ctx.beginPath(); ctx.arc(cx2, cy2 - 5, 4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx2 - 6, cy2 + 4, 4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx2 + 6, cy2 + 4, 4, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = obj.color; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx2, cy2 - 5); ctx.lineTo(cx2 - 6, cy2 + 4); ctx.lineTo(cx2 + 6, cy2 + 4); ctx.closePath(); ctx.stroke();
        }
      });
    });

    // Drone
    if (drone.alive && gameState !== 'dying') {
      var drX = drone.pixelX + CELL_W / 2, drY = drone.pixelY + CELL_H / 2;
      // Glow
      ctx.fillStyle = DRONE_COLOR; ctx.globalAlpha = 0.2;
      ctx.beginPath(); ctx.arc(drX, drY, DRONE_SIZE / 2 + DRONE_GLOW, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      // Diamond body
      ctx.fillStyle = DRONE_COLOR;
      ctx.beginPath();
      ctx.moveTo(drX, drY - 8); ctx.lineTo(drX + 8, drY); ctx.lineTo(drX, drY + 8); ctx.lineTo(drX - 8, drY);
      ctx.closePath(); ctx.fill();
      // Rotors
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(drX - 6, drY - 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(drX + 6, drY - 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(drX - 6, drY + 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(drX + 6, drY + 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      // Center dot
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(drX, drY, 2, 0, Math.PI * 2); ctx.fill();
      // Boost cooldown indicator (level 4+)
      if (level >= 4) {
        var boostPct = Math.max(0, drone.boostCooldown / BOOST_COOLDOWN);
        ctx.fillStyle = boostPct > 0 ? '#ff1744' : '#76ff03';
        ctx.beginPath(); ctx.arc(drX, drY + 14, 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Rain
    ctx.strokeStyle = RAIN_COLOR;
    var rainLen = level >= 5 ? 8 : 6;
    raindrops.forEach(function(rd) {
      ctx.globalAlpha = rd.opacity;
      ctx.beginPath(); ctx.moveTo(rd.x, rd.y); ctx.lineTo(rd.x, rd.y + rainLen); ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Particles
    particles.forEach(function(p) {
      ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;

    // HUD
    ctx.font = '14px monospace'; ctx.fillStyle = SCORE_COLOR;
    ctx.textAlign = 'left'; ctx.fillText('SCORE: ' + score, 10, H - 8);
    ctx.textAlign = 'center'; ctx.fillText('HI: ' + hiScore, W / 2, 14);
    ctx.textAlign = 'right'; ctx.fillText('LEVEL ' + level, W - 10, H - 8);
    ctx.textAlign = 'left';
    // Lives
    for (var li = 0; li < lives; li++) {
      ctx.fillStyle = DRONE_COLOR;
      ctx.beginPath();
      ctx.moveTo(10 + li * 18, H - 22); ctx.lineTo(16 + li * 18, H - 28); ctx.lineTo(22 + li * 18, H - 22); ctx.lineTo(16 + li * 18, H - 16);
      ctx.closePath(); ctx.fill();
    }
    // Timer bar
    var cfg3 = getLevelConfig();
    var timerPct = Math.max(0, timeRemaining / cfg3.timer);
    var barW = W - 20;
    ctx.fillStyle = '#222'; ctx.fillRect(10, H - 4, barW, 4);
    var timerFlash = timeRemaining <= cfg3.timer * 0.25 && frameCount % 20 < 10;
    ctx.fillStyle = timerFlash ? CAR_COLOR : DRONE_COLOR;
    ctx.fillRect(10, H - 4, barW * timerPct, 4);

    // Text popups
    textPopups.forEach(function(tp) {
      ctx.font = '12px monospace'; ctx.fillStyle = tp.color;
      ctx.globalAlpha = tp.life / tp.maxLife;
      ctx.textAlign = 'center'; ctx.fillText(tp.text, tp.x, tp.y);
      ctx.globalAlpha = 1;
    });
    ctx.textAlign = 'left';

    // Level 5+ cyan vignette
    if (level >= 5) {
      var grad = ctx.createRadialGradient(W/2, H/2, H * 0.3, W/2, H/2, H * 0.8);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,229,255,0.06)');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    }

    // Game over overlay
    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 36px monospace'; ctx.fillStyle = DRONE_COLOR;
      ctx.textAlign = 'center'; ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
      ctx.font = '18px monospace'; ctx.fillStyle = SCORE_COLOR;
      ctx.fillText('SCORE: ' + score, W / 2, H / 2 + 10);
      ctx.fillText('HI-SCORE: ' + hiScore, W / 2, H / 2 + 35);
      ctx.font = '14px monospace'; ctx.fillStyle = '#888';
      ctx.fillText('Press R to restart', W / 2, H / 2 + 65);
      ctx.textAlign = 'left';
    }
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y);
    c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
    c.closePath(); c.fill();
  }

  function restartGame() {
    score = 0; lives = STARTING_LIVES; level = 1;
    gameOver = false; gameState = 'playing';
    extraLifeAwarded = false; perfectCrossingPossible = true;
    homeSlots = [false, false, false, false, false]; frogsHome = 0;
    particles = []; textPopups = [];
    stormSurgeActive = false; stormSurgeTimer = 0; stormWarning = false;
    lightningTimer = 0; lightningFlash = false;
    initLanes(); initRain(); resetDrone();
  }

  // === INIT ===
  initLanes();
  initRain();
  resetDrone();
  animId = requestAnimationFrame(gameLoop);

  function cleanup() {
    cancelAnimationFrame(animId);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }
  return { controls: 'Arrow keys: Move | Space: Boost (L4+) | R: Restart', cleanup: cleanup };
}

