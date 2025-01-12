import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();

  interface Message {
    id: number;
    text: string;
    sender_id: number;
    created_at: string;
  }

  interface ChatDetails {
    friend_username: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchChatDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/chats/details/${chatId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setChatDetails(data);
        } else {
          console.error('Failed to fetch chat details');
        }
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };

    fetchUserId();
    fetchChatDetails();
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/chats/messages/${chatId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 403) {
                console.error('Access denied to this chat');
                router.push('/chats');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    fetchMessages();
    const interval = setInterval(() => {
        fetchMessages();
    }, 5000); 

    return () => clearInterval(interval);
}, [chatId]);


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chats/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, text: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      {chatDetails && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/chats')}>
            <Text style={styles.backButton}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{chatDetails.friend_username}</Text>
        </View>
      )}
<FlatList
  data={messages}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View
      style={[
        styles.messageItem,
        item.sender_id === userId ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  )}
  contentContainerStyle={styles.messageList}
/>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1E1E',
  },
  text: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 10,
    color: '#555555',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Chat;
