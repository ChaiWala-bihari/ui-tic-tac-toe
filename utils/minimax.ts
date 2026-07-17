import { BoardState, Player } from '../types';
import { checkWinner } from './winDetection';

/**
 * Returns a list of all available cell indices (0-8) on the board.
 */
export function getAvailableMoves(board: BoardState): number[] {
  return board
    .map((cell, idx) => (cell === null ? idx : -1))
    .filter((idx) => idx !== -1);
}

/**
 * Returns a random move from the available cells. (Easy AI)
 */
export function generateRandomMove(board: BoardState): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

/**
 * Offensive and defensive checks for Medium AI.
 * Returns the index of a critical move if one exists, otherwise -1.
 */
export function findCriticalMove(board: BoardState, activePlayer: Player): number {
  const opponent: Player = activePlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  // 1. Offense: Can activePlayer win in one move?
  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = activePlayer;
    if (checkWinner(nextBoard).winner === activePlayer) {
      return move;
    }
  }

  // 2. Defense: Can opponent win in one move? Block them.
  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = opponent;
    if (checkWinner(nextBoard).winner === opponent) {
      return move;
    }
  }

  return -1;
}

/**
 * Calculates a move for Medium difficulty:
 * - Play critical winning or blocking moves
 * - Play Center if available
 * - Play Corners if available
 * - Otherwise play random
 */
export function generateMediumMove(board: BoardState, activePlayer: Player): number {
  // 1. Try to win or block
  const criticalMove = findCriticalMove(board, activePlayer);
  if (criticalMove !== -1) return criticalMove;

  // 2. Take center if empty (index 4)
  if (board[4] === null) return 4;

  // 3. Take a corner if empty (0, 2, 6, 8)
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((idx) => board[idx] === null);
  if (availableCorners.length > 0) {
    const randCorner = Math.floor(Math.random() * availableCorners.length);
    return availableCorners[randCorner];
  }

  // 4. Fall back to random
  return generateRandomMove(board);
}

/**
 * The Minimax algorithm with Alpha-Beta Pruning.
 * Evaluates the board state recursively and returns the utility score.
 */
function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number {
  const winInfo = checkWinner(board);

  // Terminal states (win / loss / draw)
  if (winInfo.winner === aiPlayer) {
    return 10 - depth; // Prefer winning in fewer moves
  }
  if (winInfo.winner === humanPlayer) {
    return depth - 10; // Prefer delaying human victory
  }
  
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0; // Draw
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const nextBoard = [...board];
      nextBoard[move] = aiPlayer;
      
      const score = minimax(nextBoard, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      maxEval = Math.max(maxEval, score);
      
      alpha = Math.max(alpha, score);
      if (beta <= alpha) {
        break; // Beta cut-off
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const nextBoard = [...board];
      nextBoard[move] = humanPlayer;
      
      const score = minimax(nextBoard, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      minEval = Math.min(minEval, score);
      
      beta = Math.min(beta, score);
      if (beta <= alpha) {
        break; // Alpha cut-off
      }
    }
    return minEval;
  }
}

/**
 * Unbeatable AI using Minimax Algorithm.
 * Returns the best move index (0-8) for the AI player.
 */
export function generateHardMove(board: BoardState, aiPlayer: Player): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);
  
  // If first move, center (4) is mathematically the strongest start, or corner.
  // Hardcoding the first center/corner move saves redundant searches.
  if (availableMoves.length === 9) {
    // 9 empty cells, take center (4)
    return 4;
  }
  if (availableMoves.length === 8 && board[4] === null) {
    // 1 move made by human and center is empty, take center
    return 4;
  }
  if (availableMoves.length === 8 && board[4] !== null) {
    // Human took center, take corner
    return 0;
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  // Search best move
  for (const move of availableMoves) {
    const nextBoard = [...board];
    nextBoard[move] = aiPlayer;

    const score = minimax(nextBoard, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Helper to show move hints for the current player (if enabled in settings).
 * Returns the best move index using minimax logic.
 */
export function getMoveHint(board: BoardState, activePlayer: Player): number {
  // If it's a new board or close to it, provide simple logic, else minimax.
  return generateHardMove(board, activePlayer);
}
