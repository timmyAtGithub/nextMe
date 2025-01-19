import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import apiConfig from '../configs/apiConfig';


const AdminReportsScreen: React.FC = () => {
  interface Report {
    report_id: number; 
    picture_id: number;
    picture_url: string;
    sender_id: number;
    reporter_id: number; 
  }

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiConfig.BASE_URL}/api/reports/getReports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const validReports = response.data.filter((report: any): report is Report => {
          return report && 
                 typeof report.report_id === 'number' && 
                 typeof report.picture_id === 'number' && 
                 typeof report.sender_id === 'number' && 
                 typeof report.picture_url === 'string' &&
                 typeof report.reporter_id === 'number';
        });
        setReports(validReports);
      } else {
        console.error('Failed to fetch reports');
        Alert.alert('Error', 'Failed to fetch reports');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching reports:', error.message);
        Alert.alert('Error', `Failed to fetch reports: ${error.message}`);
      } else {
        console.error('Error fetching reports:', error);
        Alert.alert('Error', 'Failed to fetch reports');
      }
    }
  };

  const verifyAdmin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${apiConfig.BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.username === 'Admin') {
        setIsAdmin(true);
      } else {
        Alert.alert('Access Denied', 'You are not authorized to view this page.');
        router.push('./auth/login'); 
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      Alert.alert('Error', 'Failed to verify admin status.');
      router.push('./auth/login'); 
    }
  };

  const deleteReport = async (reportId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${apiConfig.BASE_URL}/api/reports/deleteReport/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((report) => report.report_id !== reportId));
      Alert.alert('Success', 'Report deleted successfully.');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting report:', error.message);
      } else {
        console.error('Error deleting report:', error);
      }
      Alert.alert('Error', 'Failed to delete report.');
    }
  };

  const banUser = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${apiConfig.BASE_URL}/api/reports/banUser/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports((prev) => prev.filter((report) => report.sender_id !== userId));
      Alert.alert('Success', 'User banned successfully.');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error banning user:', error.message);
      } else {
        console.error('Error banning user:', error);
      }
      Alert.alert('Error', 'Failed to ban user.');
    }
  };

  const handleDeleteReport = (reportId: number) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => deleteReport(reportId),
        },
      ]
    );
  };

  const handleBanUser = (userId: number) => {
    Alert.alert(
      'Ban User',
      'Are you sure you want to ban this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => banUser(userId),
        },
      ]
    );
  };

  useEffect(() => {
    verifyAdmin();
    fetchReports();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <View style={styles.container}>
      {selectedReport ? (
        <View style={styles.detailContainer}>
          <Image
            source={{ uri: `${apiConfig.BASE_URL}${selectedReport.picture_url}` }}
            style={styles.image}
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteReport(selectedReport.report_id)} 
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBanUser(selectedReport.sender_id)}
            >
              <Text style={styles.banIcon}>❌</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedReport(null)}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.report_id.toString()} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.reportItem}
              onPress={() => setSelectedReport(item)}
            >
              <Text style={styles.reportText}>
                Report ID: {item.report_id}, Picture ID: {item.picture_id} 
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reports found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  reportItem: {
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  reportText: {
    color: '#fff',
  },
  detailContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  deleteIcon: {
    color: 'red',
    fontSize: 24,
  },
  banIcon: {
    color: 'orange',
    fontSize: 24,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 20,
  },
  backText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AdminReportsScreen;
