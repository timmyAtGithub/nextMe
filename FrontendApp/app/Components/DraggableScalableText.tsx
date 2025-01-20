import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../settings/themeContext';


const { width } = Dimensions.get('window');



const FONTS_WITH_BORDER = ['Arial', 'Courier', 'Times', 'Verdana'];

const DraggableScalableText = (
  
  {
  text,
  fontFamily,
  onUpdateText,
  isEditing,
  setIsEditing,
  initialX,
  initialY,
}: {
  text: string;
  fontFamily: string;
  onUpdateText: (text: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  initialX: number;
  initialY: number;
}) => {
  const { GlobalStyles } = useTheme();
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const rotation = useSharedValue(0);

  const hasBorder = FONTS_WITH_BORDER.includes(fontFamily);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = hasBorder ? 0 : event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      if (hasBorder) {
        translateX.value = 0;
      }
    });

  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    if (!hasBorder) {
      rotation.value = event.scale;
    }
  });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          GlobalStyles.draggableText,
          animatedStyle,
          hasBorder && GlobalStyles.textWithBorder,
        ]}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => setIsEditing(true)}>
          <View style={GlobalStyles.textBoxFullWidth}>
            {isEditing ? (
              <TextInput
                style={[
                  GlobalStyles.textElement,
                  {
                    fontFamily,
                    maxWidth: width - 20,
                  },
                ]}
                autoFocus
                value={text}
                onChangeText={onUpdateText}
                onBlur={() => setIsEditing(false)}
                multiline
                scrollEnabled={false}
              />
            ) : (
              <Text
                style={[
                  GlobalStyles.textElement,
                  {
                    fontFamily,
                    maxWidth: width - 20,
                  },
                ]}
              >
                {text || 'Tap to add text'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableScalableText;
