import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { getGlobalStyles } from '../styles/globalStyles';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 1) Definiere den Typ für deinen Context (Theme, Toggle, Styles)
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  GlobalStyles: ReturnType<typeof getGlobalStyles>;
}

// 2) Erzeuge den Context OHNE Default (nutze null, um Fehler abzufangen)
export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

// 3) Implementiere den ThemeProvider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // --- Die Funktion zum Umschalten
  const toggleTheme = () => {
    console.log('toggleTheme called, current theme:', theme);
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Setting new theme to:', newTheme);
      return newTheme;
    });
  };

  // --- GlobalStyles neu berechnen, wenn sich das Theme ändert
  const GlobalStyles = useMemo(() => {
    console.log('Recalculating GlobalStyles for theme:', theme);
    return getGlobalStyles(theme === 'dark');
  }, [theme]);

  // --- Context-Wert zusammenbauen
  const contextValue: ThemeContextType = useMemo(() => {
    console.log('Creating new context value for theme:', theme);
    return {
      theme,
      toggleTheme,
      GlobalStyles,
    };
  }, [theme, GlobalStyles]);

  // --- Logge, wenn sich der Context ändert
  useEffect(() => {
    console.log('ThemeContext value updated:', {
      theme,
      GlobalStylesKeys: Object.keys(GlobalStyles),
    });
  }, [theme, GlobalStyles]);

  // --- Bestimme die Button-Icon-Farbe (nur ein Beispiel)
  const iconColor = GlobalStyles.text?.color || '#000';

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Alles in der GestureHandlerRootView */}
      <GestureHandlerRootView style={[GlobalStyles.container]}>
        
        {/* Back-Button */}
        <TouchableOpacity
          style={[GlobalStyles.backButton]}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={iconColor}
          />
        </TouchableOpacity>

        {/* Theme-Toggle-Button */}
        <TouchableOpacity
          style={[GlobalStyles.toggleButton]}
          onPress={() => {
            console.log('Toggle button pressed');
            toggleTheme();
          }}
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

// 4) Implementiere das benutzerdefinierte Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Falls kein Provider vorhanden ist
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  console.log('useTheme hook called, current theme:', context.theme);
  return context;
};
