import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';

// Remove loading indicator
const loadingElement = document.querySelector('.loading');
if (loadingElement) {
  loadingElement.remove();
}

// Initialize the game with enhanced error handling
let game;
try {
  console.log('🚀 Initializing Phaser Game...');
  game = new Phaser.Game(gameConfig);
  console.log('✅ Phaser Game initialized successfully');

  // Vérifier que le canvas est créé
  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      console.log('✅ Canvas created:', canvas.getBoundingClientRect());
      canvas.style.border = '2px solid #FFD700'; // Border visible pour debug
    } else {
      console.error('❌ Canvas not found!');
    }
  }, 100);

} catch (error) {
  console.error('❌ Failed to initialize Phaser Game:', error);
}

// Make game available globally for debugging
window.game = game;

// Add error handling
window.addEventListener('error', (event) => {
  // Filtrer les erreurs de destruction Phaser.js connues
  if (event.error && event.error.message &&
      (event.error.message.includes('Cannot read properties of undefined (reading \'input\')') ||
       event.error.message.includes('Cannot read properties of undefined (reading \'scene\')'))) {
    // Erreur connue de destruction Phaser.js - ignorée
    console.warn('Phaser cleanup warning (ignored):', event.error.message);
    event.preventDefault();
    return;
  }

  // Filtrer les erreurs d'extensions Chrome
  if (event.message && event.message.includes('message channel closed')) {
    event.preventDefault();
    console.warn('🔇 Chrome extension error filtered:', event.message);
    return;
  }

  console.error('Game error:', event.error);
});

// Gérer les erreurs non capturées
window.addEventListener('unhandledrejection', (event) => {
  // Filtrer les promesses rejetées par les extensions Chrome
  if (event.reason && event.reason.message &&
      event.reason.message.includes('message channel closed')) {
    event.preventDefault();
    console.warn('🔇 Chrome extension promise rejection filtered:', event.reason.message);
    return;
  }

  console.error('Unhandled promise rejection:', event.reason);
});

// Add keyboard shortcuts for development
if (import.meta.env.DEV) {
  window.addEventListener('keydown', (event) => {
    // F1 - Toggle debug physics
    if (event.key === 'F1') {
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene && currentScene.physics && currentScene.physics.world) {
        currentScene.physics.world.debugGraphic.visible = !currentScene.physics.world.debugGraphic.visible;
      }
    }

    // F2 - Restart current scene
    if (event.key === 'F2') {
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene) {
        currentScene.scene.restart();
      }
    }

    // F3 - Go to next world (for testing)
    if (event.key === 'F3') {
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene) {
        const sceneKey = currentScene.scene.key;
        let nextScene = 'MenuScene';

        switch (sceneKey) {
          case 'MenuScene':
            nextScene = 'World1_DataValley';
            break;
          case 'World1_DataValley':
            nextScene = 'World2_ScoringMaze';
            break;
          case 'World2_ScoringMaze':
            nextScene = 'World3_FridayForest';
            break;
          case 'World3_FridayForest':
            nextScene = 'World4_BudgetMountain';
            break;
          case 'World4_BudgetMountain':
            nextScene = 'World5_ReleaseCastle';
            break;
          case 'World5_ReleaseCastle':
            nextScene = 'VictoryScene';
            break;
        }

        currentScene.scene.start(nextScene, {
          score: 75,
          budget: 1000
        });
      }
    }
  });

  console.log('🎮 Release Quest - Development Mode');
  console.log('⌨️  F1: Toggle Physics Debug');
  console.log('⌨️  F2: Restart Scene');
  console.log('⌨️  F3: Next World (Testing)');
}

console.log('🎵 Release Quest - Game Started');
console.log('🚀 Game initialized successfully!');

export default game;