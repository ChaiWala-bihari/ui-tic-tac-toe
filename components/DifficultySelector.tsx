'use client';

import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onChange: (diff: Difficulty) => void;
  visible: boolean;
  onPlayClickSound: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onChange,
  visible,
  onPlayClickSound,
}) => {
  if (!visible) return null;

  const levels: { value: Difficulty; label: string; desc: string; color: string }[] = [
    { value: 'easy', label: 'Easy', desc: 'Random moves', color: 'text-emerald-500' },
    { value: 'medium', label: 'Medium', desc: 'Strategic blocks', color: 'text-amber-500' },
    { value: 'hard', label: 'Impossible', desc: 'Minimax engine', color: 'text-rose-500' },
  ];

  const handleSelect = (level: Difficulty) => {
    onPlayClickSound();
    onChange(level);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <label className="mb-1.5 block text-center text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-zinc-400">
        AI Difficulty
      </label>
      <div className="relative flex rounded-2xl bg-neutral-100 p-1 dark:bg-zinc-800/60">
        {/* Sliding background pill indicator */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(33.333%-4px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-out dark:bg-zinc-700 ${
            currentDifficulty === 'medium'
              ? 'translate-x-[calc(100%+4px)]'
              : currentDifficulty === 'hard'
              ? 'translate-x-[calc(200%+8px)]'
              : 'translate-x-0'
          }`}
        />

        {levels.map((lvl) => {
          const isActive = currentDifficulty === lvl.value;
          return (
            <button
              key={lvl.value}
              onClick={() => handleSelect(lvl.value)}
              className={`relative z-10 flex flex-1 flex-col items-center justify-center py-1.5 text-xs font-semibold transition-colors focus:outline-none rounded-xl ${
                isActive
                  ? 'text-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              aria-label={`Set AI difficulty to ${lvl.label}: ${lvl.desc}`}
            >
              <span className={isActive ? lvl.color : ''}>{lvl.label}</span>
              <span className="text-[9px] font-normal text-neutral-400 dark:text-zinc-500">
                {lvl.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
