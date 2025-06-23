import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { Icon } from '../../components/Icon';

const { height } = Dimensions.get('window');

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What is Relafin?",
      answer: "Relafin is a financial technology company that provides innovative solutions for managing and growing your finances. We offer secure, user-friendly services to help you achieve your financial goals."
    },
    {
      question: "How do I get started with Relafin?",
      answer: "Getting started is easy! Simply download our app, sign up with your phone number, and follow the verification process. You'll be guided through each step to set up your account."
    },
    {
      question: "Is my money safe with Relafin?",
      answer: "Yes, your money is completely safe with us. We use industry-standard security measures and encryption to protect your data and transactions. We're also regulated by the relevant financial authorities."
    },
    {
      question: "What services does Relafin offer?",
      answer: "Relafin offers a range of financial services including savings accounts, investment opportunities, money transfers, and financial planning tools. We're constantly expanding our services to better serve our customers."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through multiple channels: in-app chat, email, phone, or WhatsApp. Visit our Contact Us page for all the details."
    },
    {
      question: "Are there any fees for using Relafin?",
      answer: "We maintain transparent fee structures. Most basic services are free, while some premium features may have associated fees. All fees are clearly displayed before you use any service."
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color="#411D4B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQ</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/relafinlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {faqItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleExpand(index)}
            >
              <View style={styles.questionContainer}>
                <Text style={styles.question}>{item.question}</Text>
                <Icon
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#411D4B"
                />
              </View>
              {expandedIndex === index && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#411D4B',
    marginLeft: 16,
    fontFamily: 'Roboto',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.15,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  logo: {
    width: '40%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#411D4B',
    flex: 1,
    marginRight: 16,
    fontFamily: 'Roboto',
  },
  answer: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
    lineHeight: 20,
    fontFamily: 'Roboto',
  },
}); 