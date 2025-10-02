import * as Phaser from 'phaser';
import { COLORS, COIN_VALUES } from '../config/constants.js';

export default class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);

    this.scene = scene;
    this.config = config;
    this.hp = config.hp || 20;
    this.maxHp = this.hp;
    this.damage = config.damage || 5;
    this.speed = config.speed || 50;
    this.behavior = config.behavior || 'patrol_horizontal';
    this.drops = config.drops || ['bronze_coin'];
    this.special = config.special || null;
    this.isDead = false;
    this.lastAttackTime = 0;
    this.attackCooldown = 1000;

    const size = config.size || 24;
    const graphics = scene.add.graphics();
    graphics.fillStyle(config.color || COLORS.enemy, 1);
    graphics.fillRect(-size/2, -size/2, size, size);
    graphics.generateTexture(config.sprite || 'enemy_temp', size, size);
    graphics.destroy();

    this.sprite = scene.add.sprite(0, 0, config.sprite || 'enemy_temp');
    this.add(this.sprite);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(size - 4, size - 4);

    this.patrolDirection = 1;
    this.patrolDistance = config.patrolDistance || 100;
    this.startX = x;
    this.startY = y;

    this.target = null;

    this.setDepth(50);
  }

  update() {
    if (this.isDead) return;

    switch (this.behavior) {
      case 'patrol_horizontal':
        this.patrolHorizontal();
        break;
      case 'patrol_vertical':
        this.patrolVertical();
        break;
      case 'chase_player':
        this.chasePlayer();
        break;
      case 'random_walk':
        this.randomWalk();
        break;
      case 'static':
        this.body.setVelocity(0, 0);
        break;
      default:
        this.patrolHorizontal();
    }

    this.checkAttackPlayer();
  }

  patrolHorizontal() {
    this.body.setVelocityY(0);

    if (Math.abs(this.x - this.startX) >= this.patrolDistance) {
      this.patrolDirection *= -1;
    }

    this.body.setVelocityX(this.speed * this.patrolDirection);
    this.sprite.setFlipX(this.patrolDirection < 0);
  }

  patrolVertical() {
    this.body.setVelocityX(0);

    if (Math.abs(this.y - this.startY) >= this.patrolDistance) {
      this.patrolDirection *= -1;
    }

    this.body.setVelocityY(this.speed * this.patrolDirection);
  }

  chasePlayer() {
    if (!this.scene.player || this.scene.player.isDead) {
      this.body.setVelocity(0, 0);
      return;
    }

    const player = this.scene.player;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.body.setVelocity(velocityX, velocityY);
    this.sprite.setFlipX(velocityX < 0);
  }

  randomWalk() {
    if (!this.lastDirectionChange || this.scene.time.now - this.lastDirectionChange > 2000) {
      const angle = Math.random() * Math.PI * 2;
      this.body.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      );
      this.lastDirectionChange = this.scene.time.now;
    }
  }

  checkAttackPlayer() {
    if (!this.scene.player || this.scene.player.isDead) return;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.scene.player.x, this.scene.player.y
    );

    if (distance < 40) {
      const now = this.scene.time.now;
      if (now - this.lastAttackTime > this.attackCooldown) {
        this.lastAttackTime = now;
        this.scene.player.takeDamage(this.damage);
        this.performSpecialAbility();
      }
    }
  }

  performSpecialAbility() {
    if (!this.special) return;

    switch (this.special) {
      case 'steal_score_points':
        if (this.scene.scoreSystem) {
          this.scene.scoreSystem.subtractScore(10);
        }
        break;
      case 'steal_budget_coins':
        if (this.scene.budgetSystem) {
          this.scene.budgetSystem.spendBudget(50);
        }
        break;
      case 'slow_player_movement':
        if (this.scene.player) {
          const originalSpeed = this.scene.player.speed;
          this.scene.player.speed *= 0.5;
          this.scene.time.delayedCall(3000, () => {
            this.scene.player.speed = originalSpeed;
          });
        }
        break;
    }
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.hp = Math.max(0, this.hp - amount);

    const damageText = this.scene.add.text(this.x, this.y - 30, `-${amount}`, {
      fontSize: '16px',
      color: '#FF0000',
      fontFamily: 'Courier New'
    });

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 20,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        damageText.destroy();
      }
    });

    this.scene.tweens.add({
      targets: this.sprite,
      tint: 0xFF0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.sprite.clearTint();
      }
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;

    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.body.enable = false;

    if (this.scene.scoreSystem) {
      this.scene.scoreSystem.defeatCompetitor();
    }

    this.dropLoot();

    this.scene.tweens.add({
      targets: this,
      scale: 0,
      rotation: Math.PI,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  dropLoot() {
    if (!this.drops || this.drops.length === 0) return;

    const drop = Phaser.Math.RND.pick(this.drops);

    if (drop.includes('coin')) {
      const coinType = drop.replace('_coin', '');
      const value = COIN_VALUES[coinType] || 50;

      const coin = this.scene.add.container(this.x, this.y);

      const graphics = this.scene.add.graphics();
      graphics.fillStyle(COLORS.coin, 1);
      graphics.fillCircle(0, 0, 8);
      graphics.generateTexture('coin_temp', 16, 16);
      graphics.destroy();

      const coinSprite = this.scene.add.sprite(0, 0, 'coin_temp');
      coin.add(coinSprite);

      this.scene.physics.add.existing(coin);
      coin.body.setSize(16, 16);

      coin.value = value;
      coin.type = coinType;

      this.scene.tweens.add({
        targets: coinSprite,
        rotation: Math.PI * 4,
        duration: 3000,
        repeat: -1
      });

      if (this.scene.coins) {
        this.scene.coins.add(coin);
      }
    }
  }
}