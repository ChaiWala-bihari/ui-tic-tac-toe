'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Player, GameStatus, BoardState } from '../types';

interface WinnerModalProps {
  isOpen: boolean;
  winner: Player | null;
  isDraw: boolean;
  movesCount: number;
  elapsedTime: number;
  gameMode: string;
  board: BoardState;
  onRestart: () => void;
  onNewGame: () => void;
  onReplayMatch: () => void;
  onClose: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  winner,
  isDraw,
  movesCount,
  elapsedTime,
  gameMode,
  board,
  onRestart,
  onNewGame,
  onReplayMatch,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      containerRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Build emoji grid to share
  const handleShare = () => {
    const emojiBoard = board
      .map((cell, idx) => {
        const mark = cell === 'X' ? '❌' : cell === 'O' ? '⭕' : '⬜';
        const separator = idx % 3 === 2 ? '\n' : ' ';
        return mark + separator;
      })
      .join('')
      .trim();

    const modeText =
      gameMode === 'pvp'
        ? 'Player vs Player'
        : gameMode === 'pvc'
        ? 'Player vs Computer'
        : 'Computer vs Computer';

    const resultText = isDraw ? "It's a Draw! 🤝" : `Player ${winner} Won! 🏆`;

    const shareText = `🎮 Tic-Tac-Toe Match 🎮\nMode: ${modeText}\nResult: ${resultText}\nTime: ${formatTime(
      elapsedTime
    )}\nMoves: ${movesCount}\n\n${emojiBoard}\n\nPlay local Tic-Tac-Toe!`;

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy match results:', err);
      });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      {/* Modal Card */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className="w-full max-w-sm scale-95 overflow-hidden rounded-3xl border border-neutral-200/50 bg-white/95 p-6 text-center shadow-2xl transition-all dark:border-neutral-800/40 dark:bg-zinc-900/95 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Emoji */}
        <div className="text-5xl animate-bounce">
          {isDraw ? '🤝' : winner === 'X' ? '🏆' : '🤖'}
        </div>

        {/* Status Title */}
        <h2
          id="winner-title"
          className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-800 dark:text-white"
        >
          {isDraw ? (
            "It's a Draw!"
          ) : (
            <span className="bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
              Player {winner} Wins!
            </span>
          )}
        </h2>

        {/* Subtitle details */}
        <p className="mt-1 text-xs text-neutral-450 dark:text-zinc-500">
          Match completed in {movesCount} moves ({formatTime(elapsedTime)})
        </p>

        {/* Stats breakdown list */}
        <div className="my-4 rounded-2xl bg-neutral-50 p-3 text-xs dark:bg-zinc-800/30 space-y-1.5 text-neutral-600 dark:text-zinc-300">
          <div className="flex justify-between">
            <span>Game Mode</span>
            <span className="font-semibold capitalize">{gameMode === 'pvc' ? 'Player vs AI' : gameMode}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-between">
            <span>Moves Count</span>
            <span className="font-semibold">{movesCount} / 9</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          {/* Main Action: Play Again */}
          <button
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white shadow hover:bg-neutral-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Play Again
          </button>

          {/* Sub Actions */}
          <div className="flex gap-2">
            {/* Auto Replay */}
            <button
              onClick={() => {
                onReplayMatch();
                onClose();
              }}
              className="flex-1 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
            >
              🍿 Watch Replay
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex-1 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
            >
              {copied ? '✅ Copied!' : '📤 Share Result'}
            </button>
          </div>

          {/* New Game Close Link */}
          <button
            onClick={onClose}
            className="mt-1 text-xs text-neutral-400 hover:text-neutral-600 dark:text-zinc-550 dark:hover:text-zinc-450 underline decoration-dotted"
          >
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
