import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '../components';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RenderHtml from 'react-native-render-html';
import {Logger, appendZero} from '../utils';
import moment from 'moment';

const PrinterScreen = ({navigation}: any) => {
  const [t] = useTranslation('buttons');
  const dataCte = navigation.state.params.cte;
  const data = navigation.state.params.cte;

  useEffect(() => {
    Logger.log('mount PrinterScreen');

    return () => {
      Logger.log('unmount PrinterScreen');
    };
  }, []);

  const generatePdfElement = () => {
    let finalString = `<div style="width: 100%; height:400px; display: flex; flex-direction: column;">`;
    for (let i = 0; i < parseInt(dataCte.boxes, 10); i++) {
      const boxNumber = appendZero(String(i + 1));
      const totalBoxes = appendZero(data.boxes);
      const dataMatrixCode = `${data.network}U${boxNumber}U${totalBoxes}U${data.destino_uf}UC`;
      finalString =
        finalString +
        `
        <div style="
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        grid-template-rows: repeat(13, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        border: solid 1px #000
    ">
      <div style="
        grid-area: 1 / 1 / 3 / 5; 
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        <img
           src="https://solistica.com/wp-content/uploads/2018/06/logo-solistica-timeline_0.png"
           style="width: 58px; height: 40px;"
        /> 
      </div>
      <div style="
        grid-area: 3 / 1 / 4 / 6;
        font-size:14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:14px;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        Destino 
      </div>
      <div style="
        grid-area: 4 / 1 / 6 / 6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:26px;
        font-weight: bold;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        ${data.destino.slice(0, 3)}
      </div>
      <div style="
        grid-area: 8 / 1 / 14 / 9;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 0px 1px 0px 0px;
      "> 
        <img
          src="https://barcode.tec-it.com	/barcode.ashx?data=${dataMatrixCode}&code=DataMatrix&dmsize=Default&eclevel=L"
            style="width: 90%; "
        /> 
      </div>
      <div style="
        grid-area: 6 / 17 / 12 / 25;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
         <img
           src="https://barcode.tec-it.com/barcode.ashx?data=https://starweb.solistica.com/StarWeb/wptrackingcajas.aspx?${dataMatrixCode}&code=QRCode&dmsize=Default&eclevel=L"
           style="width: 90%; "
         /> 
        
      </div>
      <div style="
        grid-area: 6 / 1 / 7 / 17; 
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        padding-left: 2px;
      "> 
        Cliente: 
        <span style="font-weight: bold;">
        ${data.cliente}
        </span>
      </div>
      <div style="
        grid-area: 7 / 1 / 8 / 17;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        padding-left: 2px;
      ">
        Obs: ${data.observaciones}
      </div>
      <div style="
        grid-area: 3 / 6 / 4 / 25;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
        padding-left: 2px;
      ">
        Destinatario
        <span style="font-weight: bold;">
        ${data.rom_destino}
        </span>
      </div>
      <div style="
        grid-area: 4 / 6 / 5 / 25;
        padding-left: 2px;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
      ">
        Dirección: ${data.address}
      </div>
      <div style="
        grid-area: 5 / 6 / 6 / 15; 
        padding-left: 2px;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        Ciudad: ${data.destino} 
      </div>
      <div style="
        grid-area: 5 / 15 / 6 / 25;
        padding-left: 2px;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
      ">
        Barrio: ${data.barrio}
      </div>
      <div style="
        grid-area: 8 / 9 / 9 / 17;
        font-size:14px;
        padding-left:2px;
        border-style: solid;
        border-width: 0px 1px 0px 0px;
      ">
        Documentos:
      </div>
      <div style="
        grid-area: 9 / 9 / 12 / 17;
        font-size:26px;
        padding-left: 2px;
        font-weight: bold;
        padding-left:2px;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        ${data.documento}
      </div>
      <div style="
        grid-area: 12 / 9 / 14 / 17;
        display: flex;
        align-items: center;
        padding-left: 2px;
      ">
        ZONA ${data.zona}
      </div>
      <div style="
        grid-area: 12 / 17 / 14 / 25;
        display: flex;
        align-items: center;
        padding-left: 2px;
        border-style: solid;
        border-width: 1px 0px 0px 1px;
      ">
        RUTA ${data.ruta}
      </div>
      <div style="
        grid-area: 1 / 5 / 2 / 11;
        font-size:14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      ">
        Elaboracion 
      </div>
      <div style="
        grid-area: 2 / 5 / 3 / 11;
        font-size:18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
      "> 
        ${moment().format('DD/MM/YY')}
      </div>
      <div style="
        grid-area: 1 / 21 / 2 / 25;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:14px;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
      ">
        Unidades
      </div>
      <div style="
        grid-area: 2 / 21 / 3 / 25;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:26px;
        font-weight: bold;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
      ">
        ${i + 1}/${dataCte.boxes}
      </div>
      <div style="
        grid-area: 1 / 11 / 2 / 21;
        border-style: solid;
        border-width: 0px 1px 0px 0px;
        font-size:14px;
        padding-left: 2px;
        display: flex;
        align-items: center;
      "> 
        Remesa
      </div>
      <div style="
        grid-area: 2 / 11 / 3 / 21;
        border-style: solid;
        border-width: 0px 1px 1px 0px;
        font-size:26px;
        padding-left: 2px;
        font-weight: bold;
       ">
        ${dataCte.network}
      </div>
    </div> 
       `;
    }

    return finalString + '</div>';
  };

  const generatePdfDocument = async () => {
    const options = {
      html: generatePdfElement(),
      fileName: 'test',
      padding: 0,
      width: 600,
      height: 830,
    };

    let file = await RNHTMLtoPDF.convert(options);
    FileViewer.open(file.filePath);
  };

  const PdfBarCodePreview = ({index}: any) => {
    return (
      <View style={[barCodeStyle.container, {marginTop: 10}]}>
        <Header {...{index, dataCte, data}} />
        <Direction {...{data}} />
        <ExtraContent {...{data, index}} />
      </View>
    );
  };

  const iterateItems = () => {
    let indents = [];
    for (let i = 0; i < parseInt(dataCte.boxes, 10); i++) {
      indents.push(<PdfBarCodePreview index={i} />);
    }
    return indents;
  };

  const source = {
    html: generatePdfElement(),
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{width: '100%', padding: 2}}>
        {iterateItems()}
        <View style={{width: '100%', marginBottom: 30}}>
          <Button
            LeftIcon={() => {
              return (
                <Image
                  source={require('../imgs/printer.png')}
                  style={{width: 39, height: 40}}
                />
              );
            }}
            title={t('print')}
            titleStyle={{
              alignSelf: 'center',
              fontSize: 13,
              color: 'white',
              fontWeight: 'bold',
            }}
            buttonStyle={styles.buttonTravel}
            onPress={() => {
              generatePdfDocument();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PrinterScreen;

const QR_WIDTH = 94;

function QRCode({type, codeData, paddingTop}: any) {
  const qrWidth = QR_WIDTH;
  return (
    <View
      style={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: qrWidth,
          height: qrWidth,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          paddingTop,
        },
      ]}>
      <Image
        source={{
          uri: `https://barcode.tec-it.com/barcode.ashx?data=${codeData}&code=${type}&dmsize=Default&eclevel=L`,
        }}
        style={{width: QR_WIDTH - 10, height: QR_WIDTH - 10}}
        resizeMode="contain"
      />
    </View>
  );
}

function ExtraContent({data, index}: any) {
  const {width} = Dimensions.get('window');

  const qrWidth = QR_WIDTH;
  const bottomItemWidth = (width - qrWidth) / 2;
  const bottomLeftItemWidth = width - qrWidth - 4;
  const boxNumber = appendZero(String(index + 1));
  const totalBoxes = appendZero(data.boxes);
  const dataMatrixCode = `${data.network}U${boxNumber}U${totalBoxes}U${data.destino_uf}UC`;

  return (
    <View style={{height: qrWidth + 40}}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View>
          <View
            style={{
              width: bottomLeftItemWidth,
              height: 20,
              justifyContent: 'center',
              borderTopWidth: 1,
            }}>
            <Text style={stylesPR.smallText}>
              Cliente: <Text style={{fontWeight: 'bold'}}>{data.cliente}</Text>
            </Text>
          </View>
          <View
            style={{
              width: bottomLeftItemWidth,
              height: 20,
              justifyContent: 'center',
              borderTopWidth: 1,
              borderBottomWidth: 1,
            }}>
            <Text style={stylesPR.smallText}>
              Obs:{' '}
              <Text style={{fontWeight: 'bold'}}>{data.observaciones}</Text>
            </Text>
          </View>
          <View
            style={{
              width: bottomLeftItemWidth - 40,
              height: qrWidth - 20,
              position: 'absolute',
              bottom: -qrWidth + 20,
              left: qrWidth,
              paddingLeft: 5,
            }}>
            <Text style={stylesPR.smallText}>Documentos:</Text>
            <Text style={{fontWeight: 'bold'}}>{data.documento}</Text>
          </View>
        </View>
        <View style={{position: 'absolute', right: 0}}>
          <QRCode
            {...{
              paddingTop: 20,
              type: 'QRCode',
              codeData: `https://starweb.solistica.com/StarWeb/wptrackingcajas.aspx?${dataMatrixCode}`,
            }}
          />
          <View style={{height: 20, width: qrWidth, borderLeftWidth: 1}} />
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 0, borderRightWidth: 1}}>
        <QRCode {...{type: 'DataMatrix', codeData: dataMatrixCode}} />
      </View>
      <View style={{flexDirection: 'row', position: 'absolute', bottom: 0}}>
        <View style={{width: qrWidth}} />
        <View
          style={{
            width: bottomItemWidth,
            height: 20,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderLeftWidth: 1,
            padding: 2,
            alignSelf: 'flex-end',
          }}>
          <Text style={stylesPR.smallText}>
            ZONA <Text style={{fontWeight: 'bold'}}>{data.zona}</Text>
          </Text>
        </View>
        <View
          style={{
            width: bottomItemWidth,
            height: 20,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderLeftWidth: 1,
            padding: 2,
            alignSelf: 'flex-end',
          }}>
          <Text style={stylesPR.smallText}>
            RUTA <Text style={{fontWeight: 'bold'}}>{data.ruta}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

function Direction({data}: any) {
  const destiny = data.destino.slice(0, 3);
  return (
    <View style={{width: '100%', flexDirection: 'row'}}>
      <View style={barCodeStyle.topColumnfirst}>
        <View style={barCodeStyle.destinoTitleContainer}>
          <Text style={stylesPR.smallLabel}>Destino</Text>
        </View>
        <View style={barCodeStyle.destinoBottomContainer}>
          <Text style={barCodeStyle.destinoBottomText}>{destiny}</Text>
        </View>
      </View>
      <View style={[barCodeStyle.topColumnSecond, {flexDirection: 'column'}]}>
        <View
          style={{
            width: '100%',
            height: 20,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderLeftWidth: 1,
          }}>
          <Text style={stylesPR.smallText}>
            Destinatario:{' '}
            <Text style={{fontWeight: 'bold'}}>{data.rom_destino}</Text>
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 20,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderLeftWidth: 1,
          }}>
          <Text style={stylesPR.smallText}>
            Dirección: <Text>{data.address}</Text>
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 20,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{width: '50%'}}>
            <Text style={stylesPR.smallText}>
              Ciudad: <Text>{data.destino}</Text>
            </Text>
          </View>
          <View style={{width: '50%', borderLeftWidth: 1, paddingLeft: 2}}>
            <Text style={stylesPR.smallText}>
              Barrio: <Text>{data.barrio}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Header({dataCte, data, index}: any) {
  const {width} = Dimensions.get('window');

  const logoWidth = width * 0.15;
  const remesaWidth = width * 0.44;
  const dateWidth = width * 0.23;
  const unitWidth = width * 0.18;

  return (
    <View style={{width: '100%', flexDirection: 'row'}}>
      <View
        style={{
          width: logoWidth,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{
            uri: 'https://solistica.com/wp-content/uploads/2018/06/logo-solistica-timeline_0.png',
          }}
          style={{width: 50, height: 40}}
          resizeMode={'contain'}
        />
      </View>
      <View style={{width: dateWidth, borderLeftWidth: 1}}>
        <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}>
          <Text style={[stylesPR.smallLabel]}>Elaboración</Text>
        </View>
        <View>
          <Text style={stylesPR.text}>{moment().format('DD/MM/YY')}</Text>
        </View>
      </View>
      <View
        style={{
          width: remesaWidth,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          paddingHorizontal: 2,
        }}>
        <View>
          <Text style={[stylesPR.smallLabel, {textAlign: 'left'}]}>Remesa</Text>
          <Text style={{fontWeight: 'bold', fontSize: 17}}>
            {dataCte.network}
          </Text>
        </View>
      </View>
      {/**
         <View style={barCodeStyle.interiorTop}>
        <View style={barCodeStyle.rowInteriorTop}>
          <Text style={barCodeStyle.textTitleStyle}>Promesa</Text>
        </View>
        <View style={barCodeStyle.rowInteriorTop}>
          <Text style={barCodeStyle.interiorTextStyle}>
            {data.cte_previsao.slice(0, data.cte_previsao.indexOf(' '))}
          </Text>
        </View>
      </View>
         */}
      <View style={{width: unitWidth}}>
        <View style={{borderBottomColor: 'black', borderBottomWidth: 1}}>
          <Text style={stylesPR.smallLabel}>Unidades</Text>
        </View>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 17, textAlign: 'center'}}>
            {index + 1}/{dataCte.boxes}
          </Text>
        </View>
      </View>
    </View>
  );
}

const stylesPR = StyleSheet.create({
  smallLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 9,
  },
});

const barCodeStyle = StyleSheet.create({
  textTitleStyle: {
    fontSize: 9,
  },
  interiorTextStyle: {
    fontSize: 9,
  },
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
  },
  topColumnfirst: {
    flex: 0.2,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  topColumnSecond: {
    flex: 0.8,
    flexDirection: 'row',
  },
  interiorTop: {
    borderWidth: 0.5,
    borderColor: 'black',
  },
  rowInteriorTop: {
    borderWidth: 0.5,
    borderColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinoTitleContainer: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinoTitleText: {},
  destinoBottomContainer: {
    height: 40,
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinoBottomText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  destinatarioLeft: {
    width: '100%',
    height: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinatarioLeftBottom: {
    height: 40,
    borderWidth: 0.5,
    borderColor: 'black',
    flexDirection: 'row',
  },
  destinatarioLeftRigth: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  destinatarioLeftLeft: {
    flex: 0.3,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  addressLeft: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'black',
    flexDirection: 'row',
  },
  addressLeftBottom: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'black',
    flexDirection: 'row',
  },
  midColumn: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'black',
    flexDirection: 'row',
  },
  bottomRigth: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'black',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLeft: {
    flex: 0.3,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'black',
  },
  column: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'black',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginVertical: 5,
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
  barcodeContainer: {
    width: '100%',
    padding: 8,
    borderColor: 'black',
    borderWidth: 1,
    height: 250,
    marginVertical: 3,
  },
  barCodeColumnTopBottom: {
    width: '100%',
    borderColor: 'black',
    flex: 0.4,
    borderWidth: 0.5,
    flexDirection: 'row',
  },
  generalBorder: {
    borderColor: 'black',
    borderWidth: 0.4,
    flexDirection: 'row',
  },
  barCodeColumnMid: {
    width: '100%',
    borderColor: 'black',
    flex: 0.2,
    borderWidth: 0.5,
    flexDirection: 'row',
  },
  bogLogo: {
    flex: 0.3,
    borderColor: 'black',
    borderWidth: 0.4,
  },
  bogLeft: {
    flex: 0.7,
    borderColor: 'black',
    borderWidth: 0.4,
  },
});
const stylesCSS = {};
