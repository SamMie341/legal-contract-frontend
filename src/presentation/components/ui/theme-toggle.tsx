'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/presentation/providers';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleTheme();
      }}
      title={
        resolvedTheme === 'dark'
          ? 'ປ່ຽນເປັນໂໝດແຈ້ງ (Light Mode)'
          : 'ປ່ຽນເປັນໂໝດມືດ (Dark Mode)'
      }
      aria-label="Toggle dark/light theme"
      className={`p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-border-line bg-surface flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${className}`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-medium">
          {resolvedTheme === 'dark' ? 'ໂໝດແຈ້ງ' : 'ໂໝດມືດ'}
        </span>
      )}
    </button>
  );
}
