import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // TODO: Add OTP validation
      // TODO: Check if user exists in database
      // For now, we'll simulate checking if user exists
      const userExists = false; // This should come from your backend

      if (userExists) {
        router.replace('/(tabs)');
      } else {
        router.push('/register?' + new URLSearchParams({
          phoneNumber: params.phoneNumber as string
        }).toString());
      }
    }
  };

  const handleResend = () => {
    if (canResend) {
      // TODO: Implement resend logic
      setTimeLeft(30);
      setCanResend(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={40} color="#411D4B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Enter OTP
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to your phone
          </Text>

          <View style={styles.otpContainer}>
            {[...Array(4)].map((_, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                ref={(ref) => {
                  otpInputs.current[index] = ref;
                }}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>
              Verify
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
          >
            <Text style={styles.resendText}>
              Resend Code
            </Text>
          </TouchableOpacity>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    backgroundColor: '#71C7D8',
  },
  headerBackButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: '#411D4B',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: bottomPadding,
  },
  subtitle: {
    fontSize: 16,
    color: '#411D4B',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'white',
    color: '#411D4B',
  },
  verifyButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#411D4B',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
}); 