import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import apiConfig from '../configs/apiConfig';
import BottomNavigation from '../Components/BottomNavigation';
import Header from '../Components/Header';

interface Picture {
  id: string;
  profile_image: string;
  username: string;
  sent_at: string;
}

const PicturesScreen: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPictures = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiConfig.BASE_URL}/api/rando-pics/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPictures(response.data);
      console.log('Fetched pictures:', response.data);
    } catch (err) {
      console.error('Error fetching pictures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* Liste */}
      <View style={styles.listContainer}>
        <FlatList
          data={pictures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pictureContainer}
              onPress={() =>
                router.push({
                  pathname: `./pictures/detail/${item.id}`,
                })
              }
            >
              <Image source={{ uri: `${apiConfig.BASE_URL}${item.profile_image}` }} style={styles.profileImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.time}>{new Date(item.sent_at).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContainer: {
    flex: 1, 
    marginTop: '16%', 
    marginBottom: '10%',
  },
  pictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
  time: {
    color: '#bbb',
    fontSize: 12,
  },
});

export default PicturesScreen;
