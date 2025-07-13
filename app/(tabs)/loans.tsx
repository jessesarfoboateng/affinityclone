import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image, SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const LoanScreen = () => {
  const [expanded, setExpanded] = useState(null);
  const [isEligible, setIsEligible] = useState(false); // simulate loan eligibility

  const faqs = [
    {
      question: 'What are Affinity Instant Loans?',
      answer: 'Affinity Instant Loans offer quick approval and provide amounts ranging from GHS 100 to GHS 5,000, with flexible repayment terms of 1 to 3 months-helping you address your urgent financial needs with ease'
    },
    {
      question: 'How can I qualify for a loan?',
      answer: 'To qualify for an Affinity instant Loan, you must hold an active Affinity Daily or Growth account, maintain a good credit score, deposit frequently, and have a positive credit history. Timely repayment of exiting loans with Affinity and other financial institutions,, including mobile wallet services, is important in ascending our ability to repay.'
    },
    {
      question: 'When will I qualify for a loan?',
      answer: 'New customers can qualify for an affinity Instant Loan by saving and transacting on their Affinity account for three months after opening it. For existing customers, eligibility is accessed daily, and you’ll be notified as soon as you qualify. In the meantime, continue saving and transacting to improve your eligibility.'
    },
    {
  question: 'Why is my credit score important?',
  answer: `Your credit score helps lenders assess your reliability as a borrower and plays a role in determining your loan eligibility. However, it is not the sole factor considered for loan approval. Credit scores are categorized as follows:

• 0-250: Bad
• 251-400: Low
• 401-530: Average
• 531-700: Good
• 701-800: Best

Maintaining a higher credit score increases your chances of loan approval.`
}

  ];

  const toggleAccordion = (index) => {
    setExpanded(prev => (prev === index ? null : index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <SafeAreaView>
       {!isEligible && (
        <Text style={styles.ineligibleText}>
          You don’t qualify for an instant loan yet
        </Text>
      )}
     <Image
        source={require("@/assets/images/loan.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
       <Text style={styles.infoText}>
        To access loans, we encourage you to save and transact with us for a period of time.
        Your access is checked regularly, and once you meet our requirements, we will notify you.
      </Text>

      <Text style={styles.faqTitle}>Your loan questions answered...</Text>

      {faqs.map((item, index) => (
        <View
          key={index}
          style={[
            styles.accordion,
            index === 1 ? styles.orange : index === 2 ? styles.green : index === 3 ? styles.blue : styles.default
          ]}
        >
          <TouchableOpacity
            onPress={() => toggleAccordion(index)}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionText}>{item.question}</Text>
            <AntDesign
              name={expanded === index ? 'minuscircleo' : 'pluscircleo'}
              size={20}
              color="#7C7C7C"
            />
          </TouchableOpacity>
          {expanded === index && (
            <Text style={styles.accordionAnswer}>{item.answer}</Text>
          )}
        </View>
      ))}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 380,
    marginBottom: 16,
  },
  ineligibleText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 8,
    marginTop:8,
  },
  infoText: {
    textAlign: 'center',
    color: '#606060',
    fontSize: 17,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  accordion: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3B3B3B',
    flex: 1,
    paddingRight: 10,
  },
  accordionAnswer: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  default: {
    backgroundColor: '#EAF6FA',
  },
  orange: {
    backgroundColor: '#FFF4E1',
  },
  green: {
    backgroundColor: '#E7F4F0',
  },
  blue: {
    backgroundColor: '#E8F2FA',
  },
});

export default LoanScreen;
