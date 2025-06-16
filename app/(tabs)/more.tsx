import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const menuItems = [
  {
    id: '1',
    title: 'Profile Settings',
    icon: 'person-circle-outline',
    type: 'link',
  },
  {
    id: '2',
    title: 'Security',
    icon: 'shield-checkmark-outline',
    type: 'link',
  },
  {
    id: '3',
    title: 'Notifications',
    icon: 'notifications-outline',
    type: 'link',
  },
  {
    id: '4',
    title: 'Dark Mode',
    icon: 'moon-outline',
    type: 'toggle',
  },
  {
    id: '5',
    title: 'Help & Support',
    icon: 'help-circle-outline',
    type: 'link',
  },
  {
    id: '6',
    title: 'About',
    icon: 'information-circle-outline',
    type: 'link',
  },
];

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');

  const handleToggle = (id: string) => {
    if (id === '4') {
      setIsDarkMode(!isDarkMode);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>More</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.type === 'link' ? console.log(`Selected ${item.title}`) : handleToggle(item.id)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#411D4B" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              {item.type === 'link' ? (
                <Ionicons name="chevron-forward" size={24} color="#666" />
              ) : (
                <Switch
                  value={isDarkMode}
                  onValueChange={() => handleToggle(item.id)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isDarkMode ? '#411D4B' : '#f4f3f4'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#411D4B',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
}); 