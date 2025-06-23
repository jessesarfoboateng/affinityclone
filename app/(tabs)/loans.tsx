import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMockLoanProducts, LoanProduct } from '../../services/mockApi';
import { useTheme } from '@/context/ThemeContext'; // 👈 make sure path is correct

export default function LoansScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme(); // 👈 get theme values

  const [userData, setUserData] = React.useState<any>(null);
  const [loanProducts, setLoanProducts] = React.useState<LoanProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('userData');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');

      if (data) setUserData(JSON.parse(data));
      if (phoneNumber) await fetchLoanProducts(phoneNumber);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load loan products');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanProducts = async (phone: string) => {
    try {
      const productsData = await fetchMockLoanProducts(phone);
      setLoanProducts(productsData);
    } catch (error) {
      console.error('Error fetching loan products:', error);
      Alert.alert('Error', 'Failed to fetch loan products');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      if (phoneNumber) await fetchLoanProducts(phoneNumber);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoanPress = (loan: LoanProduct) => {
    if (!loan.isEligible) {
      Alert.alert('Not Eligible', loan.eligibilityReason || 'You are not eligible for this loan product.');
      return;
    }

    Alert.alert('Coming Soon', `Loan application for ${loan.title} will be available soon`);
  };

  const renderLoanProduct = (loan: LoanProduct) => (
    <TouchableOpacity
      key={loan.id}
      style={[
        styles.loanCard,
        { backgroundColor: colors.card },
        !loan.isEligible && styles.loanCardDisabled,
      ]}
      onPress={() => handleLoanPress(loan)}
    >
      <View style={[styles.loanIconContainer, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}>
        <Ionicons name={loan.icon as any} size={32} color={colors.icon} />
      </View>
      <View style={styles.loanInfo}>
        <View style={styles.loanHeader}>
          <Text style={[styles.loanTitle, { color: colors.text }]}>{loan.title}</Text>
          {!loan.isEligible && (
            <View style={styles.eligibilityBadge}>
              <Text style={styles.eligibilityText}>Not Eligible</Text>
            </View>
          )}
        </View>
        <Text style={[styles.loanDescription, { color: colors.text }]}>{loan.description}</Text>
        <View style={styles.loanDetails}>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Interest Rate</Text>
            <Text style={[styles.loanDetailValue, { color: colors.text }]}>{loan.interestRate}</Text>
          </View>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Term</Text>
            <Text style={[styles.loanDetailValue, { color: colors.text }]}>{loan.term}</Text>
          </View>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Max Amount</Text>
            <Text style={[styles.loanDetailValue, { color: colors.text }]}>{loan.maxAmount}</Text>
          </View>
        </View>
        {!loan.isEligible && loan.eligibilityReason && (
          <Text style={[styles.eligibilityReason, { color: colors.text }]}>{loan.eligibilityReason}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color={colors.icon} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading loan products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Loans</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Choose from our range of loan products
          </Text>
        </View>

        <View style={styles.loanProductsContainer}>
          {loanProducts.length > 0 ? (
            loanProducts.map(renderLoanProduct)
          ) : (
            <View style={styles.emptyLoans}>
              <Ionicons name="cash-outline" size={40} color="#ccc" />
              <Text style={[styles.emptyLoansText, { color: colors.text }]}>No loan products available</Text>
            </View>
          )}
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}>
          <Ionicons name="information-circle-outline" size={24} color={colors.icon} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Need help choosing a loan? Contact our support team for personalized assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loanProductsContainer: {
    padding: 20,
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  loanInfo: {
    flex: 1,
  },
  loanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 4,
  },
  loanDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetail: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#411D4B',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
  // New styles for enhanced loan functionality
  loanCardDisabled: {
    opacity: 0.6,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eligibilityBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eligibilityText: {
    fontSize: 10,
    color: '#C62828',
    fontWeight: '600',
  },
  eligibilityReason: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#411D4B',
    marginTop: 16,
  },
  emptyLoans: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyLoansText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
}); 