import { Player, Statistics } from '../types';

/**
 * Calculates win rate as a percentage of total games.
 */
export function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
}

/**
 * Returns updated Statistics after a game finishes.
 * Handles win counts, draw counts, streak increments, and streak resets.
 */
export function updateStatistics(
  prevStats: Statistics,
  result: Player | 'draw'
): Statistics {
  const gamesPlayed = prevStats.gamesPlayed + 1;
  let xWins = prevStats.xWins;
  let oWins = prevStats.oWins;
  let draws = prevStats.draws;
  let currentStreak = prevStats.currentStreak;
  let longestWinningStreak = prevStats.longestWinningStreak;
  let streakPlayer = prevStats.streakPlayer;

  if (result === 'draw') {
    draws += 1;
    currentStreak = 0; // Streak breaks on a draw
    streakPlayer = null;
  } else {
    if (result === 'X') {
      xWins += 1;
    } else {
      oWins += 1;
    }

    if (streakPlayer === result) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
      streakPlayer = result;
    }

    if (currentStreak > longestWinningStreak) {
      longestWinningStreak = currentStreak;
    }
  }

  return {
    xWins,
    oWins,
    draws,
    gamesPlayed,
    longestWinningStreak,
    currentStreak,
    streakPlayer,
  };
}
