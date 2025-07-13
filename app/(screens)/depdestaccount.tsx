import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Card = ({ label, backgroundColor, icon, iconType = 'image' }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor }]}>
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

export default function DestAccount() {
  return (
    <SafeAreaView style={{backgroundColor:"white",flex:1}}>
      <View style={{marginTop:20,marginLeft:20}}>
        <Text style={{fontSize:22,fontWeight:"700",fontFamily:"SpaceMono"}}>Source of funds</Text>
        <Text style={{marginTop:15,fontSize:12,color:"gray"}}>Select how you want to deposit into your account</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.row}>
         <Card
            label="From mobile wallet"
            backgroundColor="#E6FBF7"
            icon={require('@/assets/images/Wallet-pana.png')}
            iconType="image"
          />
          <Card
            label="From other bank"
            backgroundColor="#FEF3E6"
            icon={<FontAwesome name="bank" size={24} color="#3D1A4D" />}
            iconType="component"
          />
        </View>
        
      </View>      
    </SafeAreaView>
  )
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
})