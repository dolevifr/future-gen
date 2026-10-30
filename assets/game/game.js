// game.js - 3D Quest Engine with Mario Hero, Steel Sword, Spiked Hedgehogs, Purple Princess & Millionaire Quiz Integration
//
// The site's copy (game.html, future-gen.co.il/game). What changed from the original game:
// - touch controls for phones and tablets: a joystick that appears under the thumb on the
//   left half of the screen, and jump / sword buttons on the right ("Touch controls" below);
// - the world moves in fixed steps of 1/60 s (animate), so it plays at the same speed on
//   120 Hz screens and on slow phones;
// - W A S D E are read by physical key (e.code), so they work with a Hebrew keyboard too;
// - fixes: the last quiz no longer reopens behind the victory window; a question that runs
//   out of time shows the right answer in green; Space presses a focused button in the
//   windows; only a click on the game itself swings the sword;
// - emoji instead of Font Awesome icons, and Three.js from the site itself: the page loads
//   nothing from other sites (README, "משחק הפרומפטים").

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    // phones suspend the sound after a call or when the tab was in the background
    if (this.ctx.state === 'suspended') {
      const resumed = this.ctx.resume();
      if (resumed && resumed.catch) resumed.catch(() => {});
    }
  }

  playJump() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSlash() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playHit() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playShoot() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playTimerTick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playCorrect() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.2);
    });
  }

  playWrong() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [250, 180];

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.2);
    });
  }

  playVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 659.25, 880];

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.14);
      gain.gain.setValueAtTime(0.3, now + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.3);

      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.3);
    });
  }
}

const sfx = new SoundFX();

// Game State
const state = {
  currentLevel: 1,
  score: 0,
  lives: 3,
  isPlaying: false,
  isQuizActive: false,
  currentQuestionIdx: 0,
  correctAnswersCount: 0,
  timer: 25,
  timerInterval: null,
  levelQuizData: null
};

// Three.js Engine Variables
let scene, camera, renderer;
let playerGroup, swordGroup, rightArmGroup, leftArmGroup, rightLegMesh, leftLegMesh;
let playerPos = { x: 0, y: 1, z: 0 };
let playerVelY = 0;
let isGrounded = true;
let isAttacking = false;
let attackTimer = 0;
let animTime = 0;

let platforms = [];
let enemies = [];
let enemyProjectiles = [];
let crystals = [];
let spinners = [];
let quizPortal = null;
let princessGroup = null;
let princessCage = null;
let lavaMesh = null;
let lavaTime = 0;

// Controls Dictionary
const keys = {
  up: false, down: false, left: false, right: false,
  space: false, shift: false
};

// The joystick on touch screens: a direction (x to the right, z towards the camera,
// each -1..1), how far it is pushed (0..1), and whether it is pushed all the way (run).
const touchInput = { x: 0, z: 0, push: 0, run: false };
// Phones and tablets start with the touch controls; the first touch turns them on on a
// laptop with a touch screen, and a game key turns them off again.
let touchMode = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
document.body.classList.toggle('touch-mode', touchMode);

// Initialize Engine
function initEngine() {
  const canvas = document.getElementById('game-canvas');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0505);
  scene.fog = new THREE.FogExp2(0x1a0808, 0.012);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 14);

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  } catch (err) {
    showNoWebGL();
    return;
  }
  // a lighter picture on phones and tablets keeps the frame rate up
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, touchMode ? 1.5 : 2));
  onWindowResize();
  renderer.shadowMap.enabled = true;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.2);
  dirLight.position.set(20, 40, 20);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const lavaLight = new THREE.PointLight(0xff4500, 2, 50);
  lavaLight.position.set(0, -2, 0);
  scene.add(lavaLight);

  // Setup Boiling Lava Floor
  createBoilingLavaFloor();

  // Setup 3D Mario Character + Steel Sword
  createHeroCharacter();

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  // some phones report the new size a moment after turning
  window.addEventListener('orientationchange', () => setTimeout(onWindowResize, 300));
  setupControls();
  setupTouchControls();
  setupUIEvents();

  // Build Level 1
  loadLevel(1);

  // Start Loop
  requestAnimationFrame(animate);
}

// Without WebGL (an old browser, or graphics acceleration turned off) nothing can be drawn
function showNoWebGL() {
  const btn = document.getElementById('start-game-btn');
  if (!btn) return;
  const msg = document.createElement('p');
  msg.className = 'no-webgl';
  msg.setAttribute('role', 'alert');
  msg.textContent = 'הדפדפן הזה לא מצליח להציג את המשחק בתלת-ממד. נסו בדפדפן אחר (Chrome, Safari, Edge או Firefox) או במכשיר אחר.';
  btn.replaceWith(msg);
}

// Global Boiling Lava Floor
function createBoilingLavaFloor() {
  const lavaGeo = new THREE.PlaneGeometry(250, 250, 32, 32);
  const lavaMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    emissive: 0xd97706,
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.1
  });
  lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
  lavaMesh.rotation.x = -Math.PI / 2;
  lavaMesh.position.y = -5;
  scene.add(lavaMesh);
}

// Detailed Steel Longsword Builder
function createDetailedSteelSword() {
  swordGroup = new THREE.Group();

  // 1. Blade
  const bladeGeo = new THREE.CylinderGeometry(0.02, 0.11, 1.3, 4);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x94a3b8,
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.1
  });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.scale.set(0.35, 1, 1);
  blade.position.y = 0.65;
  swordGroup.add(blade);

  // Fuller groove down the middle
  const fullerGeo = new THREE.BoxGeometry(0.02, 1.0, 0.04);
  const fullerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
  const fuller = new THREE.Mesh(fullerGeo, fullerMat);
  fuller.position.y = 0.65;
  swordGroup.add(fuller);

  // 2. Crossguard
  const guardGroup = new THREE.Group();
  const guardMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });

  const guardCenter = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.12), guardMat);
  guardGroup.add(guardCenter);

  const wingGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.25, 8);
  const leftWing = new THREE.Mesh(wingGeo, guardMat);
  leftWing.rotation.z = Math.PI / 3;
  leftWing.position.set(-0.16, 0.05, 0);
  guardGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, guardMat);
  rightWing.rotation.z = -Math.PI / 3;
  rightWing.position.set(0.16, 0.05, 0);
  guardGroup.add(rightWing);

  guardGroup.position.y = 0.02;
  swordGroup.add(guardGroup);

  // 3. Hilt
  const hiltGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.45, 12);
  const hiltMat = new THREE.MeshStandardMaterial({ color: 0x3f1d0b, roughness: 0.7 });
  const hilt = new THREE.Mesh(hiltGeo, hiltMat);
  hilt.position.y = -0.22;
  swordGroup.add(hilt);

  // 4. Pommel
  const pommelGeo = new THREE.SphereGeometry(0.075, 12, 12);
  const pommelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
  const pommel = new THREE.Mesh(pommelGeo, pommelMat);
  pommel.position.y = -0.47;
  swordGroup.add(pommel);

  return swordGroup;
}

// 3D Mario-Style Hero Character Builder
function createHeroCharacter() {
  playerGroup = new THREE.Group();

  // Torso / Shirt (Orange-Red)
  const shirtGeo = new THREE.BoxGeometry(0.8, 0.6, 0.5);
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.y = 0.6;
  playerGroup.add(shirt);

  // Overalls (Blue)
  const overallsGeo = new THREE.BoxGeometry(0.82, 0.5, 0.52);
  const overallsMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
  const overalls = new THREE.Mesh(overallsGeo, overallsMat);
  overalls.position.y = 0.25;
  playerGroup.add(overalls);

  // Buttons
  const buttonGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 10);
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
  const bLeft = new THREE.Mesh(buttonGeo, buttonMat);
  bLeft.rotation.x = Math.PI / 2;
  bLeft.position.set(-0.25, 0.4, 0.27);
  playerGroup.add(bLeft);

  const bRight = new THREE.Mesh(buttonGeo, buttonMat);
  bRight.rotation.x = Math.PI / 2;
  bRight.position.set(0.25, 0.4, 0.27);
  playerGroup.add(bRight);

  // Head
  const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.15;
  playerGroup.add(head);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8 });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, 1.15, 0.38);
  playerGroup.add(nose);

  // Mustache
  const stacheGeo = new THREE.BoxGeometry(0.4, 0.1, 0.12);
  const stacheMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
  const stache = new THREE.Mesh(stacheGeo, stacheMat);
  stache.position.set(0, 1.05, 0.38);
  playerGroup.add(stache);

  // Cap
  const capGeo = new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(0, 1.22, 0);
  playerGroup.add(cap);

  const visorGeo = new THREE.BoxGeometry(0.5, 0.06, 0.25);
  const visor = new THREE.Mesh(visorGeo, capMat);
  visor.position.set(0, 1.32, 0.38);
  playerGroup.add(visor);

  // Arms & Gloves
  const armGeo = new THREE.BoxGeometry(0.25, 0.6, 0.25);
  const armMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
  const gloveGeo = new THREE.SphereGeometry(0.16, 12, 12);
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  // Right Arm (Holds Sword)
  rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.55, 0.7, 0);
  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.y = -0.25;
  rightArmGroup.add(rightArm);

  const rightGlove = new THREE.Mesh(gloveGeo, gloveMat);
  rightGlove.position.y = -0.55;
  rightArmGroup.add(rightGlove);

  const steelSword = createDetailedSteelSword();
  steelSword.position.set(0, -0.5, 0.35);
  steelSword.rotation.x = Math.PI / 4;
  rightArmGroup.add(steelSword);

  playerGroup.add(rightArmGroup);

  // Left Arm
  leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.55, 0.7, 0);
  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.y = -0.25;
  leftArmGroup.add(leftArm);
  const leftGlove = new THREE.Mesh(gloveGeo, gloveMat);
  leftGlove.position.y = -0.55;
  leftArmGroup.add(leftGlove);
  playerGroup.add(leftArmGroup);

  // Legs & Boots
  const legGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
  const bootGeo = new THREE.BoxGeometry(0.34, 0.25, 0.45);
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

  rightLegMesh = new THREE.Group();
  const rLeg = new THREE.Mesh(legGeo, legMat); rLeg.position.y = -0.2;
  const rBoot = new THREE.Mesh(bootGeo, bootMat); rBoot.position.set(0, -0.35, 0.05);
  rightLegMesh.add(rLeg); rightLegMesh.add(rBoot);
  rightLegMesh.position.set(0.2, 0, 0);
  playerGroup.add(rightLegMesh);

  leftLegMesh = new THREE.Group();
  const lLeg = new THREE.Mesh(legGeo, legMat); lLeg.position.y = -0.2;
  const lBoot = new THREE.Mesh(bootGeo, bootMat); lBoot.position.set(0, -0.35, 0.05);
  leftLegMesh.add(lLeg); leftLegMesh.add(lBoot);
  leftLegMesh.position.set(-0.2, 0, 0);
  playerGroup.add(leftLegMesh);

  scene.add(playerGroup);
}

// Cartoon Spiked Hedgehog Enemy Builder
function createHedgehogEnemy(x, y, z, canShoot = false, isBoss = false) {
  const group = new THREE.Group();

  const scale = isBoss ? 1.6 : 1.0;
  group.scale.set(scale, scale, scale);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: isBoss ? 0x7f1d1d : 0xd97706,
    emissive: isBoss ? 0x991b1b : 0x000000,
    emissiveIntensity: 0.4,
    roughness: 0.5
  });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), bodyMat);
  body.castShadow = true;
  group.add(body);

  const spikeGeo = new THREE.ConeGeometry(0.12, 0.45, 6);
  const spikeMat = new THREE.MeshStandardMaterial({ color: isBoss ? 0xd97706 : 0x1e293b, roughness: 0.3 });
  const spikeCount = isBoss ? 35 : 24;
  for (let i = 0; i < spikeCount; i++) {
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    const phi = Math.random() * Math.PI * 0.8 - Math.PI * 0.4;
    const theta = Math.random() * Math.PI + Math.PI * 0.5;

    spike.position.set(
      0.6 * Math.sin(phi) * Math.cos(theta),
      0.6 * Math.cos(phi) + 0.1,
      0.6 * Math.sin(phi) * Math.sin(theta) - 0.1
    );
    spike.rotation.x = Math.PI / 2 + Math.random() * 0.4;
    spike.rotation.z = (Math.random() - 0.5) * 0.6;
    group.add(spike);
  }

  // Giant Eyes
  const eyeWhiteGeo = new THREE.SphereGeometry(0.22, 12, 12);
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilGeo = new THREE.SphereGeometry(0.1, 10, 10);
  const pupilMat = new THREE.MeshBasicMaterial({ color: isBoss ? 0xef4444 : 0x000000 });

  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat); leftEyeWhite.position.set(-0.25, 0.2, 0.52); group.add(leftEyeWhite);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat); leftPupil.position.set(-0.23, 0.2, 0.68); group.add(leftPupil);
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat); rightEyeWhite.position.set(0.25, 0.2, 0.52); group.add(rightEyeWhite);
  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat); rightPupil.position.set(0.23, 0.2, 0.68); group.add(rightPupil);

  const noseGeo = new THREE.SphereGeometry(0.15, 10, 10);
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x090a0f, roughness: 0.1 });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, -0.05, 0.72);
  group.add(nose);

  group.position.set(x, y, z);
  scene.add(group);

  enemies.push({
    mesh: group,
    startX: x,
    alive: true,
    speed: isBoss ? 0.04 : 0.03,
    dir: 1,
    canShoot: canShoot,
    shootTimer: 0,
    shootInterval: isBoss ? 80 : 130
  });
}

// Spawn Enemy Fire Ball Projectile
function spawnEnemyProjectile(enemy) {
  const pMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 0.9
    })
  );

  const startPos = enemy.mesh.position.clone();
  startPos.y += 0.2;
  pMesh.position.copy(startPos);
  scene.add(pMesh);

  const dir = new THREE.Vector3()
    .subVectors(playerGroup.position, startPos)
    .normalize();

  enemyProjectiles.push({
    mesh: pMesh,
    velX: dir.x * 0.14,
    velY: 0.02,
    velZ: dir.z * 0.14,
    life: 150
  });

  sfx.playShoot();
}

// Spinning Fire Hazard Builder
function createFireSpinnerHazard(x, y, z) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0x334155 }));
  base.position.y = 0.2;
  group.add(base);

  const barMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xd97706, emissiveIntensity: 0.9 });
  const orb1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), barMat);
  orb1.position.set(-1.8, 0.4, 0);
  group.add(orb1);

  const orb2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), barMat);
  orb2.position.set(1.8, 0.4, 0);
  group.add(orb2);

  const bar = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.1), barMat);
  bar.position.y = 0.4;
  group.add(bar);

  group.position.set(x, y, z);
  scene.add(group);

  spinners.push({ group: group, orb1: orb1, orb2: orb2, hitCooldown: false });
}

// Build Level Environments with Increasing Difficulty
function loadLevel(levelNum) {
  state.currentLevel = levelNum;
  document.getElementById('level-title-hud').innerText = `שלב ${levelNum}`;

  platforms.forEach(p => scene.remove(p.mesh));
  enemies.forEach(e => scene.remove(e.mesh));
  enemyProjectiles.forEach(p => scene.remove(p.mesh));
  crystals.forEach(c => scene.remove(c));
  spinners.forEach(s => scene.remove(s.group));
  if (quizPortal) scene.remove(quizPortal);
  if (princessGroup) scene.remove(princessGroup);

  platforms = [];
  enemies = [];
  enemyProjectiles = [];
  crystals = [];
  spinners = [];

  playerPos = { x: 0, y: 1, z: 0 };
  playerGroup.position.set(0, 1, 0);

  if (levelNum === 1) {
    scene.background = new THREE.Color(0x0f172a);
    scene.fog.color.setHex(0x0f172a);
    setQuest("שלב 1 (3 קפיצות): הילחם בקיפודים בחרב (מקש S), אסוף קריסטלים והגע לפורטל!");

    // 4 platforms total (3 jumps)
    createPlatform(0, 0, 0, 10, 1, 10, 0x15803d);
    createPlatform(0, 1, -14, 6, 1, 6, 0x166534);
    createPlatform(-5, 2.5, -26, 6, 1, 6, 0x166534);
    createPlatform(0, 4, -38, 8, 1, 8, 0x15803d);

    createHedgehogEnemy(0, 1.7, -14, false);
    createHedgehogEnemy(-5, 3.2, -26, false);

    createCrystal(2, 1, -3);
    createCrystal(-5, 3.5, -26);
    createCrystal(0, 5, -38);

    createQuizPortal(0, 4.5, -38);

  } else if (levelNum === 2) {
    scene.background = new THREE.Color(0x2a0808);
    scene.fog.color.setHex(0x2a0808);
    setQuest("שלב 2 (10 קפיצות): הקיפודים יורים כדורי אש! קפוץ מעליהם (Space) וחצה 10 פלטפורמות!");

    // 11 platforms total (10 jumps)
    createPlatform(0, 0, 0, 8, 1, 8, 0x334155);
    createPlatform(0, 1.5, -13, 5, 1, 5, 0x475569);
    createPlatform(-5, 3.0, -24, 5, 1, 5, 0x334155);
    createPlatform(5, 4.5, -35, 5, 1, 5, 0x475569);
    createPlatform(0, 6.0, -46, 5, 1, 5, 0x334155);
    createPlatform(-6, 7.5, -57, 5, 1, 5, 0x475569);
    createPlatform(0, 9.0, -68, 5, 1, 5, 0x334155);
    createPlatform(6, 10.5, -79, 5, 1, 5, 0x475569);
    createPlatform(0, 12.0, -90, 5, 1, 5, 0x334155);
    createPlatform(-5, 13.5, -101, 5, 1, 5, 0x475569);
    createPlatform(0, 15.0, -114, 9, 1, 9, 0x334155);

    createHedgehogEnemy(0, 2.2, -13, true);
    createHedgehogEnemy(-5, 3.7, -24, true);
    createHedgehogEnemy(5, 5.2, -35, true);
    createHedgehogEnemy(-6, 8.2, -57, true);

    createCrystal(-5, 4, -24);
    createCrystal(6, 11.5, -79);

    createQuizPortal(0, 15.5, -114);

  } else if (levelNum === 3) {
    scene.background = new THREE.Color(0x090514);
    scene.fog.color.setHex(0x090514);
    setQuest("שלב 3 (15 קפיצות): חצה 15 פלטפורמות זזות ומכשולי אש, הבס את קיפוד הבוס והצלת הנסיכה הסגולה!");

    // 16 platforms total (15 jumps) with Moving Platforms & Fire Hazard Spinners!
    createPlatform(0, 0, 0, 8, 1, 8, 0x1e1b4b);
    createPlatform(0, 1.5, -13, 5, 1, 5, 0x312e81);
    createPlatform(-4, 3.0, -24, 5, 1, 5, 0x4338ca, true, 'x', 4, 0.04); // Moving Platform 1
    createPlatform(4, 4.5, -35, 5, 1, 5, 0x1e1b4b); createFireSpinnerHazard(4, 5.0, -35); // Spinner 1
    createPlatform(0, 6.0, -46, 5, 1, 5, 0x312e81);
    createPlatform(-5, 7.5, -57, 5, 1, 5, 0x4338ca, true, 'z', 3, 0.035); // Moving Platform 2
    createPlatform(0, 9.0, -68, 5, 1, 5, 0x1e1b4b); createFireSpinnerHazard(0, 9.5, -68); // Spinner 2
    createPlatform(6, 10.5, -79, 5, 1, 5, 0x312e81);
    createPlatform(0, 12.0, -90, 5, 1, 5, 0x4338ca, true, 'x', 5, 0.045); // Moving Platform 3
    createPlatform(-5, 13.5, -101, 5, 1, 5, 0x1e1b4b);
    createPlatform(0, 15.0, -112, 5, 1, 5, 0x312e81); createFireSpinnerHazard(0, 15.5, -112); // Spinner 3
    createPlatform(5, 16.5, -123, 5, 1, 5, 0x4338ca, true, 'x', 4, 0.05); // Moving Platform 4
    createPlatform(0, 18.0, -134, 5, 1, 5, 0x1e1b4b);
    createPlatform(-5, 19.5, -145, 5, 1, 5, 0x312e81);
    createPlatform(0, 21.0, -156, 7, 1, 7, 0x1e1b4b); // Boss Platform
    createPlatform(0, 22.5, -170, 12, 1, 12, 0x312e81); // Final Platform with Princess

    createHedgehogEnemy(-5, 8.2, -57, true);
    createHedgehogEnemy(6, 11.2, -79, true);
    createHedgehogEnemy(-5, 14.2, -101, true);
    createHedgehogEnemy(0, 22.3, -156, true, true); // Boss Hedgehog

    createPrincessInCage(0, 23.0, -174);
    createQuizPortal(0, 23.0, -168);
  }
}

// Platform Builder Helper
function createPlatform(x, y, z, width, height, depth, color, isMoving = false, moveAxis = 'x', moveRange = 0, speed = 0.03) {
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);

  platforms.push({
    mesh: mesh,
    width: width,
    height: height,
    depth: depth,
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2,
    topY: y + height / 2,
    isMoving: isMoving,
    moveAxis: moveAxis,
    moveRange: moveRange,
    speed: speed,
    startX: x,
    startZ: z,
    dir: 1
  });
}

// Glowing Crystal Collectible
function createCrystal(x, y, z) {
  const geo = new THREE.OctahedronGeometry(0.4);
  const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  crystals.push(mesh);
}

// Quiz Portal
function createQuizPortal(x, y, z) {
  const group = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 32);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);

  const innerGeo = new THREE.CircleGeometry(1.1, 32);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  group.position.set(x, y, z);
  scene.add(group);
  quizPortal = group;
}

// Detailed 3D Purple Princess Character (matching uploaded reference image)
function createPrincessInCage(x, y, z) {
  princessGroup = new THREE.Group();

  // 1. Head & Cute Face
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.35;

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfd3, roughness: 0.5 });
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
  headGroup.add(headMesh);

  // Big cute purple eyes
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
  const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeWhiteMat);
  lEye.position.set(-0.09, 0.04, 0.24);
  const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyePupilMat);
  lPupil.position.set(-0.09, 0.04, 0.29);
  headGroup.add(lEye); headGroup.add(lPupil);

  const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeWhiteMat);
  rEye.position.set(0.09, 0.04, 0.24);
  const rPupil = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyePupilMat);
  rPupil.position.set(0.09, 0.04, 0.29);
  headGroup.add(rEye); headGroup.add(rPupil);

  // Pink blush
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.6 });
  const lBlush = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), blushMat);
  lBlush.position.set(-0.13, -0.04, 0.23); headGroup.add(lBlush);
  const rBlush = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), blushMat);
  rBlush.position.set(0.13, -0.04, 0.23); headGroup.add(rBlush);

  const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), skinMat);
  noseMesh.position.set(0, -0.01, 0.28); headGroup.add(noseMesh);

  // 2. Soft Wavy Purple / Violet Hair & Bangs
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.4 });
  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), hairMat);
  hairBack.position.set(0, 0.02, -0.06); hairBack.scale.set(1.05, 1.25, 1.1);
  headGroup.add(hairBack);

  const lHairCurl = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), hairMat);
  lHairCurl.position.set(-0.24, -0.12, 0.08); lHairCurl.scale.set(0.8, 1.4, 0.9); headGroup.add(lHairCurl);
  const rHairCurl = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), hairMat);
  rHairCurl.position.set(0.24, -0.12, 0.08); rHairCurl.scale.set(0.8, 1.4, 0.9); headGroup.add(rHairCurl);

  const bangMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), hairMat);
  bangMesh.position.set(0, 0.18, 0.18); bangMesh.scale.set(1.4, 0.6, 0.8); headGroup.add(bangMesh);

  // 3. Golden Tiara / Crown with Rose Jewel
  const crownGroup = new THREE.Group();
  const crownGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 8, 24), crownGoldMat);
  band.rotation.x = Math.PI / 2; band.position.y = 0.24; crownGroup.add(band);
  [-0.1, 0, 0.1].forEach(xOffset => {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 6), crownGoldMat);
    spike.position.set(xOffset, 0.3, 0.18); crownGroup.add(spike);
  });
  const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777 }));
  jewel.position.set(0, 0.3, 0.21); crownGroup.add(jewel);
  headGroup.add(crownGroup);

  princessGroup.add(headGroup);

  // 4. Layered Royal Purple Dress
  const bodiceMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.3 });
  const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.45, 16), bodiceMat);
  bodice.position.y = 0.85; princessGroup.add(bodice);

  const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12), crownGoldMat);
  medallion.rotation.x = Math.PI / 2; medallion.position.set(0, 0.98, 0.22); princessGroup.add(medallion);

  const sleeveMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.4 });
  const lSleeve = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), sleeveMat);
  lSleeve.position.set(-0.28, 0.96, 0); princessGroup.add(lSleeve);
  const rSleeve = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), sleeveMat);
  rSleeve.position.set(0.28, 0.96, 0); princessGroup.add(rSleeve);

  const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), skinMat);
  lArm.position.set(-0.28, 0.76, 0.05); lArm.rotation.z = 0.2; princessGroup.add(lArm);
  const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8), skinMat);
  rArm.position.set(0.28, 0.76, 0.1); rArm.rotation.x = -0.6; rArm.rotation.z = -0.3; princessGroup.add(rArm);

  // Pink Flower Held in Right Hand
  const flowerGroup = new THREE.Group();
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), stemMat);
  flowerGroup.add(stem);
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777 });
  for (let p = 0; p < 5; p++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), petalMat);
    petal.position.set(0.03 * Math.cos(p * Math.PI * 0.4), 0.12, 0.03 * Math.sin(p * Math.PI * 0.4));
    flowerGroup.add(petal);
  }
  flowerGroup.position.set(0.34, 0.7, 0.22);
  princessGroup.add(flowerGroup);

  // Flared Layered Purple Skirt
  const skirtMat1 = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.3 });
  const skirtMat2 = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.3 });
  const skirt1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.6, 16, 1, true), skirtMat1);
  skirt1.position.y = 0.45; princessGroup.add(skirt1);

  const skirt2 = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.4, 16, 1, true), skirtMat2);
  skirt2.position.y = 0.32; princessGroup.add(skirt2);

  const ruffleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const ruffle = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.65, 0.08, 16), ruffleMat);
  ruffle.position.y = 0.14; princessGroup.add(ruffle);

  for (let h = 0; h < 4; h++) {
    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), crownGoldMat);
    const angle = (h * Math.PI / 2) + Math.PI / 4;
    heart.position.set(0.48 * Math.sin(angle), 0.35, 0.48 * Math.cos(angle));
    princessGroup.add(heart);
  }

  // 5. Legs & Brown Shoes with White Socks
  const sockMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x582f0e, roughness: 0.5 });
  const lSock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10), sockMat);
  lSock.position.set(-0.12, 0.08, 0); princessGroup.add(lSock);
  const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.2), shoeMat);
  lShoe.position.set(-0.12, 0.03, 0.03); princessGroup.add(lShoe);

  const rSock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 10), sockMat);
  rSock.position.set(0.12, 0.08, 0); princessGroup.add(rSock);
  const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.2), shoeMat);
  rShoe.position.set(0.12, 0.03, 0.03); princessGroup.add(rShoe);

  // 6. Enclosing Iron Cage
  const cageGeo = new THREE.CylinderGeometry(0.95, 0.95, 2.2, 10, 1, true);
  const cageMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, wireframe: true });
  princessCage = new THREE.Mesh(cageGeo, cageMat);
  princessCage.position.y = 1.1;
  princessGroup.add(princessCage);

  princessGroup.position.set(x, y, z);
  scene.add(princessGroup);
}

// Controls Setup
// Keys are read by e.code, the physical key, so W A S D E work whatever the keyboard
// language (with a Hebrew layout e.key is "'" for W). e.key is the fallback for
// keyboards that send no code.
const MOVE_KEYS = {
  KeyW: 'up', ArrowUp: 'up', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right'
};
const MOVE_KEYS_BY_NAME = { w: 'up', a: 'left', d: 'right', arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right' };

function readKey(e) {
  const k = (e.key || '').toLowerCase();
  const code = e.code || '';
  return {
    dir: MOVE_KEYS[code] || (code ? null : MOVE_KEYS_BY_NAME[k]) || null,
    jump: code === 'Space' || e.key === ' ',
    run: code === 'ShiftLeft' || code === 'ShiftRight' || e.key === 'Shift',
    attack: code === 'KeyS' || code === 'KeyE' || (!code && (k === 's' || k === 'e'))
  };
}

function setupControls() {
  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    sfx.init();
    const key = readKey(e);
    const inGame = state.isPlaying && !state.isQuizActive;

    if (key.dir) keys[key.dir] = true;
    if (key.run) keys.shift = true;
    if (key.jump) {
      keys.space = true;
      // only while playing: in the quiz and the other windows Space presses the focused button
      if (inGame) e.preventDefault();
    }
    if (key.attack && inGame) {
      performAttack();
      e.preventDefault();
    }
    if (key.dir || key.jump || key.attack) setTouchMode(false);
  });

  window.addEventListener('keyup', (e) => {
    const key = readKey(e);
    if (key.dir) keys[key.dir] = false;
    if (key.jump) keys.space = false;
    if (key.run) keys.shift = false;
  });

  // a click on the game itself swings the sword (on a touch screen the sword button does)
  document.getElementById('game-canvas').addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (!state.isQuizActive && state.isPlaying) {
      performAttack();
    }
  });

  // a key or a thumb still down when the tab is left must not keep the hero running
  window.addEventListener('blur', releaseAllInput);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releaseAllInput();
  });
}

// ---------- Touch controls (phones and tablets) ----------
// The left half of the screen is the joystick: it appears where the thumb lands, and
// pushing it all the way runs (Shift on a keyboard). On the right, hold the jump button to
// jump (like Space) and tap the sword button to swing. Pointer Events, so the joystick and
// a button work at the same time; they also answer a mouse, which helps when testing.
const STICK_RANGE = 52;     // px the knob travels from the middle
const STICK_DEAD = 0.18;    // a push smaller than this is a resting thumb
const STICK_RUN = 0.92;     // pushed this far is a run
let stick = null;           // { id, x0, y0 } while a thumb is on the joystick
let touchShown = false;
let questRaw = '';

function setTouchMode(on) {
  if (touchMode === on) return;
  touchMode = on;
  document.body.classList.toggle('touch-mode', on);
  if (questRaw) setQuest(questRaw);
}

// the level's task, with the touch buttons' names instead of key names on a touch screen
function setQuest(text) {
  questRaw = text;
  document.getElementById('quest-text').innerText = touchMode
    ? text.replace('(מקש S)', '(כפתור החרב)').replace('(Space)', '(כפתור הקפיצה)')
    : text;
}

function releaseAllInput() {
  Object.keys(keys).forEach(k => { keys[k] = false; });
  endStick();
  document.querySelectorAll('.touch-btn.pressed').forEach(b => b.classList.remove('pressed'));
}

function startStick(e) {
  if (stick) return;
  const zone = document.getElementById('stick-zone');
  const base = document.getElementById('stick-base');
  const r = base.offsetWidth / 2, pad = 6;
  // the whole ring stays on the screen even for a thumb right at the edge
  const x0 = Math.min(Math.max(e.clientX, r + pad), window.innerWidth - r - pad);
  const y0 = Math.min(Math.max(e.clientY, r + pad), window.innerHeight - r - pad);
  stick = { id: e.pointerId, x0: x0, y0: y0 };
  base.style.left = (x0 - r) + 'px';
  base.style.top = (y0 - r) + 'px';
  base.style.bottom = 'auto';
  base.classList.add('active');
  try { zone.setPointerCapture(e.pointerId); } catch (err) { /* the pointer is already gone */ }
  sfx.init();
  moveStick(e);
  e.preventDefault();
}

function moveStick(e) {
  if (!stick || e.pointerId !== stick.id) return;
  let dx = e.clientX - stick.x0;
  let dy = e.clientY - stick.y0;
  const dist = Math.hypot(dx, dy);
  if (dist > STICK_RANGE) {
    dx *= STICK_RANGE / dist;
    dy *= STICK_RANGE / dist;
  }
  document.getElementById('stick-knob').style.transform = `translate(${dx}px, ${dy}px)`;
  const push = Math.min(dist / STICK_RANGE, 1);
  if (push < STICK_DEAD) {
    touchInput.x = 0; touchInput.z = 0; touchInput.push = 0;
  } else {
    // screen right is +x and screen down is +z (towards the camera), as with the arrow keys
    touchInput.x = dx / STICK_RANGE;
    touchInput.z = dy / STICK_RANGE;
    touchInput.push = push;
  }
  touchInput.run = push >= STICK_RUN;
  document.getElementById('stick-knob').classList.toggle('running', touchInput.run);
}

function endStick(e) {
  if (!stick || (e && e.pointerId !== stick.id)) return;
  stick = null;
  touchInput.x = 0; touchInput.z = 0; touchInput.push = 0; touchInput.run = false;
  const base = document.getElementById('stick-base');
  const knob = document.getElementById('stick-knob');
  if (!base || !knob) return;
  base.style.left = ''; base.style.top = ''; base.style.bottom = '';
  base.classList.remove('active');
  knob.style.transform = '';
  knob.classList.remove('running');
}

// a button that acts on press, and (for jump) lets go on release
function setupHoldButton(btn, onPress, onRelease) {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sfx.init();
    try { btn.setPointerCapture(e.pointerId); } catch (err) { /* the pointer is already gone */ }
    btn.classList.add('pressed');
    onPress();
  });
  const release = () => {
    if (!btn.classList.contains('pressed')) return;
    btn.classList.remove('pressed');
    if (onRelease) onRelease();
  };
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', release);
  btn.addEventListener('lostpointercapture', release);
}

function setupTouchControls() {
  const ui = document.getElementById('touch-ui');
  const zone = document.getElementById('stick-zone');
  if (!ui || !zone) return;

  // the first touch anywhere turns the touch controls on
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') setTouchMode(true);
  }, true);

  zone.addEventListener('pointerdown', startStick);
  zone.addEventListener('pointermove', moveStick);
  zone.addEventListener('pointerup', endStick);
  zone.addEventListener('pointercancel', endStick);
  zone.addEventListener('lostpointercapture', endStick);

  setupHoldButton(document.getElementById('btn-jump'),
    () => { keys.space = true; },
    () => { keys.space = false; });
  setupHoldButton(document.getElementById('btn-sword'), () => {
    if (state.isPlaying && !state.isQuizActive) performAttack();
  });

  // no long-press menu or text selection on the controls
  ui.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Shows the touch controls only while the hero can move. Hiding them lets go of
// everything, so a thumb still down when a window opens doesn't keep the hero moving.
function syncTouchUI() {
  const show = touchMode && state.isPlaying && !state.isQuizActive;
  if (show === touchShown) return;
  touchShown = show;
  document.body.classList.toggle('touch-play', show);
  if (!show) releaseAllInput();
}

// Sword Attack Logic
function performAttack() {
  if (isAttacking) return;
  isAttacking = true;
  attackTimer = 0;

  sfx.playSlash();
  rightArmGroup.rotation.x = -Math.PI / 2;

  enemies.forEach(e => {
    if (e.alive) {
      const dist = playerGroup.position.distanceTo(e.mesh.position);
      if (dist < 2.8) {
        e.alive = false;
        scene.remove(e.mesh);
        sfx.playHit();
        state.score += 50;
        document.getElementById('score-val').innerText = state.score;
      }
    }
  });
}

// The site's visitor statistics (analytics.js): only that the game was started, how far it
// got and that it was finished. Nothing about the player.
function countEvent(name, params) {
  if (window.fgTrack) window.fgTrack(name, params);
}

// UI Event Binding
function setupUIEvents() {
  document.getElementById('start-game-btn').addEventListener('click', () => {
    sfx.init();
    document.getElementById('intro-modal').classList.add('hidden');
    state.isPlaying = true;
    countEvent('game_start');
  });

  // back to the site; in the middle of a game, ask first
  const homeLink = document.getElementById('home-link');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      const started = state.isQuizActive || (state.isPlaying && (state.score > 0 || state.currentLevel > 1));
      if (started && !window.confirm('לצאת מהמשחק ולחזור לאתר? ההתקדמות במשחק לא נשמרת.')) {
        e.preventDefault();
        releaseAllInput();
      }
    });
  }

  document.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.isQuizActive) return;
      const idx = parseInt(btn.getAttribute('data-index'));
      handleQuizAnswer(idx, btn);
    });
  });

  document.getElementById('next-question-btn').addEventListener('click', () => {
    advanceQuiz();
  });

  document.getElementById('hint-btn').addEventListener('click', () => {
    useHint();
  });

  document.getElementById('restart-game-btn').addEventListener('click', () => {
    location.reload();
  });

  const retryBtn = document.getElementById('retry-level-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.add('hidden');
      state.lives = 3;
      updateHeartsHUD();
      loadLevel(state.currentLevel);
      state.isPlaying = true;
    });
  }
}

// Keyboard users land inside a window when it opens (a mouse or a thumb doesn't notice).
// The window itself takes the focus, not its first button, so a Space still held from
// the last jump can't press one; Tab goes on to the buttons.
function focusInto(id) {
  const el = document.getElementById(id);
  if (el) el.focus({ preventScroll: true });
}

let isInvulnerable = false;

function triggerGameOver() {
  state.isPlaying = false;
  isInvulnerable = false;
  const msgElem = document.getElementById('gameover-msg');
  if (msgElem) {
    msgElem.innerText = "נגמרו לך החיים, התחל את השלב מהתחלה.";
  }
  const modal = document.getElementById('gameover-modal');
  if (modal) {
    modal.classList.remove('hidden');
    focusInto('gameover-modal');
  }
}

let screenShakeTime = 0;

function triggerScreenShake() {
  screenShakeTime = 14;
  const hud = document.getElementById('hud');
  if (hud) {
    hud.classList.add('bg-red-950/40');
    setTimeout(() => {
      hud.classList.remove('bg-red-950/40');
    }, 300);
  }
}

function flashPlayerInvulnerable() {
  if (!playerGroup) return;
  let count = 0;
  const interval = setInterval(() => {
    playerGroup.visible = !playerGroup.visible;
    count++;
    if (count >= 8) {
      clearInterval(interval);
      playerGroup.visible = true;
    }
  }, 150);
}

function showDamageToast() {
  const existing = document.getElementById('damage-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'damage-toast';
  toast.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white font-black text-xl md:text-2xl px-6 py-2 rounded-full shadow-2xl z-50 animate-bounce border-2 border-white flex items-center gap-2 dir-rtl pointer-events-none';
  toast.innerHTML = `<span aria-hidden="true">💔</span> ירד לב 1! נותרו ${state.lives}/3 חיים`;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 1400);
}

function takeDamage() {
  if (isInvulnerable || !state.isPlaying || state.isQuizActive) return;

  isInvulnerable = true;
  sfx.playHit();
  state.lives -= 1;
  if (state.lives < 0) state.lives = 0;

  updateHeartsHUD(true);
  triggerScreenShake();
  flashPlayerInvulnerable();

  if (state.lives <= 0) {
    triggerGameOver();
  } else {
    showDamageToast();
    setTimeout(() => {
      isInvulnerable = false;
    }, 1200);
  }
}

// Main Render & Physics Loop
// The world moves in steps of 1/60 s however often the screen redraws (60 or 120 times a
// second, or a slow phone at 30), so speeds, jumps and enemy fire are the same everywhere.
// After a pause (another tab, a dialog) it carries on rather than racing to catch up.
const STEP_MS = 1000 / 60;
let lastFrameAt = 0;
let stepBacklog = 0;

function animate(now) {
  requestAnimationFrame(animate);
  if (!lastFrameAt) lastFrameAt = now;
  stepBacklog = Math.min(stepBacklog + (now - lastFrameAt), STEP_MS * 5);
  lastFrameAt = now;
  while (stepBacklog >= STEP_MS) {
    stepWorld();
    stepBacklog -= STEP_MS;
  }
  syncTouchUI();
  renderer.render(scene, camera);
}

function stepWorld() {
  if (lavaMesh) {
    lavaTime += 0.03;
    lavaMesh.position.y = -5 + Math.sin(lavaTime) * 0.2;
  }

  if (state.isPlaying && !state.isQuizActive) {
    // Update Moving Platforms
    platforms.forEach(p => {
      if (p.isMoving) {
        let delta = p.speed * p.dir;
        if (p.moveAxis === 'x') {
          p.mesh.position.x += delta;
          p.minX = p.mesh.position.x - p.width / 2;
          p.maxX = p.mesh.position.x + p.width / 2;
          if (Math.abs(p.mesh.position.x - p.startX) > p.moveRange) {
            p.dir *= -1;
          }
        } else if (p.moveAxis === 'z') {
          p.mesh.position.z += delta;
          p.minZ = p.mesh.position.z - p.depth / 2;
          p.maxZ = p.mesh.position.z + p.depth / 2;
          if (Math.abs(p.mesh.position.z - p.startZ) > p.moveRange) {
            p.dir *= -1;
          }
        }
      }
    });

    // Update Fire Hazard Spinners
    spinners.forEach(s => {
      s.group.rotation.y += 0.04;
      const worldOrb1 = new THREE.Vector3(); s.orb1.getWorldPosition(worldOrb1);
      const worldOrb2 = new THREE.Vector3(); s.orb2.getWorldPosition(worldOrb2);

      if (playerGroup.position.distanceTo(worldOrb1) < 0.8 || playerGroup.position.distanceTo(worldOrb2) < 0.8) {
        if (!s.hitCooldown) {
          s.hitCooldown = true;
          setTimeout(() => s.hitCooldown = false, 1000);
          takeDamage();
        }
      }
    });

    updatePlayerPhysics();
    updateEnemies();
    updateProjectiles();
    checkCrystalCollect();
    checkPortalCollision();
  }

  if (quizPortal) {
    quizPortal.rotation.y += 0.02;
  }

  // Smooth Camera Tracking + Camera Shake
  if (playerGroup) {
    camera.position.x += (playerGroup.position.x - camera.position.x) * 0.1;
    camera.position.y += (playerGroup.position.y + 6 - camera.position.y) * 0.1;
    camera.position.z += (playerGroup.position.z + 12 - camera.position.z) * 0.1;

    if (screenShakeTime > 0) {
      screenShakeTime--;
      camera.position.x += (Math.random() - 0.5) * 0.45;
      camera.position.y += (Math.random() - 0.5) * 0.45;
    }

    camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1, playerGroup.position.z);
  }
}

// Player Physics & Movement Logic
function updatePlayerPhysics() {
  let moveSpeed = keys.shift ? 0.25 : 0.14;
  let moveX = 0;
  let moveZ = 0;

  if (keys.up) moveZ -= 1;
  if (keys.down) moveZ += 1;
  if (keys.left) moveX -= 1;
  if (keys.right) moveX += 1;

  // the joystick: a light push walks slower (for careful steps), all the way runs
  if (touchInput.push > 0) {
    moveX = touchInput.x;
    moveZ = touchInput.z;
    moveSpeed = touchInput.run ? 0.25 : 0.14 * Math.min(1, 0.45 + touchInput.push);
  }

  if (moveX !== 0 || moveZ !== 0) {
    const angle = Math.atan2(moveX, moveZ);
    playerGroup.rotation.y = angle;

    playerPos.x += Math.sin(angle) * moveSpeed;
    playerPos.z += Math.cos(angle) * moveSpeed;

    animTime += 0.2;
    rightLegMesh.rotation.x = Math.sin(animTime) * 0.6;
    leftLegMesh.rotation.x = -Math.sin(animTime) * 0.6;
  } else {
    rightLegMesh.rotation.x = 0;
    leftLegMesh.rotation.x = 0;
  }

  if (isAttacking) {
    attackTimer += 0.1;
    if (attackTimer > 1) {
      isAttacking = false;
      rightArmGroup.rotation.x = 0;
    }
  }

  if (keys.space && isGrounded) {
    playerVelY = 0.28;
    isGrounded = false;
    sfx.playJump();
  }

  playerVelY -= 0.012;
  playerPos.y += playerVelY;

  let currentPlatformY = -5.0;
  let standingPlatform = null;

  platforms.forEach(p => {
    if (playerPos.x >= p.minX - 0.4 && playerPos.x <= p.maxX + 0.4 &&
        playerPos.z >= p.minZ - 0.4 && playerPos.z <= p.maxZ + 0.4) {
      if (playerPos.y >= p.topY - 0.2) {
        if (p.topY > currentPlatformY) {
          currentPlatformY = p.topY;
          standingPlatform = p;
        }
      }
    }
  });

  if (playerPos.y <= currentPlatformY) {
    playerPos.y = currentPlatformY;
    playerVelY = 0;
    isGrounded = true;

    // Ride moving platform
    if (standingPlatform && standingPlatform.isMoving) {
      const delta = standingPlatform.speed * standingPlatform.dir;
      if (standingPlatform.moveAxis === 'x') playerPos.x += delta;
      else if (standingPlatform.moveAxis === 'z') playerPos.z += delta;
    }
  }

  // Lava Death Check
  if (playerPos.y <= -4.5) {
    // Safely reset player position to start platform
    playerPos = { x: 0, y: 3, z: 0 };
    playerVelY = 0;
    isGrounded = false;
    takeDamage();
  }

  playerGroup.position.set(playerPos.x, playerPos.y, playerPos.z);
}

function updateEnemies() {
  enemies.forEach(e => {
    if (e.alive) {
      e.mesh.position.x += e.speed * e.dir;
      e.mesh.rotation.y = e.dir === 1 ? Math.PI / 2 : -Math.PI / 2;

      if (Math.abs(e.mesh.position.x - e.startX) > 3) {
        e.dir *= -1;
      }

      if (e.canShoot) {
        e.shootTimer++;
        if (e.shootTimer >= e.shootInterval) {
          e.shootTimer = 0;
          spawnEnemyProjectile(e);
        }
      }

      if (playerGroup.position.distanceTo(e.mesh.position) < 1.1) {
        playerPos.x -= e.dir * 1.5;
        playerPos.y += 0.5;
        takeDamage();
      }
    }
  });
}

function updateProjectiles() {
  enemyProjectiles.forEach((p, idx) => {
    p.mesh.position.x += p.velX;
    p.mesh.position.y += p.velY;
    p.mesh.position.z += p.velZ;
    p.life--;

    if (playerGroup.position.distanceTo(p.mesh.position) < 0.9) {
      scene.remove(p.mesh);
      enemyProjectiles.splice(idx, 1);
      takeDamage();
    } else if (p.life <= 0 || p.mesh.position.y < -5) {
      scene.remove(p.mesh);
      enemyProjectiles.splice(idx, 1);
    }
  });
}

function checkCrystalCollect() {
  crystals.forEach((c, idx) => {
    c.rotation.y += 0.03;
    if (playerGroup.position.distanceTo(c.position) < 1.2) {
      scene.remove(c);
      crystals.splice(idx, 1);
      sfx.playCorrect();
      state.score += 20;
      document.getElementById('score-val').innerText = state.score;
    }
  });
}

function checkPortalCollision() {
  if (quizPortal && playerGroup.position.distanceTo(quizPortal.position) < 1.8) {
    startQuizModal();
  }
}

function startQuizModal() {
  state.isQuizActive = true;
  state.currentQuestionIdx = 0;

  if (state.currentLevel === 1) state.levelQuizData = QUIZ_QUESTIONS.level1;
  else if (state.currentLevel === 2) state.levelQuizData = QUIZ_QUESTIONS.level2;
  else if (state.currentLevel === 3) state.levelQuizData = QUIZ_QUESTIONS.level3;

  document.getElementById('quiz-level-badge').innerText = state.levelQuizData.title;
  document.getElementById('quiz-modal').classList.remove('hidden');

  renderQuestion();
  focusInto('quiz-modal');
}

function renderQuestion() {
  const q = state.levelQuizData.questions[state.currentQuestionIdx];
  const totalInLevel = state.levelQuizData.questions.length;

  document.getElementById('quiz-question-num').innerText = `שאלה ${state.currentQuestionIdx + 1} מתוך ${totalInLevel}`;
  const prizeElem = document.getElementById('quiz-prize-badge');
  if (prizeElem) prizeElem.innerText = `פרס: ${q.prize}`;

  document.getElementById('question-text').innerText = q.question;

  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('next-question-btn').classList.add('hidden');

  const optionBtns = document.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach((btn, idx) => {
    btn.className = 'quiz-option-btn p-4 rounded-2xl text-right flex items-center gap-3 cursor-pointer';
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.querySelector('.option-text').innerText = q.options[idx];
  });

  startTimer();
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.timer = 25;
  const timerText = document.getElementById('timer-text');
  const timerCircle = document.getElementById('timer-progress');
  timerText.innerText = state.timer;
  timerCircle.style.strokeDashoffset = '0';

  state.timerInterval = setInterval(() => {
    state.timer--;
    sfx.playTimerTick();
    timerText.innerText = state.timer;

    const offset = 163.3 - (163.3 * state.timer / 25);
    timerCircle.style.strokeDashoffset = offset;

    if (state.timer <= 0) {
      clearInterval(state.timerInterval);
      // no answer chosen: only the right one lights up (in green)
      handleQuizAnswer(-1, null);
    }
  }, 1000);
}

const PRAISE = /^\s*(?:🏆\s*)?(?:נכון מאוד|בינגו|כל הכבוד|מדויק|מעולה|אלוף(?: המיליון)?)!\s*(?:🏆\s*)?/;

function handleQuizAnswer(selectedIndex, btnElement) {
  clearInterval(state.timerInterval);
  const q = state.levelQuizData.questions[state.currentQuestionIdx];
  const optionBtns = document.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackExp = document.getElementById('feedback-explanation');

  if (selectedIndex === q.correctIndex) {
    if (btnElement) btnElement.classList.add('correct');
    sfx.playCorrect();
    state.score += 100;
    state.correctAnswersCount++;
    document.getElementById('score-val').innerText = state.score;

    feedbackTitle.className = 'font-bold text-emerald-400 text-base mb-1 flex items-center gap-2';
    feedbackTitle.innerHTML = '<span aria-hidden="true">✅</span> נכון מאוד!';
  } else {
    if (btnElement) btnElement.classList.add('wrong');
    optionBtns[q.correctIndex].classList.add('correct');
    sfx.playWrong();

    feedbackTitle.className = 'font-bold text-red-400 text-base mb-1 flex items-center gap-2';
    feedbackTitle.innerHTML = selectedIndex === -1
      ? '<span aria-hidden="true">⏰</span> נגמר הזמן!'
      : '<span aria-hidden="true">❌</span> תשובה לא נכונה!';
  }

  // each explanation opens with praise ("נכון מאוד!"); after a wrong answer, or none, it starts at the reason
  const right = selectedIndex === q.correctIndex;
  feedbackExp.innerText = right ? q.explanation : q.explanation.replace(PRAISE, '');
  feedbackBox.classList.toggle('is-wrong', !right);
  feedbackBox.classList.remove('hidden');
  const nextBtn = document.getElementById('next-question-btn');
  nextBtn.classList.remove('hidden');
  // the answers are disabled now; keep keyboard users in the window, on the way forward
  nextBtn.focus({ preventScroll: true });
}

function advanceQuiz() {
  state.currentQuestionIdx++;
  const totalInLevel = state.levelQuizData.questions.length;

  if (state.currentQuestionIdx < totalInLevel) {
    renderQuestion();
  } else {
    document.getElementById('quiz-modal').classList.add('hidden');
    state.isQuizActive = false;

    if (state.currentLevel < 3) {
      sfx.playVictory();
      loadLevel(state.currentLevel + 1);
      countEvent('game_level', { level: state.currentLevel });
    } else {
      triggerVictory();
    }
  }
}

function useHint() {
  const q = state.levelQuizData.questions[state.currentQuestionIdx];
  let removed = 0;
  document.querySelectorAll('.quiz-option-btn').forEach((btn, idx) => {
    if (idx !== q.correctIndex && removed < 2) {
      btn.style.opacity = '0.3';
      btn.disabled = true;
      removed++;
    }
  });
}

function triggerVictory() {
  sfx.playVictory();
  if (princessCage) scene.remove(princessCage);
  // the game is over: the hero still stands in the portal, which would open the quiz again
  state.isPlaying = false;
  if (quizPortal) {
    scene.remove(quizPortal);
    quizPortal = null;
  }

  document.getElementById('final-score-val').innerText = "1,000,000 ₪";
  document.getElementById('final-correct-val').innerText = `${state.correctAnswersCount} / 15`;
  document.getElementById('victory-modal').classList.remove('hidden');
  focusInto('victory-modal');
  countEvent('game_win');
}

function updateHeartsHUD(isHit = false) {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    if (i < state.lives) {
      container.innerHTML += '<span class="heart text-2xl inline-block transition-transform duration-200 hover:scale-125 drop-shadow" aria-hidden="true">❤️</span>';
    } else {
      const isJustLost = (i === state.lives);
      if (isJustLost && isHit) {
        container.innerHTML += '<span class="heart text-3xl scale-150 animate-bounce inline-block" aria-hidden="true">💔</span>';
      } else {
        container.innerHTML += '<span class="heart heart-off text-2xl inline-block" aria-hidden="true">❤️</span>';
      }
    }
  }
  const countText = document.createElement('span');
  countText.className = 'lives-count text-xs font-bold text-red-400 mr-1 select-none';
  countText.innerText = `(${state.lives}/3 חיים)`;
  container.appendChild(countText);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  // a phone held upright sees too little to the sides at the usual angle
  camera.fov = camera.aspect < 0.8 ? 75 : 60;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('DOMContentLoaded', initEngine);
