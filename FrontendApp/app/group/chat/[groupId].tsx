import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/globalStyles';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import apiConfig from '../../configs/apiConfig';

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && groupId) {
      sendMedia(result.assets[0].uri, String(groupId));
    }
  };

  const getUserById = async (userId: number) => {
    try {
      console.log('Fetching user with ID:', userId); 
  
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Response status:', response.status); 
  
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };
  



  const sendMedia = async (uri: string, groupId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
  
      const mediaResponse = await fetch(uri);
      const blob = await mediaResponse.blob();
      formData.append('media', blob, 'media.jpg'); 
      formData.append('groupId', groupId);
  
      const response = await fetch(`${apiConfig.BASE_URL}/api/groups/send-media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload media');
      }
  
      const data = await response.json();
      console.log('Media uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading media:', error);
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Image source={{ uri: `${apiConfig.BASE_URL}${groupImage}` }} style={styles.groupImage} />
        <Text style={styles.groupName}>{groupName}</Text>
      </View>
    );
  };


  
  return (
    <View style={[styles.container, GlobalStyles.background]}>
    <View style={[GlobalStyles.header]}>
  <TouchableOpacity onPress={() => router.push('/chats')}>
    <Ionicons name="arrow-back" size={24} color="#FFF" />
  </TouchableOpacity>
  
  {(() => {
    console.log("Group Image URL:", groupDetails?.group_image_url);
    return (
      <Image
        source={{ uri: `${apiConfig.BASE_URL}${groupDetails?.group_image_url}` }}
        style={GlobalStyles.profileImage}
      />
    );
  })()}

  <TouchableOpacity onPress={() => router.push({ pathname: `../details/${groupId}` })}>
    <Text style={GlobalStyles.title}>{groupDetails?.name}</Text>
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
                  <Text style={GlobalStyles.Bubbletext}>
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
              <Text style={GlobalStyles.Bubbletext}>
                {item.username}: 
              </Text>
              <Text style={GlobalStyles.Bubbletext}>
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
        <TouchableOpacity style={[GlobalStyles.button]} onPress={sendMessage}>
          <Text style={GlobalStyles.buttonText}>Send</Text>
        </TouchableOpacity>
        <View style={GlobalStyles.mediaOptions}>
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons name="photo" size={24} color="#FFFF" />
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
          <View style={styles.modalBackground}>
            {selectedImage && (
              <Image
                source={{ uri: `${apiConfig.BASE_URL}${selectedImage}` }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
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
  backButton: {
    padding: 10,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
});
