'use client';

import React from 'react';
import { CellValue, BoardTheme, PlayerIcons } from '../types';

interface CellProps {
  value: CellValue;
  index: number;
  onClick: () => void;
  isWinning: boolean;
  isHint: boolean;
  disabled: boolean;
  theme: BoardTheme;
  playerIcons: PlayerIcons;
  enableAnimations: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  index,
  onClick,
  isWinning,
  isHint,
  disabled,
  theme,
  playerIcons,
  enableAnimations,
  onKeyDown,
}) => {
  // Renders the icon inside the cell based on configuration settings
  const renderIcon = () => {
    if (!value) {
      if (isHint) {
        return (
          <span className="text-sm font-semibold tracking-wider text-neutral-400 opacity-40 transition-opacity dark:text-neutral-500 animate-pulse">
            HINT
          </span>
        );
      }
      return null;
    }

    const animateClass = enableAnimations ? 'animate-pop' : '';

    if (playerIcons === 'emoji') {
      const emoji = value === 'X' ? '🔥' : '❄️';
      return (
        <span
          className={`select-none text-4xl sm:text-5xl ${animateClass}`}
          role="img"
          aria-label={value === 'X' ? 'Fire' : 'Ice'}
        >
          {emoji}
        </span>
      );
    }

    if (playerIcons === 'shapes') {
      if (value === 'X') {
        return (
          <svg
            className={`h-11 w-11 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] ${animateClass}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12,3 2,21 22,21" />
          </svg>
        );
      } else {
        return (
          <svg
            className={`h-11 w-11 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] ${animateClass}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
          </svg>
        );
      }
    }

    // Classic Icons (X = Rose Cross, O = Violet Circle)
    if (value === 'X') {
      return (
        <svg
          className={`h-12 w-12 text-rose-500 dark:text-rose-400 ${animateClass}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    } else {
      return (
        <svg
          className={`h-12 w-12 text-violet-500 dark:text-violet-400 ${animateClass}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    }
  };

  // Get dynamic styles based on board theme
  const getThemeStyles = () => {
    const base = 'relative flex items-center justify-center aspect-square rounded-2xl border transition-all duration-300 font-sans focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed';

    switch (theme) {
      case 'neon':
        return `${base} border-cyan-500/30 bg-black/60 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.2)] dark:border-cyan-500/25 ${
          isWinning ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.7),inset_0_0_20px_rgba(6,182,212,0.4)] animate-pulse' : ''
        }`;

      case 'glass':
        return `${base} border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 hover:border-white/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${
          isWinning ? 'bg-amber-500/20 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : ''
        }`;

      case 'cyberpunk':
        return `${base} border-yellow-500 bg-zinc-900 shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] dark:border-yellow-400 dark:shadow-[2px_2px_0px_rgba(250,204,21,0.2)] dark:hover:shadow-[4px_4px_0px_rgba(250,204,21,0.4)] ${
          isWinning ? 'bg-yellow-400/10 border-dashed border-2 border-yellow-400 animate-pulse' : ''
        }`;

      case 'retro':
        return `${base} border-neutral-700 bg-neutral-800 shadow-[inset_0_-4px_0px_rgba(0,0,0,0.5)] hover:bg-neutral-750 active:translate-y-1 active:shadow-[inset_0_-1px_0px_rgba(0,0,0,0.5)] ${
          isWinning ? 'bg-amber-600/30 border-amber-500' : ''
        }`;

      case 'classic':
      default:
        return `${base} border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:scale-[1.02] dark:border-neutral-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 ${
          isWinning ? 'bg-amber-100 dark:bg-amber-950/30 border-amber-400/60 shadow-md' : ''
        }`;
    }
  };

  // Keyboard support: allow Space or Enter key to trigger click
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onClick();
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <button
      data-cell-index={index}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || value !== null}
      className={getThemeStyles()}
      aria-label={`Cell ${index + 1}. Current value: ${value || 'Empty'}. ${
        isWinning ? 'Winning combination cell' : ''
      }`}
    >
      {renderIcon()}
    </button>
  );
};

export default Cell;
