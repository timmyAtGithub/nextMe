import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '../Components/BottomNavigation';
import Header from '../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../configs/apiConfig';

interface Chat {
  id: number;
  friend_profile_image: string;
  friend_username: string;
  lastMessage: string;
}

const ChatsOverview: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${apiConfig.BASE_URL}/api/chats/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const checkIsFriend = async (friendId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/is-friend/${friendId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        return data.isFriend;
      } else {
        console.error('Failed to check friendship status');
        return false;
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
      return false;
    }
  };

  const getFriendId = async (chatId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/getFriendIdFromChat/${chatId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.friendId;
      } else {
        console.error('Failed to fetch friendId');
        return null;
      }
    } catch (error) {
      console.error('Error fetching friendId:', error);
      return null;
    }
  };
  

  const handleChatPress = async (chat: Chat) => {

    console.log('Chat pressed:', chat.id);
    const isFriend = await checkIsFriend(chat.id);
    const friendId = await getFriendId(chat.id);
    if (!isFriend) {
      Alert.alert(
        "Not Friends",
        "Do you want to send a friend request?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Send Request",
            onPress: () => sendFriendRequest(friendId), 
          },
        ]
      );
    } else {
      router.push(`/chats/${chat.id}`);
    }
  };
  
  const sendFriendRequest = async (friendId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/add-friend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: friendId }),
      });

      if (response.ok) {
        console.log('Friend request sent to:', friendId);
        setSentRequests((prev) => [...prev, friendId]); 
      } else {
        console.error('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <Image source={{ uri: item.friend_profile_image }} style={styles.profileImage} />
      <View style={styles.chatDetails}>
        <Text style={styles.friendName}>{item.friend_username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChat}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats available</Text>}
      />
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatList: {
    flexGrow: 1,
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  friendName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#AAAAAA',
    marginTop: 5,
  },
  emptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatsOverview;
