import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ChatPerson: React.FC = () => {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chats/messages/${chatId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);


  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await fetch('http://localhost:5000/api/chats/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, senderId: 1, text: newMessage }), 
        });

        const data = await response.json();
        setMessages([...messages, data]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>Chat ID: {chatId}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={item.sender_id === 1 ? styles.myMessage : styles.theirMessage}>{item.text}</Text>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  chatHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  myMessage: { alignSelf: 'flex-end', padding: 10, backgroundColor: '#DCF8C6', margin: 5 },
  theirMessage: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#ECECEC', margin: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 5 },
});

export default ChatPerson;
