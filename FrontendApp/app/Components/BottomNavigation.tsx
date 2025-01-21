import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../settings/themeContext';

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { GlobalStyles, theme } = useTheme(); 

  return (
    <View style={GlobalStyles.navigation}>
      <TouchableOpacity onPress={() => router.push('/chats')}>
        <Image
          source={
            pathname.startsWith('/chats')
              ? theme === 'dark'
                ? require('../assets/dark-chats-icon-active.png')
                : require('../assets/light-chats-icon-active.png')
              : theme === 'dark'
                ? require('../assets/dark-chats-icon.png')
                : require('../assets/light-chats-icon.png')
          }
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/camera')}>
        <Image
          source={
            pathname.startsWith('/camera')
              ? theme === 'dark'
                ? require('../assets/dark-camera-icon-active.png')
                : require('../assets/light-camera-icon-active.png')
              : theme === 'dark'
                ? require('../assets/dark-camera-icon.png')
                : require('../assets/light-camera-icon.png')
          }
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/pictures')}>
        <Image
          source={
            pathname.startsWith('/pictures')
              ? theme === 'dark'
                ? require('../assets/dark-pictures-icon-active.png')
                : require('../assets/light-pictures-icon-active.png')
              : theme === 'dark'
                ? require('../assets/dark-pictures-icon.png')
                : require('../assets/light-pictures-icon.png')
          }
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/settings')}>
        <Image
          source={
            pathname.startsWith('/settings')
              ? theme === 'dark'
                ? require('../assets/dark-settings-icon-active.png')
                : require('../assets/light-settings-icon-active.png')
              : theme === 'dark'
                ? require('../assets/dark-settings-icon.png')
                : require('../assets/light-settings-icon.png')
          }
          style={GlobalStyles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
