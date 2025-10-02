import * as Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import HUD from '../ui/HUD.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import BudgetSystem from '../systems/BudgetSystem.js';
import WeaponSystem from '../systems/WeaponSystem.js';

export default class World1_DataValley extends Phaser.Scene {
  constructor() {
    super({ key: 'World1_DataValley' });
  }

  create() {
    console.log('🌍 World1_DataValley - Démarrage');

    this.cameras.main.setBackgroundColor('#000000'); // Fond noir selon le design

    console.log('⚙️ Initialisation des systèmes...');
    this.scoreSystem = new ScoreSystem();
    this.budgetSystem = new BudgetSystem();

    console.log('🏗️ Création du monde...');
    this.createWorld();

    console.log('👤 Création du joueur...');
    this.createPlayer();

    console.log('⚔️ Initialisation des armes...');
    this.weaponSystem = new WeaponSystem(this);

    console.log('👹 Création des ennemis...');
    this.createEnemies();

    console.log('💎 Création des collectibles...');
    this.createCollectibles();

    console.log('🏛️ Création des temples...');
    this.createTemples();

    console.log('💥 Configuration des collisions...');
    this.setupCollisions();

    console.log('🎮 Création du HUD...');
    this.createHUD();

    console.log('⚡ Configuration des événements...');
    this.setupEvents();

    console.log('📹 Configuration de la caméra...');
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(1.5);

    console.log('🎬 Affichage de l\'intro...');
    this.showWorldIntro();

    console.log('✅ World1_DataValley - Prêt à jouer!');
  }

  createWorld() {
    const worldWidth = 50 * 32;
    const worldHeight = 30 * 32;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    const graphics = this.add.graphics();
    // Fond dégradé subtil au lieu de noir pur
    graphics.fillGradientStyle(0x0f1419, 0x1a1a2e, 0x16213e, 0x2a2a4e, 1);
    graphics.fillRect(0, 0, worldWidth, worldHeight);

    // Ajouter une grille pour visualiser le terrain (plus visible)
    graphics.lineStyle(1, 0x444466, 0.4); // Bleu gris plus visible
    for (let x = 0; x < 50; x++) {
      graphics.moveTo(x * 32, 0);
      graphics.lineTo(x * 32, worldHeight);
    }
    for (let y = 0; y < 30; y++) {
      graphics.moveTo(0, y * 32);
      graphics.lineTo(worldWidth, y * 32);
    }

    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 30; y++) {
        if (x === 0 || x === 49 || y === 0 || y === 29) {
          graphics.fillStyle(0xFF0000, 1); // Rouge (murs)
          graphics.fillRect(x * 32, y * 32, 32, 32);
          graphics.lineStyle(2, 0xFFFFFF); // Blanc (contours)
          graphics.strokeRect(x * 32, y * 32, 32, 32);
        } else if (Math.random() < 0.05) {
          graphics.fillStyle(0x444466, 0.8); // Bleu gris pour les obstacles
          graphics.fillRect(x * 32, y * 32, 32, 32);
          graphics.lineStyle(1, 0x666688, 1); // Contour plus visible
          graphics.strokeRect(x * 32, y * 32, 32, 32);
        }
      }
    }

    const hubX = 25 * 32;
    const hubY = 15 * 32;
    graphics.fillStyle(0xFFD700, 1); // Jaune (fonctions spéciales)
    graphics.fillCircle(hubX, hubY, 150);

    graphics.lineStyle(3, 0xFFFFFF, 0.5); // Blanc
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180;
      const endX = hubX + Math.cos(angle) * 400;
      const endY = hubY + Math.sin(angle) * 400;
      graphics.lineBetween(hubX, hubY, endX, endY);
    }
  }

  createPlayer() {
    const startX = 25 * 32;
    const startY = 15 * 32;

    // Récupérer les données du joueur depuis le registry
    const artistName = this.registry.get('artistName') || 'INDIE_ARTIST';
    const genre = this.registry.get('genre') || 'pop';

    console.log('🎮 Creating player:', { artistName, genre });

    this.player = new Player(this, startX, startY);

    // Ajouter une indication visuelle que le joueur est créé
    const welcomeText = this.add.text(startX, startY - 50, `Welcome ${artistName}!`, {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF', // Blanc
      stroke: '#FF0000', // Contour rouge
      strokeThickness: 2
    });
    welcomeText.setOrigin(0.5, 0.5);

    // Faire disparaître le texte après 3 secondes
    this.time.delayedCall(3000, () => {
      welcomeText.destroy();
    });
  }

  createEnemies() {
    this.enemies = this.physics.add.group();

    const enemyConfigs = [
      {
        type: 'api_bug',
        count: 8,
        config: {
          hp: 20,
          damage: 5,
          speed: 50,
          behavior: 'patrol_horizontal',
          drops: ['bronze_coin'],
          color: 0xFF00FF,
          size: 20
        }
      },
      {
        type: 'rate_limiter',
        count: 5,
        config: {
          hp: 30,
          damage: 8,
          speed: 30,
          behavior: 'static',
          special: 'invulnerable_5s_intervals',
          drops: ['silver_coin'],
          color: 0xFFAA00,
          size: 32
        }
      },
      {
        type: 'error_404',
        count: 6,
        config: {
          hp: 15,
          damage: 10,
          speed: 0,
          behavior: 'static',
          special: 'teleport_player_back',
          drops: ['bronze_coin'],
          color: 0xFF0000,
          size: 24
        }
      }
    ];

    enemyConfigs.forEach(({ type, count, config }) => {
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(100, 1500);
        const y = Phaser.Math.Between(100, 860);

        if (Math.abs(x - 800) > 200 || Math.abs(y - 480) > 200) {
          const enemy = new Enemy(this, x, y, { ...config, type });
          this.enemies.add(enemy);
        }
      }
    });
  }

  createCollectibles() {
    this.coins = this.physics.add.group();
    this.dataCrystals = this.physics.add.group();

    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(100, 1500);
      const y = Phaser.Math.Between(100, 860);

      const crystal = this.add.container(x, y);
      const graphics = this.add.graphics();
      graphics.fillStyle(0x00FFFF, 1);
      graphics.beginPath();
      graphics.moveTo(8, 0);
      graphics.lineTo(16, 8);
      graphics.lineTo(8, 16);
      graphics.lineTo(0, 8);
      graphics.closePath();
      graphics.fill();
      graphics.generateTexture('crystal_temp', 16, 16);
      graphics.destroy();

      const crystalSprite = this.add.sprite(0, 0, 'crystal_temp');
      crystal.add(crystalSprite);

      this.physics.add.existing(crystal);
      crystal.body.setSize(16, 16);

      this.tweens.add({
        targets: crystalSprite,
        rotation: Math.PI * 2,
        duration: 3000,
        repeat: -1
      });

      this.tweens.add({
        targets: crystal,
        y: crystal.y - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });

      this.dataCrystals.add(crystal);
    }
  }

  createTemples() {
    this.temples = [];
    const templeNames = ['MusicBrainz', 'YouTube', 'Google Trends', 'iTunes', 'Spotify'];
    const templeAngles = [0, 72, 144, 216, 288];

    templeNames.forEach((name, i) => {
      const angle = (templeAngles[i] - 90) * Math.PI / 180;
      const x = 800 + Math.cos(angle) * 350;
      const y = 480 + Math.sin(angle) * 350;

      const temple = this.add.container(x, y);

      const graphics = this.add.graphics();
      graphics.fillStyle(0x6666AA, 1);
      graphics.fillRect(-40, -40, 80, 80);
      graphics.fillStyle(0x8888CC, 1);
      graphics.fillRect(-30, -30, 60, 60);
      temple.add(graphics);

      const text = this.add.text(0, -60, name, {
        fontSize: '14px',
        fontFamily: 'Courier New',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2
      });
      text.setOrigin(0.5, 0.5);
      temple.add(text);

      this.physics.add.existing(temple);
      temple.body.setSize(80, 80);
      temple.body.setImmovable(true);
      temple.name = name;
      temple.completed = false;

      this.temples.push(temple);
    });
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      if (!enemy.isDead) {
        player.takeDamage(enemy.damage || 5);
      }
    });

    this.physics.add.overlap(this.player, this.coins, (player, coin) => {
      if (coin.value) {
        this.budgetSystem.addBudget(coin.value);
        coin.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.dataCrystals, (player, crystal) => {
      this.scoreSystem.collectDataCrystal();
      crystal.destroy();
    });

    this.physics.add.overlap(this.player, this.temples, (player, temple) => {
      if (this.player.isInteracting() && !temple.completed) {
        this.enterTemple(temple);
      }
    });

    if (this.weaponSystem) {
      this.physics.add.overlap(this.weaponSystem.getProjectiles(), this.enemies, (projectile, enemy) => {
        if (!enemy.isDead) {
          enemy.takeDamage(projectile.damage || 10);
          projectile.destroy();
        }
      });
    }
  }

  createHUD() {
    this.hud = new HUD(this);

    this.scoreSystem.events.on('scoreChanged', (score) => {
      this.hud.updateScore(score);
    });

    this.budgetSystem.events.on('budgetChanged', (budget) => {
      this.hud.updateBudget(budget);
    });

    this.events.on('playerHealthChanged', (current, max) => {
      this.hud.updateHealth(current, max);
    });

    this.events.on('weaponSwitched', (weaponKey) => {
      const weapon = this.weaponSystem.getCurrentWeapon();
      this.hud.updateWeapon(weapon.name);
    });

    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateBudget(this.budgetSystem.getBudget());
    this.hud.updateHealth(this.player.hp, this.player.maxHp);
    this.hud.updateWeapon('API Guitar');
    this.hud.updateTimeline('J-45');
  }

  setupEvents() {
    this.events.on('playerDied', () => {
      this.scene.start('GameOverScene', {
        score: this.scoreSystem.getScore(),
        budget: this.budgetSystem.getBudget(),
        world: 1
      });
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  enterTemple(temple) {
    temple.completed = true;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, 1600, 960);
    overlay.setScrollFactor(0);
    overlay.setDepth(900);

    const puzzleContainer = this.add.container(400, 240);
    puzzleContainer.setScrollFactor(0);
    puzzleContainer.setDepth(1000);

    const puzzleBg = this.add.graphics();
    puzzleBg.fillStyle(0x2a2a4e, 1);
    puzzleBg.fillRect(-200, -150, 400, 300);
    puzzleBg.strokeRect(-200, -150, 400, 300);
    puzzleContainer.add(puzzleBg);

    const title = this.add.text(0, -120, `${temple.name} Temple`, {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    title.setOrigin(0.5, 0.5);
    puzzleContainer.add(title);

    const puzzleText = this.add.text(0, -50, 'Match 3 data types to proceed:', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    puzzleText.setOrigin(0.5, 0.5);
    puzzleContainer.add(puzzleText);

    const dataTypes = ['Artist', 'Track', 'Album', 'Genre', 'Date'];
    const buttons = [];

    dataTypes.forEach((type, i) => {
      const button = this.add.text(-150 + (i * 75), 0, type, {
        fontSize: '14px',
        fontFamily: 'Courier New',
        color: '#FFFFFF',
        backgroundColor: '#444466',
        padding: { x: 10, y: 5 }
      });
      button.setOrigin(0.5, 0.5);
      button.setInteractive();

      button.on('pointerdown', () => {
        button.setBackgroundColor('#00FF00');
        buttons.push(button);

        if (buttons.length === 3) {
          this.time.delayedCall(500, () => {
            overlay.destroy();
            puzzleContainer.destroy();
            this.scoreSystem.completeQuest();
            this.showMessage(`${temple.name} Temple completed!`);
            this.checkAllTemplesCompleted();
          });
        }
      });

      puzzleContainer.add(button);
    });
  }

  checkAllTemplesCompleted() {
    const allCompleted = this.temples.every(t => t.completed);
    if (allCompleted) {
      this.showMessage('All temples completed! Boss unlocked!');
      this.spawnBoss();
    }
  }

  spawnBoss() {
    const bossX = 800;
    const bossY = 480;

    this.boss = this.add.container(bossX, bossY);

    const graphics = this.add.graphics();
    graphics.fillStyle(0x8B0000, 1);
    graphics.fillRect(-64, -64, 128, 128);
    graphics.fillStyle(0xFF0000, 1);
    graphics.fillRect(-48, -48, 96, 96);
    this.boss.add(graphics);

    const bossText = this.add.text(0, -80, 'TIMEOUT DRAGON', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    });
    bossText.setOrigin(0.5, 0.5);
    this.boss.add(bossText);

    this.physics.add.existing(this.boss);
    this.boss.body.setSize(128, 128);
    this.boss.body.setImmovable(true);

    this.boss.hp = 200;
    this.boss.maxHp = 200;
    this.boss.phase = 1;

    this.createBossHealthBar();
    this.startBossFight();
  }

  createBossHealthBar() {
    this.bossHealthBar = this.add.container(400, 50);
    this.bossHealthBar.setScrollFactor(0);
    this.bossHealthBar.setDepth(1000);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(-150, -10, 300, 20);
    this.bossHealthBar.add(bg);

    const bar = this.add.graphics();
    this.bossHealthBar.bar = bar;
    this.bossHealthBar.add(bar);

    this.updateBossHealth();
  }

  updateBossHealth() {
    if (!this.boss || !this.bossHealthBar) return;

    const percentage = this.boss.hp / this.boss.maxHp;
    const width = 296 * percentage;

    this.bossHealthBar.bar.clear();
    this.bossHealthBar.bar.fillStyle(0xFF0000, 1);
    this.bossHealthBar.bar.fillRect(-148, -8, width, 16);
  }

  startBossFight() {
    this.bossAttackTimer = this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.boss && this.boss.hp > 0) {
          this.bossAttack();
        }
      },
      loop: true
    });

    this.physics.add.overlap(this.weaponSystem.getProjectiles(), this.boss, (projectile, boss) => {
      this.damageBoss(projectile.damage || 10);
      projectile.destroy();
    });
  }

  bossAttack() {
    if (!this.boss || !this.player) return;

    if (this.boss.phase === 1) {
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72) * Math.PI / 180;
        this.createErrorProjectile(this.boss.x, this.boss.y, angle);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        this.createErrorProjectile(this.boss.x, this.boss.y, angle);
      }
    }
  }

  createErrorProjectile(x, y, angle) {
    const projectile = this.add.container(x, y);

    const graphics = this.add.graphics();
    graphics.fillStyle(0xFF0000, 1);
    graphics.fillCircle(0, 0, 8);
    projectile.add(graphics);

    const errorText = this.add.text(0, 0, '500', {
      fontSize: '10px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    errorText.setOrigin(0.5, 0.5);
    projectile.add(errorText);

    this.physics.add.existing(projectile);
    projectile.body.setVelocity(
      Math.cos(angle) * 200,
      Math.sin(angle) * 200
    );

    this.physics.add.overlap(projectile, this.player, () => {
      this.player.takeDamage(10);
      projectile.destroy();
    });

    this.time.delayedCall(3000, () => {
      if (projectile.active) projectile.destroy();
    });
  }

  damageBoss(damage) {
    if (!this.boss) return;

    this.boss.hp -= damage;
    this.updateBossHealth();

    if (this.boss.hp <= 100 && this.boss.phase === 1) {
      this.boss.phase = 2;
      this.showMessage('Boss enters phase 2!');
    }

    if (this.boss.hp <= 0) {
      this.defeatBoss();
    }
  }

  defeatBoss() {
    if (this.bossAttackTimer) this.bossAttackTimer.remove();

    this.tweens.add({
      targets: this.boss,
      scale: 0,
      rotation: Math.PI * 2,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.boss.destroy();
        this.bossHealthBar.destroy();
        this.completeWorld();
      }
    });

    this.scoreSystem.addScore(20);
    this.budgetSystem.addBudget(200);
    this.weaponSystem.unlockWeapon('synth_budget');
  }

  completeWorld() {
    this.showMessage('World 1 Complete! API Guitar Unlocked!');

    this.time.delayedCall(3000, () => {
      this.saveProgress();
      this.scene.start('World2_ScoringMaze', {
        score: this.scoreSystem.getScore(),
        budget: this.budgetSystem.getBudget()
      });
    });
  }

  saveProgress() {
    const saveData = {
      currentWorld: 2,
      score: this.scoreSystem.getScore(),
      budget: this.budgetSystem.getBudget(),
      unlockedWeapons: this.weaponSystem.unlockedWeapons
    };

    localStorage.setItem('releaseQuestSave', JSON.stringify(saveData));
  }

  showWorldIntro() {
    // Fond semi-transparent pour l'intro
    const introBg = this.add.graphics();
    introBg.fillStyle(0x000000, 0.8);
    introBg.fillRect(0, 0, 800, 480);
    introBg.setScrollFactor(0);
    introBg.setDepth(999);

    const introText = this.add.text(400, 240, 'WORLD 1: DATA VALLEY', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FF0000', // Rouge (thème agence)
      stroke: '#FFFFFF', // Blanc
      strokeThickness: 4
    });
    introText.setOrigin(0.5, 0.5);
    introText.setScrollFactor(0);
    introText.setDepth(1000);

    const subtitleText = this.add.text(400, 300, 'Collect API Data from 5 Temples', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      stroke: '#FF0000', // Rouge
      strokeThickness: 2
    });
    subtitleText.setOrigin(0.5, 0.5);
    subtitleText.setScrollFactor(0);
    subtitleText.setDepth(1000);

    // Instructions de contrôle
    const controlsText = this.add.text(400, 360, 'Use WASD or Arrow Keys to move\nSPACE to attack', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      align: 'center'
    });
    controlsText.setOrigin(0.5, 0.5);
    controlsText.setScrollFactor(0);
    controlsText.setDepth(1000);

    this.tweens.add({
      targets: [introText, subtitleText, introBg, controlsText],
      alpha: 0,
      duration: 3000,
      delay: 2000,
      onComplete: () => {
        introText.destroy();
        subtitleText.destroy();
        introBg.destroy();
        controlsText.destroy();
      }
    });
  }

  showMessage(text) {
    const message = this.add.text(400, 400, text, {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#00FF00',
      stroke: '#000000',
      strokeThickness: 2
    });
    message.setOrigin(0.5, 0.5);
    message.setScrollFactor(0);
    message.setDepth(1000);

    this.tweens.add({
      targets: message,
      y: message.y - 30,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        message.destroy();
      }
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }

    if (this.enemies) {
      this.enemies.children.entries.forEach(enemy => {
        if (enemy.update) enemy.update();
      });
    }
  }
}