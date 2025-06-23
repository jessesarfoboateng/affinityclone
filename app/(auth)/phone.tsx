import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useApplication } from '../../context/ApplicationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTempData, saveTempData, clearTempData } from '../../utils/tempStorage';


export default function PhoneScreen() {

  const {setLastAuthStep} = useApplication()
  useEffect(() => {
    //Save this as the last authentication step
    setLastAuthStep('phone')
  }, []);
  const router = useRouter();
  const { setAuthenticated } = useApplication();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const loadPhone = async () => {
      const saved: { phoneNumber?: string } | null = await getTempData('phoneScreen');
      if (saved?.phoneNumber) {
        setPhoneNumber(saved.phoneNumber);
      }
    };
    loadPhone();
  }, []);
  
  
  useEffect(() => {
    saveTempData('phoneScreen', { phoneNumber });
  }, [phoneNumber]);
  

  const handlePhoneNumberChange = (text: string) => {
    // Remove any non-digit characters
    const numbersOnly = text.replace(/[^0-9]/g, '');

    // Remove leading 0 if present
    const formattedNumber = numbersOnly.startsWith('0') ? numbersOnly.substring(1) : numbersOnly;

    setPhoneNumber(formattedNumber);
  };

  const handleContinue = async () => {
    // Clean input and ensure it's a valid Ghanaian number format
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!/^0?[0-9]{9}$/.test(cleanedNumber)) {
      Alert.alert('Invalid Phone Number', 'Enter a valid 9-digit phone number. It may start with 0.');
      return;
    }

    // Remove leading zero if present
    const formattedNumber = cleanedNumber.length === 10 && cleanedNumber.startsWith('0')
      ? cleanedNumber.substring(1)
      : cleanedNumber;

    try {
      setIsLoading(true);

      // Simulated API call
      const userExists = false; // Replace with actual API call result

      // Save the cleaned/standardized number for both new and returning users
      await AsyncStorage.setItem('phoneNumber', formattedNumber);

       // ✅ Clear temporary data now that this step is complete
    await clearTempData('phoneScreen');

      if (userExists) {
        await setAuthenticated(true);
        router.replace('/(tabs)/home');
      } else {
        router.push(`/otp?phoneNumber=${formattedNumber}`);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      Alert.alert('Error', 'Failed to check user status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleContactPress = () => {
    router.push('/(screens)/contact-us');

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
                placeholder="Enter your phone number"
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