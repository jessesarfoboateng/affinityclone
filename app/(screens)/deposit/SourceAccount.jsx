import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SourceAccountPage() {
  const handleAddSecondaryPhone = () => {
    // Handle add secondary phone number
    console.log('Add secondary phone pressed');
  };

  const handleAccountSelect = () => {
    // Handle account selection
    console.log('Account selected');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Source account</Text>
          <Text style={styles.subtitle}>Select a wallet to send from</Text>
        </View>

        {/* Account Card */}
        <TouchableOpacity 
          style={styles.accountCard}
          onPress={handleAccountSelect}
          activeOpacity={0.7}
        >
          <View style={styles.accountInfo}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>₵</Text>
            </View>
            <View style={styles.accountDetails}>
              <Text style={styles.accountNumber}>233206841990</Text>
              <Text style={styles.accountName}>Seth Asante Kwarteng</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Add Secondary Phone Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddSecondaryPhone}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color="#00BCD4" />
          <Text style={styles.addButtonText}>Add secondary phone number</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accountDetails: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    color: '#00BCD4',
    marginLeft: 8,
    fontWeight: '500',
  },
});