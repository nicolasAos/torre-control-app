import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {Card, Loading, Modal} from '../components';
import {useTranslation, Trans} from 'react-i18next';
import {NavigationEvents} from 'react-navigation';
import {
  getNfsSupervisorOffline,
  sendEmptyRemission,
  sendEvidencias,
  sendEvidenceArr,
} from '../actions/driver';
const {width} = Dimensions.get('window');
import {getDateBD} from '../configs/utils';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import ScreenState from '../utils/ScreenState.class';
import {getCtesRemmitances} from '../actions/driver';
import GeoCoding from '../actions/geoCoding';
import ImageResizer from 'react-native-image-resizer';
import ModalValue from '../components/ModalValue';
import pdfGenerator from '../utils/pdfGenerator';
import generatePdf from '../utils/pdfGenerator';
import AsyncStorage from '@react-native-community/async-storage';
import {Logger, AsyncStorage as AsyncStorageUtils} from '../utils';
import { Mixpanel } from '../analitycs';
const options = {
  cameraType: 'back',
  mediaType: 'photo',
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
  saveToPhotos: false,
};

let screenState = null;
const TAG = 'screens/RecogidasYEntregas';


const RecogidasYEntregas = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [dataCte, setDataCte] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [parametro_checkin, setParametro_checkin] = useState(false);
  const [checkInDisable, setCheckInDisable] = useState(false);
  const [t] = useTranslation('screens');
  const [sacReport, setSacReport] = useState(false);
  const [rotulos, setRotulos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [estadosPedidos, setEstadosPedidos] = useState({estado: '', otro: ''});
  const [photos, setPhotos] = useState([]);
  const [cadenaDeFrioModal, setCadenaDeFrioModal] = useState(false);
  const [cadenaFrioValue, setCadenaFrioValue] = useState('');
  const [errorString, setErrorString] = useState('');
  const [isEnd, setIsEnd] = useState(false);
  const [generateLabels, setGenerateLabels] = useState(false);

  const reset = () => {
    setPhotos([]);
    setCurrentIndex(5);
    setEstadosPedidos({estado: '', otro: ''});
    setErrorString('');
    setLoading(false);
  };

  useEffect(() => {
    Logger.log('mount RecogidasYEntregas screen');
    checkIfItsAlreadyDelivered();
    Mixpanel.log('Recogidas y Entregas Screen Visited');
    return () => {
      Logger.log('unmount RecogidasYEntregas screen');
    };
  }, []);

  async function checkIfItsAlreadyDelivered() {
    const cteId = navigation.state.params.cteId;
    try {
      Logger.log(`check if ${cteId} is already delivered`);
      const resposne = await AsyncStorageUtils.getData(cteId);
      if (resposne) {
        Alert.alert(`El pedido ${cteId} ya fue entregado`, '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (e) {
      Logger.recordError(e, TAG);
    }
  }

  const PhotosModalMessages = [
    '',
    'evidences.modalPhoto1',
    'evidences.modalPhoto2',
  ];
  const photosNames = ['soporte_red', 'mercancia'];

  const getRequeriments = async (labels) => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Torre de control necesita acceder a su ubicación',
        message: 'Para localizar los pedidos que se encuentran a su alrededor',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Necesitamos su permiso para continuar');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async (info) => {
        await sendRemission(
          info.coords.latitude,
          info.coords.longitude,
          labels,
        );
      },
      (error) => {
        console.log(error);
        setErrorString('error.geolocation');
      },
      {},
    );
  };

  const getNfs = async () => {
    Logger.log('getNfs');
    if (screenState == null) {
      screenState = new ScreenState();
    }
    const sac = screenState.getSendSac();
    const labels = screenState.getRotulos();
    let type = screenState.getType();
    if (sac) {
      screenState.deleteSendSaC();
      screenState.deleteType();
    }

    if (labels) {
      screenState.deleteRotulos();
    }
    if (isEnd) {
      setLoading(false);
      return;
    }
    await getNfsSupervisorOffline(navigation.state.params.cteId)
      .then(async (data) => {
        let locationPedido = {
          lat: 0,
          lng: 0,
        };
        let disable = false;
        if (
          !data[0].llegada_recogida ||
          !data[0].cargando ||
          data[0].estado_pedido == 'P'
        ) {
          disable = true;
        }
        const labelsVerificator = await AsyncStorage.getItem('generateLabels');
        data[0].locationPedido = locationPedido;
        setDataCte([data[0]]);
        setDisableButton(sac || labels || disable ? true : false);
        if (labelsVerificator && data[0].estado_pedido == 'P') {
          setGenerateLabels(true);
        }
      })
      .catch((e) => {
        Logger.log('getNfs ERROR');
        Logger.recordError(e, TAG);
      });
    if (labels) {
      await getCtesRemmitances(navigation.state.params.moto_id);
    }
    setLoading(false);
  };

  const errorModal = () => {
    return (
      <Modal
        isVisible={errorString !== ''}
        title={t('attention')}
        bodyText={errorString}
        buttons={[
          {
            onPress: () => {
              reset();
            },
            text: 'accept',
            backgroundColor: '#42c790',
          },
        ]}
      />
    );
  };

  const renderPhotoRegister = () => {
    return (
      <Modal
        isVisible={currentIndex == 0}
        title={'evidences.registro'}
        bodyText={'evidences.registroModalText'}
        buttons={[
          {
            onPress: () => {
              setCurrentIndex(1);
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderPhotoRegisterPhoto1 = () => {
    return (
      <Modal
        isVisible={currentIndex <= 2 && currentIndex >= 1}
        title={'evidences.registro'}
        bodyText={PhotosModalMessages[currentIndex]}
        buttons={[
          {
            onPress: () => {
              reset();
            },
            text: 'Cancelar',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              renderCamera();
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
            color: 'blue',
          },
        ]}
      />
    );
  };

  const renderModalNvaFoto = () => {
    return (
      <Modal
        isVisible={currentIndex == 3}
        title={'Atención'}
        bodyText={'¿Se va a tomar un nuevo registro fotográfico?'}
        buttons={[
          {
            onPress: async () => {
              setCurrentIndex(4);
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: async () => {
              renderCamera();
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderRotuloConfirm = () => {
    return (
      <Modal
        isVisible={currentIndex == 4}
        title={'evidences.modalRotuloTitle'}
        bodyText={'evidences.modalRotuloBody'}
        buttons={[
          {
            onPress: async () => {
              setLoading(true);
              setIsEnd(false);
              setCurrentIndex(5);
              getRequeriments(false);
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: async () => {
              setLoading(true);
              setCurrentIndex(5);
              getRequeriments(true);
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderCamera = async (type) => {
    setLoading(true);
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
        launchCamera(options, (response) => {
          if (response.didCancel) {
            setLoading(false);
            return;
          }
          const img = response.assets[0];
          ImageResizer.createResizedImage(
            img.uri,
            1280,
            960,
            'PNG',
            100,
            0,
          ).then((image) => {
            const name = photosNames[photos.length]
              ? photosNames[photos.length]
              : 'Extra';
            const newPhoto = {
              name: `${name}_${dataCte[0].nf_id}_${currentIndex}.png`,
              uri: image.uri,
              type: 'image/png',
              evidence_type: name,
            };

            let newStatePhotos = [...photos, newPhoto];
            afterTakePhoto(newStatePhotos);
          });
        });
      } else {
        reset();
        setLoading(false);
        Alert.alert('Necesitamos permisos para acceder a esta función');
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const afterTakePhoto = (photoArr) => {
    if (currentIndex < 3) {
      let newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
    }
    setPhotos(photoArr);
    setLoading(false);
  };

  /**
   * sendEmptyRemission
   * @param lat
   * @param lng
   */
  async function _sendEmptyRemission(lat: any, lng: any) {
    Logger.log('_sendEmptyRemission');
    try {
      await sendEmptyRemission(
        navigation.state.params.userId,
        dataCte[0],
        'P',
        estadosPedidos.otro,
        lat,
        lng,
        '',
        '',
        '',
        '',
        cadenaFrioValue,
      );
    } catch (e) {
      setLoading(false);
      Logger.recordError(e, TAG);
    }
  }

  async function _sendEvidenceArr() {
    Logger.log('_sendEvidenceArr');
    try {
      await sendEvidenceArr(dataCte[0], photos);
    } catch (e) {
      setLoading(false);
      Logger.recordError(e, TAG);
    }
  }
  // change status buttons E
  async function _getCtesRemmitances() {
    Logger.log('_getCtesRemmitances');
    try {
      await getCtesRemmitances(navigation.state.params.moto_id);
    } catch (e) {
      setLoading(false);
      Logger.recordError(e, TAG);
    }
  }
  // admin Remission
  const sendRemission = async (lat: any, lng: any, labels: any) => {
    Logger.log('sendRemission');
    setLoading(true);
    try {
      await _sendEmptyRemission(lat, lng);
      await _sendEvidenceArr();
      setDisableButton(true);
      await _getCtesRemmitances();
      await getNfs();
      setGenerateLabels(true);
      await AsyncStorage.setItem('generateLabels', 'labels');
      if (labels) {
        navigation.navigate('addRotulo', {
          cteId: navigation.state.params.cteId,
          screenState: screenState,
          rotulos: rotulos,
          moto_id: navigation.state.params.moto_id,
          type: estadosPedidos.otro,
          pedido: dataCte,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      Logger.recordError(e, TAG);
      console.log(e, 'sendRemission este es el error');
    }
  };

  const onDoneFridgeModal = (value: any) => {
    setCadenaDeFrioModal(false);
    setCadenaFrioValue(value);
    setCurrentIndex(0);
  };
  const renderHeader = () => {
    if (dataCte.length === 0) {
      return;
    }
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.client')}:</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {dataCte[0].cliente}
          </Text>
          {/* <Text style={styles.headerLabel}>{t('remission.CT-e')}:</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {this.state.dataCte.cte_numero} - ({this.state.dataCte.cte_ordem})
          </Text> */}
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.recipient')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {dataCte[0].destinatario}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.address')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {dataCte[0].direccion}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('Gestion de punto')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>{''}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('Teléfono')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>{''}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.executive')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {dataCte[0].ejecutivo}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.phone')}:</Text>
          <Text
            style={[
              styles.headerItem,
              {width: width / 1.4},
              {textDecorationLine: 'underline'},
            ]}
            numberOfLines={1}
            onPress={() =>
              Linking.openURL(`tel:${dataCte[0].telefono_ejecutivo}`)
            }>
            {dataCte[0].telefono_ejecutivo}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.boxesDry')}:</Text>
          <Text style={[styles.headerItem]}>
            {dataCte[0].cajas}
            {' | '}
          </Text>
          <Text style={styles.headerLabel}>{t('remission.boxesCold')}:</Text>
          <Text style={[styles.headerItem]}>
            {dataCte[0].cajas_en_frio}
            {' | '}
          </Text>
          <Text style={styles.headerLabel}>{t('remission.boxes')}:</Text>
          <Text style={[styles.headerItem]}>{dataCte[0].total_cajas}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
              position: 'absolute',
              top: -35,
            }}>
            <View
              style={{padding: 3, backgroundColor: 'white', borderRadius: 5}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MapFull', {
                    pedido: true,
                    lat: dataCte[0].locationPedido.lat,
                    lng: dataCte[0].locationPedido.lng,
                  });
                }}>
                <Image
                  style={{width: 40, height: 40}}
                  source={require('../imgs/mapaIcon.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.destination')}:</Text>
          <Text
            style={[styles.headerItem, {width: width / 1.26}]}
            numberOfLines={1}>
            {this.state.dataCte[0].destino_cidade}
            {this.state.dataCte[0].rom_destino}
          </Text>   
        </View> */}
      </View>
    );
  };
  const validateButtonsTypes = (type: any) => {
    Logger.log(`validateButtonsTypes ${type}`);
    // change status buttons
    if (type !== 'S') {
      if (!dataCte[0].llegada_recogida || !dataCte[0].cargando) {
        setErrorString('llegada_urbanos');
        return;
      }
      if (disableButton) {
        return;
      }
    }
    switch (type) {
      case 'I':
        setEstadosPedidos({estado: 'C', otro: 'S'});
        if (dataCte[0].cadena_frio !== 'N') {
          setCadenaDeFrioModal(true);
        } else {
          setCurrentIndex(0);
        }
        break;
      case 'N':
        setEstadosPedidos({estado: 'C', otro: 'N'});
        if (dataCte[0].cadena_frio !== 'N') {
          setCadenaDeFrioModal(true);
        } else {
          setCurrentIndex(0);
        }
        break;
      case 'NBS':
        setEstadosPedidos({estado: 'C', otro: 'D'});
        if (dataCte[0].cadena_frio !== 'N') {
          setCadenaDeFrioModal(true);
        } else {
          setCurrentIndex(0);
        }
        break;
      case 'S':
        navigation.navigate('SACReportStack', {
          nf_id: navigation.state.params.cteId,
          screenState: screenState,
          sacReport: sacReport,
          sacMenu: navigation.state.params.sacMenu,
        });
        reset();
        break;
    }
  };

  const adminRemission = async (operation_type: any) => {
    Logger.log(`admin Remission => finish delivery ${operation_type}`);
    // ctesScreen.inic
    setLoading(true);
    let estadoPedido = 'P';
    if (operation_type == 'E') {
      estadoPedido = 'C';
    }
    if (operation_type == 'L' || operation_type == 'D') {
      estadoPedido = '';
    }
    Geolocation.getCurrentPosition(
      (info) => {
        sendEmptyRemission(
          navigation.state.params.userId,
          dataCte[0],
          estadoPedido,
          '',
          info.coords.latitude,
          info.coords.longitude,
          '',
          '',
          '',
          '',
          cadenaFrioValue,
          operation_type,
        )
          .then(async () => {
            await getCtesRemmitances(navigation.state.params.moto_id);
            getNfs();
            if (operation_type == 'E') {
              await AsyncStorage.removeItem('generateLabels');
              setLoading(false);
              navigation.goBack();
            }
          })
          .catch(async (e) => {
            //await getCtesRemmitances(navigation.state.params.moto_id);
            getNfs();
            if (operation_type == 'E') {
              await AsyncStorage.removeItem('generateLabels');
              setLoading(false);
              navigation.goBack();
              // mark as completed
            }
            // update button
            if (operation_type === 'L') {
              console.log('cargando: ', dataCte[0].cargando);
              console.log(dataCte[0].llegada_recogida);
              dataCte[0].llegada_recogida = 'smth';
              console.log('cargando: ', dataCte[0].cargando);
              setDataCte([...dataCte]);
            }
            if (operation_type === '') {
              console.log('cargando: ', dataCte[0].cargando);
              console.log(dataCte[0].llegada_recogida);
              dataCte[0].cargando = 'smth';
              console.log('cargando: ', dataCte[0].cargando);
              setDataCte([...dataCte]);
            }
            Logger.recordError(e, TAG);
          });
      },
      (error) => {
        console.log(error);
        setErrorString('error.geolocation');
      },
      {},
    );
  };
  console.log('hey');
  if (dataCte.length) {
    console.log('llegada: ', dataCte[0].llegada_recogida);
    console.log('recogida: ', dataCte[0].cargando);
  }

  const changeStatusButtons = (type: any) => {
    Logger.log(`change status buttons ${type}`);
    if (isEnd) {
      return;
    }
    switch (type) {
      case 'L':
        // if has smth
        if (dataCte[0].llegada_recogida) {
          return;
        }
        break;
      case 'D':
        if (dataCte[0].cargando) {
          return;
        }
        if (!dataCte[0].llegada_recogida) {
          setErrorString('llegada_urbanos');
          return;
        }
        break;
      case 'E':
        if (dataCte[0].estado_pedido !== 'P') {
          setErrorString('Concluya todo el proceso correctamente');
          return;
        }
        break;
    }
    adminRemission(type);
  };
  /*
  const buttonLabel = (estado) => {
    if(estado == "C" ||
      estado == "P") {
        return ( 
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('addRotulo', {
                  cteId: navigation.state.params.cteId,
                  screenState: screenState,
                  rotulos: rotulos,
                  moto_id: navigation.state.params.moto_id,
                  type: estadosPedidos.otro,
                  pedido: dataCte,
                });
              }}>
              <View style={styles.buttonsDeliveries}>

                <Text style={styles.fontButtons}>
                  {t('ctesScreen.labels')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
          </>
        )
    };
    return null;
  }
  */
  const renderItems = ({item}) => {
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerBody}>
          <View style={styles.headerCard}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              {item.nf_id}
            </Text>
          </View>
          <View style={styles.containerButton}>
            {dataCte[0].estado_pedido == 'P' && generateLabels && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('addRotulo', {
                      cteId: navigation.state.params.cteId,
                      screenState: screenState,
                      rotulos: rotulos,
                      moto_id: navigation.state.params.moto_id,
                      type: estadosPedidos.otro,
                      pedido: dataCte,
                    });
                  }}>
                  <View style={styles.buttonsDeliveries}>
                    <Text style={styles.fontButtons}>
                      {t('ctesScreen.labels')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{height: 10}} />
              </>
            )}
            {
              //buttonLabel(dataCte[0].estado_pedido)
            }
            <TouchableOpacity onPress={() => changeStatusButtons('L')}>
              <View
                style={[
                  styles.buttonsDeliveries,
                  dataCte[0].llegada_recogida
                    ? {backgroundColor: '#D1D1D1'}
                    : {},
                ]}>
                <Text style={styles.fontButtons}>
                  {t('ctesScreen.llegada')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity onPress={() => changeStatusButtons('D')}>
              <View
                style={[
                  styles.buttonsDeliveries,
                  dataCte[0].cargando || !dataCte[0].llegada_recogida
                    ? {backgroundColor: '#D1D1D1'}
                    : {},
                ]}>
                <Text style={styles.fontButtons}>{t('ctesScreen.inicio')}</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => {
                validateButtonsTypes('I');
              }}>
              <View
                style={
                  !disableButton
                    ? styles.buttonsDeliveries
                    : styles.buttonsDeliveriesDisable
                }>
                {/* <Image 
                    source={require("../img/icons/check_icon.png")} 
                    style={{height: 38, width: 25}} />  */}

                <Text style={styles.fontButtons}>
                  {'RECOGIDA COMPLETA INVENTARIADA'}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => {
                validateButtonsTypes('N');
              }}>
              <View
                style={
                  !disableButton
                    ? styles.buttonsDeliveries
                    : styles.buttonsDeliveriesDisable
                }>
                <Text style={styles.fontButtons}>
                  RECOGIDA COMPLETA NO INVENTARIADA
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => {
                validateButtonsTypes('NBS');
              }}>
              <View
                style={
                  !disableButton || isEnd == 'D'
                    ? styles.buttonsDeliveries
                    : styles.buttonsDeliveriesDisable
                }>
                {/* <Image 
                    source={require("../img/icons/check_icon.png")} 
                    style={{height: 38, width: 25}} />  */}

                <Text style={styles.fontButtons}>
                  {t('ctesScreen.entrega')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => {
                validateButtonsTypes('S');
              }}>
              <View style={styles.buttonReport}>
                {/* <Image 
                    source={require("../img/icons/report_sac_icon.png")} 
                    style={{height: 32, width: 25}} />  */}

                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.fontButtons}>{t('ctesScreen.sac')}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              style={{
                marginVertical: 2,
              }}
              onPress={() => changeStatusButtons('E')}>
              <View
                style={[
                  styles.buttonsDeliveries,
                  dataCte[0].fin_carga || dataCte[0].estado_pedido !== 'P'
                    ? {backgroundColor: '#D1D1D1'}
                    : {},
                ]}>
                <Text style={styles.fontButtons}>{t('ctesScreen.fin')}</Text>
              </View>
            </TouchableOpacity>
            {/*
            <View style={styles.bottomButtonsContainer}>
              <View style={{flex: 1, padding: 3}}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => changeStatusButtons('L')}>
                  <View
                    style={[
                      styles.buttonsBottom,
                      dataCte[0].llegada_recogida
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('ctesScreen.llegada')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => changeStatusButtons('D')}>
                  <View
                    style={[
                      styles.buttonsBottom,
                      dataCte[0].cargando || !dataCte[0].llegada_recogida
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('ctesScreen.inicio')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, padding: 3}}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => changeStatusButtons('E')}>
                  <View
                    style={[
                      styles.buttonsBottom,
                      dataCte[0].fin_carga || dataCte[0].estado_pedido !== 'P'
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('ctesScreen.fin')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => changeStatusButtons('S')}>
                  <View
                    style={[
                      styles.buttonsBottom,
                      !dataCte[0].fin_carga ||
                      dataCte[0].inicio_viaje_p ||
                      isEnd
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('ctesScreen.salida')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
              */}
            <View style={{height: 10}} />
          </View>
        </View>
      </Card>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={dataCte}
        renderItem={renderItems}
        keyExtractor={(item) => item.nf_type_number}
        extraData={parametro_checkin && !checkInDisable}
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%', alignItems: 'center'}}
      />
    );
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => setLoading(true)} />
      <NavigationEvents onWillFocus={() => getNfs()} />
      <Loading show={loading} />
      {renderHeader()}
      {/* {this.renderFinishCte()} */}
      {renderList()}
      {errorModal()}
      {renderPhotoRegister()}
      {renderPhotoRegisterPhoto1()}
      {renderRotuloConfirm()}
      {renderModalNvaFoto()}
      <ModalValue
        isVisible={cadenaDeFrioModal}
        title={'Cadena de Frío'}
        message={'Porfavor capturar la temperatura'}
        icon={() => {
          return (
            <Image
              source={require('../../src/imgs/cadena_frio.png')}
              style={{width: 33, height: 33}}
            />
          );
        }}
        OnDoneModal={onDoneFridgeModal}
        withClose={false}
      />
    </View>
  );
};

export default RecogidasYEntregas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    width: width / 1.1,
    borderRadius: 20,
  },
  containerTitleDelivery: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TOOLBAR,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  containerTitlePickup: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerIconTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  body: {
    flexDirection: 'row',
  },
  containerButton: {
    alignItems: 'center',
    //flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 5,
  },
  containerHeader: {
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width: '100%',
  },
  containerHeaderItem: {
    flexDirection: 'row',
  },
  headerLabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerItem: {
    //fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  buttonStyle: {
    width: width / 2.7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 50,
  },
  checkIn: {
    width,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Nuevos estilos agregados para la parte de los botones
  buttonsDeliveries: {
    backgroundColor: global.COLOR_TITLE_CARD,
    borderRadius: 40,
    color: 'white',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    width: 210,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsDeliveriesDisable: {
    backgroundColor: global.COLOR_GREY_LIGHT,
    borderRadius: 40,
    color: 'white',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    width: 210,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonReport: {
    backgroundColor: '#dcc523',
    borderRadius: 40,
    color: 'white',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    width: 210,
    height: 45,
    justifyContent: 'center',
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: '#ed5f37',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 35,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: width / 1.1,
  },
  fontButtons: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 12,
  },
  footerTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'red',
    textDecorationLine: 'underline',
  },
  bottomButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  buttonsBottom: {
    backgroundColor: global.COLOR_TITLE_CARD,
    borderRadius: 8,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
