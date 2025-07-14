import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TransactionConfirmationPage = () => {
  const [transactionData, setTransactionData] = useState({
    senderName: '',
    senderNumber: '',
    recipientName: '',
    recipientNumber: '',
    networkName: '',
    amount: '0.00',
    date: '',
    category: 'General',
    narration: '-',
    fee: '0.00',
    elevy: '0.00',
    total: '0.00',
  });
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async () => {
    try {
      setIsLoading(true);
      
      // Load all stored data
      const [
        userName,
        selectedNetworkId,
        phoneNumber,
        transactionAmount,
        lastTransaction
      ] = await Promise.all([
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('selectedNetwork'),
        AsyncStorage.getItem('phoneNumber'),
        AsyncStorage.getItem('transactionAmount')
      ]);

      // Find selected network
      const selectedNetwork = networks.find(network => network.id === selectedNetworkId);
      
      // Calculate fees and total (simplified calculation)
      const amount = parseFloat(transactionAmount || '22.22');
      const fee = 0.00; // No fee for this transaction
      const elevy = 0.00; // No e-levy for this transaction
      const total = amount + fee + elevy;

      // Get current date in the format shown in image
      const currentDate = '13 Jul 2025';

      // Set transaction data
      setTransactionData({
        senderName: userName || 'Seth Kwarteng',
        senderNumber: '200144587829',
        recipientName: userName || 'Seth Asante Kwarteng',
        recipientNumber: phoneNumber || '233206841990',
        networkName: selectedNetwork ? selectedNetwork.name : 'Telecel Cash',
        amount: amount.toFixed(2),
        date: currentDate,
        category: 'General',
        narration: '-',
        fee: fee.toFixed(2),
        elevy: elevy.toFixed(2),
        total: total.toFixed(2),
      });

    } catch (error) {
      console.error('Error loading transaction data:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinConfirmation = () => {
    // Navigate to PIN entry screen or show PIN modal
    Alert.alert(
      'PIN Required',
      'Please enter your PIN to confirm the transaction',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Enter PIN',
          onPress: () => {
            Alert.alert(
              'Transaction Successful',
              `GHS ${transactionData.amount} has been sent to ${transactionData.recipientName}`,
              [
                {
                  text: 'OK',
                  onPress: () => router.push('../../(screens)/home'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 1);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transaction details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Transaction Parties Card */}
        <View style={styles.partiesCard}>
          {/* Sender */}
          <View style={styles.partyRow}>
            <View style={[styles.avatar, { backgroundColor: '#4A90E2' }]}>
              <Text style={styles.avatarText}>
                {getInitials(transactionData.senderName)}
              </Text>
            </View>
            <View style={styles.partyDetails}>
              <Text style={styles.partyName}>{transactionData.senderName}</Text>
              <Text style={styles.providerName}>Affinity Daily</Text>
              <Text style={styles.phoneNumber}>{transactionData.senderNumber}</Text>
            </View>
          </View>

          {/* Dotted Line */}
          <View style={styles.dottedLineContainer}>
            <View style={styles.dottedLine} />
          </View>

          {/* Recipient */}
          <View style={styles.partyRow}>
            <View style={styles.recipientAvatarContainer}>
              <View style={[styles.avatar, { backgroundColor: '#E53E3E' }]}>
                <Text style={styles.avatarText}>
                  {getInitials(transactionData.recipientName)}
                </Text>
              </View>
              <View style={styles.networkBadge}>
                <Ionicons name="wallet" size={10} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.partyDetails}>
              <Text style={styles.partyName}>{transactionData.recipientName}</Text>
              <Text style={styles.providerName}>{transactionData.networkName}</Text>
              <Text style={styles.phoneNumber}>{transactionData.recipientNumber}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{transactionData.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>GHS {transactionData.amount}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Elevy</Text>
            <Text style={styles.detailValue}>GHS {transactionData.elevy}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>GHS {transactionData.fee}</Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>GHS {transactionData.total}</Text>
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Additional details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transactionData.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Narration</Text>
            <Text style={styles.detailValue}>{transactionData.narration}</Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handlePinConfirmation}
        >
          <Text style={styles.confirmButtonText}>Enter PIN to confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  partiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recipientAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  networkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  partyDetails: {
    flex: 1,
  },
  partyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 1,
  },
  providerName: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 1,
  },
  phoneNumber: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '500',
  },
  dottedLineContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
    marginVertical: 8,
  },
  dottedLine: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666666',
  },
  detailValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '400',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4A148C',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
    marginHorizontal: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransactionConfirmationPage;