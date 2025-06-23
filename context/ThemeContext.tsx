import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  border: string;
  icon: string;
}

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#F5F5F5',
    text: '#411D4B',
    card: '#FFFFFF',
    border: '#E5E7EB',
    icon: '#411D4B',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    card: '#111111',
    border: '#333333',
    icon: '#FFFFFF',
  },
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  colors: themes.light,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => listener.remove();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};
