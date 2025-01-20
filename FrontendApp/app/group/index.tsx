import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../settings/themeContext';



const GroupMain = () => {
  const { GlobalStyles } = useTheme();
  const router = useRouter();

  return (
    <View style={GlobalStyles.container}>
      <TouchableOpacity
        style={GlobalStyles.createButton}
        onPress={() => router.push('../groups/selectFriends')}
      >
        <Text style={GlobalStyles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};
export default GroupMain;
