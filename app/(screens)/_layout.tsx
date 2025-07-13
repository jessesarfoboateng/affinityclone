import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function ScreensLayout() {
  const router = useRouter()
  const SpaceMono = "@/assets/fonts/SpaceMono-Regular.ttf"
  
  return (
    <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name='notifications' options={{
      title:"Notifications",
      headerShown:true,
      
      headerRight: () => (
                <TouchableOpacity onPress={() => router.setParams({ showMenu: true })} style={{ marginRight: 16 }}>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="gray" />
              </TouchableOpacity>
            ),
      headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

      ),       
      }}/>

      <Stack.Screen name='SendMoney' options={{
        title:"Send money",
        headerShown:true,
        headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>

      ), 

      }}/>

      <Stack.Screen name='DestAccount' options={{
        title:"Send money",
        headerShown:true,
        headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>

      ), 
        headerRight: () => (
          <TouchableOpacity>
            <Text style={{color:"red"}}>Cancel</Text>
          </TouchableOpacity>
        ),
      }}/>

      <Stack.Screen name="Deposit" options={{
        title:"Deposit into account",
        headerShown:true,
        headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>
        ),
          headerRight: () => (
          <TouchableOpacity>
            <Text style={{color:"red"}}>Cancel</Text>
          </TouchableOpacity>
        ), 

      }}/>

       <Stack.Screen name="Payment" options={{
        title:"Make payment",
        headerShown:true,
        headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>

      ), 
      }}/>

      <Stack.Screen name="AddAccount" options={{
        title:"Select an account to add",
        headerShown:true,
        headerRight:() => (
        <TouchableOpacity onPress={()=> router.back()}>
         <Feather name="x" size={24} color="gray" />
        </TouchableOpacity>

      ), 
      }}/>

       <Stack.Screen name='depdestaccount' options={{
        title:"Deposit into account",
        headerShown:true,
        headerLeft:() => (
        <TouchableOpacity onPress={()=> router.back()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>

      ), 
        headerRight: () => (
          <TouchableOpacity>
            <Text style={{color:"red"}}>Cancel</Text>
          </TouchableOpacity>
        ),
      }}/>

    </Stack>
  );
}
