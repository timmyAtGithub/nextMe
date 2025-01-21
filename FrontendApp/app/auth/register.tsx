import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';



const RegisterScreen: React.FC = () => {
  const { GlobalStyles, currentTheme } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${apiConfig.BASE_URL}/api/auth/register`, {
        firstName,
        lastName,
        username,
        number: phoneNumber,
        password,
      });

      if (response.status === 201) {
        console.log('User registered:', response.data.user);
        router.push('./login');
      }
    } catch (err) {
      setError('Error registering user');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.authContainer}>
      <Text style={GlobalStyles.title}>Register</Text>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <TextInput
        style={GlobalStyles.input}
        placeholder="First Name"
        placeholderTextColor={currentTheme.subtleText}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Last Name"
        placeholderTextColor={currentTheme.subtleText}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Username"
        placeholderTextColor={currentTheme.subtleText}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Phone Number"
        placeholderTextColor={currentTheme.subtleText}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Password"
        placeholderTextColor={currentTheme.subtleText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor={currentTheme.subtleText}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity onPress={() => router.push('./login')}>
        <Text style={GlobalStyles.authText}>
          Already have an account? <Text style={GlobalStyles.authLink}>Login</Text>
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
