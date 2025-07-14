import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Image, ImageSourcePropType, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardProps {
  label: string;
  backgroundColor: string;
  icon: ImageSourcePropType | React.ReactElement;
  iconType?: 'image' | 'component';
  onPress: () => void;
}

const Card = ({ label, backgroundColor, icon, iconType = 'image', onPress }: CardProps) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
    <View style={styles.iconWrapper}>
      {iconType === 'image' ? (
        <Image source={icon as ImageSourcePropType} style={styles.icon} />
      ) : (
        <>{icon}</>
      )}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

export default function DestAccount() {
  const router = useRouter();

  const handleMobileWalletPress = (): void => {
    router.push('(screens)/deposit/depositIntoAccount');
  };

  const handleBankTransferPress = (): void => {
    router.push('/bank-transfer-deposit');
  };

  const handleBackPress = (): void => {
    router.back();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={18} color="#3D1A4D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", fontFamily: "SpaceMono" }}>
          Source of funds
        </Text>
        <Text style={{ marginTop: 15, fontSize: 12, color: "gray" }}>
          Select how you want to deposit into your account
        </Text>
      </View>

      <View style={styles.container}>
        <View style={styles.row}>
          <Card
            label="From mobile wallet"
            backgroundColor="#E6FBF7"
            icon={require('@/assets/images/Wallet-pana.png')}
            iconType="image"
            onPress={handleMobileWalletPress}
          />
          <Card
            label="From other bank"
            backgroundColor="#FEF3E6"
            icon={<FontAwesome name="bank" size={24} color="#3D1A4D" />}
            iconType="component"
            onPress={handleBankTransferPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D1A4D',
    fontFamily: 'SpaceMono',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    marginRight: 16,
    justifyContent: 'flex-start',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    color: '#3D1A4D',
    fontSize: 16,
    fontWeight: '500',
  },
});