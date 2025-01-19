import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, Alert, } from 'react-native';
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
      console.log('User Data:', data);
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
      console.log("Starting uploadImage with URI:", uri);

      const formData = new FormData();
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("profileImage", blob, "profile.jpg");
      console.log("FormData prepared:", Array.from(formData.entries()));

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const uploadResponse = await fetch(
        `${apiConfig.BASE_URL}/api/user/upload-profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await uploadResponse.json();
      console.log("Response from server:", data);

      if (uploadResponse.ok) {
        Alert.alert("Success", "Image uploaded successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to upload the image");
      }
    } catch (error) {
      console.error("Error occurred during image upload:", error);
      Alert.alert("Error", "An unexpected error occurred during upload");
    }
  };


  const prepareFileForUpload = async (uri: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}temp.jpg`;
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });
      return fileUri;
    } catch (error) {
      console.error('Error preparing file for upload:', error);
      throw error;
    }
  };

  const resizeImage = async (uri: string) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return resizedImage.uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  };

  const handleResizeAndUpload = async (uri: string) => {
    try {
      const resizedUri = await resizeImage(uri);
      await uploadImage(resizedUri);
    } catch (error) {
      console.error('Error during resizing and upload:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected image:', result.assets[0].uri);
        await handleResizeAndUpload(result.assets[0].uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error picking image:', error.message);
      } else {
        console.error('Error picking image:', error);
      }
      Alert.alert('Error', 'An error occurred while picking the image');
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

        <Image source={{ uri: `${apiConfig.BASE_URL}${userData.profile_image}` }} style={styles.profileImage} />

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
