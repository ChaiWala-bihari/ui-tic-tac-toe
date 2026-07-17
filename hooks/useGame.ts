'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameMode, Difficulty, GameSettings, Statistics, Achievement, Player } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_STATISTICS, INITIAL_ACHIEVEMENTS } from '../constants';
import useLocalStorage from './useLocalStorage';
import useTimer from './useTimer';
import useBoard from './useBoard';
import useAI from './useAI';
import useSounds from './useSounds';
import { updateStatistics } from '../utils/statCalculations';
import { checkWinner } from '../utils/winDetection';

export function useGame() {
  // Persistent user state
  const [settings, setSettings] = useLocalStorage<GameSettings>('tic-tac-toe-settings', DEFAULT_SETTINGS);
  const [statistics, setStatistics] = useLocalStorage<Statistics>('tic-tac-toe-stats', DEFAULT_STATISTICS);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('tic-tac-toe-achievements', INITIAL_ACHIEVEMENTS);

  // Active game settings
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Board state, initialized with startingPlayer from settings
  const {
    board,
    currentPlayer,
    lastMoveIndex,
    winner,
    winningPattern,
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
  } = useBoard(settings.startingPlayer);

  // Timer and AI sub-hooks
  const timer = useTimer();
  const { getAIMove } = useAI();
  const sounds = useSounds(settings.isMuted || !settings.enableSounds);

  // AI Thinking state (to animate computer behavior and block UI inputs)
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Replay State
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIntervalId, setReplayIntervalId] = useState<number | null>(null);

  // Track if stats were updated for the current match to avoid duplicate calls
  const [hasUpdatedStats, setHasUpdatedStats] = useState(false);

  // New Achievement Unlock Notification State
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  /**
   * Triggers a visual Toast when an achievement is unlocked.
   */
  const triggerAchievementUnlock = useCallback((achievement: Achievement) => {
    setUnlockedAchievement(achievement);
    setTimeout(() => {
      setUnlockedAchievement(null);
    }, 4000);
  }, []);

  /**
   * Scans statistics and recent game outcomes to unlock new achievements.
   */
  const checkAchievements = useCallback(
    (updatedStats: Statistics, matchWinner: Player | 'draw') => {
      let achievementsChanged = false;
      const nextAchievements = achievements.map((ach) => {
        if (ach.isUnlocked) return ach;

        let shouldUnlock = false;

        if (ach.id === 'first_win' && gameMode !== 'cvc' && matchWinner === 'X') {
          // Human is X
          shouldUnlock = true;
        } else if (
          ach.id === 'beat_hard_ai' &&
          gameMode === 'pvc' &&
          difficulty === 'hard' &&
          matchWinner === 'X'
        ) {
          shouldUnlock = true;
        } else if (ach.id === 'perfect_game' && gameMode !== 'cvc' && matchWinner === 'X' && movesCount === 5) {
          shouldUnlock = true;
        } else if (ach.id === 'streak_3' && updatedStats.currentStreak >= 3 && updatedStats.streakPlayer === 'X') {
          shouldUnlock = true;
        } else if (ach.id === 'streak_5' && updatedStats.currentStreak >= 5 && updatedStats.streakPlayer === 'X') {
          shouldUnlock = true;
        } else if (ach.id === 'tie_master' && updatedStats.draws >= 3) {
          shouldUnlock = true;
        } else if (ach.id === 'lazy_gamer' && gameMode === 'cvc') {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          achievementsChanged = true;
          const unlocked = {
            ...ach,
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          };
          triggerAchievementUnlock(unlocked);
          return unlocked;
        }

        return ach;
      });

      if (achievementsChanged) {
        setAchievements(nextAchievements);
      }
    },
    [achievements, gameMode, difficulty, movesCount, setAchievements, triggerAchievementUnlock]
  );

  /**
   * Action trigger for a human player clicking a grid cell.
   */
  const makePlayerMove = useCallback(
    (index: number) => {
      // Block moves if it's the AI's turn or during match replays
      if (isAiThinking || isReplaying) return;

      // In PVC mode, only allow the human player (always 'X') to click.
      if (gameMode === 'pvc' && currentPlayer !== 'X') return;

      // In CVC mode, human can't play moves manually.
      if (gameMode === 'cvc') return;

      const success = makeMove(index);
      if (success) {
        sounds.playMove();
      }
    },
    [gameMode, currentPlayer, isAiThinking, isReplaying, makeMove, sounds]
  );

  /**
   * Core Game Loop Effects: Manages Timer status based on game flow
   */
  useEffect(() => {
    if (gameStatus === 'playing') {
      timer.start();
    } else {
      timer.pause();
    }
  }, [gameStatus, timer]);

  /**
   * Core Game Loop Effects: Handles scoring & audio sounds on game over.
   */
  useEffect(() => {
    if ((gameStatus === 'won' || gameStatus === 'draw') && !hasUpdatedStats && !isReplaying) {
      setHasUpdatedStats(true);

      const result = gameStatus === 'won' ? winner! : 'draw';
      
      // Update statistics
      setStatistics((prev) => {
        const nextStats = updateStatistics(prev, result);
        checkAchievements(nextStats, result);
        return nextStats;
      });

      // Play game-over sound effects
      if (result === 'draw') {
        sounds.playDraw();
      } else if (gameMode === 'pvp') {
        sounds.playWin();
      } else if (gameMode === 'pvc') {
        if (result === 'X') {
          sounds.playWin(); // Human won
        } else {
          sounds.playLose(); // Computer won
        }
      } else {
        // CvC auto-play sound
        sounds.playWin();
      }
    }
  }, [gameStatus, winner, hasUpdatedStats, isReplaying, gameMode, setStatistics, checkAchievements, sounds]);

  /**
   * Core Game Loop Effects: Computes and executes computer (AI) moves.
   */
  useEffect(() => {
    // Stop if game is not active
    if (gameStatus !== 'playing' && gameStatus !== 'setup') return;
    if (isReplaying) return;

    let isComputerTurn = false;
    let computerPlayer: Player = 'O';

    if (gameMode === 'pvc' && currentPlayer === 'O') {
      isComputerTurn = true;
      computerPlayer = 'O';
    } else if (gameMode === 'cvc') {
      isComputerTurn = true;
      computerPlayer = currentPlayer;
    }

    if (!isComputerTurn || isAiThinking) return;

    // AI move planning block
    setIsAiThinking(true);

    const delay = gameMode === 'cvc' ? 800 : 600; // Natural thinking delay
    const timeoutId = setTimeout(() => {
      const bestMove = getAIMove(board, computerPlayer, difficulty);
      if (bestMove !== -1) {
        const success = makeMove(bestMove);
        if (success) {
          sounds.playMove();
        }
      }
      setIsAiThinking(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [board, currentPlayer, gameMode, gameStatus, difficulty, isAiThinking, isReplaying, getAIMove, makeMove, sounds]);

  /**
   * Reset game state for a retry (keeping mode and difficulty same).
   */
  const restartGame = useCallback(() => {
    if (replayIntervalId) {
      clearInterval(replayIntervalId);
      setReplayIntervalId(null);
    }
    setIsReplaying(false);
    setHasUpdatedStats(false);
    timer.reset();
    resetBoard(settings.startingPlayer);
    sounds.playClick();
  }, [settings.startingPlayer, timer, resetBoard, sounds, replayIntervalId]);

  /**
   * Toggle to a clean, fresh game board.
   */
  const startNewMatch = useCallback(() => {
    restartGame();
  }, [restartGame]);

  /**
   * Settings customization wrapper
   */
  const updateSettings = useCallback(
    (newSettings: Partial<GameSettings>) => {
      setSettings((prev) => ({
        ...prev,
        ...newSettings,
      }));
    },
    [setSettings]
  );

  /**
   * Erase all records and locked accomplishments.
   */
  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATISTICS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    sounds.playClick();
  }, [setStatistics, setAchievements, sounds]);

  /**
   * Interactive Match Replay engine.
   * Steps through the game history automatically.
   */
  const replayMatch = useCallback(() => {
    if (history.length <= 1) return;
    
    // Reset and pause main timer
    timer.pause();
    setIsReplaying(true);
    sounds.playClick();

    let step = 0;
    jumpToMove(0);

    const intervalId = window.setInterval(() => {
      step += 1;
      if (step < history.length) {
        jumpToMove(step);
        sounds.playMove();
      } else {
        clearInterval(intervalId);
        setReplayIntervalId(null);
        setIsReplaying(false);
        // Play final sounds again at the end of replay
        const result = checkWinner(history[history.length - 1].board).winner || 'draw';
        if (result === 'draw') {
          sounds.playDraw();
        } else {
          sounds.playWin();
        }
      }
    }, 1000);

    setReplayIntervalId(intervalId);
  }, [history, jumpToMove, timer, sounds]);

  // Handle cleanup of replay loop on unmount
  useEffect(() => {
    return () => {
      if (replayIntervalId !== null) {
        clearInterval(replayIntervalId);
      }
    };
  }, [replayIntervalId]);

  // Undo Move (checks PVC rules so it undos BOTH human and computer moves)
  const undoMove = useCallback(() => {
    if (!canUndo || isAiThinking || isReplaying) return;
    
    sounds.playClick();
    if (gameMode === 'pvc') {
      // In Player vs Computer, undoing once takes you back to the computer's move,
      // and undoing again takes you to the human's move. To make it smooth for the user,
      // we undo twice so that we go back to the human's previous turn!
      // However, if the game is over and the computer made the last move, we undo once.
      // Let's check who made the last move.
      if (pointer >= 2) {
        undo();
        undo();
      } else {
        undo();
      }
    } else {
      undo();
    }
  }, [canUndo, gameMode, pointer, isAiThinking, isReplaying, undo, sounds]);

  // Redo Move
  const redoMove = useCallback(() => {
    if (!canRedo || isAiThinking || isReplaying) return;
    
    sounds.playClick();
    if (gameMode === 'pvc') {
      // Redo twice to get past both Human and Computer moves
      if (pointer <= history.length - 3) {
        redo();
        redo();
      } else {
        redo();
      }
    } else {
      redo();
    }
  }, [canRedo, gameMode, pointer, history.length, isAiThinking, isReplaying, redo, sounds]);

  return {
    // Board state
    board,
    currentPlayer,
    lastMoveIndex,
    winner,
    winningPattern,
    isDraw,
    gameStatus,
    movesCount,
    history,
    pointer,
    canUndo: canUndo && !isAiThinking && !isReplaying,
    canRedo: canRedo && !isAiThinking && !isReplaying,
    
    // Sub-states & Configurations
    gameMode,
    difficulty,
    isAiThinking,
    isReplaying,
    settings,
    statistics,
    achievements,
    elapsedTime: timer.time,
    unlockedAchievement,

    // Setters
    setGameMode,
    setDifficulty,
    updateSettings,
    resetStatistics,

    // Actions
    makePlayerMove,
    undoMove,
    redoMove,
    restartGame,
    startNewMatch,
    replayMatch,
    jumpToMove,
    playButtonClick: sounds.playClick,
  };
}

export default useGame;
