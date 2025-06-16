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
  RefreshControl,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../../services/api';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function AccountsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
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
      await fetchAccounts(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load account data');
    }
  };

  const fetchAccounts = async (phone: string) => {
    try {
      const accountsData = await apiService.getAccounts(phone);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Alert.alert('Error', 'Failed to fetch accounts');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (phoneNumber) {
        await fetchAccounts(phoneNumber);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleAccountPress = (account: Account) => {
    // TODO: Implement account details view
    Alert.alert('Coming Soon', 'Account details view will be available soon');
  };

  const renderAccount = (account: Account) => (
    <TouchableOpacity
      key={account.id}
      style={styles.accountCard}
      onPress={() => handleAccountPress(account)}
    >
      <View style={styles.accountHeader}>
        <View style={styles.accountTypeContainer}>
          <Ionicons name="wallet-outline" size={24} color="#411D4B" />
          <Text style={styles.accountType}>{account.accountType}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: account.status === 'ACTIVE' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: account.status === 'ACTIVE' ? '#2E7D32' : '#C62828' }
          ]}>
            {account.status}
          </Text>
        </View>
      </View>
      <Text style={styles.accountNumber}>{account.accountNumber}</Text>
      <Text style={styles.balance}>
        {formatCurrency(account.balance, account.currency)}
      </Text>
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
        <View style={styles.header}>
          <Text style={styles.title}>My Accounts</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#411D4B" />
          </TouchableOpacity>
        </View>

        <View style={styles.accountsContainer}>
          {accounts.map(renderAccount)}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#411D4B" />
          <Text style={styles.infoText}>
            Need help? Contact our support team for assistance with your accounts.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
  },
  addButton: {
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
  accountsContainer: {
    padding: 20,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#411D4B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
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