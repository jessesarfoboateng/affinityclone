import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Card = ({ label, backgroundColor, icon, iconType = 'image', onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
    <View style={styles.iconWrapper}>
      {iconType === 'image' ? (
        <Image source={icon} style={styles.icon} />
      ) : (
        icon
      )}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const RecipientOption = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.recipientOption} onPress={onPress}>
    <View style={styles.recipientIcon}>
      {icon}
    </View>
    <Text style={styles.recipientLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function DestAccount() {
  const router = useRouter();
  const [showRecipientModal, setShowRecipientModal] = useState(false);

  const handleMobileWalletPress = () => {
    setShowRecipientModal(true);
  };

  const dismissRecipientModal = () => {
    setShowRecipientModal(false);
  };

  const handleRecipientSelect = (recipientType) => {
    setShowRecipientModal(false);
    router.push("../../(screens)/sendMoney/addNewRecipient");
    // Handle the selected recipient type
    console.log('Selected recipient:', recipientType);
    // Navigate to appropriate screen based on selection
  };

  return (
    <SafeAreaView style={{backgroundColor:"white",flex:1}}>
      <View style={{marginTop:20,marginLeft:20}}>
        <Text style={{fontSize:25,fontWeight:"600",fontFamily:"SpaceMono"}}>Destination Account</Text>
        <Text style={{marginTop:15,fontSize:15,color:"gray"}}>Select the type of account</Text>
      </View>
       
      <View style={styles.container}>
        <View style={styles.row}>
          <Card
            label="Relafin"
            backgroundColor="#EEF3FC"
            icon={require('@/assets/images/relafinlogo.png')} 
            iconType="image"
            onPress={()=>router.push("")}
          />
          <Card 
            label="Mobile wallet"
            backgroundColor="#E6FBF7"
            icon={require('@/assets/images/Wallet-pana.png')}
            iconType="image"
            onPress={handleMobileWalletPress}
          />
        </View>
        <View style={styles.otherBank}>
          <Card
            label="Other bank"
            backgroundColor="#FEF3E6"
            icon={<FontAwesome name="bank" size={24} color="#FF9800"/>}
            iconType="component"
            onPress={()=>router.push("")}
          />
        </View>
      </View>

      {/* Recipient Selection Modal */}
      <Modal
        visible={showRecipientModal}
        transparent={true}
        animationType="slide"
        onRequestClose={dismissRecipientModal}
      >
        <View style={styles.recipientModalOverlay}>
          <View style={styles.recipientModalContainer}>
            <View style={styles.recipientModalHeader}>
              <Text style={styles.recipientModalTitle}>Select a recipient</Text>
              <TouchableOpacity onPress={dismissRecipientModal}>
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.recipientOptions}>
              <RecipientOption
                icon={<FontAwesome name="user" size={24} color="#4A90E2" />}
                label="Other mobile wallet"
                onPress={() => handleRecipientSelect('other')}
              />
              
              <RecipientOption
                icon={<View style={styles.myWalletIcon}><Text style={styles.myWalletText}>SK</Text></View>}
                label="My mobile wallet"
                onPress={() => handleRecipientSelect('my')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  otherBank: {
    flexDirection: 'row',
    marginBottom: 16,
    width: 190
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
  // Recipient Modal Styles
  recipientModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  recipientModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 200,
  },
  recipientModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  recipientModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D1A4D',
  },
  recipientOptions: {
    gap: 20,
  },
  recipientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  recipientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recipientLabel: {
    fontSize: 16,
    color: '#3D1A4D',
    fontWeight: '500',
  },
  myWalletIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myWalletText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
});