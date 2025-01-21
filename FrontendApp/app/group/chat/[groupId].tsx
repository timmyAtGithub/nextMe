import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Modal, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import apiConfig from '../../configs/apiConfig';
import { useTheme } from '@/app/settings/themeContext';


interface Message {
  id: number;
  text: string;
  sender_id: number;
  created_at: string;
  content?: string;
  type?: string;
  sender_name: string;
}

interface GroupDetails {
  name: string;
  group_image_url: string;
  members: {
    id: number;
    name: string;
    profile_image?: string;
  }[];
}

interface ChatHeaderProps {
  groupName: string;
  groupImage: string;
  onBack: () => void;
}

const GroupChat = () => {
  const { GlobalStyles, currentTheme } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
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

        await sendMedia(imageUri, Array.isArray(groupId) ? groupId[0] : groupId);
      } else {
        console.log("Image selection canceled or no URI found.");
      }
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const sendMedia = async (uri: string, groupId: string | string[]) => {
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
      formData.append("groupId", String(groupId));

      console.log("FormData ready:", Array.from(formData.entries()));

      const response = await fetch(`${apiConfig.BASE_URL}/api/groups/send-media`, {
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
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(
          `${apiConfig.BASE_URL}/api/groups/details/${groupId}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response status for group details:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched group details:", data);
          setGroupDetails(data);
        } else {
          console.error('Failed to fetch group details');
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    if (groupId) fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {


        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Token not found in AsyncStorage');
          Alert.alert('Error', 'You are not logged in.');
          return;
        }
        const response = await fetch(

          `${apiConfig.BASE_URL}/api/groups/messagesWithName/${groupId}`,
          {

            headers: { Authorization: `Bearer ${token}` },
          }
        );



        if (!response.ok) {
          console.error('Failed to fetch messages. Status:', response.status);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();


        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        Alert.alert('Error', 'An error occurred while fetching messages.');
      }
    };

    if (groupId) {
      console.log('Initializing message fetch for groupId:', groupId);
      fetchMessages();

      const interval = setInterval(() => {
        console.log('Interval triggered. Fetching messages...');
        fetchMessages();
      }, 2000);

      return () => {
        console.log('Clearing interval for message fetching');
        clearInterval(interval);
      };
    }
  }, [groupId]);


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

      const response = await fetch(`${apiConfig.BASE_URL}/api/groups/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, text: newMessage }),
      });

      const data = await response.json();
      if (response.ok) {
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

  const openImageModal = (content: string) => {
    setSelectedImage(content);
    setModalVisible(true);
  };


  const ChatHeader: React.FC<ChatHeaderProps> = ({ groupName, groupImage, onBack }) => {

    return (
      <View style={GlobalStyles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={GlobalStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.text}/>
        </TouchableOpacity>
        <Image source={{ uri: `${apiConfig.BASE_URL}${groupImage}` }} style={GlobalStyles.groupImage} />
        <Text style={GlobalStyles.groupName}>{groupName}</Text>
      </View>
    );
  };



  return (
    
    <View style={[GlobalStyles.container, GlobalStyles.background]}>
      <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={35} 
>
      <View style={[GlobalStyles.header]}>
        <TouchableOpacity onPress={() => router.push('/chats')}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>

        {(() => {
          console.log("Group Image URL:", groupDetails?.group_image_url);
          return (
            <Image
              source={{ uri: `${apiConfig.BASE_URL}${groupDetails?.group_image_url}` }}
              style={GlobalStyles.headProfileImage}
            />
          );
        })()}

        <TouchableOpacity onPress={() => router.push({ pathname: `../details/${groupId}` })}>
          <Text style={GlobalStyles.headText}>{groupDetails?.name}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isMyMessage = item.user_id === userId;

          if (item.type === 'media') {
            return (
              <View style={isMyMessage ? GlobalStyles.rightBubble : GlobalStyles.leftBubble}>
                <Text style={GlobalStyles.bubbleText}>
                  {item.username}:
                </Text>
                <TouchableOpacity onPress={() => openImageModal(item.content ?? '')}>
                  <Image source={{ uri: `${apiConfig.BASE_URL}${item.content}` }} style={GlobalStyles.media} />
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <View style={isMyMessage ? GlobalStyles.rightBubble : GlobalStyles.leftBubble}>
              <Text style={GlobalStyles.bubbleText}>
                {item.username}:
              </Text>
              <Text style={GlobalStyles.bubbleText}>
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
        <TouchableOpacity style={[GlobalStyles.sendButton]} onPress={sendMessage}>
          <Text style={GlobalStyles.buttonText}>Send</Text>
        </TouchableOpacity>
        <View style={GlobalStyles.mediaOptions}>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons name="photo" size={30} color="#FFFF" />
          </TouchableOpacity>
        </View>
      </View>

      

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={GlobalStyles.modalBackground}>
            {selectedImage && (
              <Image
                source={{ uri: `${apiConfig.BASE_URL}${selectedImage}` }}
                style={GlobalStyles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default GroupChat;

