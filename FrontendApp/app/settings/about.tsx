import React from 'react';
import { View, Text } from 'react-native';
import { getGlobalStyles } from '../styles/globalStyles';
import { useColorScheme } from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const GlobalStyles = getGlobalStyles(isDarkMode);

const VersionText = () => {
  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.versiontextField}>
        <Text style={GlobalStyles.textversion}>Beta Version</Text>
      </View>
    </View>
  );
};


export default VersionText;
