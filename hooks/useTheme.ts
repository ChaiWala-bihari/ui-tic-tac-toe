'use client';

import { useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook to manage Dark Mode state and class injection on the document element.
 * Hydration-safe, defaulting to premium Dark Mode.
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme-preference', 'dark');

  useEffect(() => {
    // Sync class list with active theme
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}

export default useTheme;
