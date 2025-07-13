import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const CreditScoreModal = ({ visible }) => {
    const router = useRouter()
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.title}>Credit score</Text>

          <Text style={styles.subTitle}>What is a credit score?</Text>
          <Text style={styles.bodyText}>
            A credit score determines your eligibility for a loan
          </Text>

          <Text style={styles.bodyText}>
            A higher score gives you access to better loan terms, while a lower score may lead to lower loan amounts, unfavourable terms or even being declined a loan
          </Text>

          <Text style={styles.bodyText}>
            Ultimately, your credit score is important to:
          </Text>

          <Text
            style={styles.link}
            onPress={() => Linking.openURL('#')}
          >
            • Determine your eligibility
          </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('#')}
          >
            • Set interest rates on your loan
          </Text>

          <TouchableOpacity style={styles.button} onPress={()=>router.back()}>
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreditScoreModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight dark overlay behind modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4B2354', // Dark purple color
    marginBottom: 15,
  },
  subTitle: {
    color: '#FFA500', // Orange color for "What is a credit score?"
    fontWeight: '600',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  link: {
    color: '#00BFFF', // Light blue for links
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4B2354', // Dark purple for button
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

