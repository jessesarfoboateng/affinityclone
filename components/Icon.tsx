import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useFonts } from '../hooks/useFonts';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  style?: any;
}

export function Icon({ name, size, color, style }: IconProps) {
  const { fontsLoaded, isLoading } = useFonts();

  if (isLoading) {
    return (
      <View
        style={[
          styles.placeholder,
          { width: size, height: size, backgroundColor: color + '20' },
          style
        ]}
      />
    );
  }

  if (!fontsLoaded) {
    return (
      <View
        style={[
          styles.placeholder,
          { width: size, height: size, backgroundColor: color + '20' },
          style
        ]}
      />
    );
  }

  return <Ionicons name={name} size={size} color={color} style={style} />;
}

const styles = StyleSheet.create({
  placeholder: {
    borderRadius: 4,
  },
}); 