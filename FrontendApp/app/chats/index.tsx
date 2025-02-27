import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavigation from '../Components/BottomNavigation';
import Header from '../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';


interface Chat {
  id: number;
  friend_profile_image?: string;
  friend_username?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  type: 'private' | 'group';
  group_name?: string;
  group_image_url?: string;
}

const ChatsOverview: React.FC = () => {
  const { GlobalStyles } = useTheme();
  
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
          console.log("Fetched group chats:", groupChats);
          console.log("Fetched private chats:", privateChats);

          const combinedChats = [
            ...privateChats.map((chat: any) => ({
              ...chat,
              lastMessage: chat.lastmessage,
              lastMessageTimestamp: chat.lastmessagetime,
              type: 'private',
            })),
            ...groupChats.map((group: any) => ({
              id: group.id,
              group_name: group.group_name,
              group_image_url: group.group_image_url,
              lastMessage: group.lastmessage,
              lastMessageTimestamp: group.lastmessagetimestamp,
              type: 'group',
            })),

          ];


          console.log('Combined chats before sorting:', combinedChats);

          const sortedChats = combinedChats.sort((a, b) => {
            const dateA = new Date(a.lastMessageTimestamp).getTime();
            const dateB = new Date(b.lastMessageTimestamp).getTime();


            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return dateB - dateA;
          });

          console.log('Sorted chats:', sortedChats);
          setChats(sortedChats);
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

  const renderChat = ({ item }: { item: Chat }) => {
    const imageUrl = item.type === 'private'
      ? item.friend_profile_image?.startsWith('/')
        ? `${apiConfig.BASE_URL}${item.friend_profile_image}`
        : item.friend_profile_image
      : item.group_image_url?.startsWith('/')
        ? `${apiConfig.BASE_URL}${item.group_image_url}`
        : item.group_image_url;

    return (
      <TouchableOpacity
        style={GlobalStyles.chatItem}
        onPress={() => handleChatPress(item)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={GlobalStyles.profileImageList}
          onError={(e) => console.error('Image Load Error:', e.nativeEvent.error)}
        />
        <View style={GlobalStyles.chatDetails}>
          <Text style={GlobalStyles.friendName}>
            {item.type === 'private' ? item.friend_username : item.group_name}
          </Text>
          <Text style={GlobalStyles.lastMessage}>
            {item.lastMessage || 'No messages yet'}
            {item.lastMessageTimestamp !== '1970-01-01T00:00:00.000Z' && (
              <Text style={GlobalStyles.lastMessageTime}>
                {' '}• {new Date(item.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </Text>

        </View>
      </TouchableOpacity>
    );
  };



  return (
    <View style={GlobalStyles.container}>
      <Header />
      <View style={GlobalStyles.chatListContainer}>
        <FlatList
          data={chats}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={renderChat}
          contentContainerStyle={GlobalStyles.chatList}
          ListEmptyComponent={<Text style={GlobalStyles.emptyText}>No chats available</Text>}
        />
      </View>
      <BottomNavigation />
    </View>
    
  );
};


export default ChatsOverview;
