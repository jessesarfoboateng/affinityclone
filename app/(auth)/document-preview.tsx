import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, ActivityIndicator, ViewStyle, TextStyle, ImageStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApplication } from '../../context/ApplicationContext';

type DocumentPreviewStyles = {
  container: ViewStyle;
  scrollContainer: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  previewGrid: ViewStyle;
  previewItem: ViewStyle;
  previewLabel: TextStyle;
  previewImage: ImageStyle;
  buttonsContainer: ViewStyle;
  button: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  buttonText: TextStyle;
  primaryButtonText: TextStyle;
  secondaryButtonText: TextStyle;
};

export default function DocumentPreviewScreen() {
  const router = useRouter();
  const { applicationData } = useApplication();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    console.log('Document Preview - Application Data:', applicationData);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Add your submission logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      router.push('/application-review');
    } catch (error) {
      console.error('Error submitting documents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Ionicons name="checkmark-circle" size={32} color="#411D4B" />
          <Text style={styles.title}>Review Your Documents</Text>
          <Text style={styles.subtitle}>Please verify that all documents are clear and readable</Text>
        </Animated.View>

        <Animated.View style={[
          styles.previewGrid,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Ghana Card Front</Text>
            <Image
              source={{ uri: applicationData.identityInfo.ghanaCardFront || '' }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={(error) => console.error('Error loading Ghana Card Front:', error.nativeEvent.error)}
            />
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Ghana Card Back</Text>
            <Image
              source={{ uri: applicationData.identityInfo.ghanaCardBack || '' }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={(error) => console.error('Error loading Ghana Card Back:', error.nativeEvent.error)}
            />
          </View>
          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>Selfie</Text>
            <Image
              source={{ uri: applicationData.selfieInfo.selfie || '' }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={(error) => console.error('Error loading Selfie:', error.nativeEvent.error)}
            />
          </View>
        </Animated.View>

        <Animated.View style={[
          styles.buttonsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
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
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Confirm & Submit</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<DocumentPreviewStyles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#411D4B',
    textAlign: 'center',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#411D4B',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  previewGrid: {
    gap: 16,
    marginVertical: 24,
  },
  previewItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#411D4B',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 16,
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
}); 