import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, ActivityIndicator, ViewStyle, TextStyle, ImageStyle, Animated, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApplication } from '../../context/ApplicationContext';

interface ApplicationReviewProps {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
    // Add other personal info fields
  };
  identityInfo: {
    ghanaCardNumber: string;
    ghanaCardFront: string;
    ghanaCardBack: string;
  };
  selfieInfo: {
    selfie: string;
  };
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

type ApplicationReviewStyles = {
  container: ViewStyle;
  scrollContainer: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionContent: ViewStyle;
  infoRow: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
  documentPreview: ViewStyle;
  previewImage: ImageStyle;
  previewLabel: TextStyle;
  ghanaCardInput: ViewStyle;
  input: TextStyle;
  inputContainer: ViewStyle;
  inputLabel: TextStyle;
  errorText: TextStyle;
  buttonsContainer: ViewStyle;
  button: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  buttonText: TextStyle;
  primaryButtonText: TextStyle;
  secondaryButtonText: TextStyle;
  placeholderImage: ViewStyle;
  placeholderText: TextStyle;
};

export default function ApplicationReviewScreen() {
  const router = useRouter();
  const { applicationData } = useApplication();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get phone number from app context or state
      const { personalInfo } = applicationData; // or wherever it's stored
      const phone = personalInfo?.phone;

      if (!phone) {
        throw new Error('Phone number is missing when navigating to success screen.');
      }

      router.push(`/success?phone=${phone}`);


    } catch (error) {
      console.error('❌ Submit error:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{applicationData.personalInfo?.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{applicationData.personalInfo?.dateOfBirth}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{applicationData.personalInfo?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{applicationData.personalInfo?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{applicationData.personalInfo?.address}</Text>
            </View>
          </View>
        </View>

        {/* Identity Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Information</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghana Card Number</Text>
              <Text style={styles.infoValue}>{applicationData.identityInfo.ghanaCardNumber}</Text>
            </View>
            <View style={styles.documentPreview}>
              <Text style={styles.previewLabel}>Ghana Card Front</Text>
              {applicationData.identityInfo.ghanaCardFront ? (
                <Image
                  source={{ uri: applicationData.identityInfo.ghanaCardFront }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.previewImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No image available</Text>
                </View>
              )}
            </View>
            <View style={styles.documentPreview}>
              <Text style={styles.previewLabel}>Ghana Card Back</Text>
              {applicationData.identityInfo.ghanaCardBack ? (
                <Image
                  source={{ uri: applicationData.identityInfo.ghanaCardBack }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.previewImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No image available</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Selfie Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selfie Verification</Text>
          <View style={styles.sectionContent}>
            <View style={styles.documentPreview}>
              <Text style={styles.previewLabel}>Selfie Photo</Text>
              {applicationData.selfieInfo.selfie ? (
                <Image
                  source={{ uri: applicationData.selfieInfo.selfie }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.previewImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No image available</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={20} color="#411D4B" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Submit Application</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<ApplicationReviewStyles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#411D4B',
    fontWeight: '500',
  },
  documentPreview: {
    marginTop: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ghanaCardInput: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    color: '#411D4B',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#411D4B',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#411D4B',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
}); 