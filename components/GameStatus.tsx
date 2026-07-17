'use client';

import React from 'react';
import { Player, GameStatus as GameStatusType } from '../types';

interface GameStatusProps {
  currentPlayer: Player;
  movesCount: number;
  elapsedTime: number;
  isAiThinking: boolean;
  isReplaying: boolean;
  gameStatus: GameStatusType;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  movesCount,
  elapsedTime,
  isAiThinking,
  isReplaying,
  gameStatus,
}) => {
  // Format elapsed time (seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (isReplaying) {
      return (
        <span className="flex items-center gap-1 text-amber-500 font-semibold animate-pulse">
          <span>🍿</span> Replaying Match...
        </span>
      );
    }
    if (isAiThinking) {
      return (
        <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 font-semibold">
          <svg
            className="h-3.5 w-3.5 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          AI is thinking...
        </span>
      );
    }

    if (gameStatus === 'won') {
      return <span className="font-bold text-amber-500">Match Completed!</span>;
    }
    if (gameStatus === 'draw') {
      return <span className="font-bold text-neutral-500">It's a Draw!</span>;
    }

    // Normal play status
    return (
      <span className="font-semibold text-neutral-600 dark:text-zinc-300">
        Turn:{' '}
        <span
          className={`inline-block font-extrabold px-1.5 py-0.5 rounded-lg text-sm select-none ${
            currentPlayer === 'X'
              ? 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/15'
              : 'text-violet-500 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/15'
          }`}
        >
          Player {currentPlayer}
        </span>
      </span>
    );
  };

  return (
    <div className="flex w-full max-w-md items-center justify-between rounded-xl border border-neutral-100 bg-white/50 px-4 py-2.5 text-xs text-neutral-500 shadow-sm dark:border-neutral-800/20 dark:bg-zinc-900/30">
      {/* Turn status / AI status */}
      <div className="flex items-center gap-1">{getStatusMessage()}</div>

      {/* Stats summary */}
      <div className="flex items-center gap-4 text-neutral-600 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-neutral-450 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <span className="font-medium">
            Moves: <span className="font-bold">{movesCount}</span>/9
          </span>
        </div>

        <div className="flex items-center gap-1">
          <svg
            className="h-3.5 w-3.5 text-neutral-450 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
