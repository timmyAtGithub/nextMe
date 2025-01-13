import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import apiConfig from '../configs/apiConfig';

const ContactInfoScreen = () => {
  const router = useRouter();
  const { contactId } = useLocalSearchParams(); 
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contactId) { 
      fetchContactData();
    }
  }, [contactId]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiConfig.BASE_URL}/api/user/getContactDetails/${contactId}`);
      if (!response.ok) throw new Error('Failed to fetch contact data');
      const data = await response.json();
      setContactData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchContactData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!contactData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact info</Text>
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={{ uri: contactData.avatar }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{contactData.username}</Text>
      </View>

      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="people-outline" size={24} color="#fff" />
        <Text style={styles.optionText}>Friends</Text>
      </TouchableOpacity>

      <View style={styles.groupsSection}>
        <Text style={styles.groupsText}>No groups in common</Text>
        <TouchableOpacity style={styles.createGroupButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createGroupText}>Create group with {contactData.username}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 16,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#333',
  },
  optionText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
  groupsSection: {
    padding: 16,
  },
  groupsText: {
    color: '#888',
    marginBottom: 12,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createGroupText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
  },
});

export default ContactInfoScreen;