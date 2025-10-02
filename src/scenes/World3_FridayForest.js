import Player from '../entities/Player.js';
import HUD from '../ui/HUD.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import BudgetSystem from '../systems/BudgetSystem.js';
import WeaponSystem from '../systems/WeaponSystem.js';

export default class World3_FridayForest extends Phaser.Scene {
  constructor() {
    super({ key: 'World3_FridayForest' });
  }

  init(data) {
    this.initialScore = data.score || 50;
    this.initialBudget = data.budget || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a3e1a');

    this.scoreSystem = new ScoreSystem();
    this.scoreSystem.addScore(this.initialScore - 50);
    this.budgetSystem = new BudgetSystem();
    this.budgetSystem.addBudget(this.initialBudget);

    this.createForest();
    this.createPlayer();
    this.weaponSystem = new WeaponSystem(this);
    this.createHUD();

    this.showWorldIntro();
  }

  createForest() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2a5e2a, 1);
    graphics.fillRect(0, 0, 800, 480);

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 480;
      graphics.fillStyle(0x1a3e1a, 0.8);
      graphics.fillCircle(x, y, 20 + Math.random() * 30);
    }
  }

  createPlayer() {
    this.player = new Player(this, 400, 400);
  }

  createHUD() {
    this.hud = new HUD(this);
    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateBudget(this.budgetSystem.getBudget());
    this.hud.updateHealth(this.player.hp, this.player.maxHp);
    this.hud.updateWeapon('Tempo Drums');
    this.hud.updateTimeline('J-14');
  }

  showWorldIntro() {
    const introText = this.add.text(400, 240, 'WORLD 3: FRIDAY FOREST', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    introText.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(400, 300, 'Choose Your Release Friday', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    subtitle.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: [introText, subtitle],
      alpha: 0,
      duration: 3000,
      delay: 2000,
      onComplete: () => {
        introText.destroy();
        subtitle.destroy();
        this.proceedToNextWorld();
      }
    });
  }

  proceedToNextWorld() {
    this.time.delayedCall(2000, () => {
      this.scene.start('World4_BudgetMountain', {
        score: this.scoreSystem.getScore(),
        budget: this.budgetSystem.getBudget()
      });
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }
}