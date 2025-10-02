import * as Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalBudget = data.budget || 0;
    this.artistName = this.registry.get('artistName') || 'INDIE_ARTIST';
    this.email = this.registry.get('email') || 'artist@music.com';
  }

  create() {
    this.cameras.main.setBackgroundColor('#000080');

    const { width, height } = this.cameras.main;

    // Victory animation
    const victoryText = this.add.text(width / 2, 80, 'RELEASE SUCCESSFUL!', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    });
    victoryText.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: victoryText,
      scale: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Stats display
    const statsContainer = this.add.container(width / 2, height / 2 - 50);

    const stats = [
      `Final Score: ${this.finalScore}/100 ${this.finalScore === 100 ? '(PERFECT!)' : ''}`,
      `Total Budget: €${this.finalBudget}`,
      `Competition Level: ${this.getCompetitionLevel(this.finalScore)}`,
      `Projected Streams: ${this.calculateStreams(this.finalScore, this.finalBudget)}`,
      `Release Quality: ${this.getReleaseQuality(this.finalScore)}`
    ];

    stats.forEach((stat, index) => {
      const statText = this.add.text(0, index * 25 - 50, stat, {
        fontSize: '18px',
        fontFamily: 'Courier New',
        color: index === 0 && this.finalScore === 100 ? '#FFD700' : '#FFFFFF'
      });
      statText.setOrigin(0.5, 0.5);
      statsContainer.add(statText);
    });

    // N8N Integration call-to-action
    const ctaText = this.add.text(width / 2, height - 120, 'Want to plan YOUR real music release?', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#00FF00'
    });
    ctaText.setOrigin(0.5, 0.5);

    const ctaButton = this.add.text(width / 2, height - 80, 'TRY MUSIC RELEASE PLANNER', {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      backgroundColor: '#00AA00',
      padding: { x: 20, y: 10 }
    });
    ctaButton.setOrigin(0.5, 0.5);
    ctaButton.setInteractive();

    ctaButton.on('pointerover', () => {
      ctaButton.setBackgroundColor('#00CC00');
    });

    ctaButton.on('pointerout', () => {
      ctaButton.setBackgroundColor('#00AA00');
    });

    ctaButton.on('pointerdown', () => {
      this.sendToN8N();
    });

    const menuButton = this.add.text(width / 2, height - 40, 'Return to Menu', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#CCCCCC'
    });
    menuButton.setOrigin(0.5, 0.5);
    menuButton.setInteractive();

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    // Victory particles
    const particles = this.add.particles(0, 0, null, {
      x: { min: 0, max: width },
      y: 0,
      speed: { min: 30, max: 80 },
      scale: { start: 1, end: 0 },
      lifespan: 4000,
      quantity: 2,
      tint: [0xFFD700, 0x00FF00, 0x00FFFF]
    });

    // Achievement check
    if (this.finalScore === 100) {
      this.showPerfectScoreAchievement();
    }
  }

  sendToN8N() {
    const payload = {
      artistName: this.artistName,
      email: this.email,
      genre: this.registry.get('genre') || 'pop',
      releaseType: 'single',
      budget: this.finalBudget,
      market: 'FR',
      newsletter: true,
      source: 'release_quest_game',
      gameScore: this.finalScore,
      competitionLevel: this.getCompetitionLevel(this.finalScore),
      worldsCompleted: '5/5',
      timestamp: new Date().toISOString()
    };

    console.log('Would send to n8n:', payload);

    // Simulate API call
    this.showMessage('Data sent! Check your email for your real release plan!');

    // In real implementation, would be:
    // fetch('https://admin-n8n.mdmcmusicads.com/webhook/music-release-planner', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   this.showMessage('Success! Check your email for your personalized release plan!');
    // })
    // .catch(error => {
    //   this.showMessage('Error connecting. Please try again later.');
    // });
  }

  showPerfectScoreAchievement() {
    const achievementBanner = this.add.container(400, 240);

    const bg = this.add.graphics();
    bg.fillStyle(0xFFD700, 0.9);
    bg.fillRect(-200, -30, 400, 60);
    achievementBanner.add(bg);

    const text = this.add.text(0, 0, 'ACHIEVEMENT UNLOCKED: THE PERFECT RELEASE!', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#000000'
    });
    text.setOrigin(0.5, 0.5);
    achievementBanner.add(text);

    achievementBanner.setScale(0);
    achievementBanner.setDepth(1000);

    this.tweens.add({
      targets: achievementBanner,
      scale: 1,
      duration: 500,
      ease: 'Back.out',
      onComplete: () => {
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: achievementBanner,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              achievementBanner.destroy();
            }
          });
        });
      }
    });
  }

  getCompetitionLevel(score) {
    if (score >= 85) return "Very Low";
    if (score >= 70) return "Low";
    if (score >= 55) return "Moderate";
    if (score >= 40) return "High";
    return "Very High";
  }

  getReleaseQuality(score) {
    if (score >= 90) return "Masterpiece";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Great";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    return "Needs Work";
  }

  calculateStreams(score, budget) {
    const baseStreams = 1000;
    const scoreMultiplier = Math.pow(score / 50, 2);
    const budgetMultiplier = Math.log10(budget + 100) / 2;
    const projected = Math.floor(baseStreams * scoreMultiplier * budgetMultiplier);
    return projected.toLocaleString();
  }

  showMessage(text) {
    const message = this.add.text(400, 200, text, {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#00FF00',
      stroke: '#000000',
      strokeThickness: 2
    });
    message.setOrigin(0.5, 0.5);
    message.setDepth(1000);

    this.tweens.add({
      targets: message,
      y: message.y - 30,
      alpha: 0,
      duration: 3000,
      onComplete: () => {
        message.destroy();
      }
    });
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