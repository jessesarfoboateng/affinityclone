import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { findNodeHandle } from 'react-native';

import { useEffect, useRef } from 'react';
import { Icon } from '../../components/Icon';

const { height } = Dimensions.get('window');

export default function LegalDocsScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams();

  const scrollViewRef = useRef<ScrollView>(null!);
  const termsRef = useRef<View>(null!);
  const privacyRef = useRef<View>(null!);

  useEffect(() => {
    const scrollToSection = async () => {
      let refToScroll: React.RefObject<View> | null = null;
    
      if (section === 'terms') refToScroll = termsRef;
      else if (section === 'privacy') refToScroll = privacyRef;
    
      if (refToScroll?.current && scrollViewRef.current) {
        const scrollViewHandle = findNodeHandle(scrollViewRef.current);
        if (scrollViewHandle) {
          // Use type assertion to bypass TypeScript limitations
          (refToScroll.current as any).measureLayout(
            scrollViewHandle,
            (x: number, y: number) => {
              scrollViewRef.current?.scrollTo({ y, animated: true });
            },
            () => {
              // You can log a generic warning; TypeScript expects this to have no args
              console.warn('Failed to measure layout for section:', section);
            }
          );
        }
      }
    }

    setTimeout(scrollToSection, 300); // Ensure layout is ready
  }, [section]);

  const screenTitle =
    section === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#411D4B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{screenTitle}</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/relafinlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View ref={termsRef} style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using the Relafin mobile application, you agree
              to be bound by these Terms and Conditions. If you do not agree to
              these terms, please do not use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Account Registration</Text>
            <Text style={styles.sectionText}>
              You must provide accurate and complete information when creating
              your account. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account.
            </Text>
          </View>

          <View ref={privacyRef} style={styles.section}>
            <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
            <Text style={styles.sectionText}>
              Your use of the application is also governed by our Privacy
              Policy, which outlines how we collect, use, and protect your
              personal information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Financial Services</Text>
            <Text style={styles.sectionText}>
              Relafin provides financial services subject to applicable laws and
              regulations. All transactions are processed securely, and we
              maintain appropriate security measures to protect your financial
              information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. User Responsibilities</Text>
            <Text style={styles.sectionText}>
              You agree to use the application only for lawful purposes and in
              accordance with these terms. You must not use the application to
              engage in any fraudulent or illegal activities.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              Relafin shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes through the application or
              via email.
            </Text>
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  sectionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontFamily: 'Roboto',
  },
});
