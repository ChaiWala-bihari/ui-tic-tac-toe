# Tic-Tac-Toe Arcade (Next.js 16 + TypeScript + Tailwind v4)

A highly polished, production-quality, and fully accessible Tic-Tac-Toe game. It features offline-compatible synthesized retro sound effects, interactive match replays, an unbeatable Minimax AI opponent, a persistent scoreboard, and accomplishments badge tracking.

---

## 🚀 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict typing, no `any`)
- **Styling**: Tailwind CSS v4 (Custom theme configurations, keyframes, transitions in `app/globals.css`)
- **State Management**: React Hooks (useMemo, useCallback, useRef) & stack-based custom state orchestrators
- **Audio**: Web Audio API (Dynamic client-side oscillator synthesis)
- **Testing**: Vitest (100% test coverage on win checks, minimax moves, and history pointers)

---

## 📁 Project Folder Structure

The project is structured according to a modular and scalable design:

```
app/
├── favicon.ico
├── globals.css          # Tailwind CSS v4 styling rules & custom keyframe animations
├── layout.tsx           # SEO layout, typography import, and hydration setups
└── page.tsx             # Root page, handles overlay controls, and renders components
components/
├── Board.tsx            # Renders 3x3 layout, listens to arrow key focus, draws winning lines
├── Cell.tsx             # Interactive grid buttons (keyboard focusable, animated SVG icons)
├── Confetti.tsx         # HTML5 Canvas particles loop for winning celebrations
├── DifficultySelector.tsx # Segmented control for toggling AI levels
├── Footer.tsx           # Keyboard navigation shortcuts instruction panel
├── GameControls.tsx     # Handles Undo, Redo, Restart, and dashboard triggers
├── GameModeSelector.tsx  # Segmented control for PvP / PvC / CvC
├── GameStatus.tsx       # Live status updates: move counter, timer, turn details, and AI thinking
├── Header.tsx           # Layout navbar with Mute, Theme, and Settings toggle buttons
├── ScoreBoard.tsx       # Quick look stats: games, win rates, and active streaks
├── SettingsModal.tsx    # Audio, animation, theme, custom icons settings panel
├── StatisticsDashboard.tsx # Streaks tracker, overall win rates, and unlocked achievements
└── WinnerModal.tsx      # Terminal game overlay with Replay and copyable result grids
hooks/
├── useAI.ts             # Direct route helper to Easy / Medium / Hard AI moves
├── useBoard.ts          # Core state of 3x3 grid, history stack, and win checks
├── useGame.ts           # Master game loop orchestrator
├── useLocalStorage.ts   # SSR-safe hydration wrapper for persistence
├── useSounds.ts         # Bridges soundSynth triggers into React components
└── useTimer.ts          # Stopwatch interval manager
lib/
└── soundSynth.ts        # Synthesized sound effects (Web Audio API)
types/
└── index.ts             # Interfaces for settings, moves, statistics, and badges
utils/
├── minimax.ts           # Easy, Medium, and Hard (Minimax with Alpha-Beta pruning) algorithms
├── statCalculations.ts  # Track record updates and streak updates
└── winDetection.ts      # Horizontal, vertical, diagonal checks
vitest.config.ts         # Testing configuration rules
```

---

## 🕹️ Game Features

1. **Game Modes**:
   - **Player vs Player (PvP)**: Play locally with alternate turns.
   - **Player vs Computer (PvC)**: Challenge the AI.
   - **Computer vs Computer (CvC)**: Relax and watch the computers battle in auto-play.
2. **AI Difficulties**:
   - **Easy**: Selects randomly from available squares.
   - **Medium**: Blocks immediate opponent wins and capitalizes on winning lines, defaulting to Center, Corners, and then random space checks.
   - **Hard**: Implements the **Minimax Algorithm with Alpha-Beta Pruning** to ensure the computer is statistically unbeatable.
3. **Sound Effects (Web Audio API)**:
   - Self-contained synthesizer generates Move, Win, Lose, Draw, and Button Click tones.
   - 0-latency and works offline without downloading static `.mp3` assets.
   - Audio mute options are fully supported.
4. **Custom Themes**:
   - Toggles between light and dark themes (persists preferences).
   - Supports 5 custom board themes: **Classic**, **Neon/Midnight**, **Glassmorphic**, **Retro Arcade**, and **Cyberpunk**.
5. **Custom Player Markers**: Choose between **Classic X/O**, **🔥 vs ❄️ Emojis**, and **Cyberpunk Shapes (Triangle vs Hexagon)**.
6. **Replays**: Auto-replay any completed match step-by-step.
7. **Accessibility (A11y)**:
   - Screen-reader compatible `aria-label` declarations.
   - Complete grid keyboard navigation via Tab or Arrow keys (↑, ↓, ←, →).
   - Visible outline focus rings (`focus-visible`).
   - Pure semantic HTML tags (`main`, `header`, `footer`, `button`).

---

## 🛠️ Installation and Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone the project and navigate to the directory
```bash
cd Tic-tac-toe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the game.

### 4. Build for production
```bash
npm run build
```

### 5. Run tests
```bash
npm run test
```

---

## 🧠 Core Algorithms

### 1. Minimax with Alpha-Beta Pruning
Located in [minimax.ts](file:///Users/amanmeena/Documents/Work/Tiny/Tic-tac-toe/utils/minimax.ts), this recursive algorithm maps the search space of the 3x3 board.
- Maximizing agent (AI) plays moves to maximize scores (+10 points for win).
- Minimizing agent (Player) plays moves to minimize scores (-10 points).
- Alpha-Beta pruning avoids exploring search branches that are guaranteed to yield worse outcomes, maximizing speed.

### 2. Stack-based Undo/Redo State History
Located in [useBoard.ts](file:///Users/amanmeena/Documents/Work/Tiny/Tic-tac-toe/hooks/useBoard.ts), we store history as an array of board state states (`BoardHistoryState[]`) and a pointer index (`pointer`):
- To **Make a Move**: Slice the history array up to `pointer + 1` (wiping out any "redone" paths), append the new board state, and set pointer to the end.
- To **Undo**: Decrement pointer.
- To **Redo**: Increment pointer.

### 3. Web Audio Synthesis Engine
Located in [soundSynth.ts](file:///Users/amanmeena/Documents/Work/Tiny/Tic-tac-toe/lib/soundSynth.ts), the engine lazy-initializes an `AudioContext` on the first user interaction to comply with browser autoplay permissions.
- Frequency envelopes are used to create clean, responsive notes.
- Example: A **Move sound** uses a triangle wave swept from 180Hz down to 80Hz in 120ms with an exponential gain decay to avoid clicking.

---

## 🔮 Future Improvement Suggestions

1. **Online Multiplayer**: Implement a Socket.io or WebRTC coordinator placeholder to allow pvp play between different browsers on different devices.
2. **Move Analysis / Evaluation Bar**: Add an evaluation metric chart showing which cells have the highest mathematical probability of winning.
3. **Larger Grids**: Scale the game board to support 4x4 or 5x5 grids (e.g. gomoku-style) with custom win conditions.
4. **Leaderboards**: Set up a database connection to allow public leaderboard comparisons.
