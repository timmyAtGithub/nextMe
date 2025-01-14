import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const BottomNavigation: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.navigation}>
      <TouchableOpacity onPress={() => router.push('/chats')}>
        <Image
          source={require('../assets/chats-icon.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/camera')}>
        <Image
          source={require('../assets/camera-icon.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pictures')}>
        <Image
          source={require('../assets/pictures-icon.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/settings')}>
        <Image
          source={require('../assets/settings-icon.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#121212',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default BottomNavigation;
