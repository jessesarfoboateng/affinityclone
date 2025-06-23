import { Link, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();

  // Optional: Auto-redirect after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(auth)'); // Or '/(onboarding)' depending on your default start
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
   
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <Link href="/(auth)" style={styles.link}>
          <ThemedText type="link">Go to login screen</ThemedText>
        </Link>
      </ThemedView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
