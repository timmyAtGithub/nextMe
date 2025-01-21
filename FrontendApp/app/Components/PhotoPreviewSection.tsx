import React, { useState, useRef } from 'react';
import { TouchableOpacity,Image,StyleSheet,View,Text,Dimensions,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,PanResponder, Platform, } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import DraggableScalableText from './DraggableScalableText';
import { randoPics } from './RandoPics';
import { useTheme } from '../settings/themeContext';


const { width, height } = Dimensions.get('window');



type PathDefinition = {
  points: { x: number; y: number }[];
  color: string;
  width: number;
};

type Photo = {
  base64?: string;
  uri: string;
};

const PhotoPreviewSection = ({ photo, handleRetakePhoto }: { photo: Photo; handleRetakePhoto: () => void }) => {
  const { GlobalStyles } = useTheme();
  const [mode, setMode] = useState<'text' | 'draw' | null>(null);
  const [paths, setPaths] = useState<PathDefinition[]>([]);
  const [currentPath, setCurrentPath] = useState<PathDefinition | null>(null);
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedFont, setSelectedFont] = useState('System');
  const [textElements, setTextElements] = useState<
    { id: string; text: string; fontFamily: string; isEditing: boolean; initialX: number; initialY: number }[]
  >([]);

  const colors = [
    'red',
    '#FF69B4',
    '#FFA500',
    '#FFFF00',
    '#00FF00',
    '#00FFFF',
    '#0000FF',
    '#800080',
  ];

  const imageContainerRef = useRef<View>(null);

  const pointsToSvgPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return (
      `M ${points[0].x},${points[0].y} ` +
      points.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ')
    );
  };

  const drawingPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => mode === 'draw',
    onMoveShouldSetPanResponder: () => mode === 'draw',

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath({
        points: [{ x: locationX, y: locationY }],
        color: selectedColor,
        width: 3,
      });
    },

    onPanResponderMove: (evt) => {
      if (!currentPath) return;
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, { x: locationX, y: locationY }],
      });
    },

    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths((prev) => [...prev, currentPath]);
        setCurrentPath(null);
      }
    },
  });

  const handleAddText = () => {
    setTextElements((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: '',
        fontFamily: selectedFont,
        isEditing: true,
        initialX: 0,
        initialY: height / 4,
      },
    ]);
  };


  const handleUpdateText = (id: string, newText: string) => {
    setTextElements((prev) =>
      prev.map((elem) => (elem.id === id ? { ...elem, text: newText } : elem))
    );
  };

  const handleChangeFont = (id: string, newFont: string) => {
    setTextElements((prev) =>
      prev.map((elem) =>
        elem.id === id
          ? {
            ...elem,
            fontFamily: newFont,
          }
          : elem
      )
    );
  };

  const handleSendPhoto = async () => {
    try {
      console.log('Start handleSendPhoto');

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera roll is required!');
        return;
      }

      console.log('Permissions granted');

      const localUri = await captureRef(imageContainerRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      console.log('Image captured:', localUri);

      if (localUri) {
        const asset = await MediaLibrary.createAssetAsync(localUri);
        console.log('Image saved to gallery:', asset.uri);
        const imageFile = {
          uri: localUri,
          type: 'image/png',
          name: `photo-${Date.now()}.png`
        };

        await randoPics(imageFile);
        console.log('LocationHandler completed');
      }
    } catch (error) {
      console.error('Error in handleSendPhoto:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={GlobalStyles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={GlobalStyles.headerRandoPics}>
            <TouchableOpacity onPress={handleRetakePhoto}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFont('Arial')}
              style={GlobalStyles.toolButton}
            >
              <Text style={{ color: 'white' }}>Arial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Courier')}
              style={GlobalStyles.toolButton}
            >
              <Text style={{ color: 'white' }}>Courier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Times')}
              style={GlobalStyles.toolButton}
            >
              <Text style={{ color: 'white' }}>Times</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Verdana')}
              style={GlobalStyles.toolButton}
            >
              <Text style={{ color: 'white' }}>Verdana</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddText} style={GlobalStyles.toolButton}>
              <MaterialIcons name="text-fields" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode(mode === 'draw' ? null : 'draw')}
              style={GlobalStyles.toolButton}
            >
              <MaterialIcons name="brush" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={GlobalStyles.imageContainer}
            {...drawingPanResponder.panHandlers}
            ref={imageContainerRef}
          >
            <Image
              style={GlobalStyles.image}
              source={{
                uri: photo.base64
                  ? `data:image/jpg;base64,${photo.base64}`
                  : photo.uri,
              }}
            />
            {paths.map((path, index) => {
              const d = pointsToSvgPath(path.points);
              return (
                <Svg key={index} style={StyleSheet.absoluteFill}>
                  <Path
                    d={d}
                    stroke={path.color}
                    strokeWidth={path.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              );
            })}

            {currentPath && (
              <Svg style={StyleSheet.absoluteFill}>
                <Path
                  d={pointsToSvgPath(currentPath.points)}
                  stroke={currentPath.color}
                  strokeWidth={currentPath.width}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
            {textElements.map((element) => (
              <DraggableScalableText
                key={element.id}
                text={element.text}
                fontFamily={element.fontFamily}
                isEditing={element.isEditing}
                setIsEditing={(isEditing) => {
                  if (!isEditing) setSelectedFont(element.fontFamily);
                  handleChangeFont(element.id, selectedFont);
                }}
                onUpdateText={(newText) => handleUpdateText(element.id, newText)}
                initialX={element.initialX}
                initialY={element.initialY}
              />
            ))}

          </View>
          {mode === 'draw' && (
            <View style={GlobalStyles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[GlobalStyles.colorOption, { backgroundColor: color }]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          )}

          <View>
            <TouchableOpacity style={GlobalStyles.sendButtonRando} onPress={handleSendPhoto}>
              <Text style={GlobalStyles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};
export default PhotoPreviewSection;
