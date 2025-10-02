import * as Phaser from 'phaser';
import Player from '../entities/Player.js';
import HUD from '../ui/HUD.js';
import ScoreSystem from '../systems/ScoreSystem.js';
import BudgetSystem from '../systems/BudgetSystem.js';
import WeaponSystem from '../systems/WeaponSystem.js';

export default class World4_BudgetMountain extends Phaser.Scene {
  constructor() {
    super({ key: 'World4_BudgetMountain' });
  }

  init(data) {
    this.initialScore = data.score || 50;
    this.initialBudget = data.budget || 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#3a2a5a');

    this.scoreSystem = new ScoreSystem();
    this.scoreSystem.addScore(this.initialScore - 50);
    this.budgetSystem = new BudgetSystem();
    this.budgetSystem.addBudget(this.initialBudget);

    this.createMountain();
    this.createPlayer();
    this.weaponSystem = new WeaponSystem(this);
    this.createHUD();

    this.showWorldIntro();
  }

  createMountain() {
    const graphics = this.add.graphics();
    
    // Mountain gradient
    for (let y = 0; y < 480; y++) {
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        { r: 58, g: 42, b: 90 },
        { r: 120, g: 100, b: 150 },
        480,
        y
      );
      graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
      graphics.fillRect(0, y, 800, 1);
    }

    // Mountain peaks
    graphics.fillStyle(0x4a3a6a, 1);
    graphics.beginPath();
    graphics.moveTo(0, 480);
    graphics.lineTo(200, 200);
    graphics.lineTo(400, 350);
    graphics.lineTo(600, 150);
    graphics.lineTo(800, 300);
    graphics.lineTo(800, 480);
    graphics.closePath();
    graphics.fill();
  }

  createPlayer() {
    this.player = new Player(this, 400, 400);
  }

  createHUD() {
    this.hud = new HUD(this);
    this.hud.updateScore(this.scoreSystem.getScore());
    this.hud.updateBudget(this.budgetSystem.getBudget());
    this.hud.updateHealth(this.player.hp, this.player.maxHp);
    this.hud.updateWeapon('Viral Violin');
    this.hud.updateTimeline('J-7');
  }

  showWorldIntro() {
    const introText = this.add.text(400, 240, 'WORLD 4: BUDGET MOUNTAIN', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    introText.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(400, 300, 'Climb to Launch Day', {
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
      this.scene.start('World5_ReleaseCastle', {
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