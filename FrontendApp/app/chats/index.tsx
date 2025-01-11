import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ChatOverview: React.FC = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chats/1'); // Beispiel-Benutzer-ID
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
    <FlatList
      data={chats}
      renderItem={renderChat}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  chatItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  name: { fontWeight: 'bold', fontSize: 16 },
  message: { color: 'gray', flex: 1 },
  time: { color: 'gray' },
});

export default ChatOverview;
