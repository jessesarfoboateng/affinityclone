import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Platform, TextInput, Linking, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const { height } = Dimensions.get('window');

export default function ContactUsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: Implement contact form submission
    router.back();
  };

  const handleCall = () => {
    Linking.openURL('tel:+233536941800');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:arthurjrdennis@gmail.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/233536941800');
  };

  const handleWebsite = () => {
    Linking.openURL('https://relafin.com');
  };

  const handleLinkedIn = () => {
    Linking.openURL('https://linkedin.com/company/relafin');
  };

  const handleTwitter = () => {
    Linking.openURL('https://twitter.com/relafin');
  };

  const handleFAQPress = () => {
    router.push('/faq');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#411D4B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/relafinlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Ionicons name="mail-outline" size={24} color="#411D4B" />
              <Text style={styles.contactText}>arthurjrdennis@gmail.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Ionicons name="call-outline" size={24} color="#411D4B" />
              <Text style={styles.contactText}>+233 53 694 1800</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={24} color="#411D4B" />
              <Text style={styles.contactText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={24} color="#411D4B" />
              <Text style={styles.contactText}>Accra, Ghana</Text>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleFAQPress}>
              <Ionicons name="help-circle-outline" size={24} color="#411D4B" />
              <Text style={styles.contactText}>View Frequently Asked Questions</Text>
            </TouchableOpacity>
          </View>

          {/* Business Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Monday - Friday</Text>
                <Text style={styles.timeText}>8:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Saturday</Text>
                <Text style={styles.timeText}>9:00 AM - 1:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.daysText}>Sunday</Text>
                <Text style={styles.timeText}>Closed</Text>
              </View>
            </View>
          </View>

          {/* Social Media */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect With Us</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
              <Ionicons name="globe-outline" size={24} color="#411D4B" />
              <Text style={styles.contactText}>Visit our website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleLinkedIn}>
              <Ionicons name="logo-linkedin" size={24} color="#411D4B" />
              <Text style={styles.contactText}>Follow on LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleTwitter}>
              <Ionicons name="logo-twitter" size={24} color="#411D4B" />
              <Text style={styles.contactText}>Follow on Twitter</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send us a Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              multiline
              numberOfLines={6}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#411D4B',
    marginLeft: 16,
    fontFamily: 'Roboto',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.15,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  logo: {
    width: '40%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 16,
    fontFamily: 'Roboto',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  contactText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    fontFamily: 'Roboto',
  },
  hoursContainer: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysText: {
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'Roboto',
  },
  timeText: {
    fontSize: 16,
    color: '#411D4B',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Roboto',
  },
  submitButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
}); 