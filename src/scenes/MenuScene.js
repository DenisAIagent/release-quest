// src/scenes/MenuScene.js - VERSION CORRIGÉE

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    console.log('🎮 MenuScene: create started');

    const { width, height } = this.cameras.main;

    // Fond noir visible
    this.cameras.main.setBackgroundColor('#000000');
    console.log('✅ Background set');

    this.createBackground();

    const title = this.add.text(width / 2, 100, 'RELEASE QUEST', {
      fontSize: '64px',
      fontFamily: 'Courier New',
      color: '#FF0000',
      stroke: '#FFFFFF',
      strokeThickness: 6
    });
    title.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(width / 2, 150, "The Planner's Journey", {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      stroke: '#FF0000',
      strokeThickness: 2
    });
    subtitle.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    const menuOptions = [
      { text: 'NEW GAME', scene: 'World1_DataValley' },
      { text: 'CONTINUE', scene: null },
      { text: 'OPTIONS', scene: null },
      { text: 'CREDITS', scene: null }
    ];

    this.selectedIndex = 0;
    this.menuItems = [];

    menuOptions.forEach((option, index) => {
      const y = 250 + (index * 50);
      const menuItem = this.add.text(width / 2, y, option.text, {
        fontSize: '24px',
        fontFamily: 'Courier New',
        color: index === 0 ? '#FFD700' : '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2
      });
      menuItem.setOrigin(0.5, 0.5);
      menuItem.setInteractive();
      menuItem.scene = option.scene;

      menuItem.on('pointerover', () => {
        this.selectedIndex = index;
        this.updateMenuSelection();
      });

      menuItem.on('pointerdown', () => {
        this.selectMenuItem(index);
      });

      this.menuItems.push(menuItem);
    });

    this.cursor = this.add.text(width / 2 - 100, 250, '>', {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.cursor.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this.cursor,
      x: this.cursor.x + 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.createInstructions();

    console.log('🎉 MenuScene: create completed');
  }

  createBackground() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 480);

    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 480;
      const size = Math.random() * 2;
      const colors = [0xFF0000, 0xFFFFFF, 0xFFD700];
      const color = colors[Math.floor(Math.random() * colors.length)];
      graphics.fillStyle(color, Math.random() * 0.8 + 0.2);
      graphics.fillCircle(x, y, size);
    }

    graphics.generateTexture('menu_bg', 800, 480);
    graphics.destroy();

    this.add.image(400, 240, 'menu_bg');
  }

  createInstructions() {
    const instructions = [
      'CONTROLS:',
      'WASD/Arrows - Move',
      'SPACE - Attack',
      'E - Interact',
      'Q - Switch Weapon',
      'ESC - Pause'
    ];

    const startY = 350;
    instructions.forEach((text, index) => {
      this.add.text(50, startY + (index * 20), text, {
        fontSize: '14px',
        fontFamily: 'Courier New',
        color: index === 0 ? '#FFD700' : '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 1
      });
    });
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const selectJustPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                             Phaser.Input.Keyboard.JustDown(this.enterKey);

    if (upJustPressed) {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
      this.updateMenuSelection();
    }

    if (downJustPressed) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
      this.updateMenuSelection();
    }

    if (selectJustPressed) {
      this.selectMenuItem(this.selectedIndex);
    }
  }

  updateMenuSelection() {
    this.menuItems.forEach((item, index) => {
      item.setColor(index === this.selectedIndex ? '#FFD700' : '#FFFFFF');
    });

    const selectedItem = this.menuItems[this.selectedIndex];
    this.cursor.y = selectedItem.y;
  }

  selectMenuItem(index) {
    const menuItem = this.menuItems[index];

    if (menuItem.text === 'NEW GAME') {
      console.log('🎮 NEW GAME selected, showing form');
      this.showGameStartForm();
    } else if (menuItem.text === 'CONTINUE') {
      this.loadGame();
    } else if (menuItem.text === 'OPTIONS') {
      this.showOptionsMenu();
    } else if (menuItem.text === 'CREDITS') {
      this.showCredits();
    }
  }

  showGameStartForm() {
    console.log('📝 Showing game start form');

    const { width, height } = this.cameras.main;

    this.formData = {
      name: '',
      firstName: '',
      email: '',
      company: '',
      genre: 'pop'
    };

    this.currentField = 0;
    this.isTyping = false;

    const formBg = this.add.graphics();
    formBg.fillStyle(0x000000, 0.9);
    formBg.fillRect(0, 0, width, height);
    formBg.setInteractive();
    formBg.setDepth(500);

    const formContainer = this.add.container(width / 2, height / 2);
    formContainer.setDepth(600);

    const formBox = this.add.graphics();
    formBox.fillStyle(0x000000, 1);
    formBox.lineStyle(3, 0xFFD700);
    formBox.strokeRect(-250, -180, 500, 480);
    formBox.fillRect(-250, -180, 500, 480);
    formContainer.add(formBox);

    const formTitle = this.add.text(0, -150, 'ARTIST INFORMATION', {
      fontSize: '28px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 2
    });
    formTitle.setOrigin(0.5, 0.5);
    formContainer.add(formTitle);

    // Champs du formulaire
    this.createFormFields(formContainer);

    // Sélecteur de genre
    this.createGenreSelector(formContainer);

    // Aperçu du personnage
    this.createCharacterPreview(formContainer);

    // Instructions
    const instructions = this.add.text(0, 230, 'TAB: Next field | ENTER: Validate | ←→: Change genre', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    instructions.setOrigin(0.5, 0.5);
    formContainer.add(instructions);

    // Bouton Start
    this.startButton = this.add.text(0, 260, '[COMPLETE THE FORM TO START]', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#666666'
    });
    this.startButton.setOrigin(0.5, 0.5);
    formContainer.add(this.startButton);

    this.formElements = {
      formBg,
      formContainer,
      instructions
    };

    this.updateFieldHighlight();
    this.setupFormKeyboard();

    console.log('✅ Form created successfully');
  }

  createFormFields(container) {
    const fields = [
      { name: 'name', label: 'Nom:', y: -120 },
      { name: 'firstName', label: 'Prénom:', y: -50 },
      { name: 'email', label: 'Email:', y: 20 },
      { name: 'company', label: 'Entreprise:', y: 90 }
    ];

    this.formFields = {};

    fields.forEach(field => {
      // Label
      const label = this.add.text(-200, field.y, field.label, {
        fontSize: '18px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      });
      label.setOrigin(0, 0.5);
      container.add(label);

      // Field background
      const fieldBg = this.add.graphics();
      fieldBg.fillStyle(0x000000, 1);
      fieldBg.lineStyle(2, 0xFFFFFF);
      fieldBg.strokeRect(-200, field.y + 20, 400, 30);
      fieldBg.fillRect(-200, field.y + 20, 400, 30);
      container.add(fieldBg);

      // Field text
      const fieldText = this.add.text(-190, field.y + 35, '', {
        fontSize: '16px',
        fontFamily: 'Courier New',
        color: '#FFFFFF'
      });
      fieldText.setOrigin(0, 0.5);
      container.add(fieldText);

      this.formFields[field.name] = {
        label,
        bg: fieldBg,
        text: fieldText,
        y: field.y
      };
    });
  }

  createGenreSelector(container) {
    const genres = ['pop', 'rock', 'rap', 'electro', 'jazz', 'metal', 'synthwave'];
    this.genreIndex = 0;

    const genreLabel = this.add.text(-200, 160, 'Genre musical:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    genreLabel.setOrigin(0, 0.5);
    container.add(genreLabel);

    this.genreField = this.add.graphics();
    this.genreField.fillStyle(0x000000, 1);
    this.genreField.lineStyle(2, 0xFFFFFF);
    this.genreField.strokeRect(-200, 180, 400, 30);
    this.genreField.fillRect(-200, 180, 400, 30);
    container.add(this.genreField);

    this.genreText = this.add.text(0, 195, genres[this.genreIndex].toUpperCase(), {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    this.genreText.setOrigin(0.5, 0.5);
    container.add(this.genreText);

    const leftArrow = this.add.text(-220, 195, '◀', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    leftArrow.setOrigin(0.5, 0.5);
    container.add(leftArrow);

    const rightArrow = this.add.text(220, 195, '▶', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    rightArrow.setOrigin(0.5, 0.5);
    container.add(rightArrow);

    this.formData.genre = genres[this.genreIndex];
    this.genres = genres;
  }

  createCharacterPreview(container) {
    const previewBg = this.add.graphics();
    previewBg.fillStyle(0x000000, 1);
    previewBg.lineStyle(2, 0xFFD700);
    previewBg.strokeRect(150, -100, 80, 120);
    previewBg.fillRect(150, -100, 80, 120);
    container.add(previewBg);

    const previewLabel = this.add.text(190, -120, 'PREVIEW', {
      fontSize: '12px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    previewLabel.setOrigin(0.5, 0.5);
    container.add(previewLabel);

    this.characterPreview = this.add.container(190, -40);
    container.add(this.characterPreview);

    this.updateCharacterPreview();
  }

  updateCharacterPreview() {
    if (!this.characterPreview) return;

    this.characterPreview.removeAll(true);

    const GENRE_STEREOTYPES = {
      pop: { name: "Pop Star", description: "Style tendance", colors: { skin: 0xFFFFFF, outfit: 0xFF0000, pants: 0xFFFFFF, shoes: 0x000000, accessory: 0xFFD700 } },
      rock: { name: "Rock Star", description: "Cuir noir", colors: { skin: 0xFFFFFF, outfit: 0x000000, pants: 0x000000, shoes: 0x000000, accessory: 0xFF0000 } },
      rap: { name: "Rapper", description: "Style urbain", colors: { skin: 0xFFFFFF, outfit: 0xFFFFFF, pants: 0x000000, shoes: 0xFFFFFF, accessory: 0xFF0000 } },
      electro: { name: "DJ", description: "Futuriste", colors: { skin: 0xFFFFFF, outfit: 0x000000, pants: 0x000000, shoes: 0xFFD700, accessory: 0xFF0000 } },
      jazz: { name: "Jazz Musician", description: "Élégant", colors: { skin: 0xFFFFFF, outfit: 0x000000, pants: 0x000000, shoes: 0x000000, accessory: 0xFFD700 } },
      metal: { name: "Metal Head", description: "Tout noir", colors: { skin: 0xFFFFFF, outfit: 0x000000, pants: 0x000000, shoes: 0x000000, accessory: 0xFF0000 } },
      synthwave: { name: "Synthwave", description: "Rétro", colors: { skin: 0xFFFFFF, outfit: 0xFF0000, pants: 0x000000, shoes: 0xFFFFFF, accessory: 0xFFD700 } }
    };

    const genre = this.genres[this.genreIndex];
    const stereotype = GENRE_STEREOTYPES[genre];
    const colors = stereotype.colors;

    const graphics = this.add.graphics();

    // Corps
    graphics.fillStyle(colors.outfit);
    graphics.fillRect(-6, -4, 12, 8);

    // Pantalon
    graphics.fillStyle(colors.pants);
    graphics.fillRect(-5, 4, 4, 8);
    graphics.fillRect(1, 4, 4, 8);

    // Chaussures
    graphics.fillStyle(colors.shoes);
    graphics.fillRect(-6, 11, 5, 3);
    graphics.fillRect(1, 11, 5, 3);

    // Tête
    graphics.fillStyle(colors.skin);
    graphics.fillCircle(0, -6, 5);

    this.characterPreview.add(graphics);

    const styleName = this.add.text(0, 25, stereotype.name, {
      fontSize: '8px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    styleName.setOrigin(0.5, 0.5);
    this.characterPreview.add(styleName);
  }

  setupFormKeyboard() {
    this.formKeys = this.input.keyboard.addKeys({
      tab: Phaser.Input.Keyboard.KeyCodes.TAB,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      backspace: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    this.input.keyboard.on('keydown', this.handleFormKeydown, this);
  }

  handleFormKeydown(event) {
    if (Phaser.Input.Keyboard.JustDown(this.formKeys.tab)) {
      event.preventDefault();
      this.currentField = (this.currentField + 1) % 5;
      this.updateFieldHighlight();
      console.log('TAB pressed, current field:', this.currentField);
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.formKeys.enter)) {
      event.preventDefault();
      console.log('ENTER pressed, can start:', this.canStartGame());
      if (this.canStartGame()) {
        this.startGameWithData();
      }
      return;
    }

    if (this.currentField === 4) {
      if (Phaser.Input.Keyboard.JustDown(this.formKeys.left)) {
        event.preventDefault();
        this.genreIndex = (this.genreIndex - 1 + this.genres.length) % this.genres.length;
        this.formData.genre = this.genres[this.genreIndex];
        this.genreText.setText(this.genres[this.genreIndex].toUpperCase());
        this.updateCharacterPreview();
        console.log('Genre changed to:', this.formData.genre);
      } else if (Phaser.Input.Keyboard.JustDown(this.formKeys.right)) {
        event.preventDefault();
        this.genreIndex = (this.genreIndex + 1) % this.genres.length;
        this.formData.genre = this.genres[this.genreIndex];
        this.genreText.setText(this.genres[this.genreIndex].toUpperCase());
        this.updateCharacterPreview();
        console.log('Genre changed to:', this.formData.genre);
      }
      return;
    }

    // Saisie de texte
    if (this.currentField >= 0 && this.currentField <= 3) {
      const fieldNames = ['name', 'firstName', 'email', 'company'];
      const fieldName = fieldNames[this.currentField];
      const fieldData = this.formFields[fieldName];

      if (Phaser.Input.Keyboard.JustDown(this.formKeys.backspace)) {
        event.preventDefault();
        this.formData[fieldName] = this.formData[fieldName].slice(0, -1);
        fieldData.text.setText(this.formData[fieldName]);
        this.updateStartButton();
        console.log(`${fieldName}:`, this.formData[fieldName]);
      } else if (event.key.length === 1) {
        if (this.formData[fieldName].length < 30) {
          this.formData[fieldName] += event.key;
          fieldData.text.setText(this.formData[fieldName]);
          this.updateStartButton();
          console.log(`${fieldName}:`, this.formData[fieldName]);
        }
      }
    }
  }

  updateFieldHighlight() {
    const fieldNames = ['name', 'firstName', 'email', 'company'];

    // Reset tous les champs
    fieldNames.forEach((fieldName, index) => {
      const field = this.formFields[fieldName];
      field.bg.clear();
      field.bg.fillStyle(0x000000, 1);
      field.bg.lineStyle(2, this.currentField === index ? 0xFFD700 : 0xFFFFFF);
      field.bg.strokeRect(-200, field.y + 20, 400, 30);
      field.bg.fillRect(-200, field.y + 20, 400, 30);
    });

    // Genre field
    this.genreField.clear();
    this.genreField.fillStyle(0x000000, 1);
    this.genreField.lineStyle(2, this.currentField === 4 ? 0xFFD700 : 0xFFFFFF);
    this.genreField.strokeRect(-200, 180, 400, 30);
    this.genreField.fillRect(-200, 180, 400, 30);
  }

  canStartGame() {
    const hasName = this.formData.name.length >= 2;
    const hasFirstName = this.formData.firstName.length >= 2;
    const hasEmail = this.formData.email.length >= 5 && this.formData.email.includes('@');

    console.log('Can start game check:', { hasName, hasFirstName, hasEmail });

    return hasName && hasFirstName && hasEmail;
  }

  updateStartButton() {
    if (this.canStartGame()) {
      this.startButton.setColor('#00FF00');
      this.startButton.setText('[ENTER TO START]');

      if (!this.startButtonTween) {
        this.startButtonTween = this.tweens.add({
          targets: this.startButton,
          alpha: 0.3,
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      }
    } else {
      this.startButton.setColor('#666666');
      this.startButton.setText('[COMPLETE THE FORM TO START]');

      if (this.startButtonTween) {
        this.startButtonTween.destroy();
        this.startButtonTween = null;
        this.startButton.setAlpha(1);
      }
    }
  }

  async startGameWithData() {
    console.log('🚀 Starting game with data:', this.formData);

    // Nettoyer le clavier
    this.input.keyboard.off('keydown', this.handleFormKeydown, this);

    // Envoyer vers n8n
    try {
      await fetch('https://primary-production-7acf.up.railway.app/webhook/849c16d0-39df-437b-9298-d56be738fe83', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.formData.name.trim(),
          firstName: this.formData.firstName.trim(),
          email: this.formData.email.trim(),
          company: this.formData.company.trim(),
          genre: this.formData.genre,
          timestamp: new Date().toISOString(),
          game: 'Release Quest - The Planner\'s Journey'
        })
      });
      console.log('✅ Données envoyées vers n8n');
    } catch (error) {
      console.warn('⚠️ Problème envoi n8n:', error);
    }

    // Sauvegarder dans le registry
    this.registry.set('artistName', this.formData.name + ' ' + this.formData.firstName);
    this.registry.set('email', this.formData.email);
    this.registry.set('genre', this.formData.genre);
    this.registry.set('currentWorld', 1);

    console.log('📦 Registry data set:', {
      artistName: this.registry.get('artistName'),
      email: this.registry.get('email'),
      genre: this.registry.get('genre')
    });

    // Nettoyer l'interface
    if (this.formElements.formBg) this.formElements.formBg.destroy();
    if (this.formElements.formContainer) this.formElements.formContainer.destroy();

    console.log('🎬 Starting transition to World1_DataValley');

    // Transition avec fade
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      console.log('✅ Fade out complete, launching World1_DataValley');

      try {
        this.scene.start('World1_DataValley');
        console.log('✅ World1_DataValley started');
      } catch (error) {
        console.error('💥 Error starting World1_DataValley:', error);
      }
    });
  }

  loadGame() {
    const saveData = localStorage.getItem('releaseQuestSave');
    if (saveData) {
      const data = JSON.parse(saveData);
      Object.keys(data).forEach(key => {
        this.registry.set(key, data[key]);
      });

      const worldScene = `World${data.currentWorld || 1}_${this.getWorldName(data.currentWorld || 1)}`;
      this.scene.start(worldScene);
    } else {
      this.showMessage('No saved game found!');
    }
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

  showOptionsMenu() {
    this.showMessage('Options coming soon!');
  }

  showCredits() {
    this.showMessage('Credits coming soon!');
  }

  showMessage(message) {
    const { width, height } = this.cameras.main;
    const messageText = this.add.text(width / 2, height - 50, message, {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFF00',
      stroke: '#000000',
      strokeThickness: 2
    });
    messageText.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: messageText,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        messageText.destroy();
      }
    });
  }

  shutdown() {
    // Nettoyer les objets interactifs
    if (this.menuItems) {
      this.menuItems.forEach(item => {
        if (item && item.removeInteractive) {
          try {
            item.removeInteractive();
          } catch (e) {
            // Ignorer
          }
        }
      });
      this.menuItems = [];
    }

    // Nettoyer les événements keyboard
    if (this.input && this.input.keyboard) {
      try {
        if (this.cursors) {
          Object.values(this.cursors).forEach(key => {
            if (key && typeof key.destroy === 'function') {
              key.destroy();
            }
          });
          this.cursors = null;
        }
        if (this.spaceKey) {
          this.input.keyboard.removeKey(this.spaceKey);
          this.spaceKey = null;
        }
        if (this.enterKey) {
          this.input.keyboard.removeKey(this.enterKey);
          this.enterKey = null;
        }
        if (this.formKeys) {
          Object.values(this.formKeys).forEach(key => {
            if (key && typeof key.destroy === 'function') {
              key.destroy();
            }
          });
          this.formKeys = null;
        }
      } catch (e) {
        // Ignorer
      }
    }

    console.log('🛑 MenuScene: shutdown complete');
    super.shutdown();
  }
}