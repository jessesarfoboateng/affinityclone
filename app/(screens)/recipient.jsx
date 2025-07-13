import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function DestinationAccount() {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('favourites');

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    router.push('/'); // Navigate to home or previous screen
  };

  const dismissCancel = () => {
    setShowCancelModal(false);
  };

  const handleAddNewRecipient = () => {
    // Navigate to add recipient screen
    console.log('Add new recipient pressed');
  };

  // Configure the default header with cancel functionality
  const CancelButton = () => (
    <TouchableOpacity onPress={handleCancel}>
      <Text style={styles.cancelText}>Cancel</Text>
    </TouchableOpacity>
  );

  const BackButton = () => (
    <TouchableOpacity onPress={() => router.back()}>
      <FontAwesome name="chevron-left" size={18} color="#3D1A4D" />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Send money',
          headerLeft: () => <BackButton />,
          headerRight: () => <CancelButton />,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#3D1A4D',
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Destination account</Text>
          <Text style={styles.subtitle}>Add or select a recipient</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipients"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Add New Recipient */}
        <TouchableOpacity style={styles.addRecipientButton} onPress={handleAddNewRecipient}>
          <FontAwesome name="plus" size={16} color="#4A90E2" />
          <Text style={styles.addRecipientText}>Add new recipient</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favourites' && styles.activeTab]}
            onPress={() => setActiveTab('favourites')}
          >
            <Text style={[styles.tabText, activeTab === 'favourites' && styles.activeTabText]}>
              Favourites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All recipients
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'favourites' ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <FontAwesome name="users" size={32} color="#FFB84D" />
              </View>
              <Text style={styles.emptyStateTitle}>No favourites to show</Text>
              <Text style={styles.emptyStateMessage}>
                Add a recipient to your favourites to see them here
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <FontAwesome name="users" size={32} color="#FFB84D" />
              </View>
              <Text style={styles.emptyStateTitle}>No recipients to show</Text>
              <Text style={styles.emptyStateMessage}>
                Add a recipient to see them here
              </Text>
            </View>
          )}
        </View>

        {/* Cancel Modal */}
        <Modal
          visible={showCancelModal}
          transparent={true}
          animationType="fade"
          onRequestClose={dismissCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIcon}>
                <FontAwesome name="times" size={24} color="#87CEEB" />
              </View>
              
              <Text style={styles.modalTitle}>Cancel transaction?</Text>
              <Text style={styles.modalMessage}>
                This will delete all details you may have entered. This action cannot be undone.
              </Text>
              
              <TouchableOpacity style={styles.confirmButton} onPress={confirmCancel}>
                <Text style={styles.confirmButtonText}>Yes, cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dismissButton} onPress={dismissCancel}>
                <Text style={styles.dismissButtonText}>No, don't cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3D1A4D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#3D1A4D',
  },
  addRecipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addRecipientText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 10,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginRight: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6B46C1',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3D1A4D',
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D1A4D',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  // Modal Styles (same as original)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3D1A4D',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#6B46C1',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 15,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#6B46C1',
    width: '100%',
  },
  dismissButtonText: {
    color: '#3D1A4D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});