# Release Quest: The Planner's Journey

A complete 2D retro-style video game built with Phaser.js 3 that simulates the journey of an independent music artist navigating the music industry to launch their project at the perfect moment.

## 🎯 Game Overview

Each game level represents a real step from the Music Release Planner workflow, transforming technical processes into engaging gameplay mechanics. The goal is to achieve a Perfect Score (100) and release your track on the Optimal Friday.

### 🌍 Game Worlds

1. **World 1: Data Valley** - Collect API data from 5 temples (MusicBrainz, YouTube, Google Trends, iTunes, Spotify)
2. **World 2: Scoring Maze** - Navigate algorithm competition and choose your genre
3. **World 3: Friday Forest** - Select the optimal release Friday based on your score
4. **World 4: Budget Mountain** - Climb through campaign timeline from J-45 to J+0
5. **World 5: Release Castle** - Final launch day with email campaigns and database management

### 🎮 Core Mechanics

- **Score System**: Real-time scoring from 0-100 affecting competition levels
- **Budget System**: Collect coins to unlock perks and power-ups
- **Weapon System**: 5 musical instruments with unique abilities
- **8-directional movement** with WASD/Arrow keys
- **Real-time combat** against music industry challenges

### 🎵 Weapons/Instruments

1. **API Guitar** - Scans enemy stats, medium damage
2. **Budget Synthesizer** - Fast attacks, double coin collection
3. **Tempo Drums** - High damage, slows time
4. **Viral Violin** - Summons fan allies
5. **Golden Microphone** - Ultimate screen-clearing attack

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Controls

- **Movement**: WASD or Arrow Keys
- **Attack**: Spacebar
- **Interact**: E key
- **Switch Weapon**: Q key
- **Pause**: ESC

### Development Controls (Dev Mode Only)

- **F1**: Toggle Physics Debug
- **F2**: Restart Current Scene
- **F3**: Skip to Next World (Testing)

## 🎨 Technical Features

- **Engine**: Phaser.js 3.70+
- **Build Tool**: Vite
- **Audio**: Web Audio API + Howler.js (placeholder)
- **Graphics**: Procedurally generated placeholder sprites
- **Physics**: Arcade physics system
- **Save System**: LocalStorage-based progression

## 🔧 Architecture

```
src/
├── scenes/          # Game scenes (worlds, menus)
├── entities/        # Player, enemies, bosses
├── systems/         # Score, budget, weapon systems
├── ui/              # HUD and interface components
├── config/          # Game configuration
└── main.js          # Entry point
```

### Key Systems

- **ScoreSystem**: Manages 0-100 scoring with real-time competition calculation
- **BudgetSystem**: Handles currency collection with tier-based perks
- **WeaponSystem**: Manages instrument switching and projectile creation
- **HUD**: Real-time display of all game metrics

## 🎵 Integration with Music Release Planner

The game collects player data throughout the journey and can send it to the real Music Release Planner n8n workflow at completion:

```javascript
// Victory screen integration
const payload = {
  artistName: 'player_input',
  email: 'player_input',
  genre: 'chosen_in_world2',
  budget: 'accumulated_in_game',
  gameScore: 'final_score_0_100',
  competitionLevel: 'calculated_from_score'
};
```

## 🎮 Gameplay Flow

1. **Start**: Enter artist name and email
2. **World 1**: Learn movement and combat while collecting API data
3. **World 2**: Navigate scoring maze and choose music genre
4. **World 3**: Strategic Friday selection based on score
5. **World 4**: Timeline progression with budget management
6. **World 5**: Final release execution with real-world integration

## 🏆 Scoring System

- **Base Score**: 50
- **Score Modifiers**:
  - Collect Data Crystal: +5
  - Defeat Competitor: +10
  - Complete Quest: +15
  - Genre Bonus: +8 to +15 (varies by genre)
  - Lose to Boss: -15
  - Wrong Friday Choice: -20

### Competition Levels

- **85-100**: Very Low Competition (Green)
- **70-84**: Low Competition (Light Green)
- **55-69**: Moderate Competition (Yellow)
- **40-54**: High Competition (Orange)
- **0-39**: Very High Competition (Red)

## 💰 Budget System

- **Tier 1** (€0-199): Basic gameplay
- **Tier 2** (€200-499): Health potions unlocked
- **Tier 3** (€500-1499): Power-ups and checkpoints
- **Tier 4** (€1500+): Auto-save, easy mode, all weapons

## 🎵 Audio System (Placeholder)

The game is designed for chiptune/8-bit style audio:

- **Music**: 7 unique background tracks (one per world + menus)
- **SFX**: Attack sounds, coin pickups, enemy defeats
- **Dynamic Audio**: Music adapts to gameplay intensity

## 🛠️ Development

### Adding New Worlds

1. Create new scene file in `src/scenes/`
2. Import and register in `src/config/gameConfig.js`
3. Implement required methods: `init()`, `create()`, `update()`
4. Add world transition logic

### Customizing Score System

Modify `src/config/constants.js` to adjust:
- Score modifiers
- Competition thresholds
- Weapon stats
- Budget tiers

### Asset Integration

Replace placeholder graphics by:
1. Adding sprite files to `assets/sprites/`
2. Loading in `BootScene.js`
3. Updating entity constructors

## 🎯 Production Deployment

```bash
# Build for production
npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
# Upload 'dist' folder contents
```

### Environment Variables

```env
VITE_N8N_WEBHOOK_URL=https://admin-n8n.mdmcmusicads.com/webhook/music-release-planner
```

## 🐛 Known Issues & Limitations

- Graphics are placeholder rectangles/circles
- Audio system is stubbed (no actual sounds)
- n8n integration is simulated (console.log)
- Worlds 3-5 are simplified placeholders
- No mobile responsiveness

## 🎵 Future Enhancements

- [ ] Complete pixel art assets
- [ ] Chiptune music composition
- [ ] Full n8n webhook integration
- [ ] Mobile touch controls
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Multiplayer co-op mode

## 🤝 Contributing

This game is designed as a marketing tool for Music Release Planner. To contribute:

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📄 License

Created for Music Release Planner. All rights reserved.

---

## 🎮 Quick Start

```bash
npm install && npm run dev
```

Navigate to `http://localhost:5173` and start your Release Quest journey!

**Goal**: Achieve Score 100 and launch your track on the perfect Friday! 🎵