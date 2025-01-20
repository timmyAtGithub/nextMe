import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../settings/themeContext';

const BottomNavigation: React.FC = () => {
  const router = useRouter();
   const { GlobalStyles } = useTheme();

  return (
    <View style={GlobalStyles.navigation}>
      <TouchableOpacity onPress={() => router.push('/chats')}>
        <Image
          source={require('../assets/chats-icon.png')}
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/camera')}>
        <Image
          source={require('../assets/camera-icon.png')}
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pictures')}>
        <Image
          source={require('../assets/pictures-icon.png')}
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/settings')}>
        <Image
          source={require('../assets/settings-icon.png')}
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
