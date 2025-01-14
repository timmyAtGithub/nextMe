import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../../configs/apiConfig';

interface GroupData {
  name: string;
  group_image_url?: string;
  description?: string;
}

const GroupImage = ({ uri }: { uri?: string }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.warn('Image loading error:', e.nativeEvent.error);
    setImageError(true);
  };

  if (!uri || imageError) {
    return (
      <View style={styles.placeholderImage}>
        <Ionicons name="people-outline" size={40} color="#FFF" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.groupImage}
      onError={handleImageError}
    />
  );
};

const GroupDetails = () => {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);

  const fetchGroupData = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/login');
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
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch group details (${response.status})`);
      }

      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load group details');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Loading group details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchGroupData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!groupData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No group data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <GroupImage uri={`${apiConfig.BASE_URL}${groupData.group_image_url}`} />

      <Text style={styles.groupName}>{groupData.name || 'Unknown Group'}</Text>
      <Text style={styles.groupDescription}>{groupData.description || 'No description available'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  groupDescription: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GroupDetails;
