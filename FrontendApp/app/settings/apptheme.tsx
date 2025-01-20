import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from './themeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { useColorScheme } from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const GlobalStyles = getGlobalStyles(isDarkMode);

const ThemeSettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
});

export default ThemeSettingsScreen;
