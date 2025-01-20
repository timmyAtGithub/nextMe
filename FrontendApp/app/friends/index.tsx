import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../Components/Header';
import BottomNavigation from '../Components/BottomNavigation';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';

const Friends: React.FC = () => {
   const { GlobalStyles } = useTheme();
  const [friends, setFriends] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<{ id: string | number; profile_image: string; sender_name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const openOrCreateChat = async (friendId: string | number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/chats/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        const chatData = await response.json();
        router.push(`../chats/${chatData.id}`);
      } else {
        console.error('Failed to open or create chat');
      }
    } catch (error) {
      console.error('Error opening or creating chat:', error);
    }
  };
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const requestsResponse = await fetch(`${apiConfig.BASE_URL}/api/user/friend-requests`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setFriendRequests(requestsData);
        }

        const friendsResponse = await fetch(`${apiConfig.BASE_URL}/api/user/friends`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData);
        }
      } catch (err) {
        console.error('Error fetching friends or friend requests:', err);
      }
    };

    fetchFriendsAndRequests();
  }, []);

  const respondToRequest = async (requestId: string | number, action: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/friend-requests/respond`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
        if (action === 'accepted') {
          const addedFriend = await response.json();
          setFriends((prev) => [...prev, addedFriend]);
        }
      }
    } catch (err) {
      console.error('Error responding to friend request:', err);
    }
  };

  const renderFriendRequest = ({ item }: { item: { id: string | number; profile_image: string; sender_name: string } }) => (
    <View style={GlobalStyles.requestItem}>
      <Image source={{ uri: `${apiConfig.BASE_URL}${item.profile_image}` }} style={GlobalStyles.profileImage} />
      <Text style={GlobalStyles.name}>{item.sender_name}</Text>
      <TouchableOpacity onPress={() => respondToRequest(item.id, 'accepted')}>
        <Text style={GlobalStyles.accept}>✔</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => respondToRequest(item.id, 'rejected')}>
        <Text style={GlobalStyles.reject}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriend = ({ item }: { item: { id: string | number; profile_image: string; name: string } }) => (
    <View style={GlobalStyles.friendItem}>
      <Image source={{ uri: `${apiConfig.BASE_URL}${item.profile_image}` }} style={GlobalStyles.profileImage} />
      <Text style={GlobalStyles.name}>{item.name}</Text>
      <TouchableOpacity onPress={() => openOrCreateChat(item.id)}>
        <Ionicons name="chatbubbles-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name &&
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
      <View style={GlobalStyles.container}>
        <Header />
    
        <View style={[GlobalStyles.friendsContainer, { marginTop: 60 }]}>
        <View style={GlobalStyles.searchContainer}>
  <TextInput
    style={GlobalStyles.searchBar}
    placeholder="Search"
    placeholderTextColor="#AAA"
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
  <TouchableOpacity style={GlobalStyles.addButton} onPress={() => router.push('/friends/add')}>
    <Ionicons name="add-circle-outline" size={30} color="#FFF" />
  </TouchableOpacity>
</View>


    
          <Text style={GlobalStyles.sectionHeader}>Friend Requests</Text>
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFriendRequest}
            contentContainerStyle={GlobalStyles.listContainer}
            ListEmptyComponent={<Text style={GlobalStyles.emptyMessage}>No pending friend requests</Text>}
          />
          <Text style={GlobalStyles.sectionHeader}>Friends</Text>
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFriend}
            contentContainerStyle={GlobalStyles.listContainer}
            ListEmptyComponent={<Text style={GlobalStyles.emptyMessage}>No friends found</Text>}
          />
        </View>
    
        <BottomNavigation />
      </View>
    );
    
};
export default Friends;
