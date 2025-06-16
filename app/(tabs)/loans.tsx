import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loanProducts = [
  {
    id: '1',
    title: 'Personal Loan',
    description: 'Quick access to funds for personal needs',
    interestRate: '15%',
    term: '12 months',
    maxAmount: 'GHS 10,000',
    icon: 'cash-outline',
  },
  {
    id: '2',
    title: 'Business Loan',
    description: 'Grow your business with flexible financing',
    interestRate: '12%',
    term: '24 months',
    maxAmount: 'GHS 50,000',
    icon: 'business-outline',
  },
  {
    id: '3',
    title: 'Education Loan',
    description: 'Invest in your future with education financing',
    interestRate: '10%',
    term: '36 months',
    maxAmount: 'GHS 30,000',
    icon: 'school-outline',
  },
];

export default function LoansScreen() {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLoanPress = (loanId: string) => {
    // TODO: Implement loan application flow
    console.log('Selected loan:', loanId);
  };

  const renderLoanProduct = (loan: typeof loanProducts[0]) => (
    <TouchableOpacity
      key={loan.id}
      style={styles.loanCard}
      onPress={() => handleLoanPress(loan.id)}
    >
      <View style={styles.loanIconContainer}>
        <Ionicons name={loan.icon as any} size={32} color="#411D4B" />
      </View>
      <View style={styles.loanInfo}>
        <Text style={styles.loanTitle}>{loan.title}</Text>
        <Text style={styles.loanDescription}>{loan.description}</Text>
        <View style={styles.loanDetails}>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Interest Rate</Text>
            <Text style={styles.loanDetailValue}>{loan.interestRate}</Text>
          </View>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Term</Text>
            <Text style={styles.loanDetailValue}>{loan.term}</Text>
          </View>
          <View style={styles.loanDetail}>
            <Text style={styles.loanDetailLabel}>Max Amount</Text>
            <Text style={styles.loanDetailValue}>{loan.maxAmount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Loans</Text>
          <Text style={styles.subtitle}>
            Choose from our range of loan products
          </Text>
        </View>

        <View style={styles.loanProductsContainer}>
          {loanProducts.map(renderLoanProduct)}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#411D4B" />
          <Text style={styles.infoText}>
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
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 