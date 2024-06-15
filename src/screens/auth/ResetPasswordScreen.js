import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { WebView } from 'react-native-webview';
const ResetPasswordScreen = ({navigation}) => {
  const url = navigation.state.params.api ? 'http://strackqa.solistica.com/torre_control/login/forgot/inicio' :
  'https://annuit.solistica.com/torre_control/login/forgot/inicio'


  return (
    <View
      style={{
        flex: 1
      }}
    >
      <WebView
        style={{ flex: .9 }}
        source={{uri: url}}
      />
      <View 
        style={{ 
          flex: .1,
          alignItems: 'center',
          padding: 3
        }}
      >
        <TouchableOpacity
          onPress={() => { navigation.goBack() }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              textDecorationLine: 'underline'
            }}
          >
            Regresar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ResetPasswordScreen
