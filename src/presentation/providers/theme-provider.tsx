'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeToDOM(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('edl_theme') as Theme | null;
      let initialTheme: Theme = 'light';
      let isDark = false;

      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        initialTheme = saved;
        if (saved === 'dark') {
          isDark = true;
        } else if (saved === 'light') {
          isDark = false;
        } else {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      } else {
        // If no preference stored, default to light
        initialTheme = 'light';
        isDark = false;
      }

      setThemeState(initialTheme);
      setResolvedTheme(isDark ? 'dark' : 'light');
      applyThemeToDOM(isDark);
    } catch {
      setThemeState('light');
      setResolvedTheme('light');
      applyThemeToDOM(false);
    }
  }, []);

  // Set theme with instantaneous synchronous DOM update
  const setTheme = useCallback((newTheme: Theme) => {
    let isDark = false;
    if (newTheme === 'dark') {
      isDark = true;
    } else if (newTheme === 'light') {
      isDark = false;
    } else {
      isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    applyThemeToDOM(isDark);
    setThemeState(newTheme);
    setResolvedTheme(isDark ? 'dark' : 'light');

    try {
      localStorage.setItem('edl_theme', newTheme);
    } catch {}
  }, []);

  // 1-click toggle between light and dark
  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  // Listen for OS system theme changes only when theme is 'system'
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      applyThemeToDOM(e.matches);
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
