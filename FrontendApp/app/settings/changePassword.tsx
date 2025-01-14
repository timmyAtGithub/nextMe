import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import apiConfig from '../configs/apiConfig';

const ChangePasswordScreen: React.FC = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    // Validierung: Prüfen, ob die neuen Passwörter übereinstimmen
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // API-Call: Übermitteln der aktuellen und neuen Passwörter
      const response = await axios.post(`${apiConfig.BASE_URL}/api/auth/changePassword`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully');
        router.push('./settings'); // Zurück zu den Einstellungen
      }
    } catch (err) {
      setError('Error changing password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {/* Fehlermeldung */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Eingabe für das aktuelle Passwort */}
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* Eingabe für das neue Passwort */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Eingabe für die Bestätigung des neuen Passworts */}
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Button zum Ändern des Passworts */}
      <Button title="Change Password" onPress={handleChangePassword} />

      {/* Button für Rückkehr zu den Einstellungen */}
      <TouchableOpacity onPress={() => router.push('./settings')}>
        <Text style={styles.backText}>Back to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles für die Seite
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  backText: {
    marginTop: 16,
    fontSize: 16,
    color: '#007bff',
  },
});

export default ChangePasswordScreen;
