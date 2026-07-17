'use client';

import React from 'react';
import { BoardTheme } from '../types';

interface BoardThemeSelectorProps {
  currentTheme: BoardTheme;
  onChange: (theme: BoardTheme) => void;
  onPlayClickSound: () => void;
}

export const BoardThemeSelector: React.FC<BoardThemeSelectorProps> = ({
  currentTheme,
  onChange,
  onPlayClickSound,
}) => {
  const themes: { value: BoardTheme; label: string; icon: string; activeClass: string }[] = [
    {
      value: 'classic',
      label: 'Classic',
      icon: '🎨',
      activeClass: 'bg-neutral-800 text-white dark:bg-white dark:text-zinc-900 border-neutral-900 dark:border-white',
    },
    {
      value: 'neon',
      label: 'Neon',
      icon: '✨',
      activeClass: 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]',
    },
    {
      value: 'glass',
      label: 'Glass',
      icon: '💎',
      activeClass: 'bg-white/20 border-white/40 text-neutral-850 dark:text-white backdrop-blur shadow-sm',
    },
    {
      value: 'cyberpunk',
      label: 'Cyber',
      icon: '⚡',
      activeClass: 'bg-yellow-400 border-yellow-500 text-zinc-950 font-bold',
    },
    {
      value: 'retro',
      label: 'Retro',
      icon: '📟',
      activeClass: 'bg-amber-600/20 border-amber-500 text-amber-500 font-mono',
    },
  ];

  const handleSelect = (theme: BoardTheme) => {
    onPlayClickSound();
    onChange(theme);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <label className="mb-1.5 block text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-zinc-500">
        Board Aesthetic
      </label>
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-neutral-100/50 p-1.5 dark:bg-zinc-900/40 border border-neutral-200/20">
        {themes.map((t) => {
          const isActive = currentTheme === t.value;
          return (
            <button
              key={t.value}
              onClick={() => handleSelect(t.value)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 focus:outline-none ${
                isActive
                  ? t.activeClass
                  : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-850 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              aria-label={`Switch theme to ${t.label}`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BoardThemeSelector;
