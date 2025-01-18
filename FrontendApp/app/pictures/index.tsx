import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';

const ImageListScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const receivedImages = [
    { id: 1, sender: 'Alice', message: 'Das ist ein Beispieltext 1', distance: '220 m', imageUrl: require('../assets/images/image1.png') },
    { id: 2, sender: 'Bob', message: 'Das ist ein Beispieltext 2', distance: '350 m', imageUrl: require('../assets/images/image2.png') },
    { id: 3, sender: 'Charlie', message: 'Das ist ein Beispieltext 3', distance: '120 m', imageUrl: require('../assets/images/image3.png') },
  ];

  const openImage = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const { width, height } = Dimensions.get('window'); // Bildschirmgröße

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {receivedImages.map((item) => (
        <TouchableOpacity key={item.id} style={styles.imageContainer} onPress={() => openImage(item)}>
          <Image source={item.imageUrl} style={styles.imagePreview} />
          <View style={styles.textContainer}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
          <Text style={styles.distanceText}>{item.distance}</Text> {/* Meterangabe anzeigen */}
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
            <Image source={selectedImage.imageUrl} style={[styles.fullScreenImage, { width, height }]} />
            <View style={styles.overlayContainer}>
              <Text style={styles.overlaySender}>{selectedImage.sender}</Text>
              <Text style={styles.overlayDistance}>{selectedImage.distance}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
              <Text style={styles.closeButtonText}>Schließen</Text>
            </TouchableOpacity>
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
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    resizeMode: 'contain', // sorgt dafür, dass das Bild vollständig sichtbar bleibt
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  overlaySender: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  overlayDistance: {
    fontSize: 16,
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ImageListScreen;
