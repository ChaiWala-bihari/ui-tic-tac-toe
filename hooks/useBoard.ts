'use client';

import { useState, useCallback, useMemo } from 'react';
import { BoardState, Player, GameStatus, Move } from '../types';
import { checkWinner, checkDraw } from '../utils/winDetection';

interface BoardHistoryState {
  board: BoardState;
  currentPlayer: Player;
  lastMoveIndex: number; // Index where the last move occurred, for hints/highlights
}

/**
 * Custom hook to manage the tic-tac-toe board state, including undo/redo capabilities.
 */
export function useBoard(startingPlayer: Player = 'X') {
  // Store full history list for perfect undo/redo replay
  const [history, setHistory] = useState<BoardHistoryState[]>([
    {
      board: Array(9).fill(null),
      currentPlayer: startingPlayer,
      lastMoveIndex: -1,
    },
  ]);
  const [pointer, setPointer] = useState(0);

  // Derive current state from history pointer
  const currentState = useMemo(() => history[pointer], [history, pointer]);
  const board = currentState.board;
  const currentPlayer = currentState.currentPlayer;
  const lastMoveIndex = currentState.lastMoveIndex;

  // Derive game results
  const winResult = useMemo(() => checkWinner(board), [board]);
  const isDraw = useMemo(() => checkDraw(board), [board]);

  const gameStatus = useMemo<GameStatus>(() => {
    if (winResult.winner) return 'won';
    if (isDraw) return 'draw';
    // If the board is completely empty, we can classify it as 'setup'
    if (board.every((cell) => cell === null)) return 'setup';
    return 'playing';
  }, [winResult, isDraw, board]);

  const movesCount = useMemo(() => {
    return board.filter((cell) => cell !== null).length;
  }, [board]);

  /**
   * Place a mark on the board.
   * Returns true if the move was successful, false otherwise.
   */
  const makeMove = useCallback(
    (index: number): boolean => {
      // Prevent moves on occupied cells or if the game is already decided
      if (board[index] !== null || winResult.winner !== null || isDraw) {
        return false;
      }

      const nextBoard = [...board];
      nextBoard[index] = currentPlayer;

      const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
      const nextHistoryState: BoardHistoryState = {
        board: nextBoard,
        currentPlayer: nextPlayer,
        lastMoveIndex: index,
      };

      // Truncate future history if we were in an "undone" state, then append the new state
      const updatedHistory = history.slice(0, pointer + 1);
      setHistory([...updatedHistory, nextHistoryState]);
      setPointer(updatedHistory.length);

      return true;
    },
    [board, currentPlayer, winResult, isDraw, history, pointer]
  );

  /**
   * Reset the board to a clean state.
   */
  const resetBoard = useCallback(
    (newStartingPlayer: Player = 'X') => {
      setHistory([
        {
          board: Array(9).fill(null),
          currentPlayer: newStartingPlayer,
          lastMoveIndex: -1,
        },
      ]);
      setPointer(0);
    },
    []
  );

  /**
   * Undo the last move.
   */
  const undo = useCallback((): boolean => {
    if (pointer > 0) {
      setPointer(pointer - 1);
      return true;
    }
    return false;
  }, [pointer]);

  /**
   * Redo the undone move.
   */
  const redo = useCallback((): boolean => {
    if (pointer < history.length - 1) {
      setPointer(pointer + 1);
      return true;
    }
    return false;
  }, [pointer, history.length]);

  // Check which moves can be undone/redone
  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  // Replay a game step-by-step from start to finish
  const jumpToMove = useCallback(
    (moveIndex: number) => {
      if (moveIndex >= 0 && moveIndex < history.length) {
        setPointer(moveIndex);
      }
    },
    [history.length]
  );

  return {
    board,
    currentPlayer,
    lastMoveIndex,
    winner: winResult.winner,
    winningPattern: winResult.pattern,
    isDraw,
    gameStatus,
    movesCount,
    history,
    pointer,
    canUndo,
    canRedo,
    makeMove,
    resetBoard,
    undo,
    redo,
    jumpToMove,
  };
}

export default useBoard;
