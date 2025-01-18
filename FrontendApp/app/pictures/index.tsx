import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';

const ImageListScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
//hier noch passende Var eintragen  -v-
  const receivedImages = [
    { id: 1, sender: 'Alice', message: 'Whats up bro', imageUrl: require('../assets/images/image1.png') },
    { id: 2, sender: 'Bob', message: 'Look at that dumptruck', imageUrl: require('../assets/images/image2.png') },
    { id: 3, sender: 'Charlie', message: 'Cops in LA are different', imageUrl: require('../assets/images/image3.png') },
  ];

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {receivedImages.map((item) => (
        <TouchableOpacity key={item.id} style={styles.imageContainer} onPress={() => openImage(item.imageUrl)}>
          <Image source={item.imageUrl} style={styles.imagePreview} />
          <View style={styles.textContainer}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Modal für die Vollansicht des Bildes */}
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImage}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalClose} onPress={closeImage}>
              <Text style={styles.modalCloseText}>Schließen</Text>
            </TouchableOpacity>
            <Image source={selectedImage} style={styles.fullImage} />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#000',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default ImageListScreen;
