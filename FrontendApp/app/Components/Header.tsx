import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiConfig from '../configs/apiConfig';


const Header: React.FC = () => {
  const [userData, setUserData] = useState<{ username: string; profile_image: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${apiConfig.BASE_URL}/api/user/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  console.log('Frontend userData:', userData);
  console.log('User Data:', userData);
  console.log('Profile Image URL:', userData?.profile_image);




  if (loading) {
    return (
      <View style={styles.header}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('./profile')}>
        {userData?.profile_image ? (
          <Image
            source={{ uri: `${apiConfig.BASE_URL}${userData.profile_image}` }}
            style={styles.profileImage}
            onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
          />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.username}>{userData?.username}</Text>
      <TouchableOpacity onPress={() => router.push('./friends')}>
        <Ionicons name="people-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    width: '100%',
    height: '7%',
    top: 0,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCCCCC',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
});

export default Header;
