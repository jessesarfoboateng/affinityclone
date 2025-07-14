import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const TransactionAmountPage = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkName, setNetworkName] = useState('Telecel Cash');
  const [phoneNumber, setPhoneNumber] = useState('233206841990');
  const router = useRouter();

  // Load saved data when component mounts
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      // Load selected network using the same key as in Add New Recipient
      const selectedNetworkId = await AsyncStorage.getItem('selectedNetwork');
      
      // Load phone number using the same key as in Add New Recipient
      const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      
      // Network data mapping - same as in Add New Recipient
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

      // Find the selected network by ID
      const selectedNetwork = networks.find(network => network.id === selectedNetworkId);
      
      // Set network name from saved data
      if (selectedNetwork) {
        setNetworkName(selectedNetwork.name);
      }

      // Set phone number from saved data
      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
      }

    } catch (error) {
      console.error('Error loading saved data:', error);
      // Keep default values if loading fails
    }
  };

  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(numericValue);
  };

  const handleContinue = async () => {
    if (!amount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    } 
    router.push("../../(screens)/sendMoney/Confirmation");
    

    setIsLoading(true);
    
    try {
      // Store the transaction amount in AsyncStorage
      await AsyncStorage.setItem('transactionAmount', amount);
      
      // You can also store additional transaction data
      const transactionData = {
        amount: parseFloat(amount),
        recipient: 'Seth Asante Kwarteng',
        recipientNumber: phoneNumber,
        provider: networkName,
        timestamp: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('lastTransaction', JSON.stringify(transactionData));
      
      // Alert.alert(
      //   'Success', 
      //   `Amount GHS ${amount} saved successfully!`,
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         // Navigate to next screen or perform next action
      //         console.log('Transaction data saved:', transactionData);
      //       }
      //     }
      //   ]
      // );
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction amount');
      console.error('AsyncStorage error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Transaction amount</Text>
            <Text style={styles.subtitle}>Enter the amount you want to send</Text>
          </View>

          {/* Recipient Info */}
          <View style={styles.recipientContainer}>
            <View style={styles.recipientInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>S</Text>
              </View>
              <View style={styles.recipientDetails}>
                <Text style={styles.recipientName}>Seth Asante Kwarteng</Text>
                <Text style={styles.providerName}>{networkName}</Text>
                <Text style={styles.phoneNumber}>{phoneNumber}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeButton} onPress={() => router.push("../../(screens)/sendMoney/addNewRecipient")}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Enter an amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currency}>GHS</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                placeholderTextColor="#C0C0C0"
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, (!amount || isLoading) && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!amount || isLoading}
          >
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '500',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    minWidth: 100,
    textAlign: 'left',
  },
  continueButton: {
    backgroundColor: '#4a148c',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TransactionAmountPage;