import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: 'none',
      gestureEnabled: false,
    }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
