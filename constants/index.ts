import { GameSettings, Statistics, Achievement } from '../types';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
] as const;

export const DEFAULT_SETTINGS: GameSettings = {
  startingPlayer: 'X',
  enableAnimations: true,
  enableSounds: true,
  showHints: false,
  boardTheme: 'classic',
  playerIcons: 'classic',
  isMuted: false,
};

export const DEFAULT_STATISTICS: Statistics = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  gamesPlayed: 0,
  longestWinningStreak: 0,
  currentStreak: 0,
  streakPlayer: null,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first match against a player or computer',
    isUnlocked: false,
    icon: '🏆',
  },
  {
    id: 'beat_hard_ai',
    title: 'Deep Blue Who?',
    description: 'Defeat the Hard AI in a match',
    isUnlocked: false,
    icon: '🤖',
  },
  {
    id: 'perfect_game',
    title: 'Perfect Strategy',
    description: 'Win a match in the minimum possible moves (5 moves total)',
    isUnlocked: false,
    icon: '⚡',
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Achieve a winning streak of 3 games',
    isUnlocked: false,
    icon: '🔥',
  },
  {
    id: 'streak_5',
    title: 'Unstoppable',
    description: 'Achieve a winning streak of 5 games',
    isUnlocked: false,
    icon: '👑',
  },
  {
    id: 'tie_master',
    title: 'Diplomat',
    description: 'Play 3 draws in a row or total',
    isUnlocked: false,
    icon: '🤝',
  },
  {
    id: 'lazy_gamer',
    title: 'Popcorn Time',
    description: 'Watch a Computer vs Computer auto-play match to completion',
    isUnlocked: false,
    icon: '🍿',
  },
];
