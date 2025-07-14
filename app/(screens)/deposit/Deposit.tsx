import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Deposit = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {/* Content */}
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", fontFamily: "SpaceMono" }}>
          Destination Account
        </Text>
        <Text style={{ marginTop: 15, fontSize: 12, color: "gray" }}>
          Select the receiving account
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={() => router.push("../../(screens)/depdestaccount")}
      >
        <View style={styles.contentContainer}>
          {/* Piggy bank icon container */}
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={32} color="#20B2AA" />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Affinity Daily</Text>
            <Text style={styles.amountText}>GHS 0.00</Text>
            <Text style={styles.accountNumber}>200144587829</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  cardContainer: {
    height: 100,
    width: "90%",
    borderRadius: 16,
    borderWidth: 1.1,
    borderColor: "#E5E7EB",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F7FA', // Light cyan background
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B2C91', // Purple color matching the image
    marginBottom: 2,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '500',
    color: "#6B7280",
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: '500',
  },
});