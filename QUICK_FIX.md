# 🔧 Quick Fix pour l'écran noir - Release Quest

## Diagnostic rapide (2 minutes)

### 1. Test de base Canvas
Ouvre ta console (F12) et vérifie ces éléments :

```javascript
// Dans la console du navigateur :
console.log('Canvas:', document.querySelector('canvas'));
console.log('Game container:', document.getElementById('game-container'));
console.log('Game object:', window.game);
```

### 2. Solutions immédiates

#### Solution A : Remplacer main.js temporairement
```bash
# Sauvegarde ton main.js
cp src/main.js src/main.js.backup

# Utilise la version diagnostic
cp src/debug-main.js src/main.js
```

#### Solution B : Corriger BootScene
```bash
# Sauvegarde ton BootScene
cp src/scenes/BootScene.js src/scenes/BootScene.js.backup

# Utilise la version corrigée
cp src/scenes/BootScene-fixed.js src/scenes/BootScene.js
```

#### Solution C : Modifier temporairement index.html
```html
<!-- Remplace cette ligne dans index.html -->
<script type="module" src="/src/debug-main.js"></script>
```

### 3. Vérifications prioritaires

#### A. Canvas visible ?
```javascript
// Si le canvas n'apparaît pas
const canvas = document.querySelector('canvas');
if (canvas) {
  canvas.style.border = '2px solid red';
  console.log('Canvas trouvé:', canvas.getBoundingClientRect());
}
```

#### B. Scène active ?
```javascript
// Vérifier la scène active
if (window.game) {
  const scenes = window.game.scene.getScenes(true);
  console.log('Scènes actives:', scenes.map(s => s.scene.key));
}
```

#### C. Erreurs silencieuses ?
```javascript
// Intercepter toutes les erreurs
window.addEventListener('error', e => {
  console.log('ERREUR:', e.error);
});
```

## Solutions définitives

### 1. Problème de timing (le plus probable)

**Problème :** BootScene transite trop rapidement vers MenuScene

**Solution :**
```javascript
// Dans BootScene.js, ligne 161-163, remplace :
this.time.delayedCall(1000, () => {
  this.scene.start('MenuScene');
});

// Par :
this.time.delayedCall(3000, () => {
  console.log('Transition vers MenuScene');
  if (this.scene.get('MenuScene')) {
    this.scene.start('MenuScene');
  } else {
    console.error('MenuScene non trouvée !');
  }
});
```

### 2. Problème de couleurs

**Problème :** Fond noir + texte noir = invisible

**Solution :**
```javascript
// Dans MenuScene.js, ligne 14, change la couleur de fond :
this.cameras.main.setBackgroundColor('#FF0000'); // Rouge pour test

// Ou dans BootScene.js, ligne 112, ajoute :
this.cameras.main.setBackgroundColor('#000033'); // Bleu foncé
```

### 3. Problème de Canvas

**Problème :** Canvas mal positionné ou invisible

**Solution CSS dans index.html :**
```css
#game-container {
  border: 2px solid red; /* Pour voir le container */
  background: yellow;    /* Pour voir si le container est vide */
}

canvas {
  border: 2px solid blue; /* Pour voir le canvas */
  display: block !important;
  visibility: visible !important;
}
```

### 4. Test de validation finale

Une fois un fix appliqué, valide avec :

```javascript
// Dans la console :
setTimeout(() => {
  console.log('=== DIAGNOSTIC FINAL ===');
  console.log('Canvas:', !!document.querySelector('canvas'));
  console.log('Game:', !!window.game);
  console.log('Scènes actives:', window.game?.scene.getScenes(true).map(s => s.scene.key));
  console.log('Dimensions canvas:', document.querySelector('canvas')?.getBoundingClientRect());
}, 5000);
```

## Si rien ne fonctionne

### Fallback minimal

Crée un fichier `minimal-test.html` :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Phaser Minimal</title>
</head>
<body>
    <div id="game"></div>
    <script type="module">
        import Phaser from '/node_modules/phaser/dist/phaser.esm.js';

        class TestScene extends Phaser.Scene {
            create() {
                this.cameras.main.setBackgroundColor('#00ff00');
                this.add.text(400, 240, 'PHASER FONCTIONNE', {
                    fontSize: '32px',
                    color: '#000000'
                }).setOrigin(0.5);
            }
        }

        new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 480,
            parent: 'game',
            scene: TestScene
        });
    </script>
</body>
</html>
```

## Contact debug

Si tu es bloqué, lance ces commandes et partage la sortie :

```bash
# Vérifier les logs Vite
npm run dev

# Dans un autre terminal
curl http://localhost:5173/
```