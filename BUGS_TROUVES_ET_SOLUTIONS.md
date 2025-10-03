# Bugs trouvés et solutions - Release Quest

## Date : 3 octobre 2025

---

## 🐛 Bug Principal : Écran noir après validation du formulaire

### Symptômes
- Le formulaire se valide correctement
- La transition fade-out fonctionne
- Le log "✅ World1_DataValley started" apparaît
- **MAIS** l'écran reste complètement noir
- La méthode `create()` de World1_DataValley ne s'exécute JAMAIS

### Logs de la console
```
log: 🚀 Starting game with data: {name: ab, firstName: cd, email: a@b.c, company: , genre: pop}
error: Failed to load resource: the server responded with a status of 500 () [webhook n8n]
log: ✅ Données envoyées vers n8n
log: 📦 Registry data set: {artistName: ab cd, email: a@b.c, genre: pop}
log: 🎬 Starting transition to World1_DataValley
log: ✅ Fade out complete, launching World1_DataValley
log: ✅ World1_DataValley started
warning: Phaser cleanup warning (ignored): Cannot read properties of undefined (reading 'input')
```

### Observations critiques
1. **Aucun log de `create()`** : Les logs comme "🌍 World1_DataValley - Démarrage", "⚙️ Initialisation des systèmes..." n'apparaissent JAMAIS
2. **La scène démarre mais ne se crée pas** : `scene.start()` réussit mais `create()` ne s'exécute pas
3. **Erreur d'input** : "Cannot read properties of undefined (reading 'input')" suggère un problème d'initialisation

---

## 🔍 Analyse approfondie

### Hypothèses testées

#### ❌ Hypothèse 1 : Imports manquants
**Test** : Vérification de l'existence de tous les fichiers importés
```bash
ls -la src/entities/Player.js src/entities/Enemy.js src/ui/HUD.js 
      src/systems/ScoreSystem.js src/systems/BudgetSystem.js 
      src/systems/WeaponSystem.js
```
**Résultat** : Tous les fichiers existent ✅

#### ❌ Hypothèse 2 : Scène non enregistrée
**Test** : Vérification de gameConfig.js
**Résultat** : World1_DataValley est bien dans la liste des scènes ✅

#### ✅ Hypothèse 3 : Erreur JavaScript dans create()
**Analyse** : La méthode `create()` plante immédiatement sans log
**Cause probable** : Une des premières lignes de `create()` lance une exception

---

## 🛠️ Corrections déjà appliquées

### 1. Correction de `this.input` dans setupEvents()
**Fichier** : `src/scenes/World1_DataValley.js` ligne 357-363

**Avant** :
```javascript
this.input.keyboard.on('keydown-ESC', () => {
  this.scene.pause();
  this.scene.launch('PauseScene');
});
```

**Après** :
```javascript
// Gestion de la touche ESC pour la pause
if (this.input && this.input.keyboard) {
  this.input.keyboard.on('keydown-ESC', () => {
    this.scene.pause();
    this.scene.launch('PauseScene');
  });
}
```

**Statut** : ✅ Corrigé et committé

### 2. Correction des dimensions dans HUD.js
**Fichier** : `src/ui/HUD.js` ligne 19-21

**Avant** :
```javascript
const width = this.scene.game.config.width;
const height = this.scene.game.config.height;
```

**Après** :
```javascript
// Utiliser les dimensions de la caméra au lieu de game.config
const width = this.scene.cameras.main.width;
const height = this.scene.cameras.main.height;
```

**Statut** : ✅ Corrigé et committé

---

## 🚨 Bugs NON RÉSOLUS

### Bug critique : create() ne s'exécute pas

**Problème** : La méthode `create()` de World1_DataValley ne s'exécute jamais, même si la scène démarre.

**Pistes à explorer** :

#### Piste 1 : Erreur dans le constructeur
Le constructeur de World1_DataValley pourrait avoir un problème :
```javascript
constructor() {
  super({ key: 'World1_DataValley' });
}
```

#### Piste 2 : Erreur dans les imports des classes
Les classes Player, Enemy, HUD, etc. pourraient avoir des erreurs d'export/import :
```javascript
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import HUD from '../ui/HUD.js';
// ...
```

#### Piste 3 : Erreur dans Player.js
Le Player utilise `scene.input.keyboard` dans son constructeur (ligne 29-41) :
```javascript
this.keys = scene.input.keyboard.addKeys({
  up: Phaser.Input.Keyboard.KeyCodes.W,
  // ...
});
```

**Si `scene.input` est undefined**, le Player ne peut pas se créer, ce qui fait planter `createPlayer()` dans `create()`.

#### Piste 4 : Problème de timing
La scène World1 est lancée immédiatement après le fade-out. Peut-être que Phaser n'a pas le temps de nettoyer MenuScene avant de créer World1.

---

## ✅ Solutions proposées

### Solution 1 : Vérifier scene.input avant utilisation dans Player.js

**Fichier** : `src/entities/Player.js` ligne 29-41

**Modification** :
```javascript
// Vérifier que scene.input existe avant de créer les keys
if (scene.input && scene.input.keyboard) {
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
} else {
  console.error('❌ scene.input is undefined in Player constructor!');
  this.keys = {}; // Créer un objet vide pour éviter les erreurs
}
```

### Solution 2 : Ajouter des try-catch dans create()

**Fichier** : `src/scenes/World1_DataValley.js` ligne 14-60

**Modification** :
```javascript
create() {
  try {
    console.log('🌍 World1_DataValley - Démarrage');

    this.cameras.main.setBackgroundColor('#0a0a1a');

    console.log('⚙️ Initialisation des systèmes...');
    this.scoreSystem = new ScoreSystem();
    this.budgetSystem = new BudgetSystem();

    console.log('🏗️ Création du monde...');
    this.createWorld();

    console.log('👤 Création du joueur...');
    this.createPlayer();

    console.log('⚔️ Initialisation des armes...');
    this.weaponSystem = new WeaponSystem(this);

    console.log('👹 Création des ennemis...');
    this.createEnemies();

    console.log('💎 Création des collectibles...');
    this.createCollectibles();

    console.log('🏛️ Création des temples...');
    this.createTemples();

    console.log('💥 Configuration des collisions...');
    this.setupCollisions();

    console.log('🎮 Création du HUD...');
    this.createHUD();

    console.log('⚡ Configuration des événements...');
    this.setupEvents();

    console.log('📹 Configuration de la caméra...');
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setZoom(1.5);

    console.log('🎬 Affichage de l\'intro...');
    this.showWorldIntro();

    console.log('✅ World1_DataValley - Prêt à jouer!');
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE dans World1_DataValley.create():', error);
    console.error('Stack trace:', error.stack);
    
    // Afficher un message d'erreur à l'utilisateur
    this.add.text(400, 240, 'ERROR: Failed to load World1\n\nCheck console for details', {
      fontSize: '24px',
      fontFamily: 'Courier New',
      color: '#FF0000',
      align: 'center'
    }).setOrigin(0.5, 0.5);
  }
}
```

### Solution 3 : Ajouter un délai avant de lancer World1

**Fichier** : `src/scenes/MenuScene.js` ligne 625-635

**Modification** :
```javascript
this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
  console.log('✅ Fade out complete, launching World1_DataValley');

  // Ajouter un délai pour laisser Phaser nettoyer MenuScene
  this.time.delayedCall(100, () => {
    try {
      this.scene.start('World1_DataValley');
      console.log('✅ World1_DataValley started');
    } catch (error) {
      console.error('💥 Error starting World1_DataValley:', error);
    }
  });
});
```

### Solution 4 : Utiliser scene.stop() au lieu de scene.start()

**Fichier** : `src/scenes/MenuScene.js` ligne 625-635

**Modification** :
```javascript
this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
  console.log('✅ Fade out complete, launching World1_DataValley');

  try {
    // Arrêter MenuScene avant de démarrer World1
    this.scene.stop('MenuScene');
    this.scene.start('World1_DataValley');
    console.log('✅ World1_DataValley started');
  } catch (error) {
    console.error('💥 Error starting World1_DataValley:', error);
  }
});
```

---

## 📋 Plan d'action recommandé

### Étape 1 : Appliquer Solution 1 (Player.js)
Vérifier `scene.input` avant utilisation dans le constructeur de Player.

### Étape 2 : Appliquer Solution 2 (try-catch)
Ajouter des try-catch dans `create()` pour capturer l'erreur exacte.

### Étape 3 : Tester localement
Lancer `npm run dev` et tester le jeu pour voir les logs d'erreur.

### Étape 4 : Appliquer Solution 3 ou 4 si nécessaire
Si le problème persiste, ajouter un délai ou utiliser `scene.stop()`.

### Étape 5 : Rebuild et redéployer
```bash
npm run build
git add -A
git commit -m "🐛 Fix World1 black screen bug"
git push origin main
```

---

## 🔧 Commandes de test

### Test local
```bash
cd /home/ubuntu/release-quest
npm run dev
# Ouvrir http://localhost:5173
```

### Test de build
```bash
npm run build
npm run preview
# Ouvrir http://localhost:4173
```

### Vérifier les logs
```bash
# Dans la console du navigateur
# Chercher les logs commençant par 🌍, ⚙️, 🏗️, etc.
```

---

## 📊 Résumé

| Bug | Statut | Priorité | Solution |
|-----|--------|----------|----------|
| Écran noir World1 | 🔴 NON RÉSOLU | CRITIQUE | Solutions 1-4 |
| this.input undefined | ✅ RÉSOLU | Haute | Vérification ajoutée |
| HUD dimensions | ✅ RÉSOLU | Moyenne | Utilisation cameras.main |
| Webhook n8n 500 | ⚠️ EXTERNE | Basse | Vérifier l'URL |

---

## 🎯 Prochaines étapes

1. ✅ Appliquer Solution 1 (Player.js)
2. ✅ Appliquer Solution 2 (try-catch)
3. ⏳ Tester localement
4. ⏳ Commit et push
5. ⏳ Attendre redéploiement Railway (2-5 min)
6. ⏳ Tester en production

---

**Note** : Le bug d'écran noir est probablement causé par `scene.input` qui est `undefined` au moment où Player est créé. La Solution 1 devrait résoudre ce problème.
