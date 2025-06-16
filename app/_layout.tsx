import { ApplicationProvider } from '../context/ApplicationContext';
import RootLayoutContent from './RootLayoutContent';

export default function RootLayout() {
  return (
    <ApplicationProvider>
      <RootLayoutContent />
    </ApplicationProvider>
  );
}