import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="phone"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="setup-pin"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="confirm-registration"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="open-account"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="legal-docs"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="contact-us"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="identity-verification"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="document-capture"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="document-preview"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="application-review"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
} 