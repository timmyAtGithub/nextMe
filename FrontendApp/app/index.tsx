import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Components/LoginScreen';
import RegisterScreen from './Components/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
  
  );
}
