import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ChatPerson: React.FC = () => {
  const { chatId } = useLocalSearchParams(); // Holen des `chatId`-Parameters aus der URL
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey, how are you?', fromMe: false },
    { id: '2', text: 'I am good, thanks!', fromMe: true },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: newMessage, fromMe: true }]);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>Chat ID: {chatId}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={item.fromMe ? styles.myMessage : styles.theirMessage}>{item.text}</Text>
        )}
        keyExtractor={(item) => item.id}
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
