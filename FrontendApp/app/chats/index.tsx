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
  friend_profile_image?: string;
  friend_username?: string;
  lastMessage: string;
  type: 'private' | 'group';
  group_name?: string;
  group_image_url?: string;
}

const ChatsOverview: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<number[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const privateChatsResponse = await fetch(`${apiConfig.BASE_URL}/api/chats/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupChatsResponse = await fetch(`${apiConfig.BASE_URL}/api/groups/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (privateChatsResponse.ok && groupChatsResponse.ok) {
          const privateChats = await privateChatsResponse.json();
          const groupChats = await groupChatsResponse.json();

          const combinedChats = [
            ...privateChats.map((chat: any) => ({ ...chat, type: 'private' })),
            ...groupChats.map((group: any) => ({
              id: group.id,
              group_name: group.group_name,
              group_image_url: group.group_image_url,
              lastMessage: group.lastMessage || '',
              type: 'group',
            })),
          ];

          setChats(combinedChats);
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatPress = async (chat: Chat) => {
    if (chat.type === 'private') {
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
    } else if (chat.type === 'group') {
      router.push(`./group/chat/${chat.id}`);
    }
  };

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

<Image 
  source={{ uri: item.type === 'private' ? `${apiConfig.BASE_URL}${item.friend_profile_image}` : `${apiConfig.BASE_URL}${item.group_image_url}` }} 
  style={styles.profileImage} 
/>


      <View style={styles.chatDetails}>
        <Text style={styles.friendName}>{
          item.type === 'private' ? item.friend_username : item.group_name
        }</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chats}
        keyExtractor={(item) => `${item.type}-${item.id}`}
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
