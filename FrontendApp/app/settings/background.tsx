import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getGlobalStyles } from '../styles/globalStyles';
import { useColorScheme } from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const GlobalStyles = getGlobalStyles(isDarkMode);

const BackgroundUpdate = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.textField}>
        <Text style={GlobalStyles.text}>Bild hochladen</Text>
        <Button title="Bild auswählen" onPress={pickImage} />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={GlobalStyles.image} />
        )}
      </View>
    </View>
  );
};

export default BackgroundUpdate;
