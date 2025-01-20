import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import apiConfig from '../configs/apiConfig';
import BottomNavigation from '../Components/BottomNavigation';
import Header from '../Components/Header';
import { useTheme } from '../settings/themeContext';


interface Picture {
  id: string;
  profile_image: string;
  username: string;
  sent_at: string;
}

const PicturesScreen: React.FC = () => {
  const { GlobalStyles } = useTheme();

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
      <View style={[GlobalStyles.container, GlobalStyles.loadingContainerPics]}>
        <Text style={GlobalStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <Header />
      <View style={GlobalStyles.contentContainerPics}>
        <FlatList
          data={pictures}
          keyExtractor={(item) => item.id}
          contentContainerStyle={GlobalStyles.listContentPics}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={GlobalStyles.pictureItemPics}
              onPress={() =>
                router.push({
                  pathname: `./pictures/detail/${item.id}`,
                })
              }
            >
              <Image 
                source={{ uri: `${apiConfig.BASE_URL}${item.profile_image}` }} 
                style={GlobalStyles.profileImage} 
              />
              <View style={GlobalStyles.infoContainer}>
                <Text style={GlobalStyles.username}>{item.username}</Text>
                <Text style={GlobalStyles.time}>
                  {new Date(item.sent_at).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <BottomNavigation />
    </View>
  );
};

export default PicturesScreen;  