import 'react-native-gesture-handler';
import React, { useRef, useState } from 'react';
import {Button,Text,TouchableOpacity,View,} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import PhotoPreviewSection from '../Components/PhotoPreviewSection';
import BottomNavigation from '../Components/BottomNavigation';
import { useTheme } from '../settings/themeContext';


export default function Camera() {
  const { GlobalStyles } = useTheme();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={GlobalStyles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!mediaLibraryPermission.granted) {
    return (
      <View style={GlobalStyles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to save photos to your gallery</Text>
        <Button onPress={requestMediaLibraryPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PhotoPreviewSection
          photo={photo}
          handleRetakePhoto={handleRetakePhoto}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={GlobalStyles.container}>
        <CameraView style={GlobalStyles.camera} facing={facing} ref={cameraRef}>
          <View style={GlobalStyles.takePhotoContainer}>
            <TouchableOpacity style={GlobalStyles.toggleButton} onPress={toggleCameraFacing}>
              <AntDesign name="retweet" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.takePhotoButton} onPress={handleTakePhoto}>
              <AntDesign name="camera" size={44} color="black" />
            </TouchableOpacity>
          </View>
        </CameraView>
        <BottomNavigation />
      </View>
    </GestureHandlerRootView>
  );
}
