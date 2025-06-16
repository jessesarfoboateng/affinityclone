import React, { useEffect, useRef, useMemo } from 'react';
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

  // Memoize the animation configuration
  const animationConfig = useMemo(() => ({
    fade: {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    },
    slide: {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }
  }), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, animationConfig.fade),
      Animated.timing(slideAnim, animationConfig.slide),
    ]).start();
  }, [fadeAnim, slideAnim, animationConfig]);

  const handleBack = useMemo(() => () => {
    router.back();
  }, [router]);

  const handleSubmit = useMemo(() => async () => {
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
  }, [router]);

  const renderPreviewItem = useMemo(() => (label: string, imageUri: string | null) => (
    <View style={styles.previewItem}>
      <Text style={styles.previewLabel}>{label}</Text>
      <Image
        source={{ uri: imageUri || '' }}
        style={styles.previewImage}
        resizeMode="contain"
        fadeDuration={0}
        onError={(error) => console.error(`Error loading ${label}:`, error.nativeEvent.error)}
      />
    </View>
  ), []);

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
          {renderPreviewItem('Ghana Card Front', applicationData.identityInfo.ghanaCardFront)}
          {renderPreviewItem('Ghana Card Back', applicationData.identityInfo.ghanaCardBack)}
          {renderPreviewItem('Selfie', applicationData.selfieInfo.selfie)}
        </Animated.View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleBack}
            disabled={isSubmitting}
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
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Submit</Text>
                <Ionicons name="checkmark" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  previewGrid: {
    marginBottom: 30,
  },
  previewItem: {
    marginBottom: 20,
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
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#411D4B',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#411D4B',
  },
}); 