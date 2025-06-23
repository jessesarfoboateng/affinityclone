import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useApplication } from '../context/ApplicationContext';
import { View, ActivityIndicator, Text } from 'react-native';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#71C7D8' }}>
      <ActivityIndicator size="large" color="#411D4B" />
      <Text style={{ marginTop: 10, color: '#411D4B' }}>Loading...</Text>
    </View>
  );
}

export default function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const {
    isAuthenticated,
    isFirstTimeUser,
    hasCompletedOnboarding,
    loaded,
    lastAuthStep,
    setLastAuthStep
  } = useApplication();

  const router = useRouter();
  const segments = useSegments();
  const [navigationComplete, setNavigationComplete] = useState(false);
  const navigationAttempted = useRef(false);
  const lastNavigationTime = useRef(0);
  const initialNavigationDone = useRef(false);

  const theme = useMemo(() => {
    return colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  }, [colorScheme]);

  // Handle first-time navigation
  useEffect(() => {
    if (!loaded || navigationAttempted.current) return;

    const hasSettled =
      typeof isAuthenticated === 'boolean' &&
      typeof isFirstTimeUser === 'boolean' &&
      typeof hasCompletedOnboarding === 'boolean';

    if (!hasSettled) return;

    navigationAttempted.current = true;

    console.log('🧭 Initial navigation check:', {
      isAuthenticated,
      isFirstTimeUser,
      hasCompletedOnboarding,
      lastAuthStep,
      currentSegment: segments[0]
    });

    try {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else if (isFirstTimeUser && !hasCompletedOnboarding) {
        router.replace('/(onboarding)');
      } else if (lastAuthStep) {
        router.replace(`/(auth)/${lastAuthStep}`);
      } else {
        router.replace('/(auth)/phone');
      }

      setNavigationComplete(true);
      initialNavigationDone.current = true;
    } catch (error) {
      console.error('❌ Navigation error:', error);
      router.replace('/(onboarding)');
      setNavigationComplete(true);
      initialNavigationDone.current = true;
    }
  }, [loaded, isAuthenticated, isFirstTimeUser, hasCompletedOnboarding, lastAuthStep]);

  // Respond to auth state changes after initial load
  useEffect(() => {
    if (!loaded || !navigationComplete || !initialNavigationDone.current) return;

    const currentSegment = segments[0];
    const isAuthScreen = currentSegment === '(auth)';
    const isOnboardingScreen = currentSegment === '(onboarding)';
    const isTabsScreen = currentSegment === '(tabs)';
    const now = Date.now();

    if (now - lastNavigationTime.current < 1000) return;

    if (!isAuthenticated && !isFirstTimeUser && !hasCompletedOnboarding) {
      console.log('🔁 Resetting incomplete auth state...');
      setLastAuthStep("");
      router.replace('/(auth)/phone');
      return;
    }

    if (isAuthenticated) {
      const currentSegment = segments[0]; // e.g., '(screens)', '(auth)', etc.
    
      const allowWhileAuthenticated = ['(tabs)', '(screens)'];
      const isAllowed = allowWhileAuthenticated.includes(currentSegment);
    
      if (!isAllowed) {
        console.log('🔄 Redirecting to home...');
        lastNavigationTime.current = now;
        router.replace('/(tabs)/home');
      }
    }
    
  }, [isAuthenticated, isFirstTimeUser, hasCompletedOnboarding, navigationComplete, loaded, segments]);

  if (!loaded) return <LoadingScreen />;

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(screens)"/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
