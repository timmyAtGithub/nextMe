import * as Location from 'expo-location';
import axios from 'axios';
import apiConfig from '../configs/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageFile {
    uri: string;
    type: string;
    name: string;
  }
  
  export const randoPics = async (imageFile: ImageFile) => {
      try {
          console.log('Standort und Upload werden verarbeitet...');
  
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              alert('Standortzugriff erforderlich, um das Bild zu senden.');
              return;
          }
  
          console.log('Standortberechtigung erteilt.');
  
          const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
          });
  
          const { latitude, longitude } = location.coords;
          console.log('Standort abgerufen:', { latitude, longitude });
  
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              alert('Token nicht gefunden. Bitte melde dich erneut an.');
              return;
          }
  
          console.log('Token abgerufen:', token);
  
          const formData = new FormData();
          formData.append('image', {
              uri: imageFile.uri,
              type: imageFile.type,
              name: imageFile.name,
          } as any);
          formData.append('latitude', latitude.toString());
          formData.append('longitude', longitude.toString());
  
          console.log('FormData erstellt:', formData);
  
          const response = await axios.post(`${apiConfig.BASE_URL}/api/rando-pics/send`, formData, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
              },
          });

        console.log('API-Antwort erhalten:', response.data);

        if (response.data.recipients && response.data.recipients.length > 0) {
            alert(
                `Bild wurde an folgende Benutzer gesendet:\n${response.data.recipients.join(', ')}`
            );
        } else {
            alert('Kein Benutzer in der Nähe gefunden.');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Fehler beim Senden:', error.response?.data || error.message);
        } else {
            console.error('Fehler beim Senden:', (error as Error).message);
        }
        alert('Es gab einen Fehler beim Senden des Bildes.');
    } finally {
        console.log('Vorgang abgeschlossen.');
    }
};
