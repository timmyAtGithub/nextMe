import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Überprüfen, ob Benachrichtigungen aktiviert sind, wenn die App geöffnet wird.
    Notifications.getPermissionsAsync().then(({ status }) => {
      setIsEnabled(status === 'granted');
    });
  }, []);

  const toggleSwitch = async () => {
    if (isEnabled) {
      // Benachrichtigungen deaktivieren
      await Notifications.setNotificationHandler({
        handleNotification: async () => {
          // Keine Benachrichtigung anzeigen
          return { shouldShowAlert: false, shouldPlaySound: false, shouldSetBadge: false };
        },
      });
    } else {
      // Benachrichtigungen aktivieren
      await Notifications.setNotificationHandler({
        handleNotification: async () => {
          // Benachrichtigungen anzeigen
          return { shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true };
        },
      });
    }
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Benachrichtigungen aktivieren:</Text>
      <Switch
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111312',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
        color:'white',
      fontSize: 18,
      marginBottom: 20,
    },
  });


export default NotificationSettings;
