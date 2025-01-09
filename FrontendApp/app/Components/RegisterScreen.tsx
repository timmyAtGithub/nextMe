import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import axios, { AxiosError } from 'axios';
import styles from './RegisterScreenStyles';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstName,
        lastName,
        username,
        number: phoneNumber,
        password,
      });

      if (response.status === 201) {
        console.log('User registered:', response.data.user);
        // Here route to next Screen
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response ? error.response.data.message : 'Unknown error');
      } else {
        setError('Unknown error');
      }
    }
  };

  const handleLogin = () => {
    console.log('Navigate to Login Screen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
