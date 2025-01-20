import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './settings/themeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
