import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PermissionExplanationScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>Camera Permission</Text>
        <Text style={styles.description}>
          This permission allows the app to access your device's camera to take photos or videos.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Storage Permission</Text>
        <Text style={styles.description}>
          This permission allows the app to access the files on your device and store data.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',  
    alignItems: 'center', 
    backgroundColor: '#111312',
    padding: 20,
  },
  box: {
    backgroundColor: '#111312',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '80%',  
    alignItems: 'center', 
    borderColor: '#D3D3D3', 
  },
  heading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',  
  },
  description: {
    color: 'white',
    fontSize: 14, 
    textAlign: 'justify',
  },
});

export default PermissionExplanationScreen;
