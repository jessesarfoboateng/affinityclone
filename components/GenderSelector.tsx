import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GenderSelectorProps {
  selectedGender: string;
  onSelect: (gender: string) => void;
}

const genders = ['Male', 'Female', 'Other'];

export default function GenderSelector({ selectedGender, onSelect }: GenderSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        {genders.map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.button,
              selectedGender === gender && styles.selectedButton,
            ]}
            onPress={() => onSelect(gender)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedGender === gender && styles.selectedText,
              ]}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#411D4B',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#411D4B',
    borderColor: '#411D4B',
  },
  buttonText: {
    color: '#411D4B',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});
