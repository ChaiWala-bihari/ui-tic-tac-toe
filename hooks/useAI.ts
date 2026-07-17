'use client';

import { useCallback } from 'react';
import { BoardState, Player, Difficulty } from '../types';
import {
  generateRandomMove,
  generateMediumMove,
  generateHardMove,
} from '../utils/minimax';

/**
 * Custom hook wrapping AI move generation algorithms.
 */
export function useAI() {
  const getAIMove = useCallback(
    (board: BoardState, aiPlayer: Player, difficulty: Difficulty): number => {
      switch (difficulty) {
        case 'easy':
          return generateRandomMove(board);
        case 'medium':
          return generateMediumMove(board, aiPlayer);
        case 'hard':
          return generateHardMove(board, aiPlayer);
        default:
          return generateRandomMove(board);
      }
    },
    []
  );

  return {
    getAIMove,
  };
}

export default useAI;
