export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 480;

export const PLAYER_CONFIG = {
  maxHp: 100,
  speed: 150,
  attackCooldown: 300,
  invulnerabilityTime: 1000
};

export const SCORE_MODIFIERS = {
  collectDataCrystal: 5,
  defeatCompetitor: 10,
  collectBudgetCoin: 2,
  completeQuest: 15,
  loseToBoss: -15,
  wrongFridayChoice: -20,
  genreBonus: {
    synthwave: 14,
    pop: 15,
    rap: 13,
    electro: 12,
    rock: 10,
    jazz: 8,
    metal: 11
  }
};

export const BUDGET_TIERS = {
  tier1: { min: 0, max: 199, perks: [] },
  tier2: { min: 200, max: 499, perks: ['health_potions'] },
  tier3: { min: 500, max: 1499, perks: ['power_ups', 'checkpoints'] },
  tier4: { min: 1500, max: Infinity, perks: ['auto_save', 'easy_mode', 'all_weapons'] }
};

export const COIN_VALUES = {
  bronze: 50,
  silver: 200,
  gold: 500,
  platinum: 1000
};

export const WEAPONS = {
  guitar_api: {
    name: "API Guitar",
    damage: 15,
    speed: 'medium',
    cooldown: 400,
    special: 'scan_enemy_stats',
    unlockWorld: 1,
    projectileSpeed: 300,
    projectileColor: 0xFFFF00
  },
  synth_budget: {
    name: "Budget Synthesizer",
    damage: 10,
    speed: 'fast',
    cooldown: 250,
    special: 'double_coin_collection',
    unlockWorld: 2,
    projectileSpeed: 400,
    projectileColor: 0x00FFFF
  },
  drums_tempo: {
    name: "Tempo Drums",
    damage: 20,
    speed: 'slow',
    cooldown: 600,
    special: 'slow_time_5s',
    unlockWorld: 3,
    projectileSpeed: 200,
    projectileColor: 0xFF00FF
  },
  violin_viral: {
    name: "Viral Violin",
    damage: 12,
    speed: 'medium',
    cooldown: 350,
    special: 'summon_fan_allies',
    unlockWorld: 4,
    projectileSpeed: 350,
    projectileColor: 0xFF00FF
  },
  mic_golden: {
    name: "Golden Microphone",
    damage: 50,
    speed: 'very_slow',
    cooldown: 1000,
    special: 'screen_clear_ultimate',
    unlockWorld: 5,
    projectileSpeed: 500,
    projectileColor: 0xFFD700
  }
};

export const COLORS = {
  player: 0xFFFFFF,  // Blanc
  enemy: 0xFF0000,   // Rouge
  boss: 0xFF0000,    // Rouge
  coin: 0xFFD700,    // Jaune
  dataCrystal: 0xFFD700, // Jaune
  wall: 0xFF0000,    // Rouge
  ground: 0x000000,  // Noir
  // Thème agence strict
  primary: 0x000000,   // Noir
  secondary: 0xFF0000, // Rouge
  accent: 0xFFFFFF,   // Blanc
  special: 0xFFD700   // Jaune
};

export const GENRE_STEREOTYPES = {
  pop: {
    name: "Pop Star",
    description: "Style tendance",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0xFF0000,  // Rouge
      pants: 0xFFFFFF,   // Blanc
      shoes: 0x000000,   // Noir
      accessory: 0xFFD700 // Jaune
    },
    style: "tenue_pop_stylée"
  },
  rock: {
    name: "Rock Star",
    description: "Maquillage et cuir noir",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0x000000,  // Noir
      pants: 0x000000,   // Noir
      shoes: 0x000000,   // Noir
      accessory: 0xFF0000 // Rouge
    },
    style: "tenue_rock_rebel"
  },
  rap: {
    name: "Rapper",
    description: "Style urbain",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0xFFFFFF,  // Blanc
      pants: 0x000000,   // Noir
      shoes: 0xFFFFFF,   // Blanc
      accessory: 0xFF0000 // Rouge
    },
    style: "tenue_rap_urbain"
  },
  electro: {
    name: "DJ",
    description: "Style futuriste",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0x000000,  // Noir
      pants: 0x000000,   // Noir
      shoes: 0xFFD700,   // Jaune
      accessory: 0xFF0000 // Rouge
    },
    style: "tenue_electro_futur"
  },
  jazz: {
    name: "Jazz Musician",
    description: "Costume élégant",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0x000000,  // Noir
      pants: 0x000000,   // Noir
      shoes: 0x000000,   // Noir
      accessory: 0xFFD700 // Jaune
    },
    style: "tenue_jazz_chic"
  },
  metal: {
    name: "Metal Head",
    description: "Tout en noir",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0x000000,  // Noir
      pants: 0x000000,   // Noir
      shoes: 0x000000,   // Noir
      accessory: 0xFF0000 // Rouge
    },
    style: "tenue_metal_sombre"
  },
  synthwave: {
    name: "Synthwave Artist",
    description: "Style rétro",
    colors: {
      skin: 0xFFFFFF,    // Blanc
      outfit: 0xFF0000,  // Rouge
      pants: 0x000000,   // Noir
      shoes: 0xFFFFFF,   // Blanc
      accessory: 0xFFD700 // Jaune
    },
    style: "tenue_synthwave_retro"
  }
};