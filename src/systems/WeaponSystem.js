import { WEAPONS } from '../config/constants.js';

export default class WeaponSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentWeapon = 'guitar_api';
    this.unlockedWeapons = ['guitar_api'];
    this.lastFired = 0;
    this.projectiles = scene.physics.add.group();
  }

  unlockWeapon(weaponKey) {
    if (!this.unlockedWeapons.includes(weaponKey)) {
      this.unlockedWeapons.push(weaponKey);
      return true;
    }
    return false;
  }

  switchWeapon() {
    const currentIndex = this.unlockedWeapons.indexOf(this.currentWeapon);
    const nextIndex = (currentIndex + 1) % this.unlockedWeapons.length;
    this.currentWeapon = this.unlockedWeapons[nextIndex];
    return this.currentWeapon;
  }

  setWeapon(weaponKey) {
    if (this.unlockedWeapons.includes(weaponKey)) {
      this.currentWeapon = weaponKey;
      return true;
    }
    return false;
  }

  canFire() {
    const weapon = WEAPONS[this.currentWeapon];
    const now = this.scene.time.now;
    return now - this.lastFired > weapon.cooldown;
  }

  fire(x, y, direction) {
    if (!this.canFire()) return null;

    const weapon = WEAPONS[this.currentWeapon];
    this.lastFired = this.scene.time.now;

    const projectile = this.projectiles.create(x, y, null);

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(weapon.projectileColor, 1);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('projectile_' + this.currentWeapon, 8, 8);
    graphics.destroy();

    projectile.setTexture('projectile_' + this.currentWeapon);
    projectile.damage = weapon.damage;
    projectile.weaponType = this.currentWeapon;

    const speed = weapon.projectileSpeed;
    projectile.setVelocity(
      Math.cos(direction) * speed,
      Math.sin(direction) * speed
    );

    projectile.setCollideWorldBounds(true);
    projectile.body.onWorldBounds = true;

    this.scene.time.delayedCall(3000, () => {
      projectile.destroy();
    });

    return projectile;
  }

  getCurrentWeapon() {
    return WEAPONS[this.currentWeapon];
  }

  getProjectiles() {
    return this.projectiles;
  }

  destroy() {
    this.projectiles.clear(true, true);
  }
}