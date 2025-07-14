import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MakePaymentScreen = () => {
  const router = useRouter();

  const handleServicePress = (service) => {
    router.push('../../(screens)/payment/AddRecipient');
    console.log('Selected service:', service);
    // Handle service selection
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make payment</Text>
      </View>

      {/* Service Providers Section */}
      <View style={styles.content}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Service providers</Text>
          <Text style={styles.sectionSubtitle}>Select a service to pay for</Text>
          
          {/* Airtime top-up */}
          <View style={styles.serviceSection}>
            <View style={styles.serviceTitleContainer}>
              <Ionicons name="phone-portrait-outline" size={20} color="#666" />
              <Text style={styles.serviceTitle}>Airtime top-up</Text>
            </View>
            
            <View style={styles.providersContainer}>
              <TouchableOpacity 
                style={styles.providerItem}
                onPress={() => handleServicePress('mtn-prepaid')}
              >
                <View style={[styles.providerIcon, { backgroundColor: '#FFEB3B' }]}>
                  <Text style={styles.providerIconText}>MTN</Text>
                </View>
                <Text style={styles.providerName}>MTN</Text>
                <Text style={styles.providerSubtext}>Prepaid</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.providerItem}
                onPress={() => handleServicePress('telecel-prepaid')}
              >
                <View style={[styles.providerIcon, { backgroundColor: '#E91E63' }]}>
                  <Text style={[styles.providerIconText, { color: '#fff' }]}>t</Text>
                </View>
                <Text style={styles.providerName}>Telecel</Text>
                <Text style={styles.providerSubtext}>Prepaid</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.providerItem}
                onPress={() => handleServicePress('at-airtime')}
              >
                <View style={[styles.providerIcon, { backgroundColor: '#E0E0E0' }]}>
                  <Text style={styles.providerIconText}>at</Text>
                </View>
                <Text style={styles.providerName}>AT Airtime</Text>
                <Text style={styles.providerSubtext}>Topup</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Data bundle */}
          <View style={styles.serviceSection}>
            <View style={styles.serviceTitleContainer}>
              <Ionicons name="wifi-outline" size={20} color="#666" />
              <Text style={styles.serviceTitle}>Data bundle</Text>
            </View>
            
            <View style={styles.providersContainer}>
              <TouchableOpacity 
                style={styles.providerItem}
                onPress={() => handleServicePress('mtn-data')}
              >
                <View style={[styles.providerIcon, { backgroundColor: '#FFEB3B' }]}>
                  <Text style={styles.providerIconText}>MTN</Text>
                </View>
                <Text style={styles.providerName}>MTN 4G</Text>
                <Text style={styles.providerSubtext}>data</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.providerItem}
                onPress={() => handleServicePress('telecel-broadband')}
              >
                <View style={[styles.providerIcon, { backgroundColor: '#E91E63' }]}>
                  <Text style={[styles.providerIconText, { color: '#fff' }]}>t</Text>
                </View>
                <Text style={styles.providerName}>Telecel</Text>
                <Text style={styles.providerSubtext}>broadband</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Offset for centered title
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  serviceSection: {
    marginBottom: 32,
  },
  serviceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  providersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  providerItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  providerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  providerSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default MakePaymentScreen;