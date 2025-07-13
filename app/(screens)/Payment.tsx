import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

const Payment = () => {
  return (
  <SafeAreaView style={{backgroundColor:'white',flex:1}}>
      <View style={{marginTop:20,marginLeft:20}}>
        <Text style={{fontSize:22,fontWeight:"700",fontFamily:"SpaceMono"}}>Select Providers</Text>
        <Text style={{marginTop:15,fontSize:12,color:"gray"}}>Select a service to pay for</Text>
      </View>
 
    </SafeAreaView>
  )
}

export default Payment

const styles = StyleSheet.create({})