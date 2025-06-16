import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ApplicationProvider, useApplication } from '../context/ApplicationContext';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#71C7D8' }}>
      <ActivityIndicator size="large" color="#411D4B" />
      <Text style={{ marginTop: 10, color: '#411D4B' }}>Loading...</Text>
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const {
    isAuthenticated,
    isFirstTimeUser,
    hasCompletedOnboarding,
    loaded
  } = useApplication();

  const router = useRouter();
  const segments = useSegments();
  const [navigationComplete, setNavigationComplete] = useState(false);
  const navigationAttempted = useRef(false);
  const lastNavigationTime = useRef(0);
  const initialNavigationDone = useRef(false);
  const lastSegment = useRef<string | undefined>(undefined);

  // Create theme before any conditional returns
  const theme = useMemo(() => {
    return colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  }, [colorScheme]);

  // Handle initial navigation
  useEffect(() => {
    if (!loaded || navigationAttempted.current) return;

    // Wait for critical values to be resolved from storage
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
      currentSegment: segments[0]
    });

    try {
      if (isAuthenticated) {
        console.log('➡️ Navigating to home');
        router.replace('/(tabs)/home');
      } else if (isFirstTimeUser && !hasCompletedOnboarding) {
        console.log('➡️ Navigating to onboarding');
        router.replace('/(onboarding)');
      } else {
        console.log('➡️ Navigating to auth');
        router.replace('/(auth)');
      }
      setNavigationComplete(true);
      initialNavigationDone.current = true;
    } catch (error) {
      console.error('❌ Navigation error:', error);
      router.replace('/(onboarding)');
      setNavigationComplete(true);
      initialNavigationDone.current = true;
    }
  }, [loaded, isAuthenticated, isFirstTimeUser, hasCompletedOnboarding, router]);

  // Handle authentication state changes during app usage
  useEffect(() => {
    if (!loaded || !navigationComplete || !initialNavigationDone.current) return;

    const currentSegment = segments[0];
    const isAuthScreen = currentSegment === '(auth)';
    const isOnboardingScreen = currentSegment === '(onboarding)';
    const isTabsScreen = currentSegment === '(tabs)';
    const now = Date.now();

    // Prevent rapid re-navigation (debounce)
    if (now - lastNavigationTime.current < 1000) {
      return;
    }

    // Track segment changes
    //if (currentSegment !== lastSegment.current) {
    //  lastSegment.current = currentSegment;
    //  return; // Don't navigate on segment changes
    //}

    // Only handle auth state changes after initial navigation
    if (isAuthenticated) {
      // If we're already on the tabs screen, don't navigate again
      if (isTabsScreen) {
        return;
      }
      // If we're on auth or onboarding screens, navigate to home
      if (isAuthScreen || isOnboardingScreen) {
        console.log('🔄 User logged in, redirecting to home');
        lastNavigationTime.current = now;
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, loaded, hasCompletedOnboarding, router, segments, navigationComplete]);

  // Show loading screen only while initializing
  if (!loaded) {
    return <LoadingScreen />;
  }

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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <RootLayoutNav />
  );
}