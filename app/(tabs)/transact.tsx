import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { fetchMockRecentRecipients, RecentRecipient } from '../../services/mockApi';

const transactionTypes = [
  {
    id: '1',
    title: 'Send Money',
    icon: 'paper-plane',
    color: '#2196F3',
    bgColor: '#eff8ffff',
    description: 'Transfer money to other Relafin users',
  },
  {
    id: '2',
    title: 'Deposit into account',
    icon: 'receipt',
    color: '#FF9800',
    bgColor: '#f7ecdcff',
    description: 'Receive from your mobile wallet',
  },
  {
    id: '3',
    title: 'Make payment',
    icon: 'phone-portrait',
    color: '#4CAF50',
    bgColor: '#e2f7e2ff',
    description: 'Pay for airtime, bills and data',
  },
  {
    id: '4',
    title: 'Scheduled transactions',
    icon: 'cash',
    color: '#746d6dff',
    bgColor: '#e0d2d227',
    description: 'View recurring transactions',
  },
];

export default function TransactScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [recentRecipients, setRecentRecipients] = useState<RecentRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (!storedPhoneNumber) {
        router.replace('/(auth)/phone');
        return;
      }
      setPhoneNumber(storedPhoneNumber);
      await fetchRecentRecipients(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentRecipients = async (phone: string) => {
    try {
      const recipientsData = await fetchMockRecentRecipients(phone);
      setRecentRecipients(recipientsData);
    } catch (error) {
      console.error('Error fetching recent recipients:', error);
      Alert.alert('Error', 'Failed to fetch recent recipients');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (phoneNumber) {
        await fetchRecentRecipients(phoneNumber);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTransactionTypePress = (typeId: string) => {
    Alert.alert('Coming Soon', 'This feature will be available soon');
  };

  const handleRecipientPress = (recipientId: string) => {
    Alert.alert('Coming Soon', 'Recipient selection will be available soon');
  };

  const renderTransactionType = (type: typeof transactionTypes[0]) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.transactionTypeCard,
        { backgroundColor: type.bgColor },
      ]}
      onPress={() => handleTransactionTypePress(type.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
        <Ionicons name={type.icon as any} size={24} color="#fff" />
      </View>
      <View style={styles.transactionTypeInfo}>
        <Text style={[styles.transactionTypeTitle, { color: isDarkMode ? '#fff' : '#411D4B' }]}>
          {type.title}
        </Text>
        <Text style={[styles.transactionTypeDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>
          {type.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentRecipient = (recipient: RecentRecipient) => (
    <TouchableOpacity
      key={recipient.id}
      style={[styles.recipientCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
      onPress={() => handleRecipientPress(recipient.id)}
    >
      <View style={[styles.recipientAvatar, { backgroundColor: '#411D4B' }]}>
        <Text style={styles.recipientInitial}>{recipient.name.charAt(0)}</Text>
      </View>
      <View style={styles.recipientInfo}>
        <Text style={[styles.recipientName, { color: isDarkMode ? '#fff' : '#411D4B' }]}>
          {recipient.name}
        </Text>
        <Text style={[styles.recipientPhone, { color: isDarkMode ? '#aaa' : '#666' }]}>
          {recipient.phoneNumber}
        </Text>
      </View>
      <Text style={[styles.lastTransaction, { color: isDarkMode ? '#aaa' : '#666' }]}>
        {recipient.lastTransaction}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#F5F5F5' }]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#411D4B" />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#411D4B' }]}>
            Loading transaction options...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#F5F5F5' }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: isDarkMode ? '#000' : '#F5F5F5' }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#411D4B' }]}>Transact</Text>
          <Text style={{marginTop: 10}}>Select a transaction option</Text>
        </View>

        <View style={styles.transactionTypesContainer}>
          {transactionTypes.map(renderTransactionType)}
        </View>

        {/* <View style={styles.recentRecipientsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#411D4B' }]}>
              Recent Recipients
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: isDarkMode ? '#ccc' : '#411D4B' }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {recentRecipients.length > 0 ? (
            recentRecipients.map(renderRecentRecipient)
          ) : (
            <View style={styles.emptyRecipients}>
              <Ionicons name="people-outline" size={40} color="#ccc" />
              <Text style={[styles.emptyRecipientsText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                No recent recipients
              </Text>
            </View>
          )}
        </View> */}

        {/* <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
          <Ionicons name="information-circle-outline" size={24} color="#411D4B" />
          <Text style={[styles.infoText, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Need help with a transaction? Contact our support team for assistance.
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 33, fontWeight: 'bold' },
  transactionTypesContainer: { padding: 20 },
  transactionTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    height: 95,
    borderRadius: 12,
    marginBottom: 15,
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
  transactionTypeInfo: { flex: 1 },
  transactionTypeTitle: { fontSize: 19, fontWeight: '500' },
  transactionTypeDescription: { fontSize: 14, marginTop: 7 },
  recentRecipientsContainer: { padding: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  viewAllText: { fontSize: 14 },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipientInitial: { fontSize: 18, fontWeight: '600', color: '#fff' },
  recipientInfo: { flex: 1 },
  recipientName: { fontSize: 16, fontWeight: '500' },
  recipientPhone: { fontSize: 14 },
  lastTransaction: { fontSize: 12 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  emptyRecipients: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyRecipientsText: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
});
