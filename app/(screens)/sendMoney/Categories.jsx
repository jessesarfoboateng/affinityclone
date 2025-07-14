import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const TransactionCategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Transport');
  const [narration, setNarration] = useState('');

  const categories = [
    { id: 'general', name: 'General', icon: 'apps', iconFamily: 'Ionicons', color: '#F3F4F6' },
    { id: 'fun', name: 'Fun', icon: 'celebration', iconFamily: 'MaterialIcons', color: '#F3E8FF' },
    { id: 'transport', name: 'Transport', icon: 'car', iconFamily: 'Ionicons', color: '#DCFCE7' },
    { id: 'food', name: 'Food', icon: 'restaurant', iconFamily: 'Ionicons', color: '#FEF3C7' },
    { id: 'health', name: 'Health', icon: 'medical', iconFamily: 'Ionicons', color: '#F3F4F6' },
    { id: 'education', name: 'Education', icon: 'school', iconFamily: 'Ionicons', color: '#DCFCE7' },
    { id: 'religion', name: 'Religion', icon: 'star-and-crescent', iconFamily: 'FontAwesome5', color: '#FEF3C7' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping-cart', iconFamily: 'Entypo', color: '#F3E8FF' },
    { id: 'selfcare', name: 'Self Care', icon: 'happy', iconFamily: 'Ionicons', color: '#F3F4F6' },
    { id: 'bills', name: 'Bills', icon: 'receipt', iconFamily: 'Ionicons', color: '#FEF3C7' },
    { id: 'holidays', name: 'Holidays', icon: 'map', iconFamily: 'Ionicons', color: '#E0F2FE' },
    { id: 'gifts', name: 'Gifts', icon: 'gift', iconFamily: 'Ionicons', color: '#DCFCE7' },
  ];

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const renderIcon = (icon, iconFamily, isSelected) => {
    const iconColor = isSelected ? '#663399' : '#666666';
    const iconSize = 24;

    switch (iconFamily) {
      case 'Ionicons':
        return <Ionicons name={icon} size={iconSize} color={iconColor} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon} size={iconSize} color={iconColor} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon} size={iconSize} color={iconColor} />;
      case 'Entypo':
        return <Entypo name={icon} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name={icon} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Additional details</Text>

        {/* Transaction Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction categories</Text>
            <View style={styles.infoIcon}>
              <Text style={styles.infoText}>?</Text>
            </View>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor: selectedCategory === category.id ? '#E8F5E8' : category.color,
                  },
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={styles.categoryIcon}>
                  {renderIcon(category.icon, category.iconFamily, selectedCategory === category.id)}
                </View>
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? '#663399' : '#666666' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Narration */}
        <View>
          <View style={styles.narrationHeader}>
            <Text style={styles.sectionTitle}>Narration</Text>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <TextInput
            style={styles.narrationInput}
            value={narration}
            onChangeText={setNarration}
            placeholder=""
            multiline
            maxLength={30}
          />
          <Text style={styles.characterCount}>0 / 30</Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 20,
    marginBottom: 30,
  },
 
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginRight: 8,
  },
  infoIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
  },
  categoryIcon: {
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 13,
  },
  narrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optional: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  narrationInput: {
    borderWidth: 1,
    borderColor: '#4A1A4A',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#4A1A4A',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TransactionCategoriesPage;