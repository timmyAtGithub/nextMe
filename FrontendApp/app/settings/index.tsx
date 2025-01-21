import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './themeContext';
import BottomNavigation from '../Components/BottomNavigation';


const SettingsScreen = () => {
  const router = useRouter();
  const { GlobalStyles } = useTheme();
  

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Sind Sie sicher, dass Sie sich abmelden möchten?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token'); 
              router.push('/auth/login'); 
            } catch (error) {
              console.error('Fehler beim Abmelden:', error);
              Alert.alert('Fehler', 'Beim Abmelden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.settingsContainer}>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => {}}>
        <Text style={GlobalStyles.buttonText}>Notifications & Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => {}}>
        <Text style={GlobalStyles.buttonText}>Data & Storage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => router.push('./settings/help')}>
        <Text style={GlobalStyles.buttonText}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => router.push('./settings/changePassword')}>
        <Text style={GlobalStyles.buttonText}>Passwort ändern</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => router.push('./settings/about')}>
        <Text style={GlobalStyles.buttonText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => router.push('./settings/apptheme')}>
        <Text style={GlobalStyles.buttonText}>App-Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={() => router.push('./settings/background')}>
        <Text style={GlobalStyles.buttonText}>Change Background</Text>
      </TouchableOpacity>
      <TouchableOpacity style={GlobalStyles.buttonContainer} onPress={handleLogout}>
        <Text style={GlobalStyles.buttonText}>Abmelden</Text>
      </TouchableOpacity>
      </View> 
      <BottomNavigation />
      
    </View>
  
  );
};

export default SettingsScreen;
