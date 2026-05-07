import React, { createContext } from "react";
import { Colors } from "@/constants/Colors";

interface ThemeContextProps {
  theme: {
    background: string;
    text: string;
    tabIconInactive: string;
    tabIconActive: string;
  };
  colorScheme: "system" | "light" | "dark";
  isDarkMode: boolean;
  toggleTheme: () => void;
  setColorScheme: (scheme: "system" | "light" | "dark") => void;
}

const theme = {
  background: "#000000",
  text: "#fff",
  tabIconInactive: "#fff",
  tabIconActive: Colors.dark.secondaryColor,
};

const ThemeContext = createContext<ThemeContextProps>({
  theme,
  colorScheme: "dark",
  isDarkMode: true,
  toggleTheme: () => {},
  setColorScheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => {},
        isDarkMode: true,
        colorScheme: "dark",
        setColorScheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default { ThemeContext, ThemeProvider };
