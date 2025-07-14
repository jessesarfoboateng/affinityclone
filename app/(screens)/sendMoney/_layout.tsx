import AntDesign from '@expo/vector-icons/AntDesign';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function ScreensLayout() {
  const router = useRouter();
  const SpaceMono = "@/assets/fonts/SpaceMono-Regular.ttf";
  
  return (
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen 
        name='SendMoney' 
        options={{
          title: "Send money",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="gray" />
            </TouchableOpacity>
          ), 
        }}
      />

      <Stack.Screen 
        name='DestAccount' 
        options={{
          title: "Send money",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="left" size={24} color="gray" />
            </TouchableOpacity>
          ), 
          headerRight: () => (
            <TouchableOpacity>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}