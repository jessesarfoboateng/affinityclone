import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
//import { apiService } from '../../services/api';
import { fetchMockAccountData } from '../../services/mockApi';

import { useApplication } from '../../context/ApplicationContext';



const { width } = Dimensions.get('window');


type Service = {
  id: string;
  title: string;
  icon: string;
  color: string;
};


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

interface UserData {
  id: number;
  phoneNumber: string;
  isPinSet: boolean;
  application?: {
    id: number;
    status: string;
    ghanaCardNumber: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      city: string;
      region: string;
    };
  };
}

const quickActions = [
  { id: '1', title: 'Send money', icon: 'paper-plane-outline', color: '#E3F2FD', iconColor: '#2196F3' },
  { id: '2', title: 'Deposit money', icon: 'wallet-outline', color: '#FFF3E0', iconColor: '#FF9800' },
  { id: '3', title: 'Make payment', icon: 'card-outline', color: '#E8F5E8', iconColor: '#4CAF50' },
  { id: '4', title: 'Add account', icon: 'add-circle-outline', color: '#F3E5F5', iconColor: '#9C27B0' },
];

export default function HomeScreen() {


  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const styles = getStyles(isDarkMode);

  const router = useRouter();
  const { signOut } = useApplication();

  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // New state for balance visibility

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load user data from storage
      const storedUserData = await AsyncStorage.getItem('userData');
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

      if (!storedPhoneNumber || !storedUserData) {
        console.log('No user data found, redirecting to phone screen');
        await signOut();
        router.replace('/(auth)/phone');
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setPhoneNumber(storedPhoneNumber);

      await fetchAccountData(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load account data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountData = async (phone: string) => {
    try {
      const { balanceData, transactionsData } = await fetchMockAccountData(phone);
      setBalance(balanceData.balance);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching mock data:', error);
      Alert.alert('Error', 'Failed to load account data. Please try again.');
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserDisplayName = () => {
    if (userData?.application?.personalInfo?.firstName) {
      return userData.application.personalInfo.firstName;
    }
    return phoneNumber || 'User';
  };

  const getApplicationStatus = () => {
    if (!userData?.application) return null;

    const status = userData.application.status;
    const statusColors = {
      'PENDING': '#FF9800',
      'DOCUMENTS_SUBMITTED': '#2196F3',
      'APPROVED': '#4CAF50',
      'REJECTED': '#F44336'
    };

    return {
      status,
      color: statusColors[status as keyof typeof statusColors] || '#666'
    };
  };

  const handleQuickAction = async (actionId: string) => {
    if (!phoneNumber) return;

    switch (actionId) {
      case '1': // Send Money
       router.push("../../(screens)/sendMoney/SendMoney");
        break;
      case '2': // Deposit into account
         router.push("../../(screens)/Deposit");
        break;
      case '3': // Make Payment
         router.push("../../(screens)/Payment");
        break;
      case '4': // Add account
         router.push("../../(screens)/AddAccount");
        break;
    }
  };

  // New function to toggle balance visibility
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Function to display balance or asterisks
  const getDisplayBalance = () => {
    if (isBalanceVisible) {
      return formatCurrency(balance);
    } else {
      return 'GH₵ ****';
    }
  };



 const renderQuickActions = () => (
  <View style={styles.quickActionsContainer}>
    <Text style={styles.quickActionsTitle}>Quick actions</Text>
    <View style={styles.quickActionsGrid}>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.quickActionCard, { backgroundColor: action.color }]}
          onPress={() => handleQuickAction(action.id)}
        >
          <View style={styles.quickActionContent}>
            <Ionicons 
              name={action.icon as any} 
              size={24} 
              color={action.iconColor} 
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
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
          {isBalanceVisible
            ? `${transaction.type === 'CREDIT' ? '+' : '-'}${formatCurrency(transaction.amount)}`
            : `${transaction.type === 'CREDIT' ? '+' : '-'}GH₵ ****`
          }
        </Text>
        <Text style={styles.transactionStatus}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderApplicationStatus = () => {
    const appStatus = getApplicationStatus();
    if (!appStatus) return null;

    return (
      <View style={styles.applicationStatusContainer}>
        <View style={styles.applicationStatusCard}>
          <View style={styles.applicationStatusHeader}>
            <Ionicons name="document-text" size={20} color={appStatus.color} />
            <Text style={styles.applicationStatusTitle}>Application Status</Text>
          </View>
          <View style={styles.applicationStatusContent}>
            <Text style={[styles.applicationStatusText, { color: appStatus.color }]}>
              {appStatus.status.replace('_', ' ')}
            </Text>
            <Text style={styles.applicationStatusDescription}>
              {appStatus.status === 'PENDING' && 'Your application is being reviewed'}
              {appStatus.status === 'DOCUMENTS_SUBMITTED' && 'Documents received, under review'}
              {appStatus.status === 'APPROVED' && 'Your account is ready to use'}
              {appStatus.status === 'REJECTED' && 'Please contact support for assistance'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#411D4B" />
          <Text style={styles.loadingText}>Loading your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Add this component to your HomeScreen file
  const HorizontalServicesList = () => {

    const router = useRouter();

    // ✅ Define your services array using the correct type
    const services: Service[] = [
      { id: '1', title: 'Contact Us', icon: 'call-outline', color: '#4CAF50' },
      { id: '2', title: 'Refer and Earn', icon: 'people-outline', color: '#FF9800' },
      { id: '3', title: 'Request a Statement', icon: 'document-text-outline', color: '#2196F3' },
    ];

    const handleServicePress = (serviceId: string, title: string) => {
      switch (serviceId) {
        case '1':
          console.log('Navigating to /(screens)/contact-us');
          router.push('../../(screens)/contact-us');


          break;
        case '2':
          Alert.alert('Refer and Earn', 'Share your referral code and earn rewards!');
          break;
        case '3':
          Alert.alert('Request Statement', 'Your statement will be sent to your registered email address.');
          break;
        default:
          Alert.alert('Coming Soon', `${title} feature will be available soon`);
      }
    };

    // ✅ Tell TypeScript that item is of type Service
    const renderServiceItem = ({ item }: { item: Service }) => (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => handleServicePress(item.id, item.title)}
      >
        <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon as any} size={24} color="white" />
        </View>
        <Text style={styles.serviceText}>{item.title}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>More Services</Text>
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          style={styles.flatListContainer}
        />
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={require('../../assets/images/relafinlogo.png')}
          style={styles.contain}>
          {/* Header */}
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.name}>{getUserDisplayName()}</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton} onPress={() =>router.push("../../(screens)/notifications")}>
                <Ionicons name="notifications-outline" size={24} color="#411D4B" />
                
                <View style={styles.badge}>
                  <Text style={styles.badgeText}></Text>
                </View>
              

              </TouchableOpacity>
            </View>


            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <View style={styles.balanceAmountRow}>
                <Text style={styles.balanceAmount}>{getDisplayBalance()}</Text>
                <TouchableOpacity style={styles.eyeButton}
                  onPress={toggleBalanceVisibility}>
                  <Ionicons name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#fff" />
                </TouchableOpacity>
              </View>
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
          </View>

        </ImageBackground>

        {/* Application Status */}
        {renderApplicationStatus()}

        <View>
          {/* Quick Actions */}
          {renderQuickActions()}
        </View>

        {HorizontalServicesList()}

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {transactions.length > 0 ? (
            transactions.map(renderTransaction)
          ) : (
            <View style={styles.emptyTransactions}>
              <Ionicons name="receipt-outline" size={40} color="#ccc" />
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
            </View>
          )}
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

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#666',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#411D4B',
    },
    notificationButton: {
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
      padding: 8,
      borderRadius: 20,
      position: 'relative', 
    },
    
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
    balanceCard: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#411D4B',
      margin: 20,
      borderRadius: 12,
      padding: 20,
    },
    balanceLabel: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#fff',
    },
    balanceAmountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    eyeButton: {
      marginLeft: 10,
    },
    balanceActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    balanceActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6200EE',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    balanceActionText: {
      color: '#fff',
      marginLeft: 6,
    },
    applicationStatusContainer: {
      padding: 16,
    },
    applicationStatusCard: {
      backgroundColor: isDarkMode ? '#111' : '#f0f0f0',
      borderRadius: 12,
      padding: 16,
    },
    applicationStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    applicationStatusTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      color: isDarkMode ? '#fff' : '#411D4B',
    },
    applicationStatusContent: {
      marginTop: 10,
    },
    applicationStatusText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    applicationStatusDescription: {
      fontSize: 13,
      color: isDarkMode ? '#aaa' : '#666',
    },
    quickActionsContainer: {
     padding: 16,
    },
    quickActionsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#666',
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    quickActionCard: {
      width: (width - 44) / 2, // Calculate width for 2 columns with gaps
      height: 65,
      borderRadius: 12,
      padding: 12,
      justifyContent: 'center',
    },
    quickActionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quickActionIcon: {
      marginRight: 12,
    },
    quickActionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? '#fff' : '#333',
      flex: 1,
    },
    transactionsContainer: {
      padding: 16,
    },
    transactionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    transactionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#411D4B',
    },
    viewAllText: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#411D4B',
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    transactionIcon: {
      marginRight: 10,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 14,
      color: isDarkMode ? '#fff' : '#333',
    },
    transactionDate: {
      fontSize: 12,
      color: isDarkMode ? '#aaa' : '#999',
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    transactionStatus: {
      fontSize: 12,
      color: isDarkMode ? '#ccc' : '#666',
    },
    emptyTransactions: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyTransactionsText: {
      fontSize: 16,
      color: '#ccc',
      marginTop: 8,
    },
    promoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
      borderRadius: 12,
      margin: 20,
    },
    promoContent: {
      flex: 1,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#411D4B',
    },
    promoDescription: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 10,
    },
    promoButton: {
      backgroundColor: '#6200EE',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    promoButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    promoImage: {
      width: 80,
      height: 80,
      marginLeft: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#411D4B',
      marginTop: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#411D4B',
      marginBottom: 10,
      marginLeft: 16,
    },
    flatListContainer: {
      paddingHorizontal: 16,
    },
    flatListContent: {
      gap: 10,
    },
    serviceItem: {
      alignItems: 'center',
      marginRight: 16,
    },
    serviceIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    serviceText: {
      fontSize: 12,
      color: isDarkMode ? '#ccc' : '#333',
    },
    contain: {
      paddingBottom: 10,
    }
  });
