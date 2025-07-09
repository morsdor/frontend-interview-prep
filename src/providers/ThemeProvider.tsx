'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { toggleTheme } from '@/store/themeSlice';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(mode);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Set initial theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      dispatch(toggleTheme());
    }
  }, [dispatch]);

  return <>{children}</>;
}
