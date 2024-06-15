import React from 'react'
import { View, StyleSheet, Text,  Dimensions, Image, ScrollView, } from 'react-native'


const PrinterRemissionScreen = ({ navigation }) => {
  const dataCte = navigation.state.params.cte

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        style={{width: '100%', padding: 10}}
      >
        {iterateItems()}
      </ScrollView>
    </View>
  )
}


export default PrinterRemissionScreen


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black', 
    marginVertical: 5,
    width: '100%',
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 5
  }
})
