import React, { useState } from 'react'
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { getNfsSupervisorOffline } from '../actions/driver';
import { Loading, Button } from '../components';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment'
import {useTranslation} from 'react-i18next';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';


const PrinterSignatureScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [dataCte, setDataCTE] = useState({
    date: '',
    network: '',
    nit: '',
    cliente: '',
    boxes: ''
  });
  const [sender, setSender] = useState({
    colaborador: '',
    cliente: ''
  });
  const [t] = useTranslation('buttons')    
  
  const generatePdfElement = () => {
    return `
      <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 95%; 
          border: 2px solid black; 
          padding: 10px; 
          border-radius: 5px; 
          display: flex; 
          flex-direction: column; 
          margin-top: 5px;
          margin-bottom: 5px"
        >
          <div>
            <span style="font-weigth: bold;">
              ${moment(dataCte?.fecha_actual).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>
          <div>
            <span style="font-weigth: bold;">
              ${dataCte?.network}
            </span>
          </div>
          <div>
            <span style="font-weigth: bold;">
              ${dataCte?.nit}
            </span>
          </div>
          <div>
            <span style="font-weigth: bold;">
              ${dataCte?.cliente}
            </span>
          </div>
          <div>
            <span style="font-weigth: bold;">
              Total cajas ${dataCte?.boxes}
            </span>
          </div>
        </div>
        <div style="
          width: 95%; 
          border: 2px solid black; 
          padding: 10px; 
          border-radius: 5px; 
          display: flex; 
          flex-direction: column; 
          margin-top: 5px;
          margin-bottom: 5px"
        >
          <div>
            <span style="font-weigth: bold;">
              ${dataCte?.network}
            </span>
          </div>
          <div style="width: '100%'; height: 95px; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: black;">
          </div>
          <div>
            <span style="font-weigth: bold;">
              Firma Colaborador de ${sender?.colaborador}
            </span>
          </div>
        </div>
        <div style="
          width: 95%; 
          border: 2px solid black; 
          padding: 10px; 
          border-radius: 5px; 
          display: flex; 
          flex-direction: column; 
          margin-top: 5px;
          margin-bottom: 5px"
        >
          <div>
            <span style="font-weigth: bold;">
              ${dataCte?.network}
            </span>
          </div>
          <div style="width: '100%'; height: 95px; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: black;">
          </div>
          <div>
            <span style="font-weigth: bold;">
              Firma Colaborador de ${sender?.cliente}
            </span>
          </div> 
        </div>
      </div>
    `
  }

  const generatePdfDocument = async() => {
    try {
      const options = {
        html: await generatePdfElement(),
        fileName: 'test',
        padding: 0
      }
      let file = await RNHTMLtoPDF.convert(options)
      await FileViewer.open(file.filePath) 
    } catch (e) {
      console.log(e)
    }

  }
  const getDataCte = () => {
    setLoading(true)
    const data = navigation.state.params.pedido[0]
    setDataCTE({
      date: moment(data.fecha_actual).format('DD/MM/YYYY HH:mm'),
      network: data.nf_id,
      nit: data.nit,
      cliente: data.desc_nit,
      boxes: `Total cajas ${data.cajas}`
    })
    setSender({
      colaborador: data.colaborador,
      cliente: data.cliente
    })
    setLoading(false)
  }
  return (
      <View
        style={styles.container}
      >
        <NavigationEvents
          onWillFocus={() => getDataCte()} 
        />
        <Loading
          show={loading}
        />
        <ScrollView
          style={{ width: '100%', padding: 10 }}
        >
          <View
            style={styles.topBox}
          >
          {
              Object.keys(dataCte).map((key) => {
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
          <View style={styles.topBox}>
            <Text
              style={[styles.topMenuTitle, {color: 'black'}]}
            >
              { dataCte.network }
            </Text>
            <View
              style={styles.campoFirma}
            />
            <Text>
              {`Firma Colaborador de ${sender.colaborador}`}  
            </Text>
          </View>
          <View style={styles.topBox}>
            <Text
              style={[styles.topMenuTitle, {color: 'black'}]}
            >
              { dataCte.network }
            </Text>
            <View
              style={styles.campoFirma}
            />
            <Text>
              {`Firma Colaborador de ${sender.cliente}`}  
            </Text>
          </View>
          <View
            style={{width: '100%', marginBottom: 30}}
          >
            <Button
              LeftIcon={() => {
                return <Image source={require('../imgs/printer.png')} style={{width: 39, height: 40}} />
              }}
              title={t('print')}
              titleStyle={{
                alignSelf: 'center',
                fontSize: 13,
                color: 'white',
                fontWeight: 'bold',
              }}
              buttonStyle={styles.buttonTravel}
              onPress={() =>{
                generatePdfDocument()
              }}
            />
          </View>
        </ScrollView>
      </View>
  )
}

export default PrinterSignatureScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBox: {
    width: '100%',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15
  },
  topMenuTitle: {
    fontWeight: 'bold',
    marginVertical: 4
  },
  campoFirma: {
    width: '100%',
    height: 100,
    borderBottomWidth: 1,
    borderColor: 'black'
  },
  buttonTravel: {
    backgroundColor: global.COLOR_TITLE_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    borderRadius: 50,
    marginTop: 50,
  }
})
