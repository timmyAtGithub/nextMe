import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';

const ChatOverview: React.FC = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        const response = await fetch('http://localhost:5000/api/chats/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const renderChat = ({ item }: { item: { id: string; name: string; lastMessage: string; time: string } }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chats/${item.id}`)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.message}>{item.lastMessage}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E' },
  listContainer: { padding: 10 },
  chatItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  name: { fontWeight: 'bold', fontSize: 16, color: '#FFF' },
  message: { color: 'gray', flex: 1 },
  time: { color: 'gray' },
});

export default ChatOverview;
