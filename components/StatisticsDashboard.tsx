'use client';

import React, { useEffect, useRef } from 'react';
import { Statistics, Achievement } from '../types';
import { calculateWinRate } from '../utils/statCalculations';

interface StatisticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Statistics;
  achievements: Achievement[];
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  isOpen,
  onClose,
  stats,
  achievements,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      containerRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalWins = stats.xWins + stats.oWins;
  const winRate = calculateWinRate(totalWins, stats.gamesPlayed);
  const xWinRate = calculateWinRate(stats.xWins, stats.gamesPlayed);
  const oWinRate = calculateWinRate(stats.oWins, stats.gamesPlayed);
  const drawRate = calculateWinRate(stats.draws, stats.gamesPlayed);

  const unlockedCount = achievements.filter((ach) => ach.isUnlocked).length;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      {/* Modal Container */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className="w-full max-w-lg scale-95 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/95 p-6 shadow-2xl transition-all dark:border-neutral-800/40 dark:bg-zinc-900/95 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-850">
          <h2 id="stats-title" className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            🏆 Player Achievements & Stats
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-450 hover:bg-neutral-100 hover:text-neutral-755 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close stats modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 max-h-[65vh] space-y-5 overflow-y-auto pr-1 text-sm text-neutral-600 dark:text-zinc-300">
          {/* Quick Metrics Cards */}
          <div>
            <span className="block text-xs font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Game Performance
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-2 dark:border-neutral-800 dark:bg-zinc-900/30">
                <span className="block font-bold text-neutral-850 dark:text-white text-base">
                  {stats.gamesPlayed}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-zinc-550 uppercase">Played</span>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-2 dark:border-neutral-800 dark:bg-zinc-900/30">
                <span className="block font-bold text-rose-500 dark:text-rose-400 text-base">
                  {stats.xWins}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-zinc-550 uppercase">X Wins</span>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-2 dark:border-neutral-800 dark:bg-zinc-900/30">
                <span className="block font-bold text-violet-500 dark:text-violet-400 text-base">
                  {stats.oWins}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-zinc-550 uppercase">O Wins</span>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-2 dark:border-neutral-800 dark:bg-zinc-900/30">
                <span className="block font-bold text-neutral-600 dark:text-zinc-300 text-base">
                  {stats.draws}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-zinc-550 uppercase">Draws</span>
              </div>
            </div>
          </div>

          {/* Win Rate Progress Bar */}
          <div>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span>Overall Win Percentage</span>
              <span>{winRate}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-zinc-800 flex">
              <div
                className="h-full bg-rose-500 dark:bg-rose-400"
                style={{ width: `${xWinRate}%` }}
                title={`X Win rate: ${xWinRate}%`}
              />
              <div
                className="h-full bg-violet-500 dark:bg-violet-400"
                style={{ width: `${oWinRate}%` }}
                title={`O Win rate: ${oWinRate}%`}
              />
              <div
                className="h-full bg-neutral-300 dark:bg-zinc-650"
                style={{ width: `${drawRate}%` }}
                title={`Draw rate: ${drawRate}%`}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-neutral-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> X wins ({xWinRate}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-violet-500" /> O wins ({oWinRate}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-neutral-300" /> Draws ({drawRate}%)
              </span>
            </div>
          </div>

          {/* Streaks Card */}
          <div className="grid grid-cols-2 gap-2 text-xs border border-neutral-100 dark:border-neutral-800 bg-neutral-50/20 dark:bg-zinc-900/10 p-3 rounded-2xl">
            <div>
              <span className="block text-neutral-400 dark:text-zinc-500">Current Winning Streak</span>
              <span className="text-sm font-bold text-neutral-800 dark:text-zinc-150 flex items-center gap-1 mt-0.5">
                {stats.currentStreak} 🔥 {stats.currentStreak > 0 && `(Player ${stats.streakPlayer})`}
              </span>
            </div>
            <div>
              <span className="block text-neutral-400 dark:text-zinc-500">Longest Win Streak Record</span>
              <span className="text-sm font-bold text-neutral-800 dark:text-zinc-150 flex items-center gap-1 mt-0.5">
                {stats.longestWinningStreak} 👑
              </span>
            </div>
          </div>

          {/* Achievements Checklist */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-wider">
                Achievements Checklist
              </span>
              <span className="text-xs text-neutral-400 dark:text-zinc-500">
                Unlocked: <span className="font-bold text-blue-500">{unlockedCount}</span>/
                {achievements.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex items-start gap-3 rounded-2xl border p-3 transition-all ${
                    ach.isUnlocked
                      ? 'border-emerald-100 bg-emerald-50/25 dark:border-emerald-950/20 dark:bg-emerald-950/5'
                      : 'border-neutral-100 bg-neutral-50/40 opacity-55 dark:border-neutral-850 dark:bg-zinc-900/40'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm ${
                      ach.isUnlocked
                        ? 'bg-emerald-500/10'
                        : 'bg-neutral-100 dark:bg-zinc-800 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-semibold text-neutral-850 dark:text-zinc-200">
                        {ach.title}
                      </span>
                      {ach.isUnlocked && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-450 shrink-0">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 dark:text-zinc-450 leading-relaxed mt-0.5">
                      {ach.description}
                    </p>
                    {ach.isUnlocked && ach.unlockedAt && (
                      <p className="text-[9px] text-neutral-400 dark:text-zinc-500 mt-1">
                        Unlocked on {formatDate(ach.unlockedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
