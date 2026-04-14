import { useState, useEffect } from 'react';

const THEME_KEY = 'markdown-notes-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme || 'light';
    }
    return 'light';
  });

  const [isDark, setIsDark] = useState(() => theme === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    root.classList.add(`${theme}-theme`);
    
    // Update state
    setIsDark(theme === 'dark');
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  return {
    theme,
    isDark,
    toggleTheme,
    setLightTheme,
    setDarkTheme
  };
};
