import { BUDGET_TIERS, COIN_VALUES } from '../config/constants.js';

export default class BudgetSystem {
  constructor() {
    this.budget = 0;
    this.tier = 'tier1';

    // Initialisation sécurisée des events
    try {
      this.events = new Phaser.Events.EventEmitter();
    } catch (error) {
      console.warn('⚠️ Phaser EventEmitter not available, using fallback');
      this.events = {
        emit: (event, ...args) => console.log(`BudgetSystem event: ${event}`, ...args),
        on: () => {},
        off: () => {}
      };
    }
  }

  addBudget(amount) {
    this.budget += amount;
    this.updateTier();
    this.events.emit('budgetChanged', this.budget);
    return this.budget;
  }

  spendBudget(amount) {
    if (this.budget >= amount) {
      this.budget -= amount;
      this.updateTier();
      this.events.emit('budgetChanged', this.budget);
      return true;
    }
    return false;
  }

  collectCoin(type) {
    const value = COIN_VALUES[type] || 0;
    return this.addBudget(value);
  }

  updateTier() {
    for (const [tierName, tierData] of Object.entries(BUDGET_TIERS)) {
      if (this.budget >= tierData.min && this.budget <= tierData.max) {
        this.tier = tierName;
        break;
      }
    }
  }

  getTier() {
    return BUDGET_TIERS[this.tier];
  }

  getTierName() {
    return this.tier;
  }

  hasPerк(perk) {
    const tier = this.getTier();
    return tier.perks.includes(perk);
  }

  getBudget() {
    return this.budget;
  }

  canAfford(amount) {
    return this.budget >= amount;
  }

  reset() {
    this.budget = 0;
    this.tier = 'tier1';
    this.events.emit('budgetChanged', this.budget);
  }

  serialize() {
    return {
      budget: this.budget,
      tier: this.tier
    };
  }

  deserialize(data) {
    this.budget = data.budget || 0;
    this.tier = data.tier || 'tier1';
    this.events.emit('budgetChanged', this.budget);
  }
}