export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Charger l'image de titre
    this.load.image('titleImage', '/assets/images/accueil.png');

    // Charger la musique d'accueil
    this.load.audio('welcomeMusic', '/assets/musiques/accueil.mp3');

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
    // Fond noir (thème agence)
    this.cameras.main.setBackgroundColor('#000000');

    console.log('🎮 BootScene created - transitioning to MenuScene');

    // Démarrer la musique d'accueil (avec gestion des restrictions navigateur)
    if (this.cache.audio.exists('welcomeMusic')) {
      this.welcomeMusic = this.sound.add('welcomeMusic', {
        volume: 0.5,
        loop: true
      });

      // Tenter de jouer immédiatement
      const playPromise = this.welcomeMusic.play();

      if (playPromise instanceof Promise) {
        playPromise.then(() => {
          console.log('🎵 Musique d\'accueil démarrée automatiquement');
        }).catch(() => {
          console.log('🎵 Musique d\'accueil en attente d\'interaction utilisateur');
          this.musicNeedsUserInteraction = true;
        });
      } else {
        console.log('🎵 Musique d\'accueil démarrée (ancien navigateur)');
      }
    } else {
      console.log('⚠️ Fichier audio welcomeMusic non trouvé');
    }

    // Si l'image de titre existe, l'afficher
    if (this.textures.exists('titleImage')) {
      const titleImage = this.add.image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        'titleImage'
      );

      // Adapter l'image pour s'ajuster à l'écran sans être trop zoomée
      const scaleX = this.cameras.main.width / titleImage.width;
      const scaleY = this.cameras.main.height / titleImage.height;
      const scale = Math.min(scaleX, scaleY); // Min pour garder l'image entière visible
      titleImage.setScale(scale);

      titleImage.setOrigin(0.5, 0.5);
      titleImage.setDepth(0);

      // Ajouter le texte "Press SPACE to Start" par-dessus l'image
      const startText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height - 80,
        'Press SPACE to Start',
        {
          fontSize: '24px',
          fontFamily: 'Courier New',
          color: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 3
        }
      );
      startText.setOrigin(0.5, 0.5);
      startText.setDepth(10);

      this.tweens.add({
        targets: startText,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    } else {
      // Affichage par défaut si pas d'image
      const titleText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 50,
        'RELEASE QUEST',
        {
          fontSize: '48px',
          fontFamily: 'Courier New',
          color: '#FF0000', // Rouge (thème agence)
          stroke: '#FFFFFF', // Blanc
          strokeThickness: 4
        }
      );
      titleText.setOrigin(0.5, 0.5);

      const subtitleText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 10,
        "The Planner's Journey",
        {
          fontSize: '24px',
          fontFamily: 'Courier New',
          color: '#FFFFFF',
          stroke: '#FF0000',
          strokeThickness: 2
        }
      );
      subtitleText.setOrigin(0.5, 0.5);

      const startText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 100,
        'Press SPACE to Start',
        {
          fontSize: '20px',
          fontFamily: 'Courier New',
          color: '#FFFFFF'
        }
      );
      startText.setOrigin(0.5, 0.5);

      this.tweens.add({
        targets: startText,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }

    // Attendre l'appui sur SPACE au lieu du timer automatique
    this.input.keyboard.once('keydown-SPACE', () => {
      this.handleUserInteraction();
    });

    // Permettre aussi le clic pour commencer
    this.input.once('pointerdown', () => {
      this.handleUserInteraction();
    });

    // Timer de sécurité plus long (10 secondes)
    this.time.delayedCall(10000, () => {
      console.log('🎮 Auto-transition to MenuScene after 10s');
      this.stopMusicAndTransition();
    });
  }

  handleUserInteraction() {
    // Si la musique était en attente d'interaction, la démarrer maintenant
    if (this.musicNeedsUserInteraction && this.welcomeMusic && !this.welcomeMusic.isPlaying) {
      this.welcomeMusic.play();
      console.log('🎵 Musique d\'accueil démarrée suite à interaction utilisateur');
    }

    this.stopMusicAndTransition();
  }

  stopMusicAndTransition() {
    // Arrêter la musique d'accueil si elle joue
    if (this.welcomeMusic && this.welcomeMusic.isPlaying) {
      this.welcomeMusic.stop();
      console.log('🎵 Musique d\'accueil arrêtée');
    }

    // Transition vers MenuScene
    this.scene.start('MenuScene');
  }
}