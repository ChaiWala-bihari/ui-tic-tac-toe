'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useGame from '../hooks/useGame';
import useTheme from '../hooks/useTheme';
import { BoardTheme } from '../types';
import { getMoveHint } from '../utils/minimax';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScoreBoard from '../components/ScoreBoard';
import GameModeSelector from '../components/GameModeSelector';
import DifficultySelector from '../components/DifficultySelector';
import GameStatus from '../components/GameStatus';
import Board from '../components/Board';
import GameControls from '../components/GameControls';
import SettingsModal from '../components/SettingsModal';
import WinnerModal from '../components/WinnerModal';
import StatisticsDashboard from '../components/StatisticsDashboard';
import Confetti from '../components/Confetti';
import BoardThemeSelector from '../components/BoardThemeSelector';

export default function Home() {
  const {
    board,
    currentPlayer,
    lastMoveIndex,
    winner,
    winningPattern,
    isDraw,
    gameStatus,
    movesCount,
    gameMode,
    difficulty,
    isAiThinking,
    isReplaying,
    settings,
    statistics,
    achievements,
    history,
    pointer,
    elapsedTime,
    unlockedAchievement,
    setGameMode,
    setDifficulty,
    updateSettings,
    resetStatistics,
    makePlayerMove,
    undoMove,
    redoMove,
    restartGame,
    startNewMatch,
    replayMatch,
    playButtonClick,
  } = useGame();

  const { isDark, toggleTheme } = useTheme();

  // Modal open states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);

  // Automatically trigger winner modal when the game reaches a terminal state
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'draw') {
      const delay = setTimeout(() => {
        setIsWinnerOpen(true);
      }, 700); // Slight delay for win animations to complete first
      return () => clearTimeout(delay);
    } else {
      setIsWinnerOpen(false);
    }
  }, [gameStatus]);

  // Compute move hints using minimax logic when enabled
  const hintIndex = useMemo(() => {
    if (
      !settings.showHints ||
      gameStatus !== 'playing' ||
      isAiThinking ||
      isReplaying
    ) {
      return -1;
    }

    // In PVC mode, only show hints during the human turn ('X')
    if (gameMode === 'pvc' && currentPlayer !== 'X') {
      return -1;
    }

    // In CVC mode, don't show hints
    if (gameMode === 'cvc') {
      return -1;
    }

    return getMoveHint(board, currentPlayer);
  }, [board, currentPlayer, gameMode, gameStatus, isAiThinking, isReplaying, settings.showHints]);

  // Get theme-specific wrapper styles
  const getThemeContainerClass = (theme: BoardTheme) => {
    const base = 'relative flex min-h-screen w-full flex-col items-center p-4 transition-all duration-500 pb-8 overflow-hidden justify-center';
    
    switch (theme) {
      case 'neon':
        return `${base} bg-[#020617] text-cyan-400 shadow-[inset_0_0_120px_rgba(6,182,212,0.15)]`;
      case 'glass':
        return `${base} bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-slate-800 dark:text-zinc-100`;
      case 'cyberpunk':
        return `${base} bg-zinc-950 text-yellow-400 font-bold border-4 border-yellow-500`;
      case 'retro':
        return `${base} bg-neutral-900 text-amber-500 font-mono`;
      case 'classic':
      default:
        return `${base} bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-150`;
    }
  };

  // Determine toggle sound behavior
  const handleToggleMute = () => {
    playButtonClick();
    updateSettings({ isMuted: !settings.isMuted });
  };

  // Determine background visual decoration overlays
  const renderThemeDecorations = () => {
    if (settings.boardTheme === 'glass') {
      return (
        <>
          {/* Animated blurred light blobs for glassmorphic backdrop */}
          <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-950/20 pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] translate-x-1/2 translate-y-1/2 rounded-full bg-pink-400/15 blur-[120px] dark:bg-rose-950/10 pointer-events-none animate-pulse" />
        </>
      );
    }
    if (settings.boardTheme === 'neon') {
      return (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      );
    }
    if (settings.boardTheme === 'retro') {
      return (
        <>
          {/* CRT scanline overlay effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-15" />
          {/* Ambient green tint */}
          <div className="pointer-events-none absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/2 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </>
      );
    }
    return null;
  };

  return (
    <div className={getThemeContainerClass(settings.boardTheme)}>
      {/* Background visual graphics */}
      {renderThemeDecorations()}

      {/* Confetti Celebration Overlay */}
      {/* Triggered only when a game is won, animations are enabled, and gameMode isn't cvc (unless X won, or PvP wins) */}
      <Confetti
        active={
          gameStatus === 'won' &&
          settings.enableAnimations &&
          (gameMode === 'pvp' || (gameMode === 'pvc' && winner === 'X') || (gameMode === 'cvc' && winner === 'X'))
        }
      />

      {/* Sliding Toast Alert for Unlocking Badges */}
      {unlockedAchievement && (
        <div className="fixed top-5 right-5 z-55 max-w-sm rounded-2xl border border-emerald-500 bg-emerald-50 p-4 shadow-xl dark:bg-zinc-900 border-l-4 animate-fade-in flex gap-3">
          <div className="text-3xl">{unlockedAchievement.icon}</div>
          <div>
            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest">
              Achievement Unlocked!
            </span>
            <span className="block text-sm font-bold text-neutral-800 dark:text-white">
              {unlockedAchievement.title}
            </span>
            <span className="block text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
              {unlockedAchievement.description}
            </span>
          </div>
        </div>
      )}

      {/* Header element */}
      <Header
        isDark={isDark}
        isMuted={settings.isMuted}
        onToggleTheme={toggleTheme}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => {
          playButtonClick();
          setIsSettingsOpen(true);
        }}
      />

      {/* Main Container Layout */}
      <main className="z-10 flex w-full max-w-md flex-col items-center gap-4 px-2">
        {/* Game Mode Pill Selectors */}
        <GameModeSelector
          currentMode={gameMode}
          onChange={setGameMode}
          disabled={movesCount > 0 && gameStatus === 'playing'}
          onPlayClickSound={playButtonClick}
        />

        {/* AI Difficulty Selector */}
        <DifficultySelector
          currentDifficulty={difficulty}
          onChange={setDifficulty}
          visible={gameMode === 'pvc'}
          onPlayClickSound={playButtonClick}
        />

        {/* ScoreBoard Dashboard Card */}
        <ScoreBoard stats={statistics} gameMode={gameMode} />

        {/* Board Aesthetic Theme Selector */}
        <BoardThemeSelector
          currentTheme={settings.boardTheme}
          onChange={(theme) => updateSettings({ boardTheme: theme })}
          onPlayClickSound={playButtonClick}
        />

        {/* Game Turn/Move Count/Timer bar */}
        <GameStatus
          currentPlayer={currentPlayer}
          movesCount={movesCount}
          elapsedTime={elapsedTime}
          isAiThinking={isAiThinking}
          isReplaying={isReplaying}
          gameStatus={gameStatus}
        />

        {/* Interactive Tic-Tac-Toe Grid Board */}
        <Board
          board={board}
          onClick={makePlayerMove}
          winningPattern={winningPattern}
          hintIndex={hintIndex}
          disabled={
            gameStatus !== 'playing' && gameStatus !== 'setup' ||
            isAiThinking ||
            isReplaying
          }
          theme={settings.boardTheme}
          playerIcons={settings.playerIcons}
          enableAnimations={settings.enableAnimations}
        />

        {/* Game Loop Controls */}
        <GameControls
          canUndo={gameStatus === 'playing' && pointer > 0}
          canRedo={gameStatus === 'playing' && pointer < history.length - 1}
          onUndo={undoMove}
          onRedo={redoMove}
          onRestart={restartGame}
          onOpenStats={() => {
            playButtonClick();
            setIsStatsOpen(true);
          }}
          gameStatus={gameStatus}
        />
      </main>

      {/* Footer copyright */}
      <Footer />

      {/* Modals Layer */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          playButtonClick();
          setIsSettingsOpen(false);
        }}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetStats={resetStatistics}
      />

      <StatisticsDashboard
        isOpen={isStatsOpen}
        onClose={() => {
          playButtonClick();
          setIsStatsOpen(false);
        }}
        stats={statistics}
        achievements={achievements}
      />

      <WinnerModal
        isOpen={isWinnerOpen}
        winner={winner}
        isDraw={isDraw}
        movesCount={movesCount}
        elapsedTime={elapsedTime}
        gameMode={gameMode}
        board={board}
        onRestart={restartGame}
        onNewGame={startNewMatch}
        onReplayMatch={replayMatch}
        onClose={() => setIsWinnerOpen(false)}
      />
    </div>
  );
}
