import React, { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useApplication } from '../../context/ApplicationContext';

export default function OTPScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const { setAuthenticated } = useApplication();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (countdown > 0) {
      timeout = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000) as unknown as NodeJS.Timeout;
    }
    return () => clearInterval(timeout);
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_API_URL/api/auth/resend-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber: `+233${phoneNumber}` })
      // });

      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCountdown(60);
      Alert.alert('Success', 'OTP resent successfully');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the complete 4-digit OTP');
      return;
    }

    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_API_URL/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     phoneNumber: `+233${phoneNumber}`,
      //     otp: otpString
      //   })
      // });
      // const data = await response.json();

      // For now, simulate successful OTP verification
      const otpIsValid = true; // ✅ Define this variable

      if (otpIsValid) {
        // OTP verified, continue to registration
        router.push(`/register?phoneNumber=${phoneNumber}`);
        // DON'T call setAuthenticated(true) here
      } else {
        // OTP invalid, show error
        Alert.alert('Invalid OTP', 'Please try again');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* OTP Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="keypad-outline" size={100} color="#411D4B" />
        </View>

        {/* Content */}
        <View style={styles.fillZoneContainer}>
          <Text style={styles.enterOtpText}>
            Enter OTP
          </Text>

          <Text style={styles.otpDescription}>
            We have sent a 4-digit code to your phone number
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                editable={!isLoading}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.verifyText}>
                    Verify
                  </Text>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={countdown > 0 || isLoading}
            >
              <Text style={[
                styles.resendLink,
                (countdown > 0 || isLoading) && styles.resendLinkDisabled
              ]}>
                Resend {countdown > 0 ? `(${countdown}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 20,
    marginTop: 50,
  },
  fillZoneContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterOtpText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpDescription: {
    fontSize: 16,
    color: '#411D4B',
    marginBottom: 48,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 320,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    backgroundColor: 'white',
  },
  verifyButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    maxWidth: 320,
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
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#411D4B',
    textAlign: 'center',
  },
  resendLink: {
    fontSize: 14,
    color: '#411D4B',
    fontWeight: '600',
    marginLeft: 4,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
}); 