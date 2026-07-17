export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type BoardState = CellValue[];

export type GameMode = 'pvp' | 'pvc' | 'cvc';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'setup' | 'playing' | 'won' | 'draw' | 'replay';

export type BoardTheme = 'classic' | 'neon' | 'glass' | 'cyberpunk' | 'retro';

export type PlayerIcons = 'classic' | 'emoji' | 'shapes';

export interface GameSettings {
  startingPlayer: Player;
  enableAnimations: boolean;
  enableSounds: boolean;
  showHints: boolean;
  boardTheme: BoardTheme;
  playerIcons: PlayerIcons;
  isMuted: boolean;
}

export interface Move {
  boardState: BoardState;
  index: number; // Index of the cell chosen (0-8)
  player: Player;
  timestamp: number;
}

export interface Statistics {
  xWins: number;
  oWins: number;
  draws: number;
  gamesPlayed: number;
  longestWinningStreak: number;
  currentStreak: number;
  streakPlayer: Player | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  icon: string;
}
