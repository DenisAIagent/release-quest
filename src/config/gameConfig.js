import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import BootScene from '../scenes/BootScene.js';
import MenuScene from '../scenes/MenuScene.js';
import World1_DataValley from '../scenes/World1_DataValley.js';
import World2_ScoringMaze from '../scenes/World2_ScoringMaze.js';
import World3_FridayForest from '../scenes/World3_FridayForest.js';
import World4_BudgetMountain from '../scenes/World4_BudgetMountain.js';
import World5_ReleaseCastle from '../scenes/World5_ReleaseCastle.js';
import GameOverScene from '../scenes/GameOverScene.js';
import VictoryScene from '../scenes/VictoryScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#000000', // Fond noir selon le design
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MenuScene,
    World1_DataValley,
    World2_ScoringMaze,
    World3_FridayForest,
    World4_BudgetMountain,
    World5_ReleaseCastle,
    GameOverScene,
    VictoryScene
  ],
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: false,
    pixelArt: true
  }
};