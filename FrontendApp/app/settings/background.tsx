import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BackgroundUpdate = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); //Noch speicherpunkt für Hintergrundbild bzw verwendung 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textField}>
        <Text style={styles.text}>Bild hochladen</Text>
        <Button title="Bild auswählen" onPress={pickImage} />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textField: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 150,
    marginTop: 16,
    borderRadius: 8,
  },
});

export default BackgroundUpdate;
