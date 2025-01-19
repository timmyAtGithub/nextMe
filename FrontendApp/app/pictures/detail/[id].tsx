import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import apiConfig from '@/app/configs/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


const PictureDetail: React.FC = () => {
  const { id } = useLocalSearchParams(); 
  const [picture, setPicture] = useState<{id: number; profile_image: string; username: string; image_url: string; sender_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiConfig.BASE_URL}/api/rando-pics/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPicture(response.data);
      } catch (error) {
        console.error('Error fetching picture details:', error);
      } finally {
        setLoading(false);
      }
    };
   
    if (id) {
      fetchPicture();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!picture) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Picture not found.</Text>
      </View>
    );
  }
  console.log('Picture:', picture);
  const removePicture = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${apiConfig.BASE_URL}/api/rando-pics/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      console.log(`Picture with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting picture:', (error as any).message);
    } finally {
      router.push('/pictures'); 
    }
  };
  

  const handleReport = async () => {
    Alert.alert(
      'Report Picture', 
      'Are you sure you want to report and block this user?',
      [
        {
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('Report cancelled.'),
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              
              const reportResponse = await fetch(`${apiConfig.BASE_URL}/api/rando-pics/report`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  pictureId: picture.id,
                  pictureUrl: picture.image_url,
                  senderId: picture.sender_id,
                }),
              });
  
              if (!reportResponse.ok) {
                console.error('Failed to report picture.');
                alert('Failed to report the picture.');
                return;
              }
              
              console.log('Picture reported successfully.');
  
              const blockResponse = await fetch(`${apiConfig.BASE_URL}/api/user/block-user`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blockedId: picture.sender_id }),
              });
  
              if (blockResponse.ok) {
                console.log('User blocked successfully.');
                alert('Picture has been reported and the user has been blocked.');
              } else {
                console.error('Failed to block user.');
                alert('Failed to block the user.');
              }
            } catch (error) {
              console.error('Error reporting or blocking user:', error);
              alert('An error occurred while reporting and blocking the user.');
            }
          },
        },
      ]
    );
  };
  
  
  const handleAddFriend = async (friendId: string) => { 
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/add-friend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: friendId }),
      });
  
      if (response.ok) {
        console.log('Friend request sent to:', friendId);
        setSentRequests((prev) => [...prev, friendId]); 
      } else {
        console.error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  const handleBack = async () => {
    if (id && typeof id === 'string') {
      await removePicture(id);
    }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.usernameContainer}>
          <Image source={{ uri: `${apiConfig.BASE_URL}${picture.profile_image}` }} style={styles.profileImage} />
          <Text style={styles.username}>{picture.username}</Text>
        </View>
        <View style={styles.icons}>
          <TouchableOpacity onPress={handleReport} style={styles.iconButton}>
            <Icon name="report" size={24} color="#FF4136" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAddFriend(picture.sender_id)} style={styles.iconButton}>
            <Icon name="person-add" size={24} color="#2ECC40" />
          </TouchableOpacity>
        </View>
      </View>

      
      <TouchableOpacity style={styles.pictureContainer} onPress={handleBack}>
        <Image source={{ uri: `${apiConfig.BASE_URL}${picture.image_url}` }} style={styles.image} />
  	  </TouchableOpacity>



     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
  icons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  pictureContainer: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  caption: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  replyContainer: {
    position: 'absolute',
    bottom: 60,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  replyInput: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default PictureDetail;
