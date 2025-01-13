import { Fontisto, AntDesign } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text } from 'react-native';

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
  handleSavePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleSavePhoto: () => void;
}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.box}>
      <Image
        style={styles.previewContainer}
        source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
      />
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
        <Fontisto name="trash" size={36} color="black" />
        <Text>Leck Eier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSavePhoto}>
        <AntDesign name="save" size={36} color="black" />
        <Text>Speechern</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderRadius: 10,
    padding: 1,
    width: '95%',
    height: '85%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '95%',
    height: '85%',
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
});

export default PhotoPreviewSection;
