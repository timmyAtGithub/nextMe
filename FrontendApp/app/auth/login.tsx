import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import styles from '../styles/LoginScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../configs/apiConfig';


const LoginScreen: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post(`${apiConfig.BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;

        await AsyncStorage.setItem('token', token);

        console.log('Login successful:', response.data);
        router.push('/chats');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    router.push('./register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>
          Not registered yet? <Text style={styles.registerLink}>Register now</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
