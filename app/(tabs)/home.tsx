import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../../services/api';
import { useApplication } from '../../context/ApplicationContext';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
  status: 'COMPLETED' | 'PENDING';
  senderPhoneNumber?: string;
  recipientPhoneNumber?: string;
}

const quickActions = [
  { id: '1', title: 'Send Money', icon: 'paper-plane', color: '#411D4B' },
  { id: '2', title: 'Pay Bills', icon: 'receipt', color: '#4CAF50' },
  { id: '3', title: 'Top Up', icon: 'phone-portrait', color: '#2196F3' },
  { id: '4', title: 'More', icon: 'apps', color: '#FF9800' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (!storedPhoneNumber) {
        // If no phone number found, sign out and go to phone screen
        const { signOut } = useApplication();
        await signOut();
        router.replace('/(auth)/phone');
        return;
      }
      setPhoneNumber(storedPhoneNumber);
      await fetchAccountData(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load account data');
    }
  };

  const fetchAccountData = async (phone: string) => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        apiService.getAccountBalance(phone),
        apiService.getRecentTransactions(phone)
      ]);
      setBalance(balanceData.balance);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching account data:', error);
      Alert.alert('Error', 'Failed to fetch account data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (phoneNumber) {
        await fetchAccountData(phoneNumber);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const handleQuickAction = async (actionId: string) => {
    if (!phoneNumber) return;

    switch (actionId) {
      case '1': // Send Money
        // TODO: Implement send money flow
        Alert.alert('Coming Soon', 'Send Money feature will be available soon');
        break;
      case '2': // Pay Bills
        // TODO: Implement pay bills flow
        Alert.alert('Coming Soon', 'Pay Bills feature will be available soon');
        break;
      case '3': // Top Up
        // TODO: Implement top up flow
        Alert.alert('Coming Soon', 'Top Up feature will be available soon');
        break;
      case '4': // More
        // TODO: Implement more options
        Alert.alert('Coming Soon', 'More features will be available soon');
        break;
    }
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.quickActionButton}
          onPress={() => handleQuickAction(action.id)}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
            <Ionicons name={action.icon as any} size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={transaction.type === 'CREDIT' ? 'arrow-down' : 'arrow-up'}
          size={24}
          color={transaction.type === 'CREDIT' ? '#4CAF50' : '#F44336'}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: transaction.type === 'CREDIT' ? '#4CAF50' : '#F44336' }
        ]}>
          {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.transactionStatus}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.name}>{phoneNumber}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#411D4B" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.balanceActionButton}
              onPress={() => handleQuickAction('3')}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.balanceActionText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.balanceActionButton}
              onPress={() => handleQuickAction('2')}
            >
              <Ionicons name="arrow-up-circle-outline" size={20} color="white" />
              <Text style={styles.balanceActionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {transactions.map(renderTransaction)}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Get 5% Cashback</Text>
            <Text style={styles.promoDescription}>On all bill payments this month</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/images/relafinlogo.png')}
            style={styles.promoImage}
            resizeMode="contain"
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#411D4B',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  balanceActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  balanceActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 5,
  },
  balanceActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  transactionsContainer: {
    padding: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#411D4B',
  },
  viewAllText: {
    fontSize: 14,
    color: '#411D4B',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#411D4B',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
  },
  promoBanner: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#411D4B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  promoImage: {
    width: 100,
    height: 100,
  },
});
