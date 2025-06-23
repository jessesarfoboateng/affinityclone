import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address?: string;
}

interface ApplicationData {
  personalInfo?: PersonalInfo;
  [key: string]: any;
}

interface ApplicationContextType {
  isAuthenticated: boolean;
  isFirstTimeUser: boolean;
  hasCompletedOnboarding: boolean;
  loaded: boolean;
  applicationData: ApplicationData;
  lastAuthStep: string | null;
  setLastAuthStep: (step: string) => void;
  setAuthenticated: (value: boolean) => void;
  setFirstTimeUser: (value: boolean) => void;
  setCompletedOnboarding: (value: boolean) => void;
  setApplicationData: (data: Partial<ApplicationData>) => void;
  signOut: () => void;
  completeRegistration: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

interface ApplicationProviderProps {
  children: ReactNode;
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [lastAuthStep, setLastAuthStepState] = useState<string | null>(null);

  const setLastAuthStep = async (step: string) => {
    console.log('🧭 Saving last auth step: ', step);
    setLastAuthStepState(step);
    await AsyncStorage.setItem('lastAuthStep', step);
  };


  // Initialize app state from AsyncStorage
  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('🚀 Initializing app state...');

        const lastStep = await AsyncStorage.getItem('lastAuthStep');
        setLastAuthStepState(lastStep);


        const [
          hasSeenOnboarding,
          userToken,
          registrationComplete,
          storedApplicationData,
          storedPhoneNumber,
          savedLastAuthStep
        ] = await Promise.all([
          AsyncStorage.getItem('hasSeenOnboarding'),
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('registrationComplete'),
          AsyncStorage.getItem('applicationData'),
          AsyncStorage.getItem('phoneNumber'),
          AsyncStorage.getItem('lastAuthStep')
        ]);

        setLastAuthStepState(savedLastAuthStep);

        console.log('📱 App state loaded:', {
          hasSeenOnboarding,
          userToken: userToken ? 'exists' : 'null',
          registrationComplete,
          storedPhoneNumber
        });

        // Set state based on stored values
        const hasOnboarded = hasSeenOnboarding === 'true';
        const isAuth = userToken !== null && registrationComplete === 'true';

        setHasCompletedOnboarding(hasOnboarded);
        setIsFirstTimeUser(!hasOnboarded);
        setIsAuthenticated(isAuth);

        let parsedData = storedApplicationData ? JSON.parse(storedApplicationData) : {};
        if (storedPhoneNumber) {
          parsedData = {
            ...parsedData,
            personalInfo: {
              ...(parsedData.personalInfo || {}),
              phone: storedPhoneNumber
            }
          };
        }

        setApplicationData(parsedData);

        console.log('✅ App state initialized:', {
          isFirstTimeUser: !hasOnboarded,
          hasCompletedOnboarding: hasOnboarded,
          isAuthenticated: isAuth
        });

      } catch (error) {
        console.error('❌ Error initializing app state:', error);
        setIsFirstTimeUser(true);
        setHasCompletedOnboarding(false);
        setIsAuthenticated(false);
      } finally {
        setLoaded(true);
      }
    }

    initializeApp();
  }, []);

  const setAuthenticated = async (value: boolean) => {
    console.log('🔐 Setting authenticated:', value);
    setIsAuthenticated(value);

    if (value) {
      // Store user data when authenticated
      await AsyncStorage.multiSet([
        ['userToken', 'authenticated'],
        ['isAuthenticated', 'true']
      ]);
    } else {
      // Remove all user data when not authenticated
      await AsyncStorage.multiRemove([
        'userToken',
        'isAuthenticated',
        'phoneNumber',
        'registrationComplete',
        'applicationData'
      ]);
    }
  };

  const setFirstTimeUser = async (value: boolean) => {
    console.log('👤 Setting first time user:', value);
    setIsFirstTimeUser(value);
  };

  const setCompletedOnboarding = async (value: boolean) => {
    console.log('📋 Setting completed onboarding:', value);
    setHasCompletedOnboarding(value);
    setIsFirstTimeUser(!value);

    if (value) {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    }
  };

  const updateApplicationData = async (data: Partial<ApplicationData>) => {
    console.log('📝 Updating application data:', data);
    const updatedData = { ...applicationData, ...data };
    setApplicationData(updatedData);
    await AsyncStorage.setItem('applicationData', JSON.stringify(updatedData));
  };

  const completeRegistration = async () => {
    console.log('✅ Completing registration...');
    await Promise.all([
      AsyncStorage.setItem('registrationComplete', 'true'),
      AsyncStorage.setItem('userToken', 'authenticated')
    ]);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    setIsAuthenticated(false);
    setApplicationData({});
    await AsyncStorage.multiRemove([
      'userToken',
      'isAuthenticated',
      'phoneNumber',
      'registrationComplete',
      'applicationData'
    ]);
  };

  const value = {
    isAuthenticated,
    isFirstTimeUser,
    hasCompletedOnboarding,
    loaded,
    applicationData,
    lastAuthStep,
    setLastAuthStep,
    setAuthenticated,
    setFirstTimeUser,
    setCompletedOnboarding,
    setApplicationData: updateApplicationData,
    signOut,
    completeRegistration


  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}