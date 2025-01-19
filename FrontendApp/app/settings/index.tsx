import React from 'react';
import { StyleSheet, View, Button, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const router = useRouter();

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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
        <Text style={styles.buttonText}>Notifications & Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
        <Text style={styles.buttonText}>Data & Storage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('./settings/help')}>
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('./settings/changePassword')}>
        <Text style={styles.buttonText}>Passwort ändern</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('./settings/about')}>
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('./settings/apptheme')}>
        <Text style={styles.buttonText}>App-Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push('./settings/background')}>
        <Text style={styles.buttonText}>Change Background</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
        <Text style={styles.buttonText}>Abmelden</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5', // Gleiche Hintergrundfarbe wie die Image-Seite
  },
  buttonContainer: {
    backgroundColor: '#ffffff', // Weißer Hintergrund für jeden Button
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#333', // Gleiche Textfarbe wie bei den Sendernamen auf der Image-Seite
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
