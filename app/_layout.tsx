import { ApplicationProvider, useApplication } from '../context/ApplicationContext';
import { ThemeProvider } from '../context/ThemeContext'; 
import RootLayoutContent from './RootLayoutContent';
import { View, ActivityIndicator } from 'react-native';

// This will wrap your app in the context provider
export default function RootLayout() {
  return (
    <ApplicationProvider>
      <ThemeProvider>
      <InnerLayout />
      </ThemeProvider>
    </ApplicationProvider>
  );
}

// Wait for the app state to be loaded before rendering the content
function InnerLayout() {
  const { loaded } = useApplication();

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootLayoutContent />;
}
