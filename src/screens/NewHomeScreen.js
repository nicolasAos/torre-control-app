import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NavigationEvents } from 'react-navigation';
import {useTranslation, Trans} from 'react-i18next';


const NewHomeScreen = () => {
  
  return(
    <View
      style={
        styles.container
      }
    >
    </View>
  )

};

export default NewHomeScreen

const styles = StyleSheet.create({
  container:{
    flex: 1
  }
})
