import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';

const Header: React.FC = () => {
   const { GlobalStyles } = useTheme();
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
      <View style={GlobalStyles.userHeader}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.userHeader}>
      <TouchableOpacity onPress={() => router.push('./profile')}>
        {userData?.profile_image ? (
          <Image
            source={{ uri: `${apiConfig.BASE_URL}${userData.profile_image}` }}
            style={GlobalStyles.profileImage}
            onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
          />
        ) : (
          <View style={[GlobalStyles.profileImage, GlobalStyles.placeholderImage]}>
            <Text style={GlobalStyles.placeholderText}>?</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={GlobalStyles.text}>{userData?.username}</Text>
      <TouchableOpacity onPress={() => router.push('./friends')}>
        <Ionicons name="people-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>

  );
};

export default Header;
