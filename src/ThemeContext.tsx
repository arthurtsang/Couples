import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LIGHT_THEME } from './theme/light';
import { DARK_THEME } from './theme/dark';
import { ThemeColors } from './types';

interface ThemeContextType {
  theme: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'userTheme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY).then((savedTheme) => {
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(Appearance.getColorScheme() === 'dark');
      }
    });

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (!SecureStore.getItemAsync(THEME_KEY)) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });
    return () => listener.remove();
  }, []);

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      SecureStore.setItemAsync(THEME_KEY, newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}