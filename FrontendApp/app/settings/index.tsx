import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './themeContext';
import BottomNavigation from '../Components/BottomNavigation';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importiere die Icons-Bibliothek

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
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => {}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="notifications" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Notifications & Chat</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => {}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="storage" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Data & Storage</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => router.push('./settings/help')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="help-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Help</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => router.push('./settings/changePassword')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="lock" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Passwort ändern</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => router.push('./settings/about')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="info" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>About</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => router.push('./settings/apptheme')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="palette" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>App-Theme</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={() => router.push('./settings/background')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="photo" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Change Background</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={GlobalStyles.buttonContainer2} onPress={handleLogout}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="logout" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={GlobalStyles.buttonText}>Abmelden</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </View>
  );
};

export default SettingsScreen;
