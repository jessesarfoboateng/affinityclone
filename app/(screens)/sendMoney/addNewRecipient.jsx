import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const SendMoneyPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const networks = [
    {
      id: 'at-money',
      name: 'AT Money',
      icon: 'card',
      color: '#E53E3E',
    },
    {
      id: 'mtn-mobile',
      name: 'MTN Mobile Money',
      icon: 'phone-portrait',
      color: '#FFD700',
    },
    {
      id: 'telecel-cash',
      name: 'Telecel Cash',
      icon: 'wallet',
      color: '#E53E3E',
    },
  ];

  // Load user data from AsyncStorage on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user name
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      } else {
        // If no name is stored, you might want to set a default or prompt user
        setUserName('Seth Asante Kwarteng'); // Default name for demo
        await AsyncStorage.setItem('userName', 'Seth Asante Kwarteng');
      }

      // Load previously selected network
      const savedNetwork = await AsyncStorage.getItem('selectedNetwork');
      if (savedNetwork) {
        setSelectedNetwork(savedNetwork);
      }

      // Load previously entered phone number (optional)
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('Seth Asante Kwarteng'); // Fallback
    }
  };

  const saveNetworkSelection = async (networkId) => {
    try {
      await AsyncStorage.setItem('selectedNetwork', networkId);
    } catch (error) {
      console.error('Error saving network selection:', error);
    }
  };

  const savePhoneNumber = async (phone) => {
    try {
      await AsyncStorage.setItem('phoneNumber', phone);
    } catch (error) {
      console.error('Error saving phone number:', error);
    }
  };

  const handleNetworkSelect = (networkId) => {
    setSelectedNetwork(networkId);
    setIsDropdownOpen(false);
    // Save the selected network to AsyncStorage
    saveNetworkSelection(networkId);
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    // Save phone number to AsyncStorage as user types (debounced approach would be better for performance)
    savePhoneNumber(text);
  };

  const handleContinue = () => {
    if (selectedNetwork && phoneNumber.trim()) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmContinue = async () => {
    try {
      // Save the complete transaction data before navigation
      const transactionData = {
        network: selectedNetwork,
        phoneNumber: phoneNumber,
        recipientName: userName,
        timestamp: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('lastTransaction', JSON.stringify(transactionData));
      
      // You might also want to save to a list of recent transactions
      const recentTransactions = await AsyncStorage.getItem('recentTransactions');
      let transactions = recentTransactions ? JSON.parse(recentTransactions) : [];
      
      // Add new transaction to the beginning of the array
      transactions.unshift(transactionData);
      
      // Keep only the last 10 transactions
      if (transactions.length > 10) {
        transactions = transactions.slice(0, 10);
      }
      
      await AsyncStorage.setItem('recentTransactions', JSON.stringify(transactions));
      
    } catch (error) {
      console.error('Error saving transaction data:', error);
    }

    setIsConfirmModalOpen(false);
    const selectedNetworkName = networks.find(n => n.id === selectedNetwork)?.name;
    router.push("../../(screens)/sendMoney/Categories");
  };

  const handleChangeRecipient = () => {
    setIsConfirmModalOpen(false);
    // You might want to clear the form or navigate back
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.multiRemove(['selectedNetwork', 'phoneNumber', 'lastTransaction']);
      setSelectedNetwork(null);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Add new recipient</Text>
          <Text style={styles.subtitle}>Fill in the details to add a recipient</Text>
          
          <Text style={styles.sectionTitle}>Recipient's network</Text>
          
          {/* Network Dropdown */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsDropdownOpen(true)}
          >
            <Text style={[
              styles.dropdownText,
              !selectedNetwork && styles.dropdownPlaceholder
            ]}>
              {selectedNetwork ? selectedNetworkData?.name : 'Please select a network'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Phone Number Input */}
          <View style={styles.phoneNumberSection}>
            <Text style={styles.sectionTitle}>Recipient's phone number</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder=""
                placeholderTextColor="#999999"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={15}
              />
              <TouchableOpacity style={styles.contactIcon}>
                <Ionicons name="person" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Clear Data Button (for testing purposes) */}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearStoredData}
          >
            <Text style={styles.clearButtonText}>Clear Stored Data</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (selectedNetwork && phoneNumber.trim()) && styles.continueButtonActive
            ]}
            onPress={handleContinue}
            disabled={!(selectedNetwork && phoneNumber.trim())}
          >
            <Text style={[
              styles.continueButtonText,
              (selectedNetwork && phoneNumber.trim()) && styles.continueButtonTextActive
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Network Dropdown Modal */}
        <Modal
          visible={isDropdownOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Recipient's network</Text>
              <ScrollView style={styles.networkList}>
                {networks.map((network) => (
                  <TouchableOpacity
                    key={network.id}
                    style={[
                      styles.networkItem,
                      selectedNetwork === network.id && styles.selectedNetworkItem
                    ]}
                    onPress={() => handleNetworkSelect(network.id)}
                  >
                    <View style={styles.networkInfo}>
                      <View style={[styles.logoContainer, { backgroundColor: network.color }]}>
                        <Ionicons name={network.icon} size={18} color="white" />
                      </View>
                      <Text style={styles.networkName}>{network.name}</Text>
                    </View>
                    {selectedNetwork === network.id && (
                      <View style={styles.radioContainer}>
                        <View style={[styles.radioButton, styles.selectedRadioButton]}>
                          <View style={styles.radioInner} />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          visible={isConfirmModalOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsConfirmModalOpen(false)}
        >
          <View style={styles.confirmModalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>Confirm recipient</Text>
              <Text style={styles.confirmSubtitle}>Please confirm the name of the recipient below</Text>
              
              <View style={styles.recipientNameContainer}>
                <Text style={styles.recipientName}>{userName}</Text>
              </View>

              <TouchableOpacity style={styles.favouriteButton}>
                <Ionicons name="star-outline" size={16} color="#FFB800" />
                <Text style={styles.favouriteText}>Add to my favourites</Text>
              </TouchableOpacity>

              <View style={styles.confirmButtonsContainer}>
                <TouchableOpacity
                  style={styles.confirmContinueButton}
                  onPress={handleConfirmContinue}
                >
                  <Text style={styles.confirmContinueText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changeRecipientButton}
                  onPress={handleChangeRecipient}
                >
                  <Text style={styles.changeRecipientText}>Change recipient</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3a3737ff',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#3a3737ff',
    marginBottom: 12,
    fontWeight: '400',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#663399',
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  dropdownPlaceholder: {
    color: '#CCCCCC',
    marginLeft: 0,
  },
  phoneNumberSection: {
    marginTop: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#663399',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
  },
  contactIcon: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 50,
  },
  continueButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#663399',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  // Network Dropdown Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '400',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  networkList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedNetworkItem: {
    borderColor: '#663399',
    backgroundColor: '#F9F7FF',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  networkName: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  radioContainer: {
    padding: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#663399',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#663399',
  },
  // Confirmation Modal styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  confirmModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 40,
  },
  recipientNameContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  favouriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 40,
  },
  favouriteText: {
    fontSize: 14,
    color: '#FFB800',
    marginLeft: 8,
  },
  confirmButtonsContainer: {
    gap: 12,
  },
  confirmContinueButton: {
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  confirmContinueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  changeRecipientButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#663399',
  },
  changeRecipientText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#663399',
  },
});

export default SendMoneyPage;