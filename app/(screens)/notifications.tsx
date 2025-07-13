import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
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
    { id: '1', text: 'Transaction completed', read: false },
    { id: '2', text: 'Your account statement is ready', read: false },
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 130,
    height: 130,
    marginBottom: 20,
    tintColor: '#4B2354',
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 55,
    right: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  notificationItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  notificationText: {
    fontSize: 15,
    color: '#333',
  },
});
