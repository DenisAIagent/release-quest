export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    console.log('🎮 BootScene preload started');
  }

  create() {
    console.log('🎮 BootScene create started');

    // Fond noir
    this.cameras.main.setBackgroundColor('#000000');

    // Test simple avec du texte
    const testText = this.add.text(400, 240, 'RELEASE QUEST - TEST', {
      fontSize: '32px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    testText.setOrigin(0.5, 0.5);

    console.log('🎮 Test text created, waiting 3 seconds...');

    // Transition automatique après 3 secondes
    this.time.delayedCall(3000, () => {
      console.log('🎮 Transitioning to MenuScene');
      this.scene.start('MenuScene');
    });
  }
}