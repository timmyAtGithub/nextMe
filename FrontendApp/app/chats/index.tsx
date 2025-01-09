import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const chats = [
  { id: '1', name: 'Markus', message: "That's great", time: '10:05 AM' },
  { id: '2', name: 'Luna', message: 'Okay see ya!', time: '10:04 AM' },
];

const ChatOverview: React.FC = () => {
  const router = useRouter();

  const renderChat = ({ item }: { item: { id: string; name: string; message: string; time: string } }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chats/${item.id}`)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderChat}
      keyExtractor={(item) => item.id}
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
