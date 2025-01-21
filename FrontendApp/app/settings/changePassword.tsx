import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import apiConfig from '../configs/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './themeContext';



const ChangePasswordScreen: React.FC = () => {
  const { GlobalStyles, currentTheme } = useTheme();
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
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Change Password</Text>

      {error && <Text style={GlobalStyles.error}>{error}</Text>}

      <TextInput
        style={GlobalStyles.input}
        placeholder="Current Password"
        placeholderTextColor={currentTheme.subtleText}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="New Password"
        placeholderTextColor={currentTheme.subtleText}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirm New Password"
        placeholderTextColor={currentTheme.subtleText}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Change Password" onPress={handleChangePassword} />

      <TouchableOpacity
        style={GlobalStyles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
       <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};


export default ChangePasswordScreen;
