import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useApplication } from '@/context/ApplicationContext';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveTempData, getTempData, clearTempData } from '@/utils/tempStorage';


export default function SetupPinScreen() {

  const { setLastAuthStep } = useApplication();

  const router = useRouter();
  const params = useLocalSearchParams();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinValidation, setPinValidation] = useState({
    length: false,
    pattern: true,
    match: false
  });

  useEffect(() => {
    setLastAuthStep('setup-pin'); // this identifies the current step
  }, []);

  useEffect(() => {
    const loadSavedPin = async () => {
      const saved = await getTempData('setupPin') as { pin?: string; confirmPin?: string };
      if (saved?.pin) setPin(saved.pin);
      if (saved?.confirmPin) setConfirmPin(saved.confirmPin);
    };
    loadSavedPin();
  }, []);
  

  // 🔽 Save pin and confirmPin as user types
useEffect(() => {
  saveTempData('setupPin', { pin, confirmPin });
}, [pin, confirmPin]);


  const checkCommonPatterns = (pin: string) => {
    // Check for repeating digits (e.g., 111111)
    if (/^(\d)\1{5}$/.test(pin)) return false;

    // Check for sequential numbers (e.g., 123456)
    if (/012345|123456|234567|345678|456789|987654|876543|765432|654321|543210/.test(pin)) return false;

    // Check for reverse sequential numbers
    if (/^(\d)(\d)(\d)(\d)(\d)(\d)$/.test(pin)) {
      const digits = pin.split('').map(Number);
      const isSequential = digits.every((digit, index) => {
        if (index === 0) return true;
        return Math.abs(digit - digits[index - 1]) === 1;
      });
      if (isSequential) return false;
    }

    return true;
  };

  const handlePinChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/[^0-9]/g, '');
    setPin(numbersOnly);

    // Update validation
    setPinValidation({
      length: numbersOnly.length === 6,
      pattern: numbersOnly.length === 6 ? checkCommonPatterns(numbersOnly) : true,
      match: numbersOnly === confirmPin
    });

    // If 6 digits are entered, move to confirmation
    if (numbersOnly.length === 6 && !isConfirming) {
      setIsConfirming(true);
    }
  };

  const handleConfirmPinChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/[^0-9]/g, '');
    setConfirmPin(numbersOnly);

    // Update validation
    setPinValidation(prev => ({
      ...prev,
      match: numbersOnly === pin
    }));
  };

  const handleSubmit = async () => {
    if (pin !== confirmPin) {
      setError('PINs do not match. Please try again.');
      return;
    }
    // TODO: Save PIN securely
    try {
      await clearTempData('setupPin'); // ✅ Clear once done
      router.push('/open-account?' + new URLSearchParams({
        firstName: params.firstName as string,
        lastName: params.lastName as string,
        phoneNumber: params.phoneNumber as string
      }).toString());
    } catch (err) {
      console.error('Failed to clear setupPin temp data:', err);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Secure your account by creating a 6-digit PIN
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>New PIN</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.pinInput}
                maxLength={6}
                keyboardType="number-pad"
                secureTextEntry={!showPin}
                value={pin}
                onChangeText={handlePinChange}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPin(!showPin)}
              >
                <Ionicons
                  name={showPin ? "eye" : "eye-off"}
                  size={24}
                  color="#411D4B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.validationContainer}>
            <View style={styles.validationItem}>
              <Ionicons
                name={pinValidation.length ? "checkmark-circle" : "checkmark-circle-outline"}
                size={20}
                color={pinValidation.length ? "#10B981" : "#6B7280"}
              />
              <Text style={[styles.validationText, pinValidation.length && styles.validationTextSuccess]}>
                Must be 6 digits long
              </Text>
            </View>
            <View style={styles.validationItem}>
              <Ionicons
                name={pinValidation.pattern ? "checkmark-circle" : "checkmark-circle-outline"}
                size={20}
                color={pinValidation.pattern ? "#10B981" : "#6B7280"}
              />
              <Text style={[styles.validationText, pinValidation.pattern && styles.validationTextSuccess]}>
                Cannot be a common pattern (e.g., 111111, 123456)
              </Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirm PIN</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.pinInput}
                maxLength={6}
                keyboardType="number-pad"
                secureTextEntry={!showPin}
                value={confirmPin}
                onChangeText={handleConfirmPinChange}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPin(!showPin)}
              >
                <Ionicons
                  name={showPin ? "eye" : "eye-off"}
                  size={24}
                  color="#411D4B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.validationContainer}>
            <View style={styles.validationItem}>
              <Ionicons
                name={pinValidation.match ? "checkmark-circle" : "checkmark-circle-outline"}
                size={20}
                color={pinValidation.match ? "#10B981" : "#6B7280"}
              />
              <Text style={[styles.validationText, pinValidation.match && styles.validationTextSuccess]}>
                PINs must match
              </Text>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!pinValidation.length || !pinValidation.pattern || !pinValidation.match) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!pinValidation.length || !pinValidation.pattern || !pinValidation.match}
          >
            <Text style={styles.submitButtonText}>
              Done
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
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Roboto',
  },
  inputWrapper: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  pinInput: {
    flex: 1,
    height: 55,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    letterSpacing: 8,
  },
  eyeButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  submitButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  validationContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  validationTextSuccess: {
    color: '#10B981',
  },
}); 