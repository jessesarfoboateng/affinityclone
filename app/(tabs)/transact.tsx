import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const transactionTypes = [
  {
    id: '1',
    title: 'Send Money',
    icon: 'paper-plane',
    color: '#411D4B',
    description: 'Transfer money to other Relafin users'
  },
  {
    id: '2',
    title: 'Pay Bills',
    icon: 'receipt',
    color: '#4CAF50',
    description: 'Pay for utilities and services'
  },
  {
    id: '3',
    title: 'Top Up',
    icon: 'phone-portrait',
    color: '#2196F3',
    description: 'Recharge your mobile phone'
  },
  {
    id: '4',
    title: 'Withdraw',
    icon: 'cash',
    color: '#FF9800',
    description: 'Withdraw money from your account'
  }
];

const recentRecipients = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+233 20 123 4567',
    lastTransaction: '2 hours ago'
  },
  {
    id: '2',
    name: 'Jane Smith',
    phoneNumber: '+233 20 765 4321',
    lastTransaction: '1 day ago'
  }
];

export default function TransactScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (!storedPhoneNumber) {
        router.replace('/(auth)/phone');
        return;
      }
      setPhoneNumber(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleTransactionTypePress = (typeId: string) => {
    // TODO: Implement transaction type specific flows
    Alert.alert('Coming Soon', 'This feature will be available soon');
  };

  const handleRecipientPress = (recipientId: string) => {
    // TODO: Implement recipient selection flow
    Alert.alert('Coming Soon', 'Recipient selection will be available soon');
  };

  const renderTransactionType = (type: typeof transactionTypes[0]) => (
    <TouchableOpacity
      key={type.id}
      style={styles.transactionTypeCard}
      onPress={() => handleTransactionTypePress(type.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
        <Ionicons name={type.icon as any} size={24} color="white" />
      </View>
      <View style={styles.transactionTypeInfo}>
        <Text style={styles.transactionTypeTitle}>{type.title}</Text>
        <Text style={styles.transactionTypeDescription}>{type.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderRecentRecipient = (recipient: typeof recentRecipients[0]) => (
    <TouchableOpacity
      key={recipient.id}
      style={styles.recipientCard}
      onPress={() => handleRecipientPress(recipient.id)}
    >
      <View style={styles.recipientAvatar}>
        <Text style={styles.recipientInitial}>
          {recipient.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.recipientInfo}>
        <Text style={styles.recipientName}>{recipient.name}</Text>
        <Text style={styles.recipientPhone}>{recipient.phoneNumber}</Text>
      </View>
      <Text style={styles.lastTransaction}>{recipient.lastTransaction}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Transact</Text>
        </View>

        <View style={styles.transactionTypesContainer}>
          {transactionTypes.map(renderTransactionType)}
        </View>

        <View style={styles.recentRecipientsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Recipients</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentRecipients.map(renderRecentRecipient)}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#411D4B" />
          <Text style={styles.infoText}>
            Need help with a transaction? Contact our support team for assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
  },
  transactionTypesContainer: {
    padding: 20,
  },
  transactionTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionTypeInfo: {
    flex: 1,
  },
  transactionTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#411D4B',
    marginBottom: 4,
  },
  transactionTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  recentRecipientsContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#411D4B',
  },
  viewAllText: {
    fontSize: 14,
    color: '#411D4B',
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#411D4B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipientInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#411D4B',
    marginBottom: 4,
  },
  recipientPhone: {
    fontSize: 14,
    color: '#666',
  },
  lastTransaction: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 