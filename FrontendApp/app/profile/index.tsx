import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, Alert,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import styles from '../styles/profileStyles';
import apiConfig from '../configs/apiConfig';


const Profile: React.FC = () => {
  const router = useRouter(); 
  const [userData, setUserData] = useState<{
    username: string;
    profileImage: string;
    about: string;
  } | null>(null);
  const [editing, setEditing] = useState<{ field: string; value: string | null }>({
    field: '',
    value: null,
  });

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
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      const response = await fetch(uri);
      const blob = await response.blob();
  
      formData.append('profileImage', blob, 'profile.jpg');
  
      const token = await AsyncStorage.getItem('token');
      const uploadResponse = await fetch(`${apiConfig.BASE_URL}/api/user/upload-profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });
  
      const data = await uploadResponse.json();
  
      if (uploadResponse.ok) {
        Alert.alert('Success', 'Profile image updated successfully');
        fetchUserData(); 
      } else {
        Alert.alert('Error', data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };
  
  const handleEdit = (field: 'username' | 'about') => {
    setEditing({ field, value: userData ? userData[field] : '' });
  };
  const handleSave = async (field: 'username' | 'about', value: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/edit-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Profile updated successfully:', data);
        Alert.alert('Success', `${field} updated successfully`);
        setEditing({ field: '', value: null });
        fetchUserData();
      } else {
        console.error('Error updating profile:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/chats')}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      </TouchableOpacity>
      <Button title="Edit Image" onPress={pickImage} />

      {editing.field === 'username' ? (
        <View>
          <TextInput
            style={styles.input}
            value={editing.value || ''}
            onChangeText={(text) => setEditing({ field: 'username', value: text })}
          />
          <Button title="Save" onPress={() => handleSave('username', editing.value || '')} />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>{userData.username}</Text>
          <Button title="Edit" onPress={() => handleEdit('username')} />
        </View>
      )}
      {editing.field === 'about' ? (
        <View>
          <TextInput
            style={styles.input}
            value={editing.value || ''}
            onChangeText={(text) => setEditing({ field: 'about', value: text })}
          />
          <Button title="Save" onPress={() => handleSave('about', editing.value || '')} />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>{userData.about}</Text>
          <Button title="Edit" onPress={() => handleEdit('about')} />
        </View>
      )}
    </View>
  );
};

export default Profile;
