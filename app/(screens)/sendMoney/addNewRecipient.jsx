import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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

  const networks = [
    {
      id: 'at-money',
      name: 'AT Money',
      logo: '🏧',
      color: '#E53E3E',
    },
    {
      id: 'mtn-mobile',
      name: 'MTN Mobile Money',
      logo: '📱',
      color: '#FFD700',
    },
    {
      id: 'telecel-cash',
      name: 'Telecel Cash',
      logo: '💳',
      color: '#E53E3E',
    },
  ];

  const handleNetworkSelect = (networkId) => {
    setSelectedNetwork(networkId);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    if (selectedNetwork && phoneNumber.trim()) {
      const selectedNetworkName = networks.find(n => n.id === selectedNetwork)?.name;
      alert(`Selected: ${selectedNetworkName}\nPhone: ${phoneNumber}`);
      // Here you would typically navigate to the next screen
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
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
              <TouchableOpacity style={styles.contactIcon}>
                <Ionicons name="person" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>
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

        {/* Dropdown Modal */}
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
                    style={styles.networkItem}
                    onPress={() => handleNetworkSelect(network.id)}
                  >
                    <View style={styles.networkInfo}>
                      <View style={[styles.logoContainer, { backgroundColor: network.color }]}>
                        <Text style={styles.logoText}>{network.logo}</Text>
                      </View>
                      <Text style={styles.networkName}>{network.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
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
    color: '#888888',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#888888',
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
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#CCCCCC',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
  },
  phoneNumberSection: {
    marginTop: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  // Modal styles
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 18,
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
});

export default SendMoneyPage;