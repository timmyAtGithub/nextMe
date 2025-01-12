import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../styles/globalStyles';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Chat = () => {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);


  interface Message {
    id: number;
    text: string;
    sender_id: number;
    created_at: string;
    content?: string;
    type?: string;
  }

  const openImageModal = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };
  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  interface ChatDetails {
    friend_username: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); 
  const [isModalVisible, setModalVisible] = useState(false);
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      sendMedia(result.assets[0].uri, Array.isArray(chatId) ? chatId[0] : chatId);
    }
  };

  const sendMedia = async (uri: string, chatId: string) => {
    try {
      console.log("--- Sending Media ---");
      console.log("Media URI:", uri);
      console.log("Chat ID:", chatId);
  
      const formData = new FormData();
  
      console.log("Fetching media blob...");
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob fetched:", blob);
  
      formData.append("media", blob, "media.jpg");
      formData.append("chatId", String(chatId));
      console.log("FormData prepared:", Array.from(formData.entries()));

      const token = await AsyncStorage.getItem('token');
      console.log("Token being used:", token);
      
  
      console.log("Sending request to server...");
      const res = await fetch("http://localhost:5000/api/chats/send-media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      console.log("Server responded with status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
  
      if (res.ok) {
        console.log("Media sent successfully:", data);
      } else {
        console.error("Error sending media:", data.message);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  const scrollToBottom = (animated = true) => {
      flatListRef.current?.scrollToEnd({ animated });
  };

  

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
    }, 500); 

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
        scrollToBottom();
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <View style={[styles.container, GlobalStyles.background]}>
    {chatDetails && (
      <View style={[GlobalStyles.header]}>
        <TouchableOpacity onPress={() => router.push('/chats')}>
         <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Image
          source={{ uri: chatDetails.friend_profile_image }}
          style={GlobalStyles.profileImage}
        />
        <Text style={GlobalStyles.title}>{chatDetails.friend_username}</Text>
      </View>
    )}
<FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    console.log('Rendering Item:', item);
    console.log('Rendering Item Type:', item.type);
    if (item.type === "media") {
      console.log('Media content:', item.content);
      return (
        <View
          style={
            item.sender_id === userId
              ? GlobalStyles.rightBubble
              : GlobalStyles.leftBubble
          }
        >
          <TouchableOpacity onPress={() => openImageModal(item.content)}>
            <Image
              source={{ uri: item.content }}
              style={GlobalStyles.media}
              resizeMode="cover"
              onError={(e) =>
                console.error('Image load error:', e.nativeEvent.error)
              }
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View
        style={
          item.sender_id === userId
            ? GlobalStyles.rightBubble
            : GlobalStyles.leftBubble
        }
      >
        <Text
          style={
            item.sender_id === userId
              ? GlobalStyles.Bubbletext
              : GlobalStyles.Bubbletext
          }
        >
          {item.text}
        </Text>
      </View>
    );
  }}
  contentContainerStyle={styles.messageList}
  onContentSizeChange={() => scrollToBottom(false)}
/>

    <View style={[GlobalStyles.inputContainer]}>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
        placeholderTextColor="#888"
      />
      <TouchableOpacity
        style={[GlobalStyles.button]}
        onPress={sendMessage}
      >
        <Text style={GlobalStyles.buttonText}>Send</Text>
      </TouchableOpacity>
      <View style={GlobalStyles.mediaOptions}>
  <TouchableOpacity onPress={pickImage}>
    <MaterialIcons name="photo" size={24} color="#FFFF" />
  </TouchableOpacity>
      </View>
      <Modal
  visible={isModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={closeImageModal}
>
  <TouchableWithoutFeedback onPress={closeImageModal}>
    <View style={styles.modalBackground}>
      {selectedImage ? (
        <Image
          source={{ uri: selectedImage }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      ) : null}
    </View>
  </TouchableWithoutFeedback>
</Modal>
    </View>
  </View>
     

  );
};
  

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backButton: {
      fontSize: 18,
      color: '#007AFF',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 10,
    },
    messageList: {
      flexGrow: 1,
      padding: 10,
      paddingBottom: 20,
    },
    messageItem: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: '90%',
      height: '90%',
    },
    
});

export default Chat;
