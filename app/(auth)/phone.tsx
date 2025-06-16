import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useApplication } from '../../context/ApplicationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PhoneScreen() {
  const router = useRouter();
  const { setAuthenticated } = useApplication();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneNumberChange = (text: string) => {
    // Remove any non-digit characters
    const numbersOnly = text.replace(/[^0-9]/g, '');

    // Remove leading 0 if present
    const formattedNumber = numbersOnly.startsWith('0') ? numbersOnly.substring(1) : numbersOnly;

    setPhoneNumber(formattedNumber);
  };

  const handleContinue = async () => {
    // Validate phone number
    if (phoneNumber.length !== 9) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 9-digit phone number without the leading 0');
      return;
    }

    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_API_URL/api/auth/check-user', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber: `+233${phoneNumber}` })
      // });
      // const data = await response.json();

      // For now, simulate API call
      const userExists = false; // This will come from your backend

      if (userExists) {
        // User exists, set authenticated and store phone number
        await Promise.all([
          setAuthenticated(true),
          AsyncStorage.setItem('phoneNumber', phoneNumber)
        ]);
        router.replace('/(tabs)/home');
      } else {
        // User doesn't exist, go to OTP for registration
        router.push(`/otp?phoneNumber=${phoneNumber}`);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      Alert.alert('Error', 'Failed to check user status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactPress = () => {
    router.push('/contact-us');
  };

  const handleTermsPress = () => {
    router.push('/legal-docs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header Image */}
        <View style={styles.relafinlogocontainer}>
          <Image
            source={require('../../assets/images/relafinlogo.png')}
            style={styles.relafinlogo}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={styles.fillZoneContainer}>
          <Text style={styles.enterPhoneText}>
            Enter your phone number
          </Text>

          <View style={styles.phoneNumContainer}>
            <Text style={styles.phoneNumber}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../../assets/images/ghanaflag.png')}
                style={styles.flagImage}
                resizeMode="contain"
              />
              <Text style={styles.numCodeText}>+233</Text>
              <TextInput
                style={styles.inputNumber}
                placeholder="Enter your phone number (without 0)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                maxLength={9}
                editable={!isLoading}
              />
            </View>
            <Text style={styles.helperText}>
              Enter your 9-digit phone number without the leading 0
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signContinueButton, isLoading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.signContinueText}>
                    Continue
                  </Text>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleContactPress}>
              <Text style={styles.linkText}>Contact Us</Text>
            </TouchableOpacity>
            <Text style={styles.linkSeparator}>|</Text>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');
const bottomPadding = Platform.OS === 'ios' ? 34 : 24;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  relafinlogocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.2,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  relafinlogo: {
    width: '50%',
    height: '100%',
  },
  fillZoneContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: bottomPadding,
  },
  enterPhoneText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 20,
    marginLeft: 4,
  },
  phoneNumContainer: {
    marginBottom: 20,
    marginLeft: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#411D4B',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  flagImage: {
    width: 38,
    height: 24,
    marginRight: 8,
  },
  numCodeText: {
    fontSize: 16,
    color: '#411D4B',
    marginRight: 5,
    fontWeight: 'bold',
  },
  inputNumber: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#411D4B',
  },
  signContinueButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  signContinueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#411D4B',
    fontSize: 14,
  },
  linkSeparator: {
    color: '#411D4B',
    marginHorizontal: 10,
  },
});