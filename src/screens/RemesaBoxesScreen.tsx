import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
// components
import {
  MainButton,
  RemesaScannerBox,
  SnowflakeIcon,
  RemesaBox,
  RemissionHeader,
  Loading,
  PRModal,
  TemperatureModalInput,
} from '../components';
import NativeCheckBox from '@react-native-community/checkbox';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
// styles
import {Colors} from '../styles';
// types
import type {BaseOrderInterface} from '../types';
import type {ColSDTDesMovCaj} from '../api/types';
import type {RemesaBox as RemesaBoxI} from '../components/RemesaBox';
// realm
import * as Realm from '../realm';
// api
import * as Api from '../api';
// actions
import {sendEvidenceArr} from '../actions/driver';
// utils
import {Logger, createBoxMatrixID, getRandomUUID, AsyncStorage} from '../utils';
import moment from 'moment';

let catchedMatrixID = '';
let sendBulk = false;
let globalTemp = '';
let tempIsGlobal = false;
let globalMatrixID = '';
const ICON_SIZE = 20;
const TAG = 'src/screens/RemesaBoxesScreen';
const options: any = {
  cameraType: 'back',
  mediaType: 'photo',
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
  saveToPhotos: true,
};

export default function RemesaBoxesScreen(props: any) {
  const coords = props.navigation.getParam('coords');
  const [remesa, _] = useState<BaseOrderInterface>(
    props.navigation.getParam('order'),
  );
  const [boxes, setBoxes] = useState<RemesaBoxI[]>([]);
  //const [temp, setTemp] = useState('');
  const [observation, setObservation] = useState('');
  const [remaining, setShowRemaining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showTempetatureModal, setShowTemperatureModal] = useState(false);

  //console.log(JSON.stringify(remesa, null, 2));

  useEffect(() => {
    Logger.log('mount RemesaBoxes screen');
    getBoxes();
    return () => {
      catchedMatrixID = '';
      sendBulk = false;
      globalTemp = '';
      tempIsGlobal = false;
      globalMatrixID = '';
      Logger.log('unmount RemesaBoxes screen');
    };
  }, []);

  useEffect(() => {
    const remainingBoxes = boxes.filter((b) => b.sent);
    if (remainingBoxes && remainingBoxes.length === remesa.total_cajas) {
      // delivery finish
      markRemesaAsFinished();
    }
  }, [boxes]);

  /**
   * Mark remesa as finished to continue with flow
   */
  async function markRemesaAsFinished() {
    await AsyncStorage.storeData(`${remesa.nf_id}Downloaded`, true);
  }

  /**
   * Create remease boxes
   * @param totalBoxes
   * @returns
   */
  function createBoxes(totalBoxes: number) {
    const tempArr = new Array(totalBoxes).fill(0);
    const numberOfBoxes: RemesaBoxI[] = tempArr.map((_, i) => {
      const boxNumber = i + 1;
      const matrixID = createBoxMatrixID(remesa.nf_id, boxNumber, totalBoxes);
      return {
        sent: false,
        remesaID: remesa.nf_id,
        matrixID,
        boxNumber,
      };
    });
    return numberOfBoxes;
  }

  async function getBoxes() {
    const response = await Realm.getRemesaBoxes(remesa.nf_id);
    if (!response) {
      const _boxes = createBoxes(remesa.total_cajas);
      await Realm.setRemesaBoxes(remesa.nf_id, _boxes);
      setBoxes(_boxes);
    } else {
      setBoxes(response.boxes);
    }
  }

  function sendAllTheRemainBoxes() {
    Logger.log('sendAllTheRemainBoxes');
    // check temp if its a cold box
    Alert.alert(`Descargar unidades faltantes?`, ``, [
      {
        text: 'SI',
        onPress: sendBulkBoxes,
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ]);
  }

  async function sendBulkBoxes() {
    Logger.log('sendBulkBoxes');
    if (remesa.cadena_frio === 'N') {
      Logger.log('its not cadena frio');
      await sendAllTheBoxesAtOnce();
    } else {
      Logger.log('its cadena frio');
      if (globalTemp !== '' || observation !== '') {
        Logger.log('send cadena frio in bulk');
        await sendAllTheBoxesAtOnce();
      } else if (globalTemp === '') {
        Logger.log('no temperatura show modal');
        // ask temperature
        sendBulk = true;
        setShowTemperatureModal(true);
      }
    }
  }

  async function sendAllTheBoxesAtOnce() {
    Logger.log('sendAllTheBoxesAtOnce START');
    setBulkLoading(true);
    const remainingBoxes = boxes.filter((b) => !b.sent);
    if (!remainingBoxes || !remainingBoxes.length) {
      Logger.log('no boxes to send');
      return;
    }
    for (let i = 0; i < remainingBoxes.length; i++) {
      const box = remainingBoxes[i];
      await sendBox(box.matrixID);
    }
    setBulkLoading(false);
    Logger.log('sendAllTheBoxesAtOnce FINISH');
  }

  //console.log(JSON.stringify(remesa, null, 2));
  console.log(remesa.movilidadId);

  function createBoxToSend(box: RemesaBoxI) {
    const MovCajSec = String(getRandomUUID());
    const MovCajLoc = `${coords.latitude}, ${coords.longitude}`;
    const MovCajFecReg = moment().utc().format('DD/MM/YY HH:mm');

    const newBox: ColSDTDesMovCaj = {
      ColSDTDesMovCaj: [
        {
          movilidadId: remesa.movilidadId,
          MovCajCedReg: remesa.rom_motorista,
          MovCajRem: remesa.nf_id,
          MovCajSec,
          MovCajNro: String(box.boxNumber),
          MovCajLoc,
          MovCajCod: box.matrixID,
          // send 0 if there is an observation
          // or if its not a cadena frio
          MovCajTem: observation ? '0' : globalTemp === '' ? '0' : globalTemp,
          MovCajFecReg,
          MovCajObs: observation,
        },
      ],
    };

    return newBox;
  }

  async function validateAndSendBox(matrixID: string) {
    Logger.log(`validateAndSendBox ${matrixID}`);
    // it's not a cold box
    const boxFound = validateMatrixID(matrixID);
    if (boxFound.length) {
      // return if the box was already sent
      if (boxFound[0].sent) return;
      // check if its a bulk action
      if (!bulkLoading) setLoading(true);
      // create a new boc
      const box = createBoxToSend(boxFound[0]);
      // send box
      const response = await Api.WSEntregaRemesa(box);
      if (response) {
        if (response.Error != 'OK') Logger.log(response.Error);
        // update local database
        await updateBoxes(matrixID);
      } else {
        // update local database
        await updateBoxes(matrixID);
      }
      // check if temp is global
      // if not ubdate the sate
      if (!tempIsGlobal) {
        globalTemp = '';
        setObservation('');
      }
    } else {
      // the matrix code is not valid
      Alert.alert(`Código no válido`, `El código ${matrixID} no es válido.`, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    }
  }

  async function sendBox(matrixID: string) {
    Logger.log(`sendBox ${matrixID}`);
    globalMatrixID = matrixID;
    if (remesa.cadena_frio === 'N') {
      await validateAndSendBox(matrixID);
    } else {
      // it's a cold box
      // check if the driver enter a valid temperature
      if (globalTemp !== '' || observation !== '') {
        Logger.log('send cadena frio');
        await validateAndSendBox(matrixID);
      } else {
        Logger.log('no temperatura show modal');
        // ask temperature
        catchedMatrixID = matrixID;
        setShowTemperatureModal(true);
      }
    }
  }
  //console.log(JSON.stringify(boxes, null, 2));
  /**
   * Update boxes in realm
   * @param matrixID
   */
  async function updateBoxes(matrixID: string) {
    Logger.log('updateBoxes STARTED');
    let updatedBoxes: RemesaBoxI[] = [];
    const response = await Realm.getRemesaBoxes(remesa.nf_id);
    response?.boxes.forEach((box) => {
      if (box.matrixID === matrixID) {
        updatedBoxes.push({
          remesaID: box.remesaID,
          matrixID: box.matrixID,
          boxNumber: box.boxNumber,
          sent: true,
        });
      } else {
        updatedBoxes.push(box);
      }
    });
    // updateLocally
    await Realm.updateRemesaBoxes(remesa.nf_id, updatedBoxes);
    // update state
    setBoxes(updatedBoxes);
    setLoading(false);
    Logger.log('updateBoxes FINISHED');
  }

  function validateMatrixID(matrixID: string) {
    return boxes.filter((box) => box.matrixID === matrixID);
  }

  function updateTemperature(
    _temp: string,
    _obervation: string,
    _tempIsGlobal: boolean,
  ) {
    Logger.log(
      `updateTemperature ${_temp}, ${_obervation} is global ${tempIsGlobal}`,
    );
    setShowTemperatureModal(false);
    globalTemp = _temp;
    tempIsGlobal = _tempIsGlobal;
    setObservation(_obervation);
    setTimeout(() => {
      console.log({catchedMatrixID, sendBulk});
      // send last event
      if (catchedMatrixID) {
        Logger.log('sendBox with catched matrixID');
        sendBox(catchedMatrixID);
        catchedMatrixID = '';
      }

      if (sendBulk) {
        Logger.log('send catched bulk');
        sendBulkBoxes();
        sendBulk = false;
      }
    }, 500);
  }

  async function openCamera(matrixID: string) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Torre de Control solicita permisos',
          message: '¿Desea Permitir el acceso a su camara?',
          buttonNeutral: 'Preguntame mas tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(options, async (response: any) => {
          Logger.log('launch camera');
          if (response.didCancel) {
            setLoading(false);
            return;
          }
          const img = response.assets[0];
          const image = await ImageResizer.createResizedImage(
            img.uri,
            840,
            480,
            'JPEG',
            50,
            0,
          );
          const name = `box_${remesa.nf_id}_${matrixID}.JPEG`;
          const photo = {
            fileName: name,
            uri: image.uri,
            type: 'image/jpeg',
            path: image.path,
            id: name,
          };
          // prueba_21107...01_1
          const photoEvidenceLabel = `Pedido_${matrixID.split('U')[0]}_${
            matrixID.split('U')[1]
          }`;
          sendPhoto(photo, photoEvidenceLabel);
        });
      }
    } catch (e) {
      Logger.recordError(e);
      setLoading(false);
    }
  }

  async function sendPhoto(photo: any, evidenceLabel: string) {
    Logger.log('sendPhoto');
    setLoading(true);
    try {
      const _photo = {
        name: photo.fileName,
        uri: photo.uri,
        type: 'image/jpeg',
        evidence_type: '',
      };
      await sendEvidenceArr(remesa, [_photo], '', evidenceLabel);
    } catch (error) {
      Logger.recordError(error, TAG);
    }
    setLoading(false);
  }

  return (
    <View style={styles.mainGrap}>
      <Loading show={loading || bulkLoading} />
      <View style={styles.contentGrap}>
        <RemissionHeader
          title={'Información Remisión'}
          remesaID={remesa.nf_id}
        />
        <View style={styles.actionsHeader}>
          <Text style={styles.contentTitle}>Entrega Remesa</Text>
          <View style={styles.iconGrap}>
            {boxes.filter((b) => b.sent).length ? (
              boxes.filter((b) => b.sent).length === boxes.length ? (
                <Text>{`Unidades descargadas.`}</Text>
              ) : (
                boxes
                  .filter((b) => b.sent)
                  .slice(-1)
                  .map((box) => (
                    <Text>{`Unidad #${box.boxNumber} descargada.`}</Text>
                  ))
              )
            ) : (
              <View />
            )}

            {remesa.cadena_frio === 'N' ? null : (
              <SnowflakeIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={Colors.blue}
              />
            )}
          </View>
          <RemesaScannerBox onPress={sendBox} />
          <View style={styles.checkBoxGrap}>
            <Text>Pendientes</Text>
            <NativeCheckBox
              value={remaining}
              onValueChange={() => setShowRemaining((prev) => !prev)}
              color={Colors.blue}
              tintColors={{true: Colors.blue, false: Colors.blue}}
            />
          </View>
        </View>
        <ScrollView>
          <View>
            {boxes.length
              ? remaining
                ? boxes
                    .filter((b) => !b.sent)
                    .map((box, i) => (
                      <RemesaBox
                        navigation={props.navigation}
                        datosRemesa={remesa}
                        key={i}
                        {...{box, onPress: sendBox}}
                        photoCallback={openCamera}
                      />
                    ))
                : boxes.map((box, i) => (
                    <RemesaBox
                      navigation={props.navigation}
                      datosRemesa={remesa}
                      key={i}
                      {...{box, onPress: sendBox}}
                      photoCallback={openCamera}
                    />
                  ))
              : null}
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <MainButton
          onPress={sendAllTheRemainBoxes}
          label={'faltantes/manual'}
          small
        />
        <Text>{`Unidades ${boxes.filter((b) => b.sent).length}/${
          boxes.length
        }`}</Text>
      </View>
      <PRModal
        isVisible={showTempetatureModal}
        title={'Registro Temperatura'}
        onCancell={() => setShowTemperatureModal(false)}>
        <TemperatureModalInput
          {...{
            temp: globalTemp,
            observation,
            callback: updateTemperature,
            matrixID: globalMatrixID,
            _tempIsGlobal: tempIsGlobal,
          }}
        />
      </PRModal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainGrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentGrap: {flex: 1},
  actionsHeader: {
    borderTopColor: 'orange',
    borderTopWidth: 5,
    borderBottomColor: 'orange',
    borderBottomWidth: 5,
    paddingTop: 10,
  },
  contentTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  iconGrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  checkBoxGrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  footer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
