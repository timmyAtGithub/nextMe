import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


const { width } = Dimensions.get('window');

const FONTS_WITH_BORDER = ['Arial', 'Courier', 'Times', 'Verdana'];

const DraggableScalableText = ({
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
          styles.draggableText,
          animatedStyle,
          hasBorder && styles.textWithBorder,
        ]}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => setIsEditing(true)}>
          <View style={styles.textBoxFullWidth}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.textElement,
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
                  styles.textElement,
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

const styles = StyleSheet.create({
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

export default DraggableScalableText;
