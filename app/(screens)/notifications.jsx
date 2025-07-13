import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NotificationsScreen() {
  const { showMenu } = useLocalSearchParams();
  const router = useRouter();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    // { id: '1', text: 'Transaction completed', read: false },
    // { id: '2', text: 'Your account statement is ready', read: false },
  ]);

  useEffect(() => {
    if (showMenu) {
      setMenuVisible(true);
      router.setParams({ showMenu: undefined }); // Reset param after opening menu
    }
  }, [showMenu]);

  const markAllAsRead = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    setMenuVisible(false);
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationItem, item.read && { backgroundColor: '#F5F5F5' }]}>
      <Text style={[styles.notificationText, item.read && { color: '#A3A3A3' }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Content */}
      {notifications.length === 0 || notifications.every((n) => n.read) ? (
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/bell-icon.png")}
            style={styles.image}
          />
          <Text style={styles.message}>
            You have no notifications yet{'\n'}
            and when you do, they will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.menuText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 32,
    tintColor: '#4B2354',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
    fontWeight: '400',
  },
})