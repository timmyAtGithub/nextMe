import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '../Components/BottomNavigation';
import Header from '../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatsOverview: React.FC = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/chats/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  interface Chat {
    id: number;
    friend_profile_image: string;
    friend_username: string;
    lastMessage: string;
  }

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chats/${item.id}`)}
    >
      <Image source={{ uri: item.friend_profile_image }} style={styles.profileImage} />
      <View style={styles.chatDetails}>
        <Text style={styles.friendName}>{item.friend_username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Chats List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChat}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats available</Text>}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatList: {
    flexGrow: 1,
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  friendName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#AAAAAA',
    marginTop: 5,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatsOverview;
