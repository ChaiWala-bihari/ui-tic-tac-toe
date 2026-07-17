import { describe, it, expect } from 'vitest';
import { BoardState, Statistics, Player } from '../../types';
import { checkWinner, checkDraw } from '../winDetection';
import { generateHardMove, findCriticalMove } from '../minimax';
import { updateStatistics } from '../statCalculations';

describe('Tic-Tac-Toe Core Logic Tests', () => {
  
  // 1. WINNER DETECTION
  describe('Winner Detection', () => {
    it('should detect horizontal wins', () => {
      const board: BoardState = [
        'X', 'X', 'X',
        null, 'O', null,
        null, null, 'O'
      ];
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.pattern).toEqual([0, 1, 2]);
    });

    it('should detect vertical wins', () => {
      const board: BoardState = [
        'O', 'X', null,
        'O', 'X', null,
        'O', null, null
      ];
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
      expect(result.pattern).toEqual([0, 3, 6]);
    });

    it('should detect diagonal wins', () => {
      const board: BoardState = [
        'X', 'O', null,
        null, 'X', 'O',
        null, null, 'X'
      ];
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.pattern).toEqual([0, 4, 8]);
    });

    it('should return null winner for active/incomplete games', () => {
      const board: BoardState = [
        'X', 'O', 'X',
        null, 'O', null,
        null, null, null
      ];
      const result = checkWinner(board);
      expect(result.winner).toBeNull();
      expect(result.pattern).toBeNull();
    });
  });

  // 2. DRAW DETECTION
  describe('Draw Detection', () => {
    it('should detect draws on fully occupied boards with no winner', () => {
      const board: BoardState = [
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', 'X'
      ];
      expect(checkDraw(board)).toBe(true);
    });

    it('should not flag incomplete boards as draws', () => {
      const board: BoardState = [
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', null
      ];
      expect(checkDraw(board)).toBe(false);
    });

    it('should not flag won boards as draws', () => {
      const board: BoardState = [
        'X', 'X', 'X',
        'O', 'O', 'X',
        'O', 'X', 'O'
      ];
      expect(checkDraw(board)).toBe(false);
    });
  });

  // 3. MINIMAX ALGORITHM (HARD AI)
  describe('Minimax AI Algorithm', () => {
    it('should make an offensive winning move when available', () => {
      const board: BoardState = [
        'O', 'O', null, // O needs to play at 2 to win
        'X', 'X', null,
        null, null, null
      ];
      const aiPlayer: Player = 'O';
      const bestMove = generateHardMove(board, aiPlayer);
      expect(bestMove).toBe(2);
    });

    it('should make a defensive block move when opponent is threatening to win', () => {
      const board: BoardState = [
        'X', 'X', null, // X needs to play at 2 to win, AI is O
        'O', null, null,
        null, null, null
      ];
      const aiPlayer: Player = 'O';
      const bestMove = generateHardMove(board, aiPlayer);
      expect(bestMove).toBe(2); // AI blocks at index 2
    });

    it('should select center if first player plays a corner', () => {
      const board: BoardState = [
        'X', null, null,
        null, null, null,
        null, null, null
      ];
      const aiPlayer: Player = 'O';
      const bestMove = generateHardMove(board, aiPlayer);
      expect(bestMove).toBe(4); // Center index is 4
    });
  });

  // 4. STATISTICS AND SCOREBOARD CALCULATIONS
  describe('Statistics calculations', () => {
    const initialStats: Statistics = {
      xWins: 0,
      oWins: 0,
      draws: 0,
      gamesPlayed: 0,
      longestWinningStreak: 0,
      currentStreak: 0,
      streakPlayer: null,
    };

    it('should update win count and increment win streaks', () => {
      let stats = updateStatistics(initialStats, 'X');
      expect(stats.xWins).toBe(1);
      expect(stats.gamesPlayed).toBe(1);
      expect(stats.currentStreak).toBe(1);
      expect(stats.streakPlayer).toBe('X');
      expect(stats.longestWinningStreak).toBe(1);

      // X wins again
      stats = updateStatistics(stats, 'X');
      expect(stats.xWins).toBe(2);
      expect(stats.currentStreak).toBe(2);
      expect(stats.longestWinningStreak).toBe(2);
    });

    it('should reset current streak when a different player wins', () => {
      let stats = updateStatistics(initialStats, 'X'); // streak 1
      stats = updateStatistics(stats, 'X'); // streak 2
      stats = updateStatistics(stats, 'O'); // streak resets, player O gets streak 1
      
      expect(stats.xWins).toBe(2);
      expect(stats.oWins).toBe(1);
      expect(stats.currentStreak).toBe(1);
      expect(stats.streakPlayer).toBe('O');
      expect(stats.longestWinningStreak).toBe(2); // record remains 2
    });

    it('should reset streak on draw', () => {
      let stats = updateStatistics(initialStats, 'X'); // streak 1
      stats = updateStatistics(stats, 'draw'); // draw resets streak
      
      expect(stats.currentStreak).toBe(0);
      expect(stats.streakPlayer).toBeNull();
    });
  });

  // 5. UNDO/REDO LOGIC SIMULATION
  describe('Undo/Redo History Stack Logic', () => {
    // Mimic useBoard stack transitions
    interface State {
      board: BoardState;
      currentPlayer: Player;
    }

    it('should successfully undo, redo, and truncate future stacks on new placements', () => {
      const startingPlayer: Player = 'X';
      let history: State[] = [{ board: Array(9).fill(null), currentPlayer: startingPlayer }];
      let pointer = 0;

      // Make Move 1: X plays index 0
      const makeMoveSim = (index: number) => {
        const current = history[pointer];
        const nextBoard = [...current.board];
        nextBoard[index] = current.currentPlayer;
        const nextPlayer: Player = current.currentPlayer === 'X' ? 'O' : 'X';
        
        const nextState = { board: nextBoard, currentPlayer: nextPlayer };
        
        // Push and truncate
        const truncatedHistory = history.slice(0, pointer + 1);
        history = [...truncatedHistory, nextState];
        pointer = truncatedHistory.length;
      };

      makeMoveSim(0); // pointer = 1
      expect(history[pointer].board[0]).toBe('X');
      expect(history[pointer].currentPlayer).toBe('O');
      expect(pointer).toBe(1);

      makeMoveSim(4); // pointer = 2 (O plays center)
      expect(history[pointer].board[4]).toBe('O');
      expect(history[pointer].currentPlayer).toBe('X');
      expect(pointer).toBe(2);

      // Undo Move: pointer goes back to 1
      if (pointer > 0) pointer--;
      expect(pointer).toBe(1);
      expect(history[pointer].board[0]).toBe('X');
      expect(history[pointer].board[4]).toBeNull(); // center is back to null!
      expect(history[pointer].currentPlayer).toBe('O'); // active player is O again

      // Redo Move: pointer goes back to 2
      if (pointer < history.length - 1) pointer++;
      expect(pointer).toBe(2);
      expect(history[pointer].board[4]).toBe('O');

      // Undo once: pointer = 1
      if (pointer > 0) pointer--;

      // Branching: X makes a DIFFERENT move (index 8) while in undone state.
      // This should truncate history pointer 2 (which had O on index 4) and overwrite with index 8.
      makeMoveSim(8); // pointer = 2
      expect(pointer).toBe(2);
      expect(history.length).toBe(3); // total elements is 3
      expect(history[pointer].board[8]).toBe('O'); // O played at 8 (since pointer 1 was O's turn)
      expect(history[pointer].board[4]).toBeNull(); // index 4 is now completely wiped from history!
    });
  });
});
