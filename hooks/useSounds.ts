'use client';

import { useCallback, useEffect } from 'react';
import { soundSynth } from '../lib/soundSynth';

/**
 * Custom hook to bridge the audio synthesizer with the game's mute settings.
 */
export function useSounds(isMuted: boolean) {
  // Sync the synth's mute state with the settings state
  useEffect(() => {
    soundSynth.setMuted(isMuted);
  }, [isMuted]);

  const playMove = useCallback(() => {
    soundSynth.playMove();
  }, []);

  const playClick = useCallback(() => {
    soundSynth.playClick();
  }, []);

  const playWin = useCallback(() => {
    soundSynth.playWin();
  }, []);

  const playLose = useCallback(() => {
    soundSynth.playLose();
  }, []);

  const playDraw = useCallback(() => {
    soundSynth.playDraw();
  }, []);

  return {
    playMove,
    playClick,
    playWin,
    playLose,
    playDraw,
  };
}

export default useSounds;
