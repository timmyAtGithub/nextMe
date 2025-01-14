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
import apiConfig from '../configs/apiConfig';

interface ContactData {
  username: string;
  profile_image?: string;
  about?: string;
}

interface RemoveFriendResponse {
  message: string;
  success: boolean;
}

const ProfileImage = ({ uri }: { uri?: string }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.warn('Image loading error:', e.nativeEvent.error);
    setImageError(true);
  };

  if (!uri || imageError) {
    return (
      <View style={styles.placeholderImage}>
        <Ionicons name="person-outline" size={40} color="#FFF" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.profileImage}
      onError={handleImageError}
    />
  );
};

const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
  >
    <TouchableOpacity
      style={styles.modalBackground}
      activeOpacity={1}
      onPress={onCancel}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Remove Friend</Text>
        <Text style={styles.modalText}>
          Are you sure you want to remove this friend? This action cannot be undone.
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
);

const ContactDetails = () => {
  const router = useRouter();
  const { contactId } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactData = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${apiConfig.BASE_URL}/api/user/getContactDetails/${contactId}`,
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
        throw new Error(`Failed to fetch contact details (${response.status})`);
      }

      const data = await response.json();
      setContactData(data);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      setError(error instanceof Error ? error.message : 'Failed to load contact details');
    } finally {
      setIsFetching(false);
    }
  };

  const removeFriend = async () => {
    try {
      setIsLoading(true);
      setShowModal(false);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${apiConfig.BASE_URL}/api/user/remove-friend/${contactId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: RemoveFriendResponse = await response.json();

      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (response.ok) {
        Alert.alert('Success', data.message, [
          { text: 'OK', onPress: () => router.push('/chats') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, [contactId]);

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Loading contact details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchContactData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!contactData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No contact data found</Text>
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
  
        <ProfileImage uri={`${apiConfig.BASE_URL}${contactData.profile_image}`} />
  
      <Text style={styles.contactName}>{contactData.username || 'Unknown'}</Text>
      <Text style={styles.contactAbout}>{contactData.about || 'No details available'}</Text>
  
      <TouchableOpacity
        style={[styles.removeButton, isLoading && styles.removeButtonDisabled]}
        onPress={() => setShowModal(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <Ionicons name="person-remove" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Remove Friend</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
  style={styles.createGroupButton}
    onPress={() => router.push({
    pathname: '/group/groupCreation',
    params: { preselectedFriend: contactId }, 
  })}
>
  <Ionicons name="people-outline" size={20} color="#FFF" />
  <Text style={styles.buttonText}>Create Group</Text>
</TouchableOpacity>

  
      <ConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={removeFriend}
      />
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
  profileImage: {
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
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactAbout: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 180,
  },
  removeButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3A3A3C',
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 180,
  },
  
});

export default ContactDetails;