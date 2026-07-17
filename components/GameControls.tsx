'use client';

import React from 'react';

interface GameControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRestart: () => void;
  onOpenStats: () => void;
  gameStatus: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRestart,
  onOpenStats,
  gameStatus,
}) => {
  return (
    <div className="flex w-full max-w-md items-center justify-center gap-3">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800/80"
        aria-label="Undo move"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
        <span>Undo</span>
      </button>

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800/80"
        aria-label="Redo move"
      >
        <span>Redo</span>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
          />
        </svg>
      </button>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-800 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-700 hover:shadow active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        aria-label="Restart match"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v8"
          />
        </svg>
        <span>{gameStatus === 'won' || gameStatus === 'draw' ? 'Play Again' : 'Restart'}</span>
      </button>

      {/* Statistics dashboard shortcut */}
      <button
        onClick={onOpenStats}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800/80"
        aria-label="Open statistics dashboard"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default GameControls;
