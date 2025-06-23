import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Dimensions, SafeAreaView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { useApplication } from '../../context/ApplicationContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GenderSelector from '@/components/GenderSelector';
import { saveTempData, getTempData, clearTempData } from '../../utils/tempStorage';

interface FormData {
  gender: string;
  dateOfBirth: Date;
  nationality: string;
  countryOfResidence: string;
  email: string;
}

const screenHeight = Dimensions.get('window').height;

export default function OpenAccountScreen() {
  const { setLastAuthStep, setApplicationData } = useApplication();

  useEffect(() => {
    setLastAuthStep('open-account');
  }, []);

  const router = useRouter();
  const params = useLocalSearchParams();

  const [formData, setFormData] = useState<FormData>({
    gender: '',
    dateOfBirth: new Date(),
    nationality: '',
    countryOfResidence: '',
    email: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [showResidencePicker, setShowResidencePicker] = useState(false);

  const [nationalityCode, setNationalityCode] = useState<CountryCode>('GH');
  const [nationalityCountry, setNationalityCountry] = useState<Country | null>(null);
  const [residenceCode, setResidenceCode] = useState<CountryCode>('GH');
  const [residenceCountry, setResidenceCountry] = useState<Country | null>(null);

  const genders = ['Male', 'Female', 'Other'];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const loadTempData = async () => {
      const saved = await getTempData<FormData>('openAccountForm');
      if (saved) {
        setFormData((prev) => ({ ...prev, ...saved }));
      }
    };
    loadTempData();
  }, []);
  
  useEffect(() => {
    saveTempData('openAccountForm', formData);
  }, [formData]);
  

  const handleDateConfirm = (selectedDate: Date) => {
    setFormData({ ...formData, dateOfBirth: selectedDate });
    setShowDatePicker(false);
  };

  const getCountryName = (country: Country | null): string => {
    if (!country) return '';
    if (typeof country.name === 'object' && 'common' in country.name) {
      return country.name.common;
    }
    return String(country.name);
  };

  const handleNationalitySelect = (country: Country) => {
    setNationalityCode(country.cca2);
    setNationalityCountry(country);
    setFormData({ ...formData, nationality: getCountryName(country) });
  };

  const handleResidenceSelect = (country: Country) => {
    setResidenceCode(country.cca2);
    setResidenceCountry(country);
    setFormData({ ...formData, countryOfResidence: getCountryName(country) });
  };

  const handleSubmit = async() => {
    const { gender, nationality, countryOfResidence, email } = formData;

    if (!gender) return Alert.alert('Validation Error', 'Please select your gender');
    if (!nationality) return Alert.alert('Validation Error', 'Please select your nationality');
    if (!countryOfResidence) return Alert.alert('Validation Error', 'Please select your country of residence');
    if (!email) return Alert.alert('Validation Error', 'Please enter your email address');
    if (!isValidEmail(email)) return Alert.alert('Invalid Email', 'Please enter a valid email address');

    const personalInfo = {
      fullName: `${params.firstName} ${params.lastName}`,
      dateOfBirth: formData.dateOfBirth.toISOString(),
      email: email,
      phone: `+233${params.phoneNumber}`,
      address: `${countryOfResidence}`,
    };

    setApplicationData({ personalInfo });
     await clearTempData('openAccountForm');

    const queryParams = new URLSearchParams({
      fullName: `${params.firstName} ${params.lastName}`,
      dateOfBirth: formData.dateOfBirth.toISOString(),
      email: email,
      phone: `+233${params.phoneNumber}`,
      nationality: nationality,
      countryOfResidence: countryOfResidence,
    }).toString();

    router.push(`/identity-verification?${queryParams}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content} enableOnAndroid extraScrollHeight={100} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Open Your Account</Text>

        <GenderSelector
          selectedGender={formData.gender}
          onSelect={(gender) => setFormData({ ...formData, gender })}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{formData.dateOfBirth.toDateString()}</Text>
          <Ionicons name="calendar-outline" size={20} color="#411D4B" />
        </TouchableOpacity>
        <DateTimePickerModal isVisible={showDatePicker} mode="date" onConfirm={handleDateConfirm} onCancel={() => setShowDatePicker(false)} maximumDate={new Date()} />

        <Text style={styles.label}>Nationality</Text>
        <TouchableOpacity style={styles.countryButton} onPress={() => setShowNationalityPicker(true)}>
          <Text style={styles.countryText}>{nationalityCountry ? `${nationalityCountry.flag} ${getCountryName(nationalityCountry)}` : 'Select nationality'}</Text>
        </TouchableOpacity>
        <CountryPicker withEmoji withFilter withFlag withAlphaFilter withCountryNameButton withCallingCode={false} onSelect={handleNationalitySelect} countryCode={nationalityCode} visible={showNationalityPicker} onClose={() => setShowNationalityPicker(false)} translation="common"/>

        <Text style={styles.label}>Country of Residence</Text>
        <TouchableOpacity style={styles.countryButton} onPress={() => setShowResidencePicker(true)}>
          <Text style={styles.countryText}>{residenceCountry ? `${residenceCountry.flag} ${getCountryName(residenceCountry)}` : 'Select country of residence'}</Text>
        </TouchableOpacity>
        <CountryPicker withEmoji withFilter withFlag withAlphaFilter withCountryNameButton withCallingCode={false} onSelect={handleResidenceSelect} countryCode={residenceCode} visible={showResidencePicker} onClose={() => setShowResidencePicker(false)} translation="common" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} keyboardType="email-address" autoCapitalize="none" />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#411D4B',
  },
  input: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#411D4B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    color: '#411D4B',
    fontSize: 16,
  },
  countryButton: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  countryText: {
    fontSize: 16,
    color: '#411D4B',
  },
  radioOption: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
