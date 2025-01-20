import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';

const AddFriend: React.FC = () => {
   const { GlobalStyles } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUserAndFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const userResponse = await fetch(`${apiConfig.BASE_URL}/api/user/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUserId(userData.id);
        }

        const friendsResponse = await fetch(`${apiConfig.BASE_URL}/api/user/friends`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData.map((friend: any) => friend.id));
        }
      } catch (error) {
        console.error('Error fetching user or friends:', error);
      }
    };

    fetchCurrentUserAndFriends();
  }, []);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${apiConfig.BASE_URL}/api/user/sent-requests`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Sent Requests:', data);
          setSentRequests(data);
        } else {
          console.error('Failed to fetch sent friend requests');
        }
      } catch (error) {
        console.error('Error fetching sent friend requests:', error);
      }
    };

    fetchSentRequests();
  }, []);


  const searchUsers = async (query: string) => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/search?query=${query}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setResults(data.filter((user: any) => user.id !== currentUserId));
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
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

  const renderItem = ({ item }: { item: any }) => {
    let iconName: 'add-circle-outline' | 'person-circle' | 'time' = 'add-circle-outline';
    let iconColor = '#FFF';
    let isDisabled = false;

    if (friends.includes(item.id)) {
      iconName = 'person-circle';
      iconColor = 'green';
      isDisabled = true;
    } else if (sentRequests.includes(item.id)) {
      iconName = 'time';
      iconColor = '#AAA';
      isDisabled = true;
    }

    return (
      <View style={GlobalStyles.resultItem}>
        <Text style={GlobalStyles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => sendFriendRequest(item.id)}
          disabled={isDisabled}
        >
          <Ionicons name={iconName} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <View style={GlobalStyles.container}>
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => router.push('../friends')}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
        <View style={GlobalStyles.searchContainer}>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Search for users"
        placeholderTextColor="#AAA"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchUsers(text);
        }}
      />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          searchQuery.length > 0 && results.length === 0 ? (
            <Text style={GlobalStyles.emptyMessage}>No users found</Text>
          ) : null
        }
      />
    </View>
  );
};
export default AddFriend;
