import * as Phaser from 'phaser';
import Player from '../entities/Player.js';
import HUD from '../ui/HUD.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import BudgetSystem from '../systems/BudgetSystem.js';
import WeaponSystem from '../systems/WeaponSystem.js';

export default class World5_ReleaseCastle extends Phaser.Scene {
  constructor() {
    super({ key: 'World5_ReleaseCastle' });
  }

  init(data) {
    this.initialScore = data.score || 50;
    this.initialBudget = data.budget || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#2a1a4a');

    this.scoreSystem = new ScoreSystem();
    this.scoreSystem.addScore(this.initialScore - 50);
    this.budgetSystem = new BudgetSystem();
    this.budgetSystem.addBudget(this.initialBudget);

    this.createCastle();
    this.createPlayer();
    this.weaponSystem = new WeaponSystem(this);
    this.createHUD();

    this.showWorldIntro();
  }

  createCastle() {
    const graphics = this.add.graphics();
    
    // Castle background
    graphics.fillStyle(0x3a2a5a, 1);
    graphics.fillRect(0, 0, 800, 480);

    // Castle walls
    graphics.fillStyle(0x5a4a7a, 1);
    graphics.fillRect(200, 100, 400, 300);

    // Castle towers
    graphics.fillStyle(0x6a5a8a, 1);
    graphics.fillRect(150, 50, 100, 400);
    graphics.fillRect(550, 50, 100, 400);

    // Castle gate
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(350, 300, 100, 100);
  }

  createPlayer() {
    this.player = new Player(this, 400, 400);
  }

  createHUD() {
    this.hud = new HUD(this);
    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateBudget(this.budgetSystem.getBudget());
    this.hud.updateHealth(this.player.hp, this.player.maxHp);
    this.hud.updateWeapon('Golden Microphone');
    this.hud.updateTimeline('J+0');
  }

  showWorldIntro() {
    const introText = this.add.text(400, 240, 'WORLD 5: RELEASE CASTLE', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    introText.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(400, 300, 'The Final Launch', {
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
        this.proceedToVictory();
      }
    });
  }

  proceedToVictory() {
    this.time.delayedCall(2000, () => {
      this.scene.start('VictoryScene', {
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