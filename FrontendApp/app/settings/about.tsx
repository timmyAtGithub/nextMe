import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VersionText = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textField}>
        <Text style={styles.text}>Beta Version</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textField: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default VersionText;
