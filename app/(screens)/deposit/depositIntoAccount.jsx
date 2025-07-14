import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const DepositPage = () => {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState({
    number: '23320684190',
    name: 'Seth Asante Kwarteng'
  });
  
  const [secondaryPhones, setSecondaryPhones] = useState([]);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [phoneLabel, setPhoneLabel] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddSecondaryPhone = () => {
    setShowAddPhoneModal(true);
  };

  const handleSavePhone = () => {
    if (newPhoneNumber.trim() && phoneLabel.trim()) {
      const newPhone = {
        id: Date.now().toString(),
        number: newPhoneNumber.trim(),
        label: phoneLabel.trim(),
      };
      setSecondaryPhones([...secondaryPhones, newPhone]);
      setNewPhoneNumber('');
      setPhoneLabel('');
      setShowAddPhoneModal(false);
    }
  };

  const handleAccountSelect = () => {
    // Navigate to account selection screen
    router.push('/account-selection');
  };

  const handleRemovePhone = (phoneId) => {
    setSecondaryPhones(secondaryPhones.filter(phone => phone.id !== phoneId));
  };

  const BackIcon = () => (
    <Text style={styles.iconText}>‹</Text>
  );

  const PlusIcon = () => (
    <Text style={styles.plusIcon}>+</Text>
  );

  const CloseIcon = () => (
    <Text style={styles.closeIcon}>✕</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit into account</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Source account</Text>
        <Text style={styles.subtitle}>Select a wallet to send from</Text>

        {/* Account Selection */}
        <TouchableOpacity 
          style={styles.accountCard}
          onPress={handleAccountSelect}
          activeOpacity={0.7}
        >
          <View style={styles.accountInfo}>
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <Text style={styles.currencyIcon}>₵</Text>
              </View>
            </View>
            <View style={styles.accountDetails}>
              <Text style={styles.accountNumber}>{selectedAccount.number}</Text>
              <Text style={styles.accountName}>{selectedAccount.name}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Secondary Phone Numbers */}
        {secondaryPhones.map((phone) => (
          <View key={phone.id} style={styles.phoneCard}>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneLabel}>{phone.label}</Text>
              <Text style={styles.phoneNumber}>{phone.number}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleRemovePhone(phone.id)}
              style={styles.removeButton}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Secondary Phone */}
        <TouchableOpacity 
          style={styles.addPhoneButton}
          onPress={handleAddSecondaryPhone}
          activeOpacity={0.7}
        >
          <PlusIcon />
          <Text style={styles.addPhoneText}>Add secondary phone number</Text>
        </TouchableOpacity>
      </View>

      {/* Add Phone Modal */}
      <Modal
        visible={showAddPhoneModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddPhoneModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Secondary Phone</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Phone Label (e.g., Work, Home)"
                value={phoneLabel}
                onChangeText={setPhoneLabel}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={newPhoneNumber}
                onChangeText={setNewPhoneNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => {
                    setShowAddPhoneModal(false);
                    setNewPhoneNumber('');
                    setPhoneLabel('');
                  }}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSavePhone}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    height: 60,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  cancelButton: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  accountCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyIcon: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountDetails: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 14,
    color: '#666',
  },
  phoneCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneInfo: {
    flex: 1,
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    marginLeft: 12,
  },
  closeIcon: {
    fontSize: 16,
    color: '#FF5252',
  },
  addPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  plusIcon: {
    fontSize: 20,
    color: '#00BCD4',
    fontWeight: '300',
    marginRight: 8,
  },
  addPhoneText: {
    fontSize: 16,
    color: '#00BCD4',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelModalButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelModalButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#00BCD4',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DepositPage;