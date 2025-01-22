import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { getGlobalStyles } from '../styles/globalStyles';
import { useColorScheme } from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const GlobalStyles = getGlobalStyles(isDarkMode);

const TextWithTitleScreen = () => {
  return (
    <ScrollView contentContainerStyle={GlobalStyles.container}>
      <View style={GlobalStyles.headerContainer}>
        <Text style={GlobalStyles.headerText}>How the app works</Text>
      </View>
      <View style={GlobalStyles.textContainer}>
        <Text style={GlobalStyles.bodyText}>
        Ah, so you’ve finally found that groundbreaking app that lets you share pictures with total strangers near you? How exciting! No more keeping your moments to yourself – after all, nothing’s safer than the idea that everyone around you must know what you’re eating, where you are, or how you’ve been photographed in that perfectly angled shot. All you have to do is choose a photo (hopefully not the embarrassing one you took yesterday), and then – tada! – with a simple click on "Share," it’s already in the hands of strangers roaming nearby.

Of course, the “Near Me” feature ensures you’re instantly connected with people you’ll never want to see again. Who needs private albums when you can experience the magic of public life up close? And don’t worry, your privacy is absolutely secure – after all, you voluntarily uploaded the photo, and who would question if someone else shares the same picture in a few minutes? Have fun posting your most intimate moments – and remember, in a few years, you might wonder why you’re no longer safe in any app.
        </Text>
      </View>
    </ScrollView>
  );
};
export default TextWithTitleScreen;
