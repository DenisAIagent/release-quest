export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.createBackground();

    const title = this.add.text(width / 2, 100, 'RELEASE QUEST', {
      fontSize: '64px',
      fontFamily: 'Courier New',
      color: '#FF0000', // Rouge (thème agence)
      stroke: '#FFFFFF', // Blanc (contour)
      strokeThickness: 6
    });
    title.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(width / 2, 150, "The Planner's Journey", {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FFFFFF', // Blanc (thème agence)
      stroke: '#FF0000', // Rouge (contour)
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
  }

  createBackground() {
    const graphics = this.add.graphics();

    // Fond noir (thème agence)
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 800, 480);

    // Étoiles dans la palette autorisée (rouge, blanc, jaune)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 480;
      const size = Math.random() * 2;
      const colors = [0xFF0000, 0xFFFFFF, 0xFFD700]; // Rouge, blanc, jaune
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
    const { width, height } = this.cameras.main;

    // Données du formulaire
    this.formData = {
      name: '',
      firstName: '',
      email: '',
      company: '',
      genre: 'pop'
    };

    this.currentField = 0; // 0: nom, 1: prénom, 2: email, 3: entreprise, 4: genre
    this.isTyping = false;

    const formBg = this.add.graphics();
    formBg.fillStyle(0x000000, 0.9);
    formBg.fillRect(0, 0, width, height);
    formBg.setInteractive();

    const formContainer = this.add.container(width / 2, height / 2);

    const formBox = this.add.graphics();
    formBox.fillStyle(0x000000, 1); // Noir
    formBox.lineStyle(3, 0xFFD700); // Jaune
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

    // Champ Nom
    const nameLabel = this.add.text(-200, -120, 'Nom:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    nameLabel.setOrigin(0, 0.5);
    formContainer.add(nameLabel);

    this.nameField = this.add.graphics();
    this.nameField.fillStyle(0x000000, 1); // Noir
    this.nameField.lineStyle(2, 0xFFFFFF); // Blanc
    this.nameField.strokeRect(-200, -100, 400, 30);
    this.nameField.fillRect(-200, -100, 400, 30);
    formContainer.add(this.nameField);

    this.nameText = this.add.text(-190, -85, '', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    this.nameText.setOrigin(0, 0.5);
    formContainer.add(this.nameText);

    // Champ Prénom
    const firstNameLabel = this.add.text(-200, -50, 'Prénom:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    firstNameLabel.setOrigin(0, 0.5);
    formContainer.add(firstNameLabel);

    this.firstNameField = this.add.graphics();
    this.firstNameField.fillStyle(0x000000, 1); // Noir
    this.firstNameField.lineStyle(2, 0xFFFFFF); // Blanc
    this.firstNameField.strokeRect(-200, -30, 400, 30);
    this.firstNameField.fillRect(-200, -30, 400, 30);
    formContainer.add(this.firstNameField);

    this.firstNameText = this.add.text(-190, -15, '', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    this.firstNameText.setOrigin(0, 0.5);
    formContainer.add(this.firstNameText);

    // Champ Email
    const emailLabel = this.add.text(-200, 20, 'Email:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    emailLabel.setOrigin(0, 0.5);
    formContainer.add(emailLabel);

    this.emailField = this.add.graphics();
    this.emailField.fillStyle(0x000000, 1); // Noir
    this.emailField.lineStyle(2, 0xFFFFFF); // Blanc
    this.emailField.strokeRect(-200, 40, 400, 30);
    this.emailField.fillRect(-200, 40, 400, 30);
    formContainer.add(this.emailField);

    this.emailText = this.add.text(-190, 55, '', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    this.emailText.setOrigin(0, 0.5);
    formContainer.add(this.emailText);

    // Champ Entreprise
    const companyLabel = this.add.text(-200, 90, 'Entreprise:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    companyLabel.setOrigin(0, 0.5);
    formContainer.add(companyLabel);

    this.companyField = this.add.graphics();
    this.companyField.fillStyle(0x000000, 1); // Noir
    this.companyField.lineStyle(2, 0xFFFFFF); // Blanc
    this.companyField.strokeRect(-200, 110, 400, 30);
    this.companyField.fillRect(-200, 110, 400, 30);
    formContainer.add(this.companyField);

    this.companyText = this.add.text(-190, 125, '', {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    this.companyText.setOrigin(0, 0.5);
    formContainer.add(this.companyText);

    // Sélecteur de genre
    const genreLabel = this.add.text(-200, 160, 'Genre musical:', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#FFFFFF'
    });
    genreLabel.setOrigin(0, 0.5);
    formContainer.add(genreLabel);

    this.createGenreSelector(formContainer);

    // Aperçu du personnage
    this.createCharacterPreview(formContainer);

    // Instructions
    const instructions = this.add.text(0, 230, 'TAB: Next field | ENTER: Validate | ←→: Change genre', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#FFFFFF' // Blanc au lieu de gris
    });
    instructions.setOrigin(0.5, 0.5);
    formContainer.add(instructions);

    // Bouton Start
    this.startButton = this.add.text(0, 260, '[ENTER TO START]', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#FFD700' // Jaune pour fonctions spéciales
    });
    this.startButton.setOrigin(0.5, 0.5);
    formContainer.add(this.startButton);

    // Stocker les références
    this.formElements = {
      formBg,
      formContainer,
      nameLabel,
      emailLabel,
      genreLabel,
      instructions
    };

    this.updateFieldHighlight();
    this.setupFormKeyboard();
  }

  createGenreSelector(container) {
    const genres = ['pop', 'rock', 'rap', 'electro', 'jazz', 'metal', 'synthwave'];
    this.genreIndex = 0;

    this.genreField = this.add.graphics();
    this.genreField.fillStyle(0x000000, 1); // Noir
    this.genreField.lineStyle(2, 0xFFFFFF); // Blanc
    this.genreField.strokeRect(-200, 180, 400, 30);
    this.genreField.fillRect(-200, 180, 400, 30);
    container.add(this.genreField);

    this.genreText = this.add.text(0, 195, genres[this.genreIndex].toUpperCase(), {
      fontSize: '16px',
      fontFamily: 'Courier New',
      color: '#FFD700' // Jaune
    });
    this.genreText.setOrigin(0.5, 0.5);
    container.add(this.genreText);

    // Flèches
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
  }

  createCharacterPreview(container) {
    // Zone d'aperçu à droite
    const previewBg = this.add.graphics();
    previewBg.fillStyle(0x000000, 1); // Noir
    previewBg.lineStyle(2, 0xFFD700); // Jaune
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

    // Container pour le personnage preview
    this.characterPreview = this.add.container(190, -40);
    container.add(this.characterPreview);

    this.updateCharacterPreview();
  }

  updateCharacterPreview() {
    if (!this.characterPreview) return;

    // Nettoyer l'aperçu précédent
    this.characterPreview.removeAll(true);

    // Définir les stéréotypes directement (copié depuis constants.js)
    const GENRE_STEREOTYPES = {
      pop: { name: "Pop Star", description: "Style coloré et tendance", colors: { skin: 0xFFDBB3, outfit: 0xFF69B4, pants: 0xFFFFFF, shoes: 0x000000, accessory: 0xFFD700 } },
      rock: { name: "Rock Star", description: "Maquillage KISS et cuir noir", colors: { skin: 0xFFFFFF, outfit: 0x000000, pants: 0x000000, shoes: 0x000000, accessory: 0xFF0000 } },
      rap: { name: "Rapper", description: "Baggy jeans et casquette à l'envers", colors: { skin: 0xD2B48C, outfit: 0xFFFFFF, pants: 0x4169E1, shoes: 0xFFFFFF, accessory: 0xFF0000 } },
      electro: { name: "DJ", description: "Style futuriste néon", colors: { skin: 0xFFDBB3, outfit: 0x000000, pants: 0x000000, shoes: 0x00FFFF, accessory: 0x00FF00 } },
      jazz: { name: "Jazz Musician", description: "Costume élégant vintage", colors: { skin: 0xFFDBB3, outfit: 0x2F4F4F, pants: 0x000000, shoes: 0x8B4513, accessory: 0xFFD700 } },
      metal: { name: "Metal Head", description: "Cheveux longs et tout en noir", colors: { skin: 0xFFDBB3, outfit: 0x000000, pants: 0x000000, shoes: 0x000000, accessory: 0x696969 } },
      synthwave: { name: "Synthwave Artist", description: "Style rétro 80s", colors: { skin: 0xFFDBB3, outfit: 0xFF1493, pants: 0x4B0082, shoes: 0xFFFFFF, accessory: 0x00FFFF } }
    };

    const genre = ['pop', 'rock', 'rap', 'electro', 'jazz', 'metal', 'synthwave'][this.genreIndex];
    const stereotype = GENRE_STEREOTYPES[genre];
    const colors = stereotype.colors;

    // Créer un mini personnage
    const graphics = this.add.graphics();

    // Corps (plus petit)
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

    // Caractéristiques du genre (version miniature)
    switch (genre) {
      case 'rap':
        // Casquette
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-6, -10, 12, 4);
        graphics.fillRect(4, -8, 3, 2);
        break;

      case 'rock':
        // Étoile KISS
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-3, -8, 2, 2);
        break;

      case 'pop':
        // Boucles d'oreilles
        graphics.fillStyle(colors.accessory);
        graphics.fillCircle(-4, -6, 1);
        graphics.fillCircle(4, -6, 1);
        break;

      case 'electro':
        // Lunettes
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-4, -7, 8, 2);
        break;

      case 'jazz':
        // Chapeau
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-5, -11, 10, 2);
        graphics.fillRect(-3, -13, 6, 4);
        break;

      case 'metal':
        // Cheveux longs
        graphics.fillStyle(0x000000);
        graphics.fillRect(-8, -9, 4, 10);
        graphics.fillRect(4, -9, 4, 10);
        break;

      case 'synthwave':
        // Lunettes 80s
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-5, -7, 10, 3);
        break;
    }

    this.characterPreview.add(graphics);

    // Nom du style
    const styleName = this.add.text(0, 25, stereotype.name, {
      fontSize: '8px',
      fontFamily: 'Courier New',
      color: '#FFD700'
    });
    styleName.setOrigin(0.5, 0.5);
    this.characterPreview.add(styleName);

    // Description
    const description = this.add.text(0, 35, stereotype.description, {
      fontSize: '6px',
      fontFamily: 'Courier New',
      color: '#CCCCCC',
      wordWrap: { width: 70 },
      align: 'center'
    });
    description.setOrigin(0.5, 0.5);
    this.characterPreview.add(description);
  }

  setupFormKeyboard() {
    this.formKeys = this.input.keyboard.addKeys({
      tab: Phaser.Input.Keyboard.KeyCodes.TAB,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      backspace: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });

    // Écouter la saisie de texte
    this.input.keyboard.on('keydown', this.handleFormKeydown, this);
  }

  handleFormKeydown(event) {
    const genres = ['pop', 'rock', 'rap', 'electro', 'jazz', 'metal', 'synthwave'];

    if (Phaser.Input.Keyboard.JustDown(this.formKeys.tab)) {
      this.currentField = (this.currentField + 1) % 5;
      this.updateFieldHighlight();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.formKeys.enter)) {
      if (this.canStartGame()) {
        this.startGameWithData();
      }
      return;
    }

    if (this.currentField === 4) { // Genre selector
      if (Phaser.Input.Keyboard.JustDown(this.formKeys.left)) {
        this.genreIndex = (this.genreIndex - 1 + genres.length) % genres.length;
        this.formData.genre = genres[this.genreIndex];
        this.genreText.setText(genres[this.genreIndex].toUpperCase());
        this.updateCharacterPreview();
      } else if (Phaser.Input.Keyboard.JustDown(this.formKeys.right)) {
        this.genreIndex = (this.genreIndex + 1) % genres.length;
        this.formData.genre = genres[this.genreIndex];
        this.genreText.setText(genres[this.genreIndex].toUpperCase());
        this.updateCharacterPreview();
      }
      return;
    }

    // Saisie de texte pour nom, prénom, email et entreprise
    if (this.currentField >= 0 && this.currentField <= 3) {
      let fieldName, textElement;

      switch(this.currentField) {
        case 0:
          fieldName = 'name';
          textElement = this.nameText;
          break;
        case 1:
          fieldName = 'firstName';
          textElement = this.firstNameText;
          break;
        case 2:
          fieldName = 'email';
          textElement = this.emailText;
          break;
        case 3:
          fieldName = 'company';
          textElement = this.companyText;
          break;
      }

      if (Phaser.Input.Keyboard.JustDown(this.formKeys.backspace)) {
        this.formData[fieldName] = this.formData[fieldName].slice(0, -1);
        textElement.setText(this.formData[fieldName]);
      } else if (event.key.length === 1) {
        // Limiter la longueur
        if (this.formData[fieldName].length < 30) {
          this.formData[fieldName] += event.key;
          textElement.setText(this.formData[fieldName]);
        }
      }

      this.updateStartButton();
    }
  }

  updateFieldHighlight() {
    // Reset tous les champs
    this.nameField.clear();
    this.firstNameField.clear();
    this.emailField.clear();
    this.companyField.clear();
    this.genreField.clear();

    // Redessiner nom
    this.nameField.fillStyle(0x000000, 1); // Noir
    this.nameField.lineStyle(2, this.currentField === 0 ? 0xFFD700 : 0xFFFFFF); // Jaune actif, blanc inactif
    this.nameField.strokeRect(-200, -100, 400, 30);
    this.nameField.fillRect(-200, -100, 400, 30);

    // Redessiner prénom
    this.firstNameField.fillStyle(0x000000, 1); // Noir
    this.firstNameField.lineStyle(2, this.currentField === 1 ? 0xFFD700 : 0xFFFFFF); // Jaune actif, blanc inactif
    this.firstNameField.strokeRect(-200, -30, 400, 30);
    this.firstNameField.fillRect(-200, -30, 400, 30);

    // Redessiner email
    this.emailField.fillStyle(0x000000, 1); // Noir
    this.emailField.lineStyle(2, this.currentField === 2 ? 0xFFD700 : 0xFFFFFF); // Jaune actif, blanc inactif
    this.emailField.strokeRect(-200, 40, 400, 30);
    this.emailField.fillRect(-200, 40, 400, 30);

    // Redessiner entreprise
    this.companyField.fillStyle(0x000000, 1); // Noir
    this.companyField.lineStyle(2, this.currentField === 3 ? 0xFFD700 : 0xFFFFFF); // Jaune actif, blanc inactif
    this.companyField.strokeRect(-200, 110, 400, 30);
    this.companyField.fillRect(-200, 110, 400, 30);

    // Redessiner genre
    this.genreField.fillStyle(0x000000, 1); // Noir
    this.genreField.lineStyle(2, this.currentField === 4 ? 0xFFD700 : 0xFFFFFF); // Jaune actif, blanc inactif
    this.genreField.strokeRect(-200, 180, 400, 30);
    this.genreField.fillRect(-200, 180, 400, 30);
  }

  canStartGame() {
    return this.formData.name.length >= 2 &&
           this.formData.firstName.length >= 2 &&
           this.formData.email.length >= 5 &&
           this.formData.email.includes('@');
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
      this.startButton.setText('[COMPLETE THE FORM]');

      if (this.startButtonTween) {
        this.startButtonTween.destroy();
        this.startButtonTween = null;
        this.startButton.setAlpha(1);
      }
    }
  }

  async startGameWithData() {
    if (!this.canStartGame()) return;

    // Nettoyer le clavier
    this.input.keyboard.off('keydown', this.handleFormKeydown, this);

    // Envoyer les données vers le webhook n8n
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
      console.log('✅ Données artiste envoyées vers n8n');
    } catch (error) {
      console.warn('⚠️ Problème d\'envoi vers n8n:', error);
    }

    // Sauvegarder les données
    this.registry.set('artistName', this.formData.name + ' ' + this.formData.firstName);
    this.registry.set('email', this.formData.email);
    this.registry.set('genre', this.formData.genre);
    this.registry.set('currentWorld', 1);

    // Nettoyer l'interface
    Object.values(this.formElements).forEach(element => {
      element.destroy();
    });

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('World1_DataValley');
    });
  }

  startGame() {
    this.registry.set('artistName', 'INDIE_ARTIST');
    this.registry.set('email', 'artist@music.com');
    this.registry.set('currentWorld', 1);

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('World1_DataValley');
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
    const credits = [
      'RELEASE QUEST',
      '',
      'Created for Music Release Planner',
      '',
      'Game Design & Programming',
      'Your Name Here',
      '',
      'Powered by Phaser 3',
      '',
      'Press SPACE to return'
    ];

    const { width, height } = this.cameras.main;
    const creditsBg = this.add.graphics();
    creditsBg.fillStyle(0x000000, 0.9);
    creditsBg.fillRect(0, 0, width, height);

    const creditsContainer = this.add.container(width / 2, height / 2);

    credits.forEach((text, index) => {
      const y = -100 + (index * 25);
      const creditText = this.add.text(0, y, text, {
        fontSize: index === 0 ? '24px' : '16px',
        fontFamily: 'Courier New',
        color: index === 0 ? '#FFD700' : '#FFFFFF'
      });
      creditText.setOrigin(0.5, 0.5);
      creditsContainer.add(creditText);
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      creditsBg.destroy();
      creditsContainer.destroy();
    });
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
    // Nettoyer les objets interactifs avant la destruction de la scène
    if (this.menuItems) {
      this.menuItems.forEach(item => {
        if (item && item.removeInteractive) {
          try {
            item.removeInteractive();
          } catch (e) {
            // Ignorer les erreurs de nettoyage
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
            if (key) {
              if (typeof key.destroy === 'function') {
                key.destroy();
              } else {
                this.input.keyboard.removeKey(key);
              }
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
            if (key) {
              if (typeof key.destroy === 'function') {
                key.destroy();
              } else {
                this.input.keyboard.removeKey(key);
              }
            }
          });
          this.formKeys = null;
        }
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }
    }

    super.shutdown();
  }
}