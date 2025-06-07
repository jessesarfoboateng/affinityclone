import React, { createContext, useContext, useState } from 'react';

interface ApplicationData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
  };
  identityInfo: {
    ghanaCardNumber: string;
    ghanaCardFront: string | null;
    ghanaCardBack: string | null;
  };
  selfieInfo: {
    selfie: string | null;
  };
}

interface ApplicationContextType {
  applicationData: ApplicationData;
  setApplicationData: (data: Partial<ApplicationData>) => void;
  clearApplicationData: () => void;
}

const defaultApplicationData: ApplicationData = {
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
  },
  identityInfo: {
    ghanaCardNumber: '',
    ghanaCardFront: null,
    ghanaCardBack: null,
  },
  selfieInfo: {
    selfie: null,
  },
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [applicationData, setApplicationDataState] = useState<ApplicationData>(defaultApplicationData);

  const setApplicationData = (data: Partial<ApplicationData>) => {
    setApplicationDataState(prev => ({
      ...prev,
      ...data,
    }));
  };

  const clearApplicationData = () => {
    setApplicationDataState(defaultApplicationData);
  };

  return (
    <ApplicationContext.Provider value={{ applicationData, setApplicationData, clearApplicationData }}>
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