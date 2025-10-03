export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.elements = {};

    this.create();
  }

  create() {
    const padding = 20;
    const textStyle = {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2
    };

    // Utiliser les dimensions de la caméra au lieu de game.config
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    this.elements.hpBar = this.createHealthBar(padding, padding);

    this.elements.budgetText = this.scene.add.text(
      width / 2,
      padding,
      'BUDGET: €0',
      { ...textStyle, fontSize: '18px' }
    );
    this.elements.budgetText.setOrigin(0.5, 0);
    this.elements.budgetText.setScrollFactor(0);
    this.elements.budgetText.setDepth(1000);

    this.elements.scoreText = this.scene.add.text(
      width - padding,
      padding,
      'SCORE: 50',
      { ...textStyle, fontSize: '20px', color: '#FFD700' }
    );
    this.elements.scoreText.setOrigin(1, 0);
    this.elements.scoreText.setScrollFactor(0);
    this.elements.scoreText.setDepth(1000);

    this.elements.competitionText = this.scene.add.text(
      width - padding,
      padding + 25,
      'COMPETITION: MODERATE',
      { ...textStyle, fontSize: '14px' }
    );
    this.elements.competitionText.setOrigin(1, 0);
    this.elements.competitionText.setScrollFactor(0);
    this.elements.competitionText.setDepth(1000);

    this.elements.weaponText = this.scene.add.text(
      padding,
      height - padding,
      'WEAPON: API Guitar',
      { ...textStyle, fontSize: '14px' }
    );
    this.elements.weaponText.setOrigin(0, 1);
    this.elements.weaponText.setScrollFactor(0);
    this.elements.weaponText.setDepth(1000);

    this.elements.timelineText = this.scene.add.text(
      width - padding,
      height - padding,
      'TIMELINE: J-45',
      { ...textStyle, fontSize: '14px' }
    );
    this.elements.timelineText.setOrigin(1, 1);
    this.elements.timelineText.setScrollFactor(0);
    this.elements.timelineText.setDepth(1000);
  }

  createHealthBar(x, y) {
    const barWidth = 150;
    const barHeight = 20;

    const container = this.scene.add.container(x, y);

    const background = this.scene.add.graphics();
    background.fillStyle(0x000000, 0.8);
    background.fillRect(0, 0, barWidth, barHeight);
    container.add(background);

    const healthBar = this.scene.add.graphics();
    container.add(healthBar);

    const text = this.scene.add.text(barWidth / 2, barHeight / 2, 'HP: 100/100', {
      fontSize: '12px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    text.setOrigin(0.5, 0.5);
    container.add(text);

    container.setScrollFactor(0);
    container.setDepth(1000);

    container.healthBar = healthBar;
    container.text = text;
    container.maxWidth = barWidth - 4;

    return container;
  }

  updateHealth(current, max) {
    const container = this.elements.hpBar;
    const percentage = current / max;
    const width = container.maxWidth * percentage;

    container.healthBar.clear();

    let color;
    if (percentage > 0.6) color = 0x00FF00;
    else if (percentage > 0.3) color = 0xFFFF00;
    else color = 0xFF0000;

    container.healthBar.fillStyle(color, 1);
    container.healthBar.fillRect(2, 2, width, 16);

    container.text.setText(`HP: ${current}/${max}`);
  }

  updateBudget(budget) {
    this.elements.budgetText.setText(`BUDGET: €${budget}`);

    this.scene.tweens.add({
      targets: this.elements.budgetText,
      scale: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power1'
    });
  }

  updateScore(score) {
    this.elements.scoreText.setText(`SCORE: ${score}`);

    const competition = this.getCompetitionLevel(score);
    this.elements.competitionText.setText(`COMPETITION: ${competition.level}`);
    this.elements.competitionText.setColor(this.colorToHex(competition.color));

    this.scene.tweens.add({
      targets: this.elements.scoreText,
      scale: 1.1,
      duration: 100,
      yoyo: true,
      ease: 'Power1'
    });
  }

  updateWeapon(weaponName) {
    this.elements.weaponText.setText(`WEAPON: ${weaponName}`);
  }

  updateTimeline(timeline) {
    this.elements.timelineText.setText(`TIMELINE: ${timeline}`);
  }

  getCompetitionLevel(score) {
    if (score >= 85) return { level: "VERY LOW", color: 0x00FF00 };
    if (score >= 70) return { level: "LOW", color: 0x90EE90 };
    if (score >= 55) return { level: "MODERATE", color: 0xFFFF00 };
    if (score >= 40) return { level: "HIGH", color: 0xFFA500 };
    return { level: "VERY HIGH", color: 0xFF0000 };
  }

  colorToHex(color) {
    return '#' + color.toString(16).padStart(6, '0');
  }

  show() {
    Object.values(this.elements).forEach(element => {
      if (element.setVisible) element.setVisible(true);
      else element.visible = true;
    });
  }

  hide() {
    Object.values(this.elements).forEach(element => {
      if (element.setVisible) element.setVisible(false);
      else element.visible = false;
    });
  }

  destroy() {
    Object.values(this.elements).forEach(element => {
      element.destroy();
    });
  }
}