import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import apiConfig from '../configs/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePasswordScreen: React.FC = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      console.error('Validation Error: New passwords do not match', { newPassword, confirmPassword });
      return;
    }
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          `${apiConfig.BASE_URL}/api/auth/changePassword`,
          { currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          console.log('API Response:', response.data);
          Alert.alert('Success', 'Password changed successfully');
          router.push('./settings');
        } else {
          setError('Error changing password');
        }
      } catch (err) {
        console.error('Unexpected error', err);
        setError('Error changing password');
      }
    }

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Change Password" onPress={handleChangePassword} />

      <TouchableOpacity onPress={() => router.push('./settings')}>
        <Text style={styles.backText}>Back to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

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
