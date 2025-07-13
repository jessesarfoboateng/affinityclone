import { Tabs } from 'expo-router/tabs';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Text, useColorScheme,TouchableOpacity, Modal ,View,StyleSheet,Linking } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';


type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
    const [showCreditScore, setShowCreditScore] = useState(false);
  const router = useRouter()
  const colorScheme = useColorScheme();
  

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#411D4B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff',
          borderTopColor: colorScheme === 'dark' ? '#2C2C2E' : '#eee',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transact"
        options={{
          title: 'Transact',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="loans" 
        options={{
          headerShown: true,
          title: 'Loans',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
           headerRight: () => (
                <TouchableOpacity onPress={() => setShowCreditScore(true)} style={styles.helpBtn}>
                  <Text style={styles.helpText}>Help </Text>
                  <AntDesign name="questioncircleo" size={16} color="cyan" />
              </TouchableOpacity>
            ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>

    {/*Global Modal placed outside Tabs */} 
      
      <Modal
        visible={showCreditScore}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreditScore(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.title}>Credit score</Text>

            <Text style={styles.subTitle}>What is a credit score?</Text>
            <Text style={styles.bodyText}>
              A credit score determines your eligibility for a loan.
            </Text>
            <Text style={styles.bodyText}>
              A higher score gives you access to better loan terms, while a lower score may lead to lower loan amounts, unfavourable terms or even being declined a loan.
            </Text>
            <Text style={styles.bodyText}>
              Ultimately, your credit score is important to:
            </Text>

            <Text style={styles.link} onPress={() => Linking.openURL('#')}>
              • Determine your eligibility
            </Text>
            <Text style={styles.link} onPress={() => Linking.openURL('#')}>
              • Set interest rates on your loan
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCreditScore(false)}
            >
              <Text style={styles.buttonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )};


const styles = StyleSheet.create({
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  helpText: {
    marginRight: 4,
    color: 'cyan',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4B2354',
    marginBottom: 15,
  },
  subTitle: {
    color: '#FFA500',
    fontWeight: '600',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  link: {
    color: '#00BFFF',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4B2354',
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

