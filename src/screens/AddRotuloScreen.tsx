import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Button, Loading } from '../components';
import {useTranslation} from 'react-i18next';
import { NavigationEvents } from 'react-navigation';

// utils
import { Logger } from '../utils';

const AddRotuloScreen = ({navigation}:any) => {
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    Logger.log('mount AddRotuloScreen')
    return ()=> {
      Logger.log('unmount AddRotuloScreen')
    }
  },[])
  
  const loadData = async () => {
    setLoading(true)
    const type = await navigation.state.params?.type
    await navigation.state.params.screenState?.addRotulos()
    await navigation.state.params.screenState?.addType(type)
    //getRemission()
    setLoading(false)
  }

  const [t] = useTranslation('rotulosScreens');
  return(
    <View style={styles.container}>  
      <NavigationEvents
        onWillFocus={() => loadData()} 
      />
      <Loading
        show={loading} 
      />
      <Button
        LeftIcon={() => {
          return <Image source={require('../imgs/qrcode.png')} style={{width: 40, height: 40}} />
        }}
        title={t('qrButton')}
        titleStyle={{
          alignSelf: 'center',
          fontSize: 14,
          color: 'white',
          fontWeight: 'bold',
        }}
        buttonStyle={styles.buttonTravel}
        onPress={() =>{
          navigation.navigate('labelGenerateStack', {
            cteId: navigation.state.params.cteId,
            pedido: navigation.state.params.pedido,
          })
        }}
      />
      <View
        style={{padding: 5}}
      />
      <Button
        LeftIcon={() => {
          return <Image source={require('../imgs/printer.png')} style={{width: 40, height: 40}} />
        }}
        title={t('network')}
        titleStyle={{
          alignSelf: 'center',
          fontSize: 14,
          color: 'white',
          fontWeight: 'bold',
        }}
        onPress={() => {
          navigation.navigate('printerSignatureStack', {
            cteId: navigation.state.params.cteId,
            pedido: navigation.state.params.pedido,
          })
        }}
        buttonStyle={styles.buttonTravel}
      />
    </View>
  )
}


export default AddRotuloScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  buttonTravel: {
    backgroundColor: '#dcc523',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderRadius: 50,
    marginVertical: 15,
  }
})

