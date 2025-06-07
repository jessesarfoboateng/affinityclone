import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, Linking } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function ConfirmRegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  // Get registration details from params
  const {
    title,
    firstName,
    otherName,
    lastName,
    referralCode,
  } = params;

  const handleConfirm = async () => {
    if (!acceptedTerms) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);
    // TODO: Implement registration confirmation logic
    router.push('/setup-pin?' + new URLSearchParams({
      firstName: firstName as string,
      lastName: lastName as string,
      phoneNumber: params.phoneNumber as string
    }).toString());
  };

  const handleEdit = () => {
    router.back();
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.subtitle}>
              Confirm Registration Details
            </Text>

            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Title</Text>
                <Text style={styles.detailValue}>{title}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>First Name</Text>
                <Text style={styles.detailValue}>{firstName}</Text>
              </View>

              {otherName && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Other Name</Text>
                  <Text style={styles.detailValue}>{otherName}</Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Last Name</Text>
                <Text style={styles.detailValue}>{lastName}</Text>
              </View>

              {referralCode && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Referral Code</Text>
                  <Text style={styles.detailValue}>{referralCode}</Text>
                </View>
              )}
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={acceptedTerms}
                onValueChange={(value) => {
                  setAcceptedTerms(value);
                  setShowTermsError(false);
                }}
                color={acceptedTerms ? '#411D4B' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                I have read, understood and accepted Relafin's{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>Terms and Conditions</Text>
                {' '}and{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>Privacy Policy</Text>
              </Text>
            </View>
            {showTermsError && (
              <Text style={styles.errorText}>
                You must accept the Terms and Conditions to continue
              </Text>
            )}

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={marketingConsent}
                onValueChange={setMarketingConsent}
                color={marketingConsent ? '#411D4B' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                I would like to receive additional marketing communications from Relafin{' '}
                <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleEdit}
          >
            <Text style={styles.backButtonText}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmButton, !acceptedTerms && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!acceptedTerms}
          >
            <Text style={styles.buttonText}>
              Confirm
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
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 40 : 60,
  },
  scrollContent: {
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 20,
    fontFamily: 'Roboto',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20,
  },
  detailsList: {
    gap: 15,
  },
  detailItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  detailValue: {
    fontSize: 16,
    color: '#411D4B',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  checkbox: {
    marginRight: 10,
    borderColor: '#411D4B',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 34,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: bottomPadding,
    backgroundColor: '#71C7D8',
    gap: 10,
    minHeight: height * 0.15,
  },
  backButton: {
    flex: 1,
    padding: 15,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#411D4B',
    maxWidth: 120,
  },
  backButtonText: {
    color: '#411D4B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#411D4B',
    padding: 15,
    height: 50,
    borderRadius: 10,
    maxWidth: 120,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  termsLink: {
    color: '#411D4B',
    textDecorationLine: 'underline',
  },
  optionalText: {
    color: '#6B7280',
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 