import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/constants.js';

// Scene de diagnostic ultra-simple
class DiagnosticScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DiagnosticScene' });
  }

  preload() {
    console.log('🔄 DiagnosticScene: preload started');

    // Créer des assets simples sans dépendances
    this.load.on('complete', () => {
      console.log('✅ DiagnosticScene: preload completed');
    });
  }

  create() {
    console.log('🎨 DiagnosticScene: create started');

    // 1. Tester le fond coloré
    this.cameras.main.setBackgroundColor('#ff0000'); // Rouge vif
    console.log('✅ Background color set to red');

    // 2. Tester un rectangle simple
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00, 1); // Vert
    graphics.fillRect(100, 100, 200, 100);
    console.log('✅ Green rectangle created');

    // 3. Tester du texte
    const text = this.add.text(400, 240, 'DIAGNOSTIC OK', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    text.setOrigin(0.5, 0.5);
    console.log('✅ Text created');

    // 4. Tester les dimensions de la caméra
    const camera = this.cameras.main;
    console.log(`📐 Camera dimensions: ${camera.width}x${camera.height}`);
    console.log(`📐 World bounds: ${this.physics.world.bounds.width}x${this.physics.world.bounds.height}`);

    // 5. Informations sur le canvas
    const canvas = this.game.canvas;
    console.log(`🖼️ Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`🖼️ Canvas style: ${canvas.style.cssText}`);
    console.log(`🖼️ Canvas parent: ${canvas.parentElement?.id || 'none'}`);

    // 6. Test d'interaction
    this.input.on('pointerdown', () => {
      console.log('🖱️ Mouse click detected');
      this.cameras.main.setBackgroundColor('#0000ff'); // Bleu
      text.setText('CLICK DETECTED!');
    });

    // 7. Test de timer
    this.time.delayedCall(2000, () => {
      console.log('⏰ Timer test: 2 seconds elapsed');
      const timerText = this.add.text(400, 300, 'TIMER OK', {
        fontSize: '24px',
        color: '#ffff00'
      });
      timerText.setOrigin(0.5, 0.5);
    });

    // 8. Test de tween
    this.tweens.add({
      targets: text,
      scale: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      onStart: () => {
        console.log('🎭 Tween animation started');
      }
    });

    console.log('🎉 DiagnosticScene: create completed successfully');
  }

  update() {
    // Diagnostic en temps réel
    if (this.time.now % 5000 < 50) { // Toutes les 5 secondes
      console.log(`⚡ Game running - FPS: ${Math.round(this.game.loop.actualFps)}`);
    }
  }
}

// Configuration de diagnostic simplifiée
const diagnosticConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#ff00ff', // Magenta pour détecter si le canvas s'affiche
  scene: [DiagnosticScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

// Diagnostic du DOM avant Phaser
function diagnoseDOMIssues() {
  console.log('🔍 Starting DOM diagnostic...');

  const container = document.getElementById('game-container');
  if (!container) {
    console.error('❌ CRITICAL: #game-container not found in DOM');
    return false;
  }

  console.log('✅ #game-container found');

  const computedStyle = window.getComputedStyle(container);
  console.log(`📐 Container computed style:`, {
    display: computedStyle.display,
    visibility: computedStyle.visibility,
    width: computedStyle.width,
    height: computedStyle.height,
    position: computedStyle.position,
    overflow: computedStyle.overflow
  });

  // Tester si on peut créer un canvas manuellement
  try {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 100;
    testCanvas.height = 100;
    testCanvas.style.border = '2px solid yellow';
    testCanvas.style.position = 'absolute';
    testCanvas.style.top = '10px';
    testCanvas.style.left = '10px';
    testCanvas.style.zIndex = '9999';

    const ctx = testCanvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('TEST', 30, 50);

    document.body.appendChild(testCanvas);
    console.log('✅ Test canvas created and visible');

    // Retirer le canvas de test après 5 secondes
    setTimeout(() => {
      testCanvas.remove();
    }, 5000);

  } catch (error) {
    console.error('❌ Canvas creation failed:', error);
  }

  return true;
}

// Intercepter les erreurs avant l'initialisation
window.addEventListener('error', (event) => {
  console.error('💥 JavaScript Error:', {
    message: event.error?.message || event.message,
    filename: event.filename,
    lineno: event.lineno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled Promise Rejection:', event.reason);
});

// Initialiser le diagnostic
console.log('🚀 Starting Release Quest Diagnostic...');

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiagnostic);
} else {
  initDiagnostic();
}

function initDiagnostic() {
  console.log('📋 DOM ready, starting diagnostic sequence...');

  // 1. Diagnostic DOM
  if (!diagnoseDOMIssues()) {
    console.error('❌ DOM diagnostic failed - stopping');
    return;
  }

  // 2. Diagnostic Phaser
  try {
    console.log('🎮 Creating Phaser game instance...');
    const game = new Phaser.Game(diagnosticConfig);

    // Exposer globalement pour debug
    window.game = game;

    // Surveiller les événements Phaser
    game.events.on('ready', () => {
      console.log('✅ Phaser game ready event fired');
    });

    game.events.on('boot', () => {
      console.log('✅ Phaser game boot event fired');
    });

    // Diagnostic périodique
    setInterval(() => {
      if (game.canvas) {
        console.log(`📊 Canvas status: ${game.canvas.width}x${game.canvas.height}, visible: ${game.canvas.style.display !== 'none'}`);
      }

      const activeScenes = game.scene.getScenes(true);
      console.log(`🎬 Active scenes: ${activeScenes.map(s => s.scene.key).join(', ')}`);
    }, 10000); // Toutes les 10 secondes

  } catch (error) {
    console.error('💥 Phaser initialization failed:', error);
  }
}

export default window.game;