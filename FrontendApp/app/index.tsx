import React from 'react';
import { Redirect } from 'expo-router';
import { ThemeProvider } from './settings/themeContext'; 

export default function Index() {
  return (
    <ThemeProvider>
      <Redirect href="./auth/login" />
    </ThemeProvider>
  );
}
  