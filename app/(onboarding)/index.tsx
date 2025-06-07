import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Convenient',
    description: 'No more wasting time in long queues. Transact anything, anywhere, anytime',
    image: require('../../assets/images/Finance leaders-bro 1.png'),
  },
  {
    id: 2,
    title: 'Easy',
    description: 'Keep track of your spending habits',
    image: require('../../assets/images/Fast loading-rafiki 1.png'),
  },
  {
    id: 3,
    title: 'Set Your Goals',
    description: 'Achieve your financial goals with ease',
    image: require('../../assets/images/Saving money-rafiki 1.png'),
  },
  {
    id: 4,
    title: 'Secure',
    description: 'Your deposits are insured by the Ghana Deposit Insurance Corporation',
    image: require('../../assets/images/Security-rafiki 1.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      if (Platform.OS === 'web') {
        scrollViewRef.current?.scrollTo({ x: (currentPage + 1) * width, animated: true });
        setCurrentPage(currentPage + 1);
      } else {
        pagerRef.current?.setPage(currentPage + 1);
      }
    } else {
      handleFinish();
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/phone');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/phone');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      router.replace('/(onboarding)');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const renderContent = () => {
    if (Platform.OS === 'web') {
      return (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(newPage);
          }}
          style={styles.pager}
        >
          {onboardingData.map((item) => (
            <View key={item.id} style={[styles.page, { width }]}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {onboardingData.map((item) => (
          <View key={item.id} style={styles.page}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </PagerView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={[
          styles.buttonContainer,
          currentPage === onboardingData.length - 1 && styles.buttonContainerCenter
        ]}>
          {currentPage < onboardingData.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#411D4B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainerCenter: {
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#411D4B',
  },
  skipButtonText: {
    color: '#411D4B',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  nextButton: {
    backgroundColor: '#411D4B',
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 