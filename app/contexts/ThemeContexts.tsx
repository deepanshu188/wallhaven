import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextProps {
  theme: {
    background: string;
    text: string;
    tabIconInactive: string;
    tabIconActive: string;
  };
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: {
    background: '#fff',
    text: '#000',
    tabIconInactive: 'gray',
    tabIconActive: 'tomato',
  },
  isDarkMode: false,
  toggleTheme: () => { },
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('isDarkMode');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'true');
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
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      } catch (error) {
        console.log('Error saving theme to AsyncStorage:', error);
      }
    };

    saveTheme();
  }, [isDarkMode]);

  const theme = {
    background: isDarkMode ? '#000' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    tabIconInactive: isDarkMode ? 'lightgray' : 'gray',
    tabIconActive: isDarkMode ? 'lightblue' : 'tomato',
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
