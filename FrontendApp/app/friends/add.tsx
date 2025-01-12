import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddFriend: React.FC = () => {
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

        const userResponse = await fetch('http://localhost:5000/api/user/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUserId(userData.id);
        }

        const friendsResponse = await fetch('http://localhost:5000/api/user/friends', {
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
        const response = await fetch('http://localhost:5000/api/user/sent-requests', {
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
      const response = await fetch(`http://localhost:5000/api/user/search?query=${query}`, {
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
      const response = await fetch('http://localhost:5000/api/user/add-friend', {
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
      <View style={styles.resultItem}>
        <Text style={styles.name}>{item.name}</Text>
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('../friends')}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for users"
        placeholderTextColor="#AAA"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchUsers(text);
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          searchQuery.length > 0 && results.length === 0 ? (
            <Text style={styles.emptyMessage}>No users found</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E', padding: 10 },
  backButton: { position: 'absolute', top: 40, left: 10, zIndex: 1 },
  searchBar: { backgroundColor: '#333', color: '#FFF', borderRadius: 10, padding: 10, marginBottom: 10, marginTop: 50 },
  resultItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#292929', borderRadius: 10, marginBottom: 5 },
  name: { color: '#FFF', fontSize: 16 },
  emptyMessage: { color: '#AAA', textAlign: 'center', marginTop: 10 },
});

export default AddFriend;
