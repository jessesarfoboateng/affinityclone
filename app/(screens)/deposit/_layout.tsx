import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScreenLayout() {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    router.push('/'); // Navigate to home or previous screen
  };

  const dismissCancel = () => {
    setShowCancelModal(false);
  };

  const CancelButton = () => (
    <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Deposit"
          options={{
            title: "Deposit into account",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <AntDesign name="left" size={24} color="gray" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="depositIntoAccount"
          options={{
            title: "Send money",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <AntDesign name="left" size={24} color="gray" />
              </TouchableOpacity>
            ),
            headerRight: () => <CancelButton />,
          }}
        />

        <Stack.Screen
          name="SourceAccount"
          options={{
            title: "Send money",
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <AntDesign name="left" size={24} color="gray" />
              </TouchableOpacity>
            ),
            headerRight: () => <CancelButton />,
          }}
        />
      </Stack>

      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={dismissCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <FontAwesome name="times" size={24} color="#87CEEB" />
            </View>
            
            <Text style={styles.modalTitle}>Cancel transaction?</Text>
            <Text style={styles.modalMessage}>
              This will delete all details you may have entered. This action cannot be undone.
            </Text>
            
            <TouchableOpacity style={styles.confirmButton} onPress={confirmCancel}>
              <Text style={styles.confirmButtonText}>Yes, cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dismissButton} onPress={dismissCancel}>
              <Text style={styles.dismissButtonText}>No, don't cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  cancelButton: {
    padding: 8,
    marginRight: 16,
  },
  cancelText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    maxWidth: '90%',
    width: 300,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3D1A4D',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#6B46C1',
    width: '100%',
  },
  dismissButtonText: {
    color: '#3D1A4D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});