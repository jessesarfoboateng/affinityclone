import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ApplicationProvider } from '../context/ApplicationContext';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        console.log('hasSeenOnboarding value:', hasSeenOnboarding);

        // Only redirect if we're not already on the correct screen
        const currentSegment = segments[0];
        if (!hasSeenOnboarding && currentSegment !== '(onboarding)') {
          router.replace('/(onboarding)/index');
        } else if (hasSeenOnboarding && currentSegment !== '(auth)') {
          router.replace('/(auth)/phone');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/(onboarding)/index');
      } finally {
        setIsReady(true);
      }
    };

    checkOnboarding();
  }, [segments]); // Add segments as dependency

  if (!isReady || !loaded) {
    return null;
  }

  return (
    <ApplicationProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ApplicationProvider>
  );
}
