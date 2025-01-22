import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../../configs/apiConfig';
import { useTheme } from '@/app/settings/themeContext';
 
 
 
interface GroupData {
  name: string;
  group_image_url?: string;
  description?: string;
  owner_id: number;
}
 
interface Member {
  user_id: number;
  username: string;
  profile_image?: string;
}
 
const GroupImage = ({ uri }: { uri?: string }) => {
 
  const { GlobalStyles } = useTheme();
 
  const [imageError, setImageError] = useState(false);
 
  const handleImageError = () => {
    setImageError(true);
  };
 
  if (!uri || imageError) {
    return (
      <View style={GlobalStyles.placeholderImage}>
        <Ionicons name="people-outline" size={40} color="#FFF" />
      </View>
    );
  }
 
  return (
    <Image
      source={{ uri }}
      style={GlobalStyles.groupImage}
      onError={handleImageError}
    />
  );
};
 
const GroupDetails = () => {
  const { GlobalStyles } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
 
  const fetchGroupData = async () => {
    try {
      setIsFetching(true);
      setError(null);
 
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('./auth/login');
        return;
      }
 
      const response = await fetch(
        `${apiConfig.BASE_URL}/api/groups/details/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
 
      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        router.push('./auth/login');
        return;
      }
 
      if (!response.ok) {
        throw new Error(`Failed to fetch group details (${response.status})`);
      }
 
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load group details');
    } finally {
      setIsFetching(false);
    }
  };
 
  const fetchGroupMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('./auth/login');
        return;
      }
 
      const response = await fetch(
        `${apiConfig.BASE_URL}/api/groups/${groupId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
 
      if (!response.ok) {
        throw new Error('Failed to fetch group members');
      }
 
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching group members:', error);
      setError('Failed to load group members');
    }
  };
 
  useEffect(() => {
    fetchGroupData();
    fetchGroupMembers();
  }, [groupId]);
 
  if (isFetching) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={GlobalStyles.loadingText}>Loading group details...</Text>
      </View>
    );
  }
 
  if (error) {
    return (
      <View style={GlobalStyles.errorContainer}>
        <Text style={GlobalStyles.errorText}>{error}</Text>
        <TouchableOpacity style={GlobalStyles.retryButton} onPress={fetchGroupData}>
          <Text style={GlobalStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  if (!groupData) {
    return (
      <View style={GlobalStyles.errorContainer}>
        <Text style={GlobalStyles.errorText}>No group data found</Text>
      </View>
    );
  }
 
  return (
    
     <View style={GlobalStyles.container}>
          <TouchableOpacity
            style={GlobalStyles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
      
          <View style={GlobalStyles.centeredProfileContainer}>
      <Image  source={{uri:`${apiConfig.BASE_URL}${groupData.group_image_url}`}} style={GlobalStyles.groupImagefull} />
      <Text style={GlobalStyles.groupName}>{groupData.name || 'Unknown Group'}</Text>
      <Text style={GlobalStyles.groupDescription}>{groupData.description || 'No description available'}</Text> 
      <Text style={GlobalStyles.membersTitle}>Group Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.memberItem}>
            <Image
              source={{ uri: `${apiConfig.BASE_URL}${item.profile_image || '/default-profile.png'}` }}
              style={GlobalStyles.memberImage}
            />
            <Text style={GlobalStyles.memberName}>
              {item.username}
              {item.user_id === groupData.owner_id && (
                <Text style={GlobalStyles.ownerLabel}> (Owner)</Text>
              )}
            </Text>
          </View>
        )}
        contentContainerStyle={GlobalStyles.membersList}
      />
    </View>
    </View>
  );
};
export default GroupDetails;
 