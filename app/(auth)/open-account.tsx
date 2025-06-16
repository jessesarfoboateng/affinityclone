import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, TextInput, Modal, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useApplication } from '../../context/ApplicationContext';

interface FormData {
  gender: string;
  dateOfBirth: Date;
  nationality: string;
  countryOfResidence: string;
  email: string;
}

export default function OpenAccountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setApplicationData } = useApplication();
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    dateOfBirth: new Date(),
    nationality: '',
    countryOfResidence: '',
    email: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get user's full name and phone number from params
  const { firstName, lastName, phoneNumber } = params;
  const fullName = `${firstName} ${lastName}`;

  const genders = ['Male', 'Female', 'Other'];
  const countries = ['Ghana', 'Nigeria', 'Kenya', 'South Africa', 'United States', 'United Kingdom', 'Canada'];

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.gender || !formData.nationality || !formData.countryOfResidence || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Format the data for the application context
    const personalInfo = {
      fullName: fullName,
      dateOfBirth: formData.dateOfBirth.toISOString(),
      email: formData.email,
      phone: `+233${phoneNumber}`,
      address: `${formData.countryOfResidence}` // You might want to add more address fields
    };

    // Save to application context
    setApplicationData({ personalInfo });

    // Navigate to identity verification with the data
    const queryParams = new URLSearchParams({
      fullName,
      dateOfBirth: formData.dateOfBirth.toISOString(),
      email: formData.email,
      phone: `+233${phoneNumber}`,
      nationality: formData.nationality,
      countryOfResidence: formData.countryOfResidence
    }).toString();

    router.push(`/identity-verification?${queryParams}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="#411D4B" />
            </View>
            <Text style={styles.greeting}>Hello {fullName}!</Text>
            <Text style={styles.subtitle}>
              Your Relafin account will be opened using the:
            </Text>
            <View style={styles.phoneBadge}>
              <Ionicons name="call" size={16} color="#411D4B" />
              <Text style={styles.phoneText}>+233{phoneNumber}</Text>
            </View>
            <Text style={styles.instructionText}>
              Please complete these final details to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  style={styles.picker}
                  dropdownIconColor="#411D4B"
                >
                  <Picker.Item label="Select your gender" value="" />
                  {genders.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <View style={styles.dateContent}>
                  <Ionicons name="calendar-outline" size={20} color="#411D4B" style={styles.dateIcon} />
                  <Text style={styles.pickerButtonText}>
                    {formatDate(formData.dateOfBirth)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#411D4B" />
              </TouchableOpacity>

              {showDatePicker && (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Date of Birth</Text>
                      </View>
                      <View style={styles.datePickerWrapper}>
                        <DateTimePicker
                          value={formData.dateOfBirth}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          maximumDate={new Date()}
                          textColor="#411D4B"
                          themeVariant="light"
                        />
                      </View>
                      <View style={styles.datePickerButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => setShowDatePicker(false)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.okButton}
                          onPress={() => setShowDatePicker(false)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.okButtonText}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>

            {/* Nationality */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationality</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.nationality}
                  onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                  style={styles.picker}
                  dropdownIconColor="#411D4B"
                >
                  <Picker.Item label="Select your nationality" value="" />
                  {countries.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Country of Residence */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country of Residence</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.countryOfResidence}
                  onValueChange={(value) => setFormData({ ...formData, countryOfResidence: value })}
                  style={styles.picker}
                  dropdownIconColor="#411D4B"
                >
                  <Picker.Item label="Select country of residence" value="" />
                  {countries.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#411D4B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');
const bottomPadding = Platform.OS === 'ios' ? 34 : 24;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  container: {
    flex: 1,
    backgroundColor: '#71C7D8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: bottomPadding,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#411D4B',
    marginBottom: 8,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#411D4B',
    lineHeight: 24,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  phoneText: {
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginLeft: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#411D4B',
    fontFamily: 'Roboto',
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    gap: 24,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
    fontWeight: '500',
    marginLeft: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: '#411D4B',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    padding: 16,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#411D4B',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#411D4B',
    fontFamily: 'Roboto',
  },
  datePickerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#411D4B',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  okButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#411D4B',
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
});