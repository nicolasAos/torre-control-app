import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import {useTranslation, Trans} from 'react-i18next';
import { Button, Loading } from '../components';
import { NavigationEvents } from 'react-navigation';

import { Logger } from '../utils';

const topMenu = [
  'network',
  'sendto',
  'boxes',
  'kilos',
  'city'
]
const LabelGenerate = ({ navigation }:any) => {
  const [t] = useTranslation('screens');

  useEffect(()=>{
    Logger.log('mount LabelGenerate')
    return () => {
      Logger.log('unmount LabelGenerate')
    }
  },[])
  const [loading, setLoading] = useState(false);
  const [dataCte, setDataCTE] = useState({
    network: '',
    dest: '',
    boxes: '',
    kilos: '',
    city: '',
    fridges: '',
    cedis: ''
  });
  const [dataComplete, setDataComplete] = useState();
  
  const [detailsCte, setDetailsCte] = useState({
    destino: ''
  });
  const [recogidas, setRecogidas] = useState({
    cajas: 0,
    neveras: 0
  });
  
  
  const getDataCte = () => {
    setLoading(true)
    const data = navigation.state.params.pedido[0];
    setDataCTE({
      network: data.nf_id,
      dest: data.zona_distribucion,
      boxes: data.cajas.toString(),
      kilos: data.movilidad_kilos,
      city: data.movilidad_ciudad,
      fridges: data.neveras_recogidas.toString(),
    })
    setDetailsCte({
      destino: data.destino,
      entrega: data.nf_dt_entrega,
      destinatario: data.cliente,
      address: data.rom_destino,
      ciudad: '',
      cp: '', 
      barrio: '',
      factura: '',
      documento: '',
      observaciones: ''
    })
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() => getDataCte()} 
      />
      <Loading
        show={loading}
      />
      <View
        style={styles.topBox}
      >
        <View 
          style={{flex: 1}}
        >
          {
            topMenu.map((item) => {
              return (
                <Text
                  style={[styles.topMenuTitle, {color: 'blue'}]}
                >
                  { t('rotulos'+'.'+item) }
                </Text>
              )
            })
          }
        </View>
        <View
          style={{flex:1}}
        >
          {
              Object.keys(dataCte).map((key) => {
              if (key == 'fridges') {
                return null
              }
              return(
                <Text
                  style={[styles.topMenuTitle, {color: 'black'}]}
                >
                  { dataCte[key] }
                </Text>
              )
            })
          }
        </View>
      </View>
      <View 
        style={{
          width: '100%', 
          flexDirection: 'row',
          marginTop: 40
        }}
      >
        <View
          style={{flex: 1}}
        >
          <View
            style={{
              height: 50,
              justifyContent: 'flex-end'
            }}
          >
            <Text
              style={[styles.boxesFridges, {color: 'blue'}]}
            >
              { t('rotulos.boxesReceived') }
            </Text>
          </View>
          <View
            style={{
              height: 50,
              justifyContent: 'flex-end'
            }}
          >
            <Text
              style={[styles.boxesFridges, {color: 'blue'}]}
            >
              { t('rotulos.fridgeReceived') }
            </Text>
          </View>
        </View>
        <View
          style={{flex: 1}}
        >
          <View
            style={{
              height: 50,
              justifyContent: 'flex-end'
            }}
          >
            <TextInput
              style={styles.inputStyle}
              editable={false}
              value={dataCte.boxes}
            /> 
          </View>
          <View
            style={{
              height: 50,
              justifyContent: 'flex-end'
            }}
          >
            <TextInput
              style={styles.inputStyle}
              editable={false}
              value={dataCte.fridges}
            />
          </View>
        </View>
      </View>
      <Button 
        title={t('accept')}
        titleStyle={{
          alignSelf: 'center',
          fontSize: 14,
          color: 'white',
          fontWeight: 'bold',
        }}
        onPress={() => {
          navigation.navigate('printerStack', {
            cteId: navigation.state.params.cteId,
            cte: {
              ...dataCte,
              ...detailsCte,
              ...navigation.state.params.pedido[0],
            },
            dataCte: dataComplete,
          })
        }}
        buttonStyle={styles.buttonTravel}
      />
    </View>
  )
}

export default LabelGenerate

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBox: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  topMenuTitle: {
    fontWeight: 'bold',
    marginVertical: 3
  },
  boxesFridges: {
    fontWeight: 'bold',
  },
  buttonTravel: {
    backgroundColor: global.COLOR_TITLE_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderRadius: 50,
    marginTop: 50,
  },
  inputStyle: {
    width: '95%',
    borderBottomWidth: 2,
    borderColor: 'black',
    textAlign: 'center',
    height: 50,
    
  }

})
