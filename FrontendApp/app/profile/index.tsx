import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/profileStyles';
import apiConfig from '../configs/apiConfig';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const Profile: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    username: string;
    profile_image: string;
    about: string;
  } | null>(null);
  const [editing, setEditing] = useState<{ field: string; value: string | null }>({
    field: '',
    value: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch(`${apiConfig.BASE_URL}/api/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const uploadImage = async (uri: string): Promise<boolean> => {
    try {
      setIsUploading(true);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return false;
      }

      const formData = new FormData();
      formData.append('profileImage', {
        uri: uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const uploadResponse = await fetch(
        `${apiConfig.BASE_URL}/api/user/upload-profile-image`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      const data = await uploadResponse.json();
      await fetchUserData(); 
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const resizeImage = async (uri: string): Promise<string> => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { 
          compress: 0.8, 
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );
      return result.uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        try {
          const resizedUri = await resizeImage(result.assets[0].uri);
          const uploadSuccess = await uploadImage(resizedUri);
          
          if (uploadSuccess) {
            Alert.alert('Success', 'Profile image updated successfully');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to process and upload the image');
        }
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleEdit = (field: 'username' | 'about') => {
    setEditing({ field, value: userData ? userData[field] : '' });
  };

  const handleSave = async (field: 'username' | 'about', value: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch(`${apiConfig.BASE_URL}/api/user/edit-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert('Success', `${field} updated successfully`);
      setEditing({ field: '', value: null });
      await fetchUserData();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/chats')}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={pickImage}
        disabled={isUploading}
      >
        <Image 
          source={{ 
            uri: userData.profile_image.startsWith('http') 
              ? userData.profile_image 
              : `${apiConfig.BASE_URL}${userData.profile_image}` 
          }} 
          style={styles.profileImage} 
        />
      </TouchableOpacity>
      
      <Button 
        title={isUploading ? "Uploading..." : "Edit Image"} 
        onPress={pickImage}
        disabled={isUploading}
      />

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
            multiline
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