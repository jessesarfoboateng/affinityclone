import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApplication } from '../../context/ApplicationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for our user data
interface UserData {
  id: number;
  phoneNumber: string;
  isPinSet: boolean;
  application?: {
    id: number;
    status: string;
    ghanaCardNumber: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      city: string;
      region: string;
    };
  };
}

interface LoginResponse {
  token: string;
  user: UserData;
}

export default function SuccessScreen() {

  const { setLastAuthStep } = useApplication();

  useEffect(() => {
    setLastAuthStep('success'); // or optionally remove it from storage
  }, []);


  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = params.phone as string;
  const userDataStr = params.userData as string;

  const [isLoading, setIsLoading] = useState(false);
  const { completeRegistration } = useApplication();

  const validateUserData = (data: any): data is LoginResponse => {
    return (
      data &&
      typeof data.token === 'string' &&
      data.user &&
      typeof data.user.id === 'number' &&
      typeof data.user.phoneNumber === 'string' &&
      typeof data.user.isPinSet === 'boolean'
    );
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);


      const userDataStr = params.userData as string;

      console.log('📞 Received phone param:', phone);

      if (!phone) {
        throw new Error('Phone number is missing from navigation parameters.');
      }

      if (!userDataStr) {
        throw new Error('User data is missing from navigation parameters.');
      }

      // Parse and validate user data
      console.log('📞 Received phone param:', phone);
      console.log('📦 Received userData param:', userDataStr);

      let parsedData: LoginResponse;
      try {
        parsedData = JSON.parse(userDataStr);
      } catch (e) {
        throw new Error('Invalid user data format');
      }

      if (!validateUserData(parsedData)) {
        throw new Error('Invalid user data structure');
      }

      // Store user data securely
      await Promise.all([
        AsyncStorage.setItem('userData', JSON.stringify(parsedData.user)),
        AsyncStorage.setItem('userToken', parsedData.token),

      ]);

      console.log('✅ User data stored successfully');
      console.log('👤 User ID:', parsedData.user.id);
      console.log('📱 Phone:', parsedData.user.phoneNumber);
      if (parsedData.user.application) {
        console.log('📄 Application Status:', parsedData.user.application.status);
      }

      await completeRegistration();
      console.log('✅ Finalizing registration, redirecting to home', parsedData);
      console.log('➡️ Navigating to home from success');
      router.replace('/(tabs)/home');

    } catch (error) {
      console.error('❌ Error handling user data:', error);
      Alert.alert(
        'Error',
        'There was a problem saving your information. Please try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={64} color="#411D4B" />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            You have successfully logged in. Your account information has been loaded.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Continue to Dashboard</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#411D4B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});