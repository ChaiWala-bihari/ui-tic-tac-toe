'use client';

import React, { useCallback, useMemo } from 'react';
import { BoardState, BoardTheme, PlayerIcons } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: BoardState;
  onClick: (index: number) => void;
  winningPattern: number[] | null;
  hintIndex: number;
  disabled: boolean;
  theme: BoardTheme;
  playerIcons: PlayerIcons;
  enableAnimations: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onClick,
  winningPattern,
  hintIndex,
  disabled,
  theme,
  playerIcons,
  enableAnimations,
}) => {
  // Arrow key grid navigation
  const handleArrowNavigation = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex = index;

    switch (e.key) {
      case 'ArrowUp':
        if (index >= 3) targetIndex = index - 3;
        break;
      case 'ArrowDown':
        if (index <= 5) targetIndex = index + 3;
        break;
      case 'ArrowLeft':
        if (index % 3 !== 0) targetIndex = index - 1;
        break;
      case 'ArrowRight':
        if (index % 3 !== 2) targetIndex = index + 1;
        break;
      default:
        return; // Allow Space, Enter, Tab to trigger naturally
    }

    e.preventDefault();
    const cellButtons = document.querySelectorAll<HTMLButtonElement>('[data-cell-index]');
    cellButtons[targetIndex]?.focus();
  }, []);

  // Map winning cell index patterns to exact SVG viewBox (0-100) coordinates
  const winningLineCoords = useMemo(() => {
    if (!winningPattern) return null;
    const sorted = [...winningPattern].sort((a, b) => a - b);
    const key = sorted.join(',');

    switch (key) {
      // Rows
      case '0,1,2':
        return { x1: 5, y1: 16.66, x2: 95, y2: 16.66 };
      case '3,4,5':
        return { x1: 5, y1: 50, x2: 95, y2: 50 };
      case '6,7,8':
        return { x1: 5, y1: 83.33, x2: 95, y2: 83.33 };
      // Columns
      case '0,3,6':
        return { x1: 16.66, y1: 5, x2: 16.66, y2: 95 };
      case '1,4,7':
        return { x1: 50, y1: 5, x2: 50, y2: 95 };
      case '2,5,8':
        return { x1: 83.33, y1: 5, x2: 83.33, y2: 95 };
      // Diagonals
      case '0,4,8':
        return { x1: 8, y1: 8, x2: 92, y2: 92 };
      case '2,4,6':
        return { x1: 92, y1: 8, x2: 8, y2: 92 };
      default:
        return null;
    }
  }, [winningPattern]);

  // Determine line style based on theme
  const getLineStrokeColor = () => {
    switch (theme) {
      case 'neon':
        return 'stroke-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]';
      case 'cyberpunk':
        return 'stroke-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]';
      case 'glass':
        return 'stroke-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.7)]';
      case 'retro':
        return 'stroke-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]';
      case 'classic':
      default:
        return 'stroke-amber-500 dark:stroke-amber-400';
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px]">
      {/* 3x3 Grid Board */}
      <div className="grid grid-cols-3 gap-3 p-1">
        {board.map((cellValue, idx) => {
          const isWinningCell = winningPattern?.includes(idx) ?? false;
          const isHintCell = hintIndex === idx;

          return (
            <Cell
              key={idx}
              index={idx}
              value={cellValue}
              isWinning={isWinningCell}
              isHint={isHintCell}
              disabled={disabled}
              theme={theme}
              playerIcons={playerIcons}
              enableAnimations={enableAnimations}
              onClick={() => onClick(idx)}
              onKeyDown={(e) => handleArrowNavigation(e, idx)}
            />
          );
        })}
      </div>

      {/* SVG Animated Winning Line Overlay */}
      {winningLineCoords && (
        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full p-1"
          viewBox="0 0 100 100"
          fill="none"
        >
          <line
            x1={winningLineCoords.x1}
            y1={winningLineCoords.y1}
            x2={winningLineCoords.x2}
            y2={winningLineCoords.y2}
            strokeWidth="3.5"
            strokeLinecap="round"
            className={`winning-line ${getLineStrokeColor()} ${
              enableAnimations ? 'animate-draw-line' : ''
            }`}
          />
        </svg>
      )}
    </div>
  );
};

export default Board;
