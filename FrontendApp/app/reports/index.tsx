import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Modal, TouchableOpacity } from 'react-native';

const UserListScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const users = [
    { id: 1, name: 'LoickSuchtSieUnter10', description: 'Hat terroristisches Gedankengut verbreitet' },
    { id: 2, name: 'TimDerBrecher', description: 'Hat wiederholt Dickpics gesendet' },
    { id: 3, name: 'SvenDerEchte', description: 'Kann nichts und sollte sich umbringen' },
  ];

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={styles.userButton}
          onPress={() => handleUserPress(user)}
        >
          <Text style={styles.userText}>{user.name}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>{selectedUser.name}</Text>
                <Text style={styles.modalDescription}>{selectedUser.description}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Schließen" onPress={closeModal} />
                  <Button title="Weg damit" color="red" onPress={() => alert('Benutzer gebannt!')} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  userButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default UserListScreen;
