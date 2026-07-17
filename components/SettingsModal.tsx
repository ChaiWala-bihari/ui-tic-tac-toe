'use client';

import React, { useEffect, useRef } from 'react';
import { GameSettings, BoardTheme, PlayerIcons, Player } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetStats,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus the modal container for accessibility
      modalRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof GameSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };


  const handleSelectIcons = (icons: PlayerIcons) => {
    onUpdateSettings({ playerIcons: icons });
  };

  const handleSelectStarting = (player: Player) => {
    onUpdateSettings({ startingPlayer: player });
  };

  const handleResetClick = () => {
    if (window.confirm('Are you absolutely sure you want to reset all game statistics and achievements? This cannot be undone.')) {
      onResetStats();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-md scale-95 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/95 p-6 shadow-2xl transition-all dark:border-neutral-800/40 dark:bg-zinc-900/95 focus:outline-none"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-850">
          <h2 id="settings-title" className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            ⚙️ Game Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-450 hover:bg-neutral-100 hover:text-neutral-755 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close settings modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1 text-sm text-neutral-600 dark:text-zinc-300">
          {/* Starting Player Selector */}
          <div>
            <span className="block text-xs font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Starting Player
            </span>
            <div className="flex gap-2">
              {['X', 'O'].map((player) => (
                <button
                  key={player}
                  onClick={() => handleSelectStarting(player as Player)}
                  className={`flex-1 rounded-xl py-2 font-bold transition-all border active:scale-98 ${
                    settings.startingPlayer === player
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                      : 'bg-transparent border-neutral-200 hover:bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  Player {player}
                </button>
              ))}
            </div>
          </div>


          {/* Marker Icon Type */}
          <div>
            <span className="block text-xs font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Player Icon Style
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'classic', label: 'Classic X/O' },
                { value: 'emoji', label: '🔥 vs ❄️' },
                { value: 'shapes', label: 'Shapes' },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleSelectIcons(style.value as PlayerIcons)}
                  className={`rounded-xl border py-1.5 text-xs font-semibold transition-all active:scale-98 ${
                    settings.playerIcons === style.value
                      ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/20 dark:border-blue-400 dark:text-blue-400'
                      : 'bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800 dark:text-zinc-400 dark:hover:border-neutral-700'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles (Animations, Sounds, Hints) */}
          <div className="space-y-3 pt-2">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">Game Audio</span>
                <span className="block text-xs text-neutral-400 dark:text-zinc-500">Synthesized sound effects</span>
              </div>
              <button
                onClick={() => handleToggle('enableSounds')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  settings.enableSounds ? 'bg-blue-500' : 'bg-neutral-250 dark:bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.enableSounds}
                aria-label="Toggle game audio"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableSounds ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">Cell Transitions</span>
                <span className="block text-xs text-neutral-400 dark:text-zinc-500">Enable grid pops & lines</span>
              </div>
              <button
                onClick={() => handleToggle('enableAnimations')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  settings.enableAnimations ? 'bg-blue-500' : 'bg-neutral-250 dark:bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.enableAnimations}
                aria-label="Toggle animations"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Hints Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-800 dark:text-zinc-200">Show Move Hints</span>
                <span className="block text-xs text-neutral-400 dark:text-zinc-500">Computes the best cell move</span>
              </div>
              <button
                onClick={() => handleToggle('showHints')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  settings.showHints ? 'bg-blue-500' : 'bg-neutral-250 dark:bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.showHints}
                aria-label="Toggle move hints"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showHints ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Statistics */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-850">
            <button
              onClick={handleResetClick}
              className="w-full rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-950/20 dark:bg-rose-950/10 dark:text-rose-400 dark:hover:bg-rose-950/20 active:scale-[0.99] transition-all"
            >
              ⚠️ Reset Scoreboard & Achievements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
