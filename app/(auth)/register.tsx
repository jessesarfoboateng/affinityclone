import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';

interface FormData {
  title: string;
  firstName: string;
  otherName: string;
  lastName: string;
  referralCode: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    otherName: '',
    lastName: '',
    referralCode: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const titles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];

  const handleTitleSelect = (title: string) => {
    setFormData({ ...formData, title });
    setShowDropdown(false);
  };

  const handleRegister = async () => {
    router.push('/confirm-registration?' + new URLSearchParams({
      ...formData,
      phoneNumber: params.phoneNumber as string
    }).toString());
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
          <Text style={styles.confirmationTitle}>
            Please fill in the details below to complete your registration
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.titleContainer}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Select title"
                  value={formData.title}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Ionicons name="caret-down" size={14} color="#411D4B" />
                </TouchableOpacity>
              </View>
              {showDropdown && (
                <View style={styles.dropdownContent}>
                  {titles.map((title) => (
                    <TouchableOpacity
                      key={title}
                      style={styles.titleOption}
                      onPress={() => handleTitleSelect(title)}
                    >
                      <Text style={styles.titleOptionText}>{title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Other Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your other name"
                value={formData.otherName}
                onChangeText={(text) => setFormData({ ...formData, otherName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referral Code (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter referral code if any"
                value={formData.referralCode}
                onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>
              Register
            </Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By tapping on "Register" you agree to our{' '}
            <Text
              style={styles.termsLink}
              onPress={() => router.push('/legal-docs')}
            >
              Terms and Conditions
            </Text> and{' '}
            <Text
              style={styles.termsLink}
              onPress={() => router.push('/legal-docs')}
            >
              Privacy Policy
            </Text>
          </Text>
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    backgroundColor: '#71C7D8',
  },
  confirmationTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: '#411D4B',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  titleInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  arrowButton: {
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#411D4B',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    width: '50%',
  },
  titleOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleOptionText: {
    fontSize: 14,
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: bottomPadding,
    backgroundColor: '#71C7D8',
    minHeight: height * 0.15,
  },
  registerButton: {
    backgroundColor: '#411D4B',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  termsText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingBottom: Platform.OS === 'ios' ? 0 : 10,
  },
  termsLink: {
    color: '#411D4B',
    textDecorationLine: 'underline',
  },
}); 