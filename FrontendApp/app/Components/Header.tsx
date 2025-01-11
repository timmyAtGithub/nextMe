import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Header: React.FC = () => {
  const [userData, setUserData] = useState<{ username: string; profileImage: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/user/me`, {
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

  if (loading) {
    return (
      <View style={styles.header}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {userData?.profileImage ? (
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profileImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}
      <Text style={styles.username}>{userData?.username}</Text>
      <TouchableOpacity
        style={styles.friendsIcon}
        onPress={() => router.push('/friends')}
      >
        <Image
          source={require('../assets/friends-icon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#121212',
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
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },
  friendsIcon: {
    padding: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default Header;
