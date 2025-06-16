import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useMemo } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const { width, height } = Dimensions.get('window');

// Memoize onboarding data to prevent unnecessary re-renders
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

  // Memoize handlers to prevent unnecessary re-renders
  const handlePageSelected = useMemo(() => (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  }, []);

  const handleNext = useMemo(() => () => {
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
  }, [currentPage]);

  const handleSkip = useMemo(() => async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/phone');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }, [router]);

  const handleFinish = useMemo(() => async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/phone');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }, [router]);

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      router.replace('/(onboarding)');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const renderContent = useMemo(() => {
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
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
                fadeDuration={0}
              />
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
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
              fadeDuration={0}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </PagerView>
    );
  }, [handlePageSelected]);

  return (
    <View style={styles.container}>
      {renderContent}
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
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
    backgroundColor: '#D1D1D1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#411D4B',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#411D4B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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