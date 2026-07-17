'use client';

import React from 'react';
import { Statistics } from '../types';
import { calculateWinRate } from '../utils/statCalculations';

interface ScoreBoardProps {
  stats: Statistics;
  gameMode: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats, gameMode }) => {
  const xWinRate = calculateWinRate(stats.xWins, stats.gamesPlayed);
  const oWinRate = calculateWinRate(stats.oWins, stats.gamesPlayed);

  const getStreakText = () => {
    if (stats.currentStreak === 0) return 'None';
    return `${stats.streakPlayer === 'X' ? 'Player X' : 'Player O'} (${stats.currentStreak} 🔥)`;
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800/40 dark:bg-zinc-900/60">
      <div className="grid grid-cols-3 gap-3 text-center">
        {/* X Wins Card */}
        <div className="rounded-xl bg-rose-50/50 p-2.5 dark:bg-rose-950/10">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {gameMode === 'pvc' ? 'Player (X)' : 'Player X'}
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">
            {stats.xWins}
          </p>
          <p className="text-[10px] text-rose-500/80 dark:text-rose-400/60">
            {xWinRate}% Win Rate
          </p>
        </div>

        {/* Draws Card */}
        <div className="rounded-xl bg-neutral-50/50 p-2.5 dark:bg-zinc-800/20">
          <p className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">
            Draws
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-700 dark:text-zinc-300">
            {stats.draws}
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-zinc-500">
            {stats.gamesPlayed} Played
          </p>
        </div>

        {/* O Wins Card */}
        <div className="rounded-xl bg-violet-50/50 p-2.5 dark:bg-violet-950/10">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
            {gameMode === 'pvc' ? 'Computer (O)' : 'Player O'}
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-700 dark:text-violet-300">
            {stats.oWins}
          </p>
          <p className="text-[10px] text-violet-500/80 dark:text-violet-400/60">
            {oWinRate}% Win Rate
          </p>
        </div>
      </div>

      {/* Streak Dashboard Summary */}
      <div className="mt-3 flex justify-between border-t border-neutral-100 pt-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-zinc-400">
        <div>
          <span>Current Streak: </span>
          <span className="font-semibold text-neutral-700 dark:text-zinc-200">
            {getStreakText()}
          </span>
        </div>
        <div>
          <span>Record Streak: </span>
          <span className="font-semibold text-neutral-700 dark:text-zinc-200">
            {stats.longestWinningStreak} {stats.longestWinningStreak > 0 ? '🔥' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
