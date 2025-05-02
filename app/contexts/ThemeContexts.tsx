import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/utils/mmkv';

interface ThemeContextProps {
  theme: {
    background: string;
    text: string;
    tabIconInactive: string;
    tabIconActive: string;
  };
  colorScheme: 'system' | 'light' | 'dark';
  isDarkMode: boolean;
  toggleTheme: () => void;
  setColorScheme: (scheme: 'system' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: {
    background: '#fff',
    text: '#000',
    tabIconInactive: 'gray',
    tabIconActive: 'tomato',
  },
  colorScheme: 'system',
  isDarkMode: false,
  toggleTheme: () => { },
  setColorScheme: () => { },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = storage.getString('colorScheme');
        if (storedTheme !== null) {
          if (storedTheme === 'system') {
            setColorScheme('system');
            setIsDarkMode(systemScheme === 'dark');
          } else if (storedTheme === 'light') {
            setColorScheme('light');
            setIsDarkMode(false);
          } else if (storedTheme === 'dark') {
            setColorScheme('dark');
            setIsDarkMode(true);
          }
        }
      } catch (error) {
        console.log('Error loading theme from AsyncStorage:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        storage.set('colorScheme', colorScheme);
        if (colorScheme === 'system') {
          setIsDarkMode(systemScheme === 'dark');
        } else {
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.log('Error saving theme to AsyncStorage:', error);
      }
    };

    saveTheme();
  }, [colorScheme]);

  const theme = {
    background: isDarkMode ? '#000' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    tabIconInactive: isDarkMode ? '#fff' : '#000',
    tabIconActive: '#8B0EFC',
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default { ThemeContext, ThemeProvider };
