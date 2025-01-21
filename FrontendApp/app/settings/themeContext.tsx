import React, { createContext, useState, useContext, useMemo, useEffect, ReactNode, } from 'react';
import { getGlobalStyles } from '../styles/globalStyles';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { darkThemeColors, lightThemeColors } from '../styles/globalStyles';


interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  GlobalStyles: ReturnType<typeof getGlobalStyles>;
  currentTheme: typeof darkThemeColors | typeof lightThemeColors;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  mode?: 'light' | 'dark'; 
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, mode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(mode || 'light');

  const currentTheme = theme === 'dark' ? darkThemeColors : lightThemeColors;


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const GlobalStyles = useMemo(() => getGlobalStyles(theme === 'dark'), [theme]);

  const contextValue: ThemeContextType = useMemo(
    () => ({
      theme,
      toggleTheme,
      GlobalStyles,
      currentTheme
    }),
    [theme, GlobalStyles]
  );

  useEffect(() => {
    console.log('ThemeProvider: Theme updated to', theme);
  }, [theme]);

  const iconColor = GlobalStyles.text?.color || '#000';

  return (
    <ThemeContext.Provider value={contextValue}>
      <GestureHandlerRootView style={[GlobalStyles.container]}>
        <TouchableOpacity
          style={[GlobalStyles.toggleButton]}
          onPress={toggleTheme}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={24}
            color={iconColor}
          />
        </TouchableOpacity>

        {children}
      </GestureHandlerRootView>
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
