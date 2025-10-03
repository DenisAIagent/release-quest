import * as Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    console.log('🔄 BootScene preload started');

    // NE PAS charger les assets manquants - utiliser uniquement les placeholders
    // this.load.image('titleImage', '/assets/images/accueil.png');
    // this.load.audio('welcomeMusic', '/assets/musiques/accueil.mp3');

    // Gestion des erreurs de chargement
    this.load.on('loaderror', (file) => {
      console.warn('⚠️ Asset loading failed:', file.key, 'but continuing...');
    });

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x000000, 0.8); // Noir
    progressBox.lineStyle(2, 0xFFFFFF); // Contour blanc
    progressBox.strokeRect(width / 2 - 160, height / 2 - 25, 320, 50);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

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
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xFFD700, 1); // Jaune pour la progression
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading: ' + file.key);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.createPlaceholderAssets();
  }

  createPlaceholderAssets() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0xFFFFFF, 1); // Blanc pour le joueur
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player', 32, 32);
    graphics.clear();

    graphics.fillStyle(0xFF0000, 1); // Rouge pour les ennemis
    graphics.fillRect(0, 0, 24, 24);
    graphics.generateTexture('enemy', 24, 24);
    graphics.clear();

    graphics.fillStyle(0xFF0000, 1); // Rouge pour le boss
    graphics.fillRect(0, 0, 64, 64);
    graphics.generateTexture('boss', 64, 64);
    graphics.clear();

    graphics.fillStyle(0xFFD700, 1); // Jaune pour les pièces
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('coin', 16, 16);
    graphics.clear();

    graphics.fillStyle(0xFFD700, 1); // Jaune pour les cristaux
    graphics.beginPath();
    graphics.moveTo(8, 0);
    graphics.lineTo(16, 8);
    graphics.lineTo(8, 16);
    graphics.lineTo(0, 8);
    graphics.closePath();
    graphics.fill();
    graphics.generateTexture('dataCrystal', 16, 16);
    graphics.clear();

    graphics.fillStyle(0xFF0000, 1); // Rouge pour les murs
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('wall', 32, 32);
    graphics.clear();

    graphics.fillStyle(0x000000, 1); // Noir pour le sol
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('ground', 32, 32);
    graphics.clear();

    graphics.fillStyle(0xFFFFFF, 1); // Blanc pour les tuiles
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(2, 0x000000, 1); // Contour noir
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture('tile', 32, 32);
    graphics.clear();

    graphics.destroy();
  }

  create() {
    console.log('🎮 BootScene created');

    // Fond bleu foncé pour meilleure visibilité (au lieu de noir pur)
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Texte principal - blanc avec contour rouge
    const title = this.add.text(400, 200, 'RELEASE QUEST', {
      fontSize: '48px',
      color: '#FFFFFF',
      stroke: '#FF0000',
      strokeThickness: 4,
      fontFamily: 'Courier New'
    });
    title.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(400, 260, "The Planner's Journey", {
      fontSize: '24px',
      color: '#FFFFFF',
      stroke: '#FF0000',
      strokeThickness: 2,
      fontFamily: 'Courier New'
    });
    subtitle.setOrigin(0.5, 0.5);

    const instruction = this.add.text(400, 350, 'Appuyez sur ENTRÉE pour commencer', {
      fontSize: '20px',
      color: '#FFFFFF',
      stroke: '#FF0000',
      strokeThickness: 2,
      fontFamily: 'Courier New'
    });
    instruction.setOrigin(0.5, 0.5);

    // Animation clignotante pour l'instruction
    this.tweens.add({
      targets: instruction,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    console.log('🎮 BootScene: Design noir/blanc/rouge appliqué');

    // Musique désactivée (assets non disponibles)
    // La musique sera ajoutée plus tard avec les vrais assets

    // Attendre que l'utilisateur appuie sur ENTRÉE pour continuer
    this.input.keyboard.once('keydown-ENTER', () => {
      console.log('🔄 Transition vers MenuScene via ENTRÉE');
      this.scene.start('MenuScene');
    });

    // Aussi accepter SPACE comme alternative
    this.input.keyboard.once('keydown-SPACE', () => {
      console.log('🔄 Transition vers MenuScene via SPACE');
      this.scene.start('MenuScene');
    });

    // Et le clic de souris
    this.input.once('pointerdown', () => {
      console.log('🔄 Transition vers MenuScene via clic');
      this.scene.start('MenuScene');
    });
  }

  handleUserInteraction() {
    // Pas de musique à gérer
    this.stopMusicAndTransition();
  }

  stopMusicAndTransition() {
    console.log('🔄 Transition vers MenuScene');

    // Pas de musique à arrêter (assets non disponibles)
    
    // Transition directe sans fade
    this.scene.start('MenuScene');
  }
}