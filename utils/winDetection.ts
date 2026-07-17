import { BoardState, Player } from '../types';
import { WINNING_COMBINATIONS } from '../constants';

export interface WinResult {
  winner: Player | null;
  pattern: number[] | null; // e.g. [0, 1, 2] indices that led to win
}

/**
 * Checks if there is a winner on the current board.
 * Returns the winning player and the combination pattern indices.
 */
export function checkWinner(board: BoardState): WinResult {
  for (const pattern of WINNING_COMBINATIONS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        pattern: [...pattern],
      };
    }
  }

  return {
    winner: null,
    pattern: null,
  };
}

/**
 * Checks if the game is a draw.
 * A draw is when all cells are filled and there is no winner.
 */
export function checkDraw(board: BoardState): boolean {
  // If there's already a winner, it's not a draw
  if (checkWinner(board).winner !== null) {
    return false;
  }
  
  // Draw if all cells are filled
  return board.every((cell) => cell !== null);
}
