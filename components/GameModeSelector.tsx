'use client';

import React from 'react';
import { GameMode } from '../types';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onChange: (mode: GameMode) => void;
  disabled: boolean;
  onPlayClickSound: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onChange,
  disabled,
  onPlayClickSound,
}) => {
  const modes: { value: GameMode; label: string; icon: string }[] = [
    { value: 'pvp', label: '1v1 Local', icon: '👥' },
    { value: 'pvc', label: 'VS Computer', icon: '🤖' },
    { value: 'cvc', label: 'Auto Play', icon: '🍿' },
  ];

  const handleSelect = (mode: GameMode) => {
    if (disabled) return;
    onPlayClickSound();
    onChange(mode);
  };

  return (
    <div className="w-full max-w-md">
      <label className="mb-1.5 block text-center text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-zinc-400">
        Select Game Mode
      </label>
      <div className="relative flex rounded-2xl bg-neutral-100 p-1 dark:bg-zinc-800/60">
        {/* Sliding background pill indicator for active mode */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(33.333%-4px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-out dark:bg-zinc-700 ${
            currentMode === 'pvc'
              ? 'translate-x-[calc(100%+4px)]'
              : currentMode === 'cvc'
              ? 'translate-x-[calc(200%+8px)]'
              : 'translate-x-0'
          }`}
        />

        {modes.map((m) => {
          const isActive = currentMode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => handleSelect(m.value)}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors focus:outline-none rounded-xl ${
                isActive
                  ? 'text-neutral-800 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              aria-label={`Switch to mode: ${m.label}`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameModeSelector;
