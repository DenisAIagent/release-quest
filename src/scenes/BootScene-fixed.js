export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    console.log('🚀 BootScene: preload started');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    console.log(`📐 Screen dimensions: ${width}x${height}`);

    // Vérifier que les dimensions sont correctes
    if (width === 0 || height === 0) {
      console.error('❌ CRITICAL: Invalid screen dimensions');
      return;
    }

    // Créer la barre de progression avec un fond plus visible
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.add.text(width / 2, height / 2 + 50, '', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      console.log(`📊 Loading progress: ${Math.round(value * 100)}%`);
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x00FF00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      console.log(`📦 Loading asset: ${file.key}`);
      assetText.setText('Loading: ' + file.key);
    });

    this.load.on('complete', () => {
      console.log('✅ All assets loaded');
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    // Créer les assets avec vérification
    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    console.log('🎨 Creating placeholder assets...');

    try {
      const graphics = this.add.graphics();

      // Player (vert vif pour visibilité)
      graphics.fillStyle(0x00FF00, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture('player', 32, 32);
      graphics.clear();
      console.log('✅ Player texture created');

      // Enemy (rouge vif)
      graphics.fillStyle(0xFF0000, 1);
      graphics.fillRect(0, 0, 24, 24);
      graphics.generateTexture('enemy', 24, 24);
      graphics.clear();
      console.log('✅ Enemy texture created');

      // Boss (rouge foncé)
      graphics.fillStyle(0x8B0000, 1);
      graphics.fillRect(0, 0, 64, 64);
      graphics.generateTexture('boss', 64, 64);
      graphics.clear();
      console.log('✅ Boss texture created');

      // Coin (jaune vif)
      graphics.fillStyle(0xFFD700, 1);
      graphics.fillCircle(8, 8, 8);
      graphics.generateTexture('coin', 16, 16);
      graphics.clear();
      console.log('✅ Coin texture created');

      // Data Crystal (cyan vif)
      graphics.fillStyle(0x00FFFF, 1);
      graphics.beginPath();
      graphics.moveTo(8, 0);
      graphics.lineTo(16, 8);
      graphics.lineTo(8, 16);
      graphics.lineTo(0, 8);
      graphics.closePath();
      graphics.fill();
      graphics.generateTexture('dataCrystal', 16, 16);
      graphics.clear();
      console.log('✅ Data crystal texture created');

      // Wall (gris visible)
      graphics.fillStyle(0x444444, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture('wall', 32, 32);
      graphics.clear();
      console.log('✅ Wall texture created');

      // Ground (gris foncé)
      graphics.fillStyle(0x222222, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture('ground', 32, 32);
      graphics.clear();
      console.log('✅ Ground texture created');

      // Tile (avec bordure visible)
      graphics.fillStyle(0x666666, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.lineStyle(2, 0x000000, 1);
      graphics.strokeRect(0, 0, 32, 32);
      graphics.generateTexture('tile', 32, 32);
      graphics.clear();
      console.log('✅ Tile texture created');

      graphics.destroy();
      console.log('🎉 All placeholder assets created successfully');

    } catch (error) {
      console.error('💥 Error creating placeholder assets:', error);
    }
  }

  create() {
    console.log('🎬 BootScene: create started');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fond visible pour le debug
    this.cameras.main.setBackgroundColor('#000033'); // Bleu très foncé
    console.log('🎨 Background color set');

    // Titre principal avec couleurs contrastées
    const titleText = this.add.text(
      width / 2,
      height / 2 - 50,
      'RELEASE QUEST',
      {
        fontSize: '48px',
        fontFamily: 'Courier New',
        color: '#FFD700', // Or
        stroke: '#000000', // Noir
        strokeThickness: 4
      }
    );
    titleText.setOrigin(0.5, 0.5);
    console.log('📝 Title text created');

    // Sous-titre
    const subtitleText = this.add.text(
      width / 2,
      height / 2 + 10,
      "The Planner's Journey",
      {
        fontSize: '24px',
        fontFamily: 'Courier New',
        color: '#FFFFFF', // Blanc
        stroke: '#000000', // Noir
        strokeThickness: 2
      }
    );
    subtitleText.setOrigin(0.5, 0.5);
    console.log('📝 Subtitle text created');

    // Instructions
    const startText = this.add.text(
      width / 2,
      height / 2 + 100,
      'Press SPACE to Start',
      {
        fontSize: '20px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      }
    );
    startText.setOrigin(0.5, 0.5);
    console.log('📝 Start text created');

    // Animation de clignotement
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      onStart: () => {
        console.log('🎭 Start text animation started');
      }
    });

    // Debug info
    const debugText = this.add.text(
      10, 10,
      `Debug: ${width}x${height}`,
      {
        fontSize: '12px',
        fontFamily: 'Courier New',
        color: '#00FF00'
      }
    );
    console.log('🔍 Debug info displayed');

    // Transition automatique MAIS aussi manuelle
    let transitionTriggered = false;

    // Transition automatique après 2 secondes (plus long pour debug)
    this.time.delayedCall(2000, () => {
      if (!transitionTriggered) {
        console.log('⏰ Auto-transition to MenuScene');
        this.transitionToMenu();
        transitionTriggered = true;
      }
    });

    // Transition manuelle avec SPACE
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on('down', () => {
      if (!transitionTriggered) {
        console.log('🎹 Manual transition to MenuScene (SPACE pressed)');
        this.transitionToMenu();
        transitionTriggered = true;
      }
    });

    // Transition manuelle avec clic
    this.input.on('pointerdown', () => {
      if (!transitionTriggered) {
        console.log('🖱️ Manual transition to MenuScene (mouse clicked)');
        this.transitionToMenu();
        transitionTriggered = true;
      }
    });

    console.log('🎉 BootScene: create completed');
  }

  transitionToMenu() {
    console.log('🔄 Starting transition to MenuScene...');

    // Vérifier que MenuScene existe
    if (!this.scene.get('MenuScene')) {
      console.error('❌ MenuScene not found in scene manager');
      return;
    }

    try {
      // Fade out avec callback
      this.cameras.main.fadeOut(500, 0, 0, 0);

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        console.log('✅ Fade out complete, starting MenuScene');
        this.scene.start('MenuScene');
      });

    } catch (error) {
      console.error('💥 Error during transition:', error);
      // Fallback: transition directe
      this.scene.start('MenuScene');
    }
  }

  shutdown() {
    console.log('🛑 BootScene: shutdown');

    // Nettoyer les événements
    if (this.spaceKey) {
      this.spaceKey.removeAllListeners();
    }

    super.shutdown();
  }
}