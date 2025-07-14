import { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const SendMoneyPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const networks = [
    {
      id: 'at-money',
      name: 'AT Money',
      logo: '🏧', // Using emoji as placeholder for AT Money logo
      color: '#E53E3E',
    },
    {
      id: 'mtn-mobile',
      name: 'MTN Mobile Money',
      logo: '📱', // Using emoji as placeholder for MTN logo
      color: '#FFD700',
    },
    {
      id: 'telecel-cash',
      name: 'Telecel Cash',
      logo: '💳', // Using emoji as placeholder for Telecel logo
      color: '#E53E3E',
    },
  ];

  const handleNetworkSelect = (networkId) => {
    setSelectedNetwork(networkId);
  };

  const handleContinue = () => {
    if (selectedNetwork && phoneNumber.trim()) {
      const selectedNetworkName = networks.find(n => n.id === selectedNetwork)?.name;
      alert(`Selected: ${selectedNetworkName}\nPhone: ${phoneNumber}`);
      // Here you would typically navigate to the next screen
    }
  };

  const handleCancel = () => {
    alert('Cancelled');
    // Here you would typically navigate back
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send money</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Add new recipient</Text>
        <Text style={styles.subtitle}>Fill in the details to add a recipient</Text>
        
        <Text style={styles.sectionTitle}>Recipient's network</Text>
        
        {/* Network Options */}
        <View style={styles.networkList}>
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
                  <Text style={styles.logoText}>{network.logo}</Text>
                </View>
                <Text style={styles.networkName}>{network.name}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedNetwork === network.id && styles.selectedRadioButton
                ]}>
                  {selectedNetwork === network.id && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone Number Input */}
        <View style={styles.phoneNumberSection}>
          <Text style={styles.sectionTitle}>Recipient's phone number</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter phone number"
            placeholderTextColor="#999999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={15}
          />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  cancelText: {
    fontSize: 16,
    color: '#E53E3E',
    fontWeight: '500',
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
    color: '#666666',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    fontWeight: '500',
  },
  networkList: {
    gap: 16,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedNetworkItem: {
    borderColor: '#663399',
    backgroundColor: '#F9F7FF',
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  phoneNumberSection: {
    marginTop: 40,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
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
});

export default SendMoneyPage;