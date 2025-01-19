import React, { useState, useRef } from 'react';
import { TouchableOpacity,Image,StyleSheet,View,Text,Dimensions,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,PanResponder, Platform, } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import DraggableScalableText from './DraggableScalableText';
import { randoPics } from './RandoPics';

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
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleRetakePhoto}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFont('Arial')}
              style={styles.toolButton}
            >
              <Text style={{ color: 'white' }}>Arial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Courier')}
              style={styles.toolButton}
            >
              <Text style={{ color: 'white' }}>Courier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Times')}
              style={styles.toolButton}
            >
              <Text style={{ color: 'white' }}>Times</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFont('Verdana')}
              style={styles.toolButton}
            >
              <Text style={{ color: 'white' }}>Verdana</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddText} style={styles.toolButton}>
              <MaterialIcons name="text-fields" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode(mode === 'draw' ? null : 'draw')}
              style={styles.toolButton}
            >
              <MaterialIcons name="brush" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={styles.imageContainer}
            {...drawingPanResponder.panHandlers}
            ref={imageContainerRef}
          >
            <Image
              style={styles.image}
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
            <View style={styles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          )}

          <View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendPhoto}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  toolButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 5,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    margin: 0,
    padding: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 'auto',
    resizeMode: 'cover',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  draggableText: {
    position: 'absolute',
    zIndex: 10,
  },
  textElement: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    padding: 5,
  },
  textWithBorder: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: width,
  },
  textBoxFullWidth: {
    alignSelf: 'center',
  },
});


export default PhotoPreviewSection;
