export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalBudget = data.budget || 0;
    this.world = data.world || 1;
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    const { width, height } = this.cameras.main;

    const gameOverText = this.add.text(width / 2, 100, 'GAME OVER', {
      fontSize: '64px',
      fontFamily: 'Courier New',
      color: '#FF0000',
      stroke: '#000000',
      strokeThickness: 6
    });
    gameOverText.setOrigin(0.5, 0.5);

    const statsContainer = this.add.container(width / 2, height / 2);

    const stats = [
      `Final Score: ${this.finalScore}/100`,
      `Budget Accumulated: €${this.finalBudget}`,
      `World Reached: ${this.world}/5`,
      `Competition Level: ${this.getCompetitionLevel(this.finalScore)}`
    ];

    stats.forEach((stat, index) => {
      const statText = this.add.text(0, index * 30 - 45, stat, {
        fontSize: '20px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      });
      statText.setOrigin(0.5, 0.5);
      statsContainer.add(statText);
    });

    const retryButton = this.add.text(width / 2 - 100, height - 100, 'RETRY', {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      backgroundColor: '#444444',
      padding: { x: 20, y: 10 }
    });
    retryButton.setOrigin(0.5, 0.5);
    retryButton.setInteractive();

    const menuButton = this.add.text(width / 2 + 100, height - 100, 'MAIN MENU', {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      backgroundColor: '#444444',
      padding: { x: 20, y: 10 }
    });
    menuButton.setOrigin(0.5, 0.5);
    menuButton.setInteractive();

    retryButton.on('pointerover', () => {
      retryButton.setBackgroundColor('#666666');
    });

    retryButton.on('pointerout', () => {
      retryButton.setBackgroundColor('#444444');
    });

    retryButton.on('pointerdown', () => {
      this.scene.start(`World${this.world}_${this.getWorldName(this.world)}`);
    });

    menuButton.on('pointerover', () => {
      menuButton.setBackgroundColor('#666666');
    });

    menuButton.on('pointerout', () => {
      menuButton.setBackgroundColor('#444444');
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Add some particle effects
    const particles = this.add.particles(0, 0, null, {
      x: { min: 0, max: width },
      y: 0,
      speed: { min: 20, max: 50 },
      scale: { start: 0.5, end: 0 },
      lifespan: 6000,
      quantity: 1,
      tint: 0xFF0000
    });
  }

  getCompetitionLevel(score) {
    if (score >= 85) return "Very Low";
    if (score >= 70) return "Low";
    if (score >= 55) return "Moderate";
    if (score >= 40) return "High";
    return "Very High";
  }

  getWorldName(worldNumber) {
    const worldNames = {
      1: 'DataValley',
      2: 'ScoringMaze',
      3: 'FridayForest',
      4: 'BudgetMountain',
      5: 'ReleaseCastle'
    };
    return worldNames[worldNumber] || 'DataValley';
  }

  shutdown() {
    // Nettoyer les objets interactifs avant la destruction
    if (this.children && this.children.list) {
      this.children.list.forEach(child => {
        if (child && child.removeInteractive) {
          try {
            child.removeInteractive();
          } catch (e) {
            // Ignorer les erreurs de nettoyage
          }
        }
      });
    }

    super.shutdown();
  }
}