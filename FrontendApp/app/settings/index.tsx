import React from 'react'; 
import { StyleSheet, View, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Notifications & Chat" onPress={() => {}} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Data & Storage" onPress={() => {}} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Help" onPress={() => {}} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Passwort ändern" onPress={() => router.push('./settings/changePassword')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="About" onPress={() => router.push('./settings/about')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="App-Theme" onPress={() => router.push('./settings/apptheme')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Support kontaktieren" onPress={() => {}} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Abmelden" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginBottom: 16,
  },
});

export default SettingsScreen;
