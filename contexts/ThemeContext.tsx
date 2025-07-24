import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#F5F5F0',
  surface: '#FFFFFF',
  primary: '#2D5A3D',
  primaryLight: '#F0F9F0',
  text: '#2D2D2D',
  textSecondary: '#6B7280',
  border: '#E0F2E0',
  shadow: '#000000',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#4CAF50',
  primaryLight: '#2D3B2D',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#404040',
  shadow: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};