import * as Phaser from 'phaser';
import { PLAYER_CONFIG, COLORS, GENRE_STEREOTYPES } from '../config/constants.js';

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene = scene;
    this.hp = PLAYER_CONFIG.maxHp;
    this.maxHp = PLAYER_CONFIG.maxHp;
    this.speed = PLAYER_CONFIG.speed;
    this.isInvulnerable = false;
    this.isDead = false;
    this.facing = 'right';

    // Récupérer le genre depuis les données du jeu
    this.genre = scene.registry.get('genre') || 'pop';
    this.artistName = scene.registry.get('artistName') || 'INDIE_ARTIST';

    this.createPlayerSprite();
    this.addPlayerElements();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(28, 28);
    this.body.setCollideWorldBounds(true);

    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      altUp: Phaser.Input.Keyboard.KeyCodes.UP,
      altDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
      altLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
      altRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      switchWeapon: Phaser.Input.Keyboard.KeyCodes.Q
    });

    this.lastAttackTime = 0;
    this.attackCooldown = PLAYER_CONFIG.attackCooldown;

    this.setDepth(100);
  }

  createPlayerSprite() {
    const stereotype = GENRE_STEREOTYPES[this.genre];
    const colors = stereotype.colors;

    // Créer le sprite personnalisé selon le genre
    const graphics = this.scene.add.graphics();

    // Corps (torse)
    graphics.fillStyle(colors.outfit);
    graphics.fillRect(-12, -8, 24, 16);

    // Pantalon/Jambes
    graphics.fillStyle(colors.pants);
    graphics.fillRect(-10, 8, 8, 16);  // Jambe gauche
    graphics.fillRect(2, 8, 8, 16);    // Jambe droite

    // Chaussures
    graphics.fillStyle(colors.shoes);
    graphics.fillRect(-12, 22, 10, 6);  // Pied gauche
    graphics.fillRect(2, 22, 10, 6);    // Pied droit

    // Tête
    graphics.fillStyle(colors.skin);
    graphics.fillCircle(0, -12, 10);

    // Ajouts spécifiques par genre
    this.addGenreSpecificFeatures(graphics, colors, stereotype);

    graphics.generateTexture('player_' + this.genre, 32, 32);
    graphics.destroy();

    this.sprite = this.scene.add.sprite(0, 0, 'player_' + this.genre);
    this.add(this.sprite);
  }

  addGenreSpecificFeatures(graphics, colors, stereotype) {
    switch (this.genre) {
      case 'rap':
        // Casquette à l'envers
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-12, -20, 24, 8);
        graphics.fillRect(8, -16, 6, 4);  // Visière à l'envers

        // Baggy effect (pantalon plus large)
        graphics.fillStyle(colors.pants);
        graphics.fillRect(-14, 8, 28, 16);
        break;

      case 'rock':
        // Maquillage KISS (étoile sur l'œil)
        graphics.fillStyle(colors.accessory);
        graphics.beginPath();
        graphics.moveTo(-6, -12);
        graphics.lineTo(-4, -16);
        graphics.lineTo(-2, -12);
        graphics.lineTo(-8, -10);
        graphics.lineTo(-4, -8);
        graphics.closePath();
        graphics.fill();

        // Cuir (effet brillant)
        graphics.fillStyle(0x333333);
        graphics.fillRect(-12, -8, 2, 16);
        graphics.fillRect(10, -8, 2, 16);
        break;

      case 'pop':
        // Accessoires dorés
        graphics.fillStyle(colors.accessory);
        graphics.fillCircle(-8, -12, 2);  // Boucle d'oreille
        graphics.fillCircle(8, -12, 2);   // Boucle d'oreille

        // Tenue colorée avec paillettes (petits points)
        graphics.fillStyle(0xFFFFFF);
        for (let i = 0; i < 10; i++) {
          graphics.fillCircle(
            Math.random() * 20 - 10,
            Math.random() * 12 - 6,
            1
          );
        }
        break;

      case 'electro':
        // Lunettes futuristes
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-8, -14, 16, 4);
        graphics.strokeRect(-8, -14, 16, 4);

        // Effets néon
        graphics.fillStyle(0x00FFFF);
        graphics.fillRect(-1, -8, 2, 16);  // Ligne néon verticale
        break;

      case 'jazz':
        // Chapeau élégant
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-10, -22, 20, 4);  // Bord du chapeau
        graphics.fillRect(-6, -26, 12, 8);   // Calotte

        // Nœud papillon
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-4, -2, 8, 3);
        graphics.fillRect(-1, -3, 2, 5);
        break;

      case 'metal':
        // Cheveux longs
        graphics.fillStyle(0x000000);
        graphics.fillRect(-16, -18, 8, 20);  // Cheveux gauche
        graphics.fillRect(8, -18, 8, 20);    // Cheveux droite

        // Chaînes
        graphics.fillStyle(colors.accessory);
        graphics.fillCircle(-6, 0, 2);
        graphics.fillCircle(0, 2, 2);
        graphics.fillCircle(6, 0, 2);
        break;

      case 'synthwave':
        // Lunettes de soleil 80s
        graphics.fillStyle(colors.accessory);
        graphics.fillRect(-10, -14, 20, 6);

        // Veste ouverte style 80s
        graphics.lineStyle(2, colors.outfit);
        graphics.strokeRect(-12, -8, 24, 16);

        // Effet rétro (lignes horizontales)
        graphics.lineStyle(1, colors.accessory);
        for (let i = -6; i < 8; i += 3) {
          graphics.lineBetween(-12, i, 12, i);
        }
        break;
    }
  }

  addPlayerElements() {
    // Afficher le nom de l'artiste au-dessus
    this.nameText = this.scene.add.text(0, -40, this.artistName, {
      fontSize: '12px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 1
    });
    this.nameText.setOrigin(0.5, 0.5);
    this.add(this.nameText);

    // Ajouter une indication du genre musical
    const stereotype = GENRE_STEREOTYPES[this.genre];
    this.genreText = this.scene.add.text(0, -28, stereotype.name, {
      fontSize: '10px',
      fontFamily: 'Courier New',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 1
    });
    this.genreText.setOrigin(0.5, 0.5);
    this.add(this.genreText);

    // Animation clignotante pour le nom au début
    this.scene.tweens.add({
      targets: [this.nameText, this.genreText],
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.nameText.setAlpha(1);
        this.genreText.setAlpha(1);
      }
    });

    // Ajouter un cercle lumineux autour du personnage pour le rendre visible
    const glow = this.scene.add.graphics();
    glow.lineStyle(2, 0xFFFFFF, 0.5);
    glow.strokeCircle(0, 0, 30);
    this.add(glow);
  }

  update() {
    if (this.isDead) return;

    this.handleMovement();
    this.handleAttack();
    this.handleWeaponSwitch();
    this.updateInvulnerability();
  }

  handleMovement() {
    const velocity = { x: 0, y: 0 };

    if (this.keys.left.isDown || this.keys.altLeft.isDown) {
      velocity.x = -this.speed;
      this.facing = 'left';
      this.sprite.setFlipX(true);
    } else if (this.keys.right.isDown || this.keys.altRight.isDown) {
      velocity.x = this.speed;
      this.facing = 'right';
      this.sprite.setFlipX(false);
    }

    if (this.keys.up.isDown || this.keys.altUp.isDown) {
      velocity.y = -this.speed;
    } else if (this.keys.down.isDown || this.keys.altDown.isDown) {
      velocity.y = this.speed;
    }

    if (velocity.x !== 0 && velocity.y !== 0) {
      const normalizer = 0.707;
      velocity.x *= normalizer;
      velocity.y *= normalizer;
    }

    this.body.setVelocity(velocity.x, velocity.y);
  }

  handleAttack() {
    if (this.keys.space.isDown) {
      const now = this.scene.time.now;
      if (now - this.lastAttackTime > this.attackCooldown) {
        this.lastAttackTime = now;
        this.attack();
      }
    }
  }

  attack() {
    if (this.scene.weaponSystem) {
      const direction = this.facing === 'right' ? 0 : Math.PI;
      const offsetX = this.facing === 'right' ? 20 : -20;

      this.scene.weaponSystem.fire(
        this.x + offsetX,
        this.y,
        direction
      );

      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.2,
        scaleY: 0.8,
        duration: 100,
        yoyo: true,
        ease: 'Power1'
      });
    }
  }

  handleWeaponSwitch() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.switchWeapon)) {
      if (this.scene.weaponSystem) {
        const newWeapon = this.scene.weaponSystem.switchWeapon();
        this.scene.events.emit('weaponSwitched', newWeapon);
      }
    }
  }

  takeDamage(amount) {
    if (this.isInvulnerable || this.isDead) return;

    this.hp = Math.max(0, this.hp - amount);
    this.scene.events.emit('playerHealthChanged', this.hp, this.maxHp);

    if (this.hp <= 0) {
      this.die();
      return;
    }

    this.makeInvulnerable();

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.alpha = 1;
      }
    });

    this.scene.cameras.main.shake(200, 0.01);

    const flashGraphics = this.scene.add.graphics();
    flashGraphics.fillStyle(0xFF0000, 0.3);
    flashGraphics.fillRect(0, 0, 800, 480);

    this.scene.tweens.add({
      targets: flashGraphics,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        flashGraphics.destroy();
      }
    });
  }

  makeInvulnerable() {
    this.isInvulnerable = true;
    this.scene.time.delayedCall(PLAYER_CONFIG.invulnerabilityTime, () => {
      this.isInvulnerable = false;
    });
  }

  updateInvulnerability() {
    if (this.isInvulnerable) {
      this.sprite.setTint(0xFFFFFF * Math.random());
    } else {
      this.sprite.clearTint();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.scene.events.emit('playerHealthChanged', this.hp, this.maxHp);

    const healText = this.scene.add.text(this.x, this.y - 40, `+${amount}`, {
      fontSize: '20px',
      color: '#00FF00',
      fontFamily: 'Courier New'
    });

    this.scene.tweens.add({
      targets: healText,
      y: healText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        healText.destroy();
      }
    });
  }

  die() {
    if (this.isDead) return;

    this.isDead = true;
    this.body.setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      rotation: Math.PI * 2,
      scale: 0,
      duration: 1000,
      onComplete: () => {
        this.scene.events.emit('playerDied');
      }
    });
  }

  reset() {
    this.hp = this.maxHp;
    this.isDead = false;
    this.isInvulnerable = false;
    this.rotation = 0;
    this.scale = 1;
    this.alpha = 1;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  isInteracting() {
    return Phaser.Input.Keyboard.JustDown(this.keys.interact);
  }
}