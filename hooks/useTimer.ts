'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to manage the game timer (seconds elapsed).
 */
export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      // Use window.setInterval to avoid NodeJS.Timeout vs number type issues in TypeScript browser environment
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime,
  };
}

export default useTimer;
