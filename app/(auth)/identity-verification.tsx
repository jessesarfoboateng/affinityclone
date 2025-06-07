import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';

export default function IDVerificationScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/document-capture');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color="#411D4B" />
          <Text style={styles.title}>We need to verify your ID for security purposes</Text>
          <Text style={styles.subtitle}>Before you start:</Text>
        </View>

        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Ionicons name="id-card" size={20} color="#411D4B" />
            <Text style={styles.instructionText}>You'll need to take photos of both sides of your Ghana Card</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="person" size={20} color="#411D4B" />
            <Text style={styles.instructionText}>You'll also need to take a selfie</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="sunny" size={20} color="#411D4B" />
            <Text style={styles.instructionText}>Ensure that you are in a well lit room</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="scan" size={20} color="#411D4B" />
            <Text style={styles.instructionText}>Check that all four corners of your card are within the photo frame</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="eye" size={20} color="#411D4B" />
            <Text style={styles.instructionText}>Make sure all pictures are clear and readable</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#411D4B',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructions: {
    marginBottom: 32,
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#411D4B',
    flex: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#411D4B',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});