import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, StyleSheet, ActivityIndicator, ImageErrorEventData, NativeSyntheticEvent, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../configs/apiConfig';
import { useTheme } from '../settings/themeContext';

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
  const { GlobalStyles } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.warn('Image loading error:', e.nativeEvent.error);
    setImageError(true);
  };

  if (!uri || imageError) {
    return (
      <View style={GlobalStyles.placeholderImage}>
        <Ionicons name="person-outline" size={40} color="#FFF" />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.profileContainer}>
    <Image
      source={{ uri }}
      style={GlobalStyles.profileImageProfiles}
      onError={handleImageError}
    />
    </View>
  );
};

const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  GlobalStyles,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  GlobalStyles: any;
}) => (

  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
  >
    <TouchableOpacity
      style={GlobalStyles.modalBackground}
      activeOpacity={1}
      onPress={onCancel}
    >
      <View style={GlobalStyles.modalContent}>
        <Text style={GlobalStyles.modalTitle}>Remove Friend</Text>
        <Text style={GlobalStyles.modalText}>
          Are you sure you want to remove this friend? This action cannot be undone.
        </Text>
        <View style={GlobalStyles.modalButtons}>
          <TouchableOpacity
            style={GlobalStyles.cancelButton}
            onPress={onCancel}
          >
            <Text style={GlobalStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={GlobalStyles.confirmButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
);

const ContactDetails = () => {
  const { GlobalStyles } = useTheme();
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
        router.push('./login');
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
        router.push('./login');
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
  const blockUser = async () => {
    try {
      setIsLoading(true);
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        router.push('./login');
        return;
      }
  
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/block-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockedId: contactId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', data.message, [
          { text: 'OK', onPress: () => router.push('/chats') },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const removeFriend = async () => {
    try {
      setIsLoading(true);
      setShowModal(false);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        router.push('./login');
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
        router.push('./login');
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
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={GlobalStyles.loadingText}>Loading contact details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={GlobalStyles.errorContainer}>
        <Text style={GlobalStyles.errorText}>{error}</Text>
        <TouchableOpacity style={GlobalStyles.retryButton} onPress={fetchContactData}>
          <Text style={GlobalStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!contactData) {
    return (
      <View style={GlobalStyles.errorContainer}>
        <Text style={GlobalStyles.errorText}>No contact data found</Text>
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
        <ProfileImage uri={`${apiConfig.BASE_URL}${contactData.profile_image}`} />
        <Text style={GlobalStyles.contactName}>{contactData.username || 'Unknown'}</Text>
        <Text style={GlobalStyles.contactAbout}>{contactData.about || 'No details available'}</Text>
      </View>
  
      <View style={GlobalStyles.actionContainer}>
        <TouchableOpacity
          style={[GlobalStyles.removeButton, isLoading && GlobalStyles.removeButtonDisabled]}
          onPress={() => setShowModal(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="person-remove" size={20} color="#FFF" />
              <Text style={GlobalStyles.buttonText}>Remove Friend</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[GlobalStyles.blockButton, isLoading && GlobalStyles.blockButtonDisabled]}
          onPress={blockUser}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="ban" size={20} color="#FFF" />
              <Text style={GlobalStyles.buttonText}>Block User</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
        style={GlobalStyles.createGroupButton}
        onPress={() => router.push({
          pathname: '/group/groupCreation',
          params: { preselectedFriend: contactId },
        })}
      >
        <Ionicons name="people-outline" size={20} color="#FFF" />
        <Text style={GlobalStyles.buttonText}>Create Group</Text>
      </TouchableOpacity>
      </View>
  
      <ConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={removeFriend}
        GlobalStyles={GlobalStyles}
      />
    </View>
  );
};

export default ContactDetails;