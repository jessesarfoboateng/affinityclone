import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    // TODO: Implement signup logic
    // After successful signup, navigate to home
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center">
        <Text className="text-2xl font-bold mb-2">Create your account</Text>
        <Text className="text-gray-600 mb-6">
          Please fill in your details to continue
        </Text>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Full Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-lg"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-lg"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 rounded-lg p-4"
          onPress={handleSignup}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 