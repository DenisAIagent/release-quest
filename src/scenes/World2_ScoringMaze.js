import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import HUD from '../ui/HUD.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import BudgetSystem from '../systems/BudgetSystem.js';
import WeaponSystem from '../systems/WeaponSystem.js';

export default class World2_ScoringMaze extends Phaser.Scene {
  constructor() {
    super({ key: 'World2_ScoringMaze' });
  }

  init(data) {
    this.initialScore = data.score || 50;
    this.initialBudget = data.budget || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#2a1a3e');

    this.scoreSystem = new ScoreSystem();
    this.scoreSystem.addScore(this.initialScore - 50);
    this.budgetSystem = new BudgetSystem();
    this.budgetSystem.addBudget(this.initialBudget);

    this.createMaze();
    this.createPlayer();
    this.weaponSystem = new WeaponSystem(this);
    this.weaponSystem.unlockWeapon('synth_budget');
    this.createEnemies();
    this.createScoreDoors();
    this.createGenreHall();
    this.setupCollisions();
    this.createHUD();

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(1.2);

    this.showWorldIntro();
  }

  createMaze() {
    const mazeWidth = 60;
    const mazeHeight = 40;
    const cellSize = 32;

    this.physics.world.setBounds(0, 0, mazeWidth * cellSize, mazeHeight * cellSize);

    const graphics = this.add.graphics();

    for (let x = 0; x < mazeWidth; x++) {
      for (let y = 0; y < mazeHeight; y++) {
        if (x % 5 === 0 || y % 5 === 0 || x === 0 || x === mazeWidth - 1 || y === 0 || y === mazeHeight - 1) {
          graphics.fillStyle(0x4a3a6e, 1);
          graphics.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else {
          graphics.fillStyle(0x2a1a3e, 1);
          graphics.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  createPlayer() {
    this.player = new Player(this, 100, 100);
  }

  createEnemies() {
    this.enemies = this.physics.add.group();

    const enemyTypes = [
      {
        name: 'major_competitor',
        hp: 50,
        damage: 15,
        speed: 40,
        special: 'steal_score_points',
        behavior: 'chase_player',
        color: 0xFF6666,
        size: 32
      },
      {
        name: 'budget_leech',
        hp: 25,
        damage: 5,
        speed: 60,
        special: 'steal_budget_coins',
        behavior: 'random_walk',
        color: 0x9966FF,
        size: 24
      }
    ];

    for (let i = 0; i < 10; i++) {
      const type = Phaser.Math.RND.pick(enemyTypes);
      const x = Phaser.Math.Between(200, 1800);
      const y = Phaser.Math.Between(200, 1000);
      const enemy = new Enemy(this, x, y, type);
      this.enemies.add(enemy);
    }
  }

  createScoreDoors() {
    const doors = [
      { score: 40, label: 'Bronze Door', color: 0xCD7F32, x: 600, y: 400 },
      { score: 70, label: 'Silver Door', color: 0xC0C0C0, x: 1000, y: 400 },
      { score: 85, label: 'Gold Door', color: 0xFFD700, x: 1400, y: 400 }
    ];

    this.doors = [];
    doors.forEach(door => {
      const doorContainer = this.add.container(door.x, door.y);

      const graphics = this.add.graphics();
      graphics.fillStyle(door.color, 1);
      graphics.fillRect(-40, -60, 80, 120);
      doorContainer.add(graphics);

      const text = this.add.text(0, -80, door.label, {
        fontSize: '14px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      });
      text.setOrigin(0.5, 0.5);
      doorContainer.add(text);

      const scoreReq = this.add.text(0, 80, `Score ≥${door.score}`, {
        fontSize: '12px',
        fontFamily: 'Courier New',
        color: '#FFFF00'
      });
      scoreReq.setOrigin(0.5, 0.5);
      doorContainer.add(scoreReq);

      this.physics.add.existing(doorContainer);
      doorContainer.body.setImmovable(true);
      doorContainer.scoreRequired = door.score;

      this.doors.push(doorContainer);
    });
  }

  createGenreHall() {
    const genres = ['pop', 'rock', 'electro', 'rap', 'jazz', 'metal', 'synthwave'];
    const hallX = 960;
    const hallY = 600;

    this.genrePortals = [];

    genres.forEach((genre, i) => {
      const angle = (i * (360 / genres.length)) * Math.PI / 180;
      const x = hallX + Math.cos(angle) * 150;
      const y = hallY + Math.sin(angle) * 150;

      const portal = this.add.container(x, y);

      const graphics = this.add.graphics();
      graphics.fillStyle(0x00FFFF, 0.5);
      graphics.fillCircle(0, 0, 30);
      portal.add(graphics);

      const text = this.add.text(0, 0, genre.toUpperCase(), {
        fontSize: '12px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      });
      text.setOrigin(0.5, 0.5);
      portal.add(text);

      this.physics.add.existing(portal);
      portal.body.setCircle(30);
      portal.genre = genre;

      this.genrePortals.push(portal);
    });
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      if (!enemy.isDead) {
        player.takeDamage(enemy.damage || 5);
      }
    });

    this.physics.add.overlap(this.player, this.doors, (player, door) => {
      if (this.scoreSystem.getScore() >= door.scoreRequired) {
        door.destroy();
        this.showMessage('Door opened!');
      } else {
        this.showMessage(`Need score ≥${door.scoreRequired} to pass!`);
      }
    });

    this.physics.add.overlap(this.player, this.genrePortals, (player, portal) => {
      if (this.player.isInteracting() && !this.genreChosen) {
        this.chooseGenre(portal.genre);
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

  chooseGenre(genre) {
    this.genreChosen = true;
    this.scoreSystem.setGenre(genre);
    this.showMessage(`Genre chosen: ${genre.toUpperCase()}!`);

    this.genrePortals.forEach(portal => {
      if (portal.genre !== genre) {
        portal.destroy();
      }
    });

    this.time.delayedCall(2000, () => {
      this.spawnBoss();
    });
  }

  spawnBoss() {
    this.boss = this.add.container(960, 600);

    const currentScore = this.scoreSystem.getScore();
    let bossColor, bossSize, bossSpeed;

    if (currentScore < 40) {
      bossColor = 0xFF0000;
      bossSize = 80;
      bossSpeed = 100;
    } else if (currentScore < 70) {
      bossColor = 0xFFFF00;
      bossSize = 60;
      bossSpeed = 70;
    } else {
      bossColor = 0x00FF00;
      bossSize = 40;
      bossSpeed = 50;
    }

    const graphics = this.add.graphics();
    graphics.fillStyle(bossColor, 1);
    graphics.fillRect(-bossSize/2, -bossSize/2, bossSize, bossSize);
    this.boss.add(graphics);

    const text = this.add.text(0, -bossSize, 'THE ALGORITHM', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    text.setOrigin(0.5, 0.5);
    this.boss.add(text);

    this.physics.add.existing(this.boss);
    this.boss.body.setSize(bossSize, bossSize);
    this.boss.hp = 300;
    this.boss.speed = bossSpeed;

    this.startBossFight();
  }

  startBossFight() {
    this.bossMovement = this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.boss && this.player) {
          const angle = Phaser.Math.Angle.Between(
            this.boss.x, this.boss.y,
            this.player.x, this.player.y
          );
          this.boss.body.setVelocity(
            Math.cos(angle) * this.boss.speed,
            Math.sin(angle) * this.boss.speed
          );
        }
      },
      loop: true
    });

    this.physics.add.overlap(this.weaponSystem.getProjectiles(), this.boss, (projectile, boss) => {
      this.boss.hp -= projectile.damage || 10;
      projectile.destroy();

      if (this.boss.hp <= 0) {
        this.defeatBoss();
      }
    });

    this.physics.add.collider(this.player, this.boss, () => {
      this.player.takeDamage(20);
    });
  }

  defeatBoss() {
    if (this.bossMovement) this.bossMovement.remove();

    this.tweens.add({
      targets: this.boss,
      scale: 0,
      rotation: Math.PI * 4,
      duration: 1000,
      onComplete: () => {
        this.boss.destroy();
        this.completeWorld();
      }
    });

    this.scoreSystem.addScore(25);
    this.budgetSystem.addBudget(500);
    this.weaponSystem.unlockWeapon('drums_tempo');
  }

  completeWorld() {
    this.showMessage('World 2 Complete! Budget Synthesizer Unlocked!');

    this.time.delayedCall(3000, () => {
      this.saveProgress();
      this.scene.start('World3_FridayForest', {
        score: this.scoreSystem.getScore(),
        budget: this.budgetSystem.getBudget()
      });
    });
  }

  saveProgress() {
    const saveData = {
      currentWorld: 3,
      score: this.scoreSystem.getScore(),
      budget: this.budgetSystem.getBudget(),
      unlockedWeapons: this.weaponSystem.unlockedWeapons,
      genre: this.scoreSystem.genre
    };

    localStorage.setItem('releaseQuestSave', JSON.stringify(saveData));
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

    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateBudget(this.budgetSystem.getBudget());
    this.hud.updateHealth(this.player.hp, this.player.maxHp);
    this.hud.updateWeapon('Budget Synthesizer');
    this.hud.updateTimeline('J-30');
  }

  showWorldIntro() {
    const introText = this.add.text(400, 240, 'WORLD 2: SCORING MAZE', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    });
    introText.setOrigin(0.5, 0.5);
    introText.setScrollFactor(0);

    this.tweens.add({
      targets: introText,
      alpha: 0,
      duration: 3000,
      delay: 2000,
      onComplete: () => {
        introText.destroy();
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