import { SCORE_MODIFIERS } from '../config/constants.js';

export default class ScoreSystem {
  constructor() {
    this.baseScore = 50;
    this.score = this.baseScore;
    this.genre = null;

    // Initialisation sécurisée des events
    try {
      this.events = new Phaser.Events.EventEmitter();
    } catch (error) {
      console.warn('⚠️ Phaser EventEmitter not available, using fallback');
      this.events = {
        emit: (event, ...args) => console.log(`ScoreSystem event: ${event}`, ...args),
        on: () => {},
        off: () => {}
      };
    }
  }

  addScore(amount) {
    this.score = Math.max(0, Math.min(100, this.score + amount));
    this.events.emit('scoreChanged', this.score);
    return this.score;
  }

  subtractScore(amount) {
    return this.addScore(-amount);
  }

  collectDataCrystal() {
    return this.addScore(SCORE_MODIFIERS.collectDataCrystal);
  }

  defeatCompetitor() {
    return this.addScore(SCORE_MODIFIERS.defeatCompetitor);
  }

  collectBudgetCoin() {
    return this.addScore(SCORE_MODIFIERS.collectBudgetCoin);
  }

  completeQuest() {
    return this.addScore(SCORE_MODIFIERS.completeQuest);
  }

  loseToBoss() {
    return this.addScore(SCORE_MODIFIERS.loseToBoss);
  }

  wrongFridayChoice() {
    return this.addScore(SCORE_MODIFIERS.wrongFridayChoice);
  }

  setGenre(genre) {
    this.genre = genre;
    const bonus = SCORE_MODIFIERS.genreBonus[genre] || 0;
    return this.addScore(bonus);
  }

  getCompetitionLevel() {
    if (this.score >= 85) return { level: "Very Low", color: 0x00FF00 };
    if (this.score >= 70) return { level: "Low", color: 0x90EE90 };
    if (this.score >= 55) return { level: "Moderate", color: 0xFFFF00 };
    if (this.score >= 40) return { level: "High", color: 0xFFA500 };
    return { level: "Very High", color: 0xFF0000 };
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = this.baseScore;
    this.genre = null;
    this.events.emit('scoreChanged', this.score);
  }

  serialize() {
    return {
      score: this.score,
      genre: this.genre
    };
  }

  deserialize(data) {
    this.score = data.score || this.baseScore;
    this.genre = data.genre || null;
    this.events.emit('scoreChanged', this.score);
  }
}