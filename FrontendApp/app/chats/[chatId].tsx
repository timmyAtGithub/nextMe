import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';

const Chat = () => {
  const { GlobalStyles, currentTheme } = useTheme();
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
    friend_id: number;
  }

  const openImageModal = (imageUri: string) => {
    setSelectedImage(`${imageUri}`);
    setModalVisible(true);
  };
  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  interface ChatDetails {
    friend_username: string;
    friend_id: number;
    friend_profile_image: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);


  const pickImage = async () => {
    try {
      console.log("Starting image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        console.log("Selected Image URI:", imageUri);

        await sendMedia(imageUri, Array.isArray(chatId) ? chatId[0] : chatId);
      } else {
        console.log("Image selection canceled or no URI found.");
      }
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const sendMedia = async (uri: string, chatId: string | string[]) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!uri) {
        throw new Error("Invalid URI");
      }

      console.log("Preparing to fetch media:", uri);
      const formData = new FormData();
      formData.append("media", {
        uri: uri,
        type: "image/jpeg",
        name: "media.jpg"
      } as any);
      formData.append("chatId", String(chatId));

      console.log("FormData ready:", Array.from(formData.entries()));

      const response = await fetch(`${apiConfig.BASE_URL}/api/chats/send-media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload Response Status:", response.status);

      let responseData;
      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      try {
        responseData = JSON.parse(responseText);
        console.log("Parsed response data:", responseData);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Invalid server response format");
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || `Server Error: ${response.status}`
        );
      }

      return responseData;
    } catch (error) {
      console.error("Error in sendMedia:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      Alert.alert("Error", errorMessage);
      throw error;
    }
  };
  const scrollToBottom = (animated = true) => {
    flatListRef.current?.scrollToEnd({ animated });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${apiConfig.BASE_URL}/api/auth/me`, {
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
        const response = await fetch(`${apiConfig.BASE_URL}/api/chats/details/${chatId}`, {
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
        const response = await fetch(`${apiConfig.BASE_URL}/api/chats/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 403) {
          Alert.alert('Error', 'You are not allowed to access this chat.');
          router.push('/chats');
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        Alert.alert('Error', 'An error occurred while fetching messages.');
      }
    };
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 500);

    return () => clearInterval(interval);
  }, [chatId]);


  const sendMessage = async () => {
    if (!newMessage.trim()) {
      console.error('Message is empty. Cannot send.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      console.log('Sending message with chatId:', chatId);
      console.log('Message text:', newMessage);

      const response = await fetch(`${apiConfig.BASE_URL}/api/chats/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, text: newMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Message sent successfully:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage('');
        scrollToBottom();
      } else {
        console.error('Failed to send message:', data.message || data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={[GlobalStyles.container, GlobalStyles.background]}>
 
      
      {chatDetails && (
        <View style={[GlobalStyles.header]}>
          <TouchableOpacity style={GlobalStyles.arrowBack} onPress={() => router.push('/chats')}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <Image
            source={{ uri: `${apiConfig.BASE_URL}${chatDetails.friend_profile_image}` }}
            style={GlobalStyles.headProfileImage}
          />
          <TouchableOpacity onPress={() => router.push({ pathname: `/profile/[contactId]`, params: { contactId: chatDetails.friend_id } })}>
            <Text style={GlobalStyles.headText}>{chatDetails.friend_username}</Text>
          </TouchableOpacity>
     
        </View>

      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0} >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (item.type === "media") {
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
                    source={{ uri: `${apiConfig.BASE_URL}${item.content}` }}
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
                    ? GlobalStyles.bubbleText
                    : GlobalStyles.bubbleText
                }
              >
                {item.text}
              </Text>
             
             
            </View>
          );
        }}
        contentContainerStyle={GlobalStyles.messageList}
        onContentSizeChange={() => scrollToBottom(false)}
      />
      <View style={[GlobalStyles.inputContainer]}>
        <TextInput
          style={GlobalStyles.inputChat}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={[GlobalStyles.sendButton]}
          onPress={sendMessage}
        >
          <Text style={GlobalStyles.buttonText}>Send</Text>
        </TouchableOpacity>
        <View style={GlobalStyles.mediaOptions}>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons name="photo" size={30} color="#FFFF" />
          </TouchableOpacity>
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <TouchableWithoutFeedback onPress={closeImageModal}>
            <View style={GlobalStyles.modalBackground}>
              {selectedImage ? (
                <Image
                  source={{ uri: `${apiConfig.BASE_URL}${selectedImage}` }}
                  style={GlobalStyles.fullImage}
                  resizeMode="contain"
                />
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      </KeyboardAvoidingView>
    </View>


  );
};


export default Chat;
