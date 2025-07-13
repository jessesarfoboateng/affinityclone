import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  {
    id: '1',
    title: 'Personal details',
    subtitle: 'View your personal information',
    icon: 'person-outline',
    type: 'link',
  },
  {
    id: '2',
    title: 'Security details',
    subtitle: 'Change your PIN',
    icon: 'key-outline',
    type: 'link',
  },
  {
    id: '3',
    title: 'Account settings',
    subtitle: 'Manage account withdrawal limits',
    icon: 'settings-outline',
    type: 'link',
  },
  {
    id: '4',
    title: 'Request a statement',
    subtitle: 'Request a statement of account',
    icon: 'document-text-outline',
    type: 'link',
  },
  {
    id: '5',
    title: 'Notifications',
    subtitle: 'Manage your notification settings',
    icon: 'notifications-outline',
    type: 'link',
  },
  // {
  //   id: '6',
  //   title: 'Dark Mode',
  //   subtitle: 'Toggle dark mode on/off',
  //   icon: 'moon-outline',
  //   type: 'toggle',
  // },
  // {
  //   id: '7',
  //   title: 'Help & Support',
  //   subtitle: 'Get help and support',
  //   icon: 'help-circle-outline',
  //   type: 'link',
  // },
  // {
  //   id: '8',
  //   title: 'About',
  //   subtitle: 'App information and version',
  //   icon: 'information-circle-outline',
  //   type: 'link',
  // },
];

export default function MoreScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const styles = getStyles(isDarkMode);

  const handleToggle = (id: string) => {
    if (id === '6') {
      toggleTheme();
    }
  };

  const ProfileHeader = () => (
    <View style={styles.profileSection}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#FFB74D', '#FF7043', '#29B6F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>JS</Text>
            </View>
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>Jesse Sarfo-boateng</Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileHeader />

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={() => {
                if (item.type === 'link') {
                  console.log(`Navigating to ${item.title}`);
                  // router.push(...) here
                } else if (item.type === 'toggle') {
                  handleToggle(item.id);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={isDarkMode ? '#64B5F6' : '#64B5F6'}
                  />
                </View>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              {/* {item.type === 'toggle' ? (
                <Switch
                  value={isDarkMode}
                  onValueChange={() => handleToggle(item.id)}
                  trackColor={{ false: '#E0E0E0', true: '#64B5F6' }}
                  thumbColor={isDarkMode ? '#fff' : '#fff'}
                  ios_backgroundColor="#E0E0E0"
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? '#888' : '#C0C0C0'}
                />
              )} */}
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

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#F8F9FA',
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      marginBottom: 0,
    },
    gradientHeader: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDarkMode ? '#333' : 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    profileInitials: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#666',
    },
    cameraIcon: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#fff',
    },
    profileName: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
      textAlign: 'center',
    },
    menuContainer: {
      backgroundColor: isDarkMode ? '#111' : '#fff',
      marginTop: 24,
      marginHorizontal: 16,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#F5F5F5',
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#1E3A8A' : '#E3F2FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuItemTextContainer: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#1A1A1A',
      marginBottom: 4,
    },
    menuItemSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#888' : '#666',
      lineHeight: 18,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#111' : '#fff',
      marginTop: 24,
      marginHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 16,
      marginBottom: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FF3B30',
      marginLeft: 8,
    },
  });