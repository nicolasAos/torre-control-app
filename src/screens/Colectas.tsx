import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {Card, Button, Loading, Modal} from '../components';
import {useTranslation, Trans} from 'react-i18next';
import {NavigationEvents} from 'react-navigation';
import {
  getNfsSupervisorOffline,
  sendEmptyRemission,
  sendEvidencias,
} from '../actions/driver';

import {launchCamera} from 'react-native-image-picker';
import ScreenState from '../utils/ScreenState.class';
import ModalScanBoxes from '../components/ModalScanBoxes';
import {getCtesRemmitances} from '../actions/driver';
import generatePdf from '../utils/pdfGenerator';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import axios from 'axios';
// urils
import {Logger, Location} from '../utils';
import {Mixpanel} from '../analitycs';
//  console.log
const {width} = Dimensions.get('window');

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

let screenState:any = null;

const Colectas = ({navigation}: any) => {
  const [loading, setLoading] = useState(true);
  const [metersDiff, setMetersDiff] = useState(0);
  const [dataCte, setDataCte] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [parametro_checkin, setParametro_checkin] = useState(false);
  const [checkInDisable, setCheckInDisable] = useState(false);
  const [t] = useTranslation('screens');
  const [sacReport, setSacReport] = useState(false);
  const [buttonsObject, setButtonObject] = useState([
    {name: 'colecta.stepOne', disable: false, step: 1},
    {name: 'colecta.stepTwo', disable: false, step: 2},
    {name: 'colecta.stepThree', disable: false, step: 3},
    {name: 'colecta.stepFour', disable: false, step: 4},
  ]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [photos, setPhotos] = useState([]);
  const [modalToRender, setModalToRender] = useState('');
  const [modalBoxes, setModalBoxes] = useState(false);
  const modals = [
    {
      title: 'colecta.titleOne',
      message: `¿Confirma llegada al cliente?`,
      step: 1,
      isMultiple: false,
    },
    {
      title: 'colecta.titleTwo',
      message: 'colecta.stepTwo',
      step: 2,
      isMultiple: false,
    },
    {
      title: 'colecta.titleOne',
      message: 'colecta.stepThree',
      step: 3,
      isMultiple: false,
    },
    {
      title: 'colecta.titleOne',
      message: 'colecta.finalStept',
      step: 4,
      isMultiple: true,
    },
  ];
  const [geoCodingModal, setGeoCodingModal] = useState(false);
  const [modalStep, setModalStep] = useState(false);
  const PhotosModalMessages = [
    'colecta.stepOne',
    'colecta.stepTwoPhotoOne',
    'colecta.stepTwoPhotoTwo',
    'colecta.stepTwoPhotoThree',
  ];

  const photosNames = [
    'cajas_colecta',
    'documentos_colecta',
    'despacho_colecta',
  ];
  const [modalReset, setModalReset] = useState(false);
  const [errorString, setErrorString] = useState('');
  const [cargueModal, setCargueModal] = useState(false);

  useEffect(() => {
    Logger.log('mount Colectas screen');
    Mixpanel.log('Colectas Screen Visited');
    return () => {
      Logger.log('unmount Colectas screen');
    };
  }, []);

  const reset = () => {
    setPhotos([]);
    setModalBoxes(false);
    setModalToRender('');
    setCurrentIndex(5);
    setModalReset(false);
  };

  const getRequeriments = async (step: any, index: any, cajas: any) => {
    Logger.log('getRequeriments');
    const coords = await Location.getCurrentPosition();
    if (coords !== undefined) {
      sendRemission(coords.latitude, coords.longitude, step, index, cajas);
    }
  };

  const endColecta = async () => {
    Logger.log('endColecta');
    setLoading(true);
    const coords = await Location.getCurrentPosition();
    if (coords) {
      sendEmptyRemission(
        navigation.state.params.userId,
        dataCte[0],
        'P',
        '',
        coords.latitude,
        coords.longitude,
        '',
        '',
        5,
        '',
        '',
      ).then(async () => {
        await getCtesRemmitances(navigation.state.params.moto_id);
        await getNfs();
        setLoading(false);
        setModalReset(false);
      });
    }
  };

  const cargueMercancia = () => {
    const date = moment(new Date());

    return (
      <Modal
        isVisible={cargueModal}
        title={'Iniciar Cargue'}
        bodyText={`No Orden       ${
          dataCte[0]?.no_planilla
        }\n\nPlaca Vehículo                  ${
          dataCte[0]?.placa
        }\n\nFecha Inicio                ${date.format(
          'DD/MM/YYYY',
        )}\n\nObservación`}
        observacion={true}
        buttons={[
          {
            onPress: () => setCargueModal(false),
            text: 'Cancelar',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              axios({
                method: 'post',
                url: 'http://190.145.108.98:8081/CreoServicesV4/rest/WSCargueInicial',
                headers: {
                  'Content-Type': 'application/json',
                  Cookie: 'ASP.NET_SessionId=wlv20pd2ixt5rl0pzalpxetk',
                },
                data: JSON.stringify({
                  CarMenCdg: dataCte[0]?.no_planilla,
                  CarMenPla: dataCte[0]?.placa,
                  CarMenEst: 'I',
                  CarMenObs: '',
                  CarMenLoc: dataCte[0]?.cte_local_entrega,
                  CarMenMovId: navigation.state.params.moto_id,
                  CarMenCed: navigation.state.params.userId,
                  CarMenConCgd: navigation.state.params.userId,
                  CarMenScrCdg: '',
                }),
              }).then((response) =>
                console.log('Respuesta de primer servicio:', response),
              );
              setCargueModal(false);
              navigation.navigate('ProcesoCargueScreen', {
                nf_id: navigation.state.params.cteId,
                screenState: screenState,
                sacMenu: navigation.state.params.sacMenu,
                dataCte: dataCte[0],
                idUsuario: navigation.state.params.userId,
              });
            },
            text: 'Iniciar',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
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
              setErrorString('');
            },
            text: 'accept',
            backgroundColor: '#42c790',
          },
        ]}
      />
    );
  };

  const getNfs = () => {
    if (screenState == null) {
      screenState = new ScreenState();
    }
    const sac = screenState.getSendSac();
    if (sac) {
      screenState.deleteSendSaC();
    }
    setLoading(true);
    getNfsSupervisorOffline(navigation.state.params.cteId).then(
      async (data) => {
        const locationPedido = {
          lat: 0,
          lng: 0,
        };
        const coords = await Location.getCurrentPosition();
        if (coords !== undefined) {
          if (
            locationPedido.lat + 2 >= coords.latitude &&
            locationPedido.lat - 2 <= coords.latitude &&
            locationPedido.lng + 2 >= coords.longitude &&
            locationPedido.lng - 2 <= coords.longitude &&
            JSON.parse(data[0].movilidad_cargue_paso).length == 3
          ) {
            setGeoCodingModal(true);
          }
        }

        data[0].locationPedido = locationPedido;

        const buttonObj = [
          {name: 'colecta.stepOne', disable: false, step: 1},
          {name: 'colecta.stepTwo', disable: false, step: 2},
          {name: 'colecta.stepThree', disable: false, step: 3},
          {name: 'colecta.stepFour', disable: false, step: 4},
        ];

        for (let i = 0; i < buttonObj.length; i++) {
          if (
            JSON.parse(data[0].movilidad_cargue_paso).includes(
              buttonObj[i].step,
            )
          ) {
            buttonObj[i].disable = true;
          }
        }

        setDataCte([data[0]]);
        setButtonObject(buttonObj);
        setLoading(false);
        setDisableButton(sac);
        if (JSON.parse(data[0].movilidad_cargue_paso).length == 4) {
          setModalReset(true);
        }
      },
    );
  };

  const renderModalGeoCercas = () => {
    return (
      <Modal
        isVisible={geoCodingModal}
        title={'attention'}
        bodyText={'geoCercas.stepTwo'}
        buttons={[
          {
            onPress: () => {
              setGeoCodingModal(false);
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              getRequeriments(4, 3, dataCte[0].movilidad_cajas);
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
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
              reset();
            },
            text: 'Cancelar',
            backgroundColor: '#42c790',
          },
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

  const modalRender = () => {
    return (
      <Modal
        isVisible={modalToRender !== ''}
        title={modals[modalToRender]?.title}
        bodyText={
          modals[modalToRender] && modals[modalToRender].step === 1
            ? `Esta a ${metersDiff} metros de la posición del cliente. Confirma llegada al cliente.`
            : modals[modalToRender]?.message
        }
        buttons={
          modals[modalToRender]?.isMultiple
            ? [
                {
                  onPress: () => {
                    setModalToRender('');
                  },
                  text: 'No',
                  backgroundColor: '#42c790',
                },
                {
                  onPress: () => {
                    dataToSend(modals[modalToRender].step, '');
                    setModalToRender('');
                  },
                  text: 'Si',
                  backgroundColor: global.COLOR_TITLE_CARD,
                },
              ]
            : [
                {
                  onPress: () => {
                    reset();
                  },
                  text: 'Cancelar',
                  backgroundColor: '#42c790',
                },
                {
                  onPress: () => {
                    switch (modals[modalToRender].step) {
                      case 1:
                        dataToSend(1, '');
                        setModalToRender('');
                        break;
                      case 2:
                        setCurrentIndex(0);
                        setModalToRender('');
                        break;
                      case 3:
                        setModalBoxes(true);
                        setModalToRender('');
                        break;
                    }
                  },
                  text: 'Aceptar',
                  backgroundColor: global.COLOR_TITLE_CARD,
                },
              ]
        }
      />
    );
  };

  const renderModalStep = () => {
    return (
      <Modal
        isVisible={modalStep}
        title={'attention'}
        bodyText={'completeStep'}
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
              setModalStep(false);
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
            color: 'blue',
          },
        ]}
      />
    );
  };

  const renderPhotoRegisterPhoto1 = () => {
    return (
      <Modal
        isVisible={currentIndex <= 3 && currentIndex > 0}
        title={t('remission.modalPhotoTitle')}
        bodyText={t(PhotosModalMessages[currentIndex])}
        buttons={[
          {
            onPress: () => {
              reset();
            },
            text: 'Cancelar',
            backgroundColor: '#42c790',
          },
          {
            onPress: async () => {
              await renderCamera();
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
            color: 'blue',
          },
        ]}
      />
    );
  };

  const renderDeliveryConfirm = () => {
    return (
      <Modal
        isVisible={currentIndex === 4}
        title={t('remission.deliveryTitle')}
        bodyText={t('remission.deliveryConfirmText')}
        buttons={[
          {
            onPress: () => {
              sendAllEvidencias();
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: async () => {
              await renderCamera();
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const endStep = () => {
    return (
      <Modal
        isVisible={modalReset}
        title={'attention'}
        bodyText={'colecta.endColecta'}
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
              endColecta();
            },
            text: 'Confirmar',
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
              : 'EXTRA';
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
    let newIndex = currentIndex + 1;
    setPhotos(photoArr);
    setCurrentIndex(newIndex);
    setLoading(false);
  };

  const sendRemission = (
    lat: any,
    lng: any,
    step: any,
    index: any,
    cajas: any,
  ) => {
    Logger.log('sendRemission');
    sendEmptyRemission(
      navigation.state.params.userId,
      dataCte[0],
      '',
      '',
      lat,
      lng,
      '',
      '',
      step,
      cajas,
    )
      .then(async () => {
        await getCtesRemmitances(navigation.state.params.moto_id);
        const newBtnArr = [...buttonsObject];
        buttonsObject[index].disable = true;
        setButtonObject(newBtnArr);
        setLoading(false);
        if (step == 4) {
          setModalReset(true);
        }
      })
      .catch(async (error) => {
        await getCtesRemmitances(navigation.state.params.moto_id);
        const newBtnArr = [...buttonsObject];
        buttonsObject[index].disable = true;
        setButtonObject(newBtnArr);
        setLoading(false);
        if (step == 4) {
          setModalReset(true);
        }
      });
  };

  const sendAllEvidencias = async () => {
    setLoading(true);
    setCurrentIndex(5);
    dataToSend(2, '');
    const newPdf = await generatePdf(
      {
        tipo: 'Colecta',
        no_planilla: dataCte[0].no_planilla,
        remesa: dataCte[0].nf_id,
        travel_id: dataCte[0].rom_id,
        destination_order: dataCte[0].destino,
      },
      photos,
    );
    await sendEvidencias(dataCte[0], newPdf, 'COLECTA').then(() => {
      setLoading(false);
    });
  };

  const dataToSend = (step: any, cajas: any) => {
    Logger.log('dataToSend');
    getRequeriments(step, step - 1, cajas);
  };

  async function calculateDistanceBetweenPoints(): Promise<number | undefined> {
    return new Promise(async (resolve, _) => {
      const coords = await Location.getCurrentPosition();
      if (coords) {
        const {cte_local_entrega} = dataCte[0];
        const [latitude, longitude] = cte_local_entrega.split(',');
        const deliveryLoc = {latitude, longitude};
        const locationDiff = Location.haversine(coords, deliveryLoc);
        resolve(locationDiff);
      } else {
        resolve(undefined);
      }
    });
  }


  const doneBoxes = (arr:any) => {
    dataToSend(3, arr.length);
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
          <Text style={styles.headerLabel}>{t('remission.executive')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {dataCte[0].ejecutivo}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}> {t('remission.phone')}:</Text>
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
      </View>
    );
  };

  const changeStatusButtons = (type) => {
    let step = '';
    switch (type) {
      case 'L':
        if (dataCte[0].nf_dt_llegada) {
          return;
        }
        break;
      case 'D':
        if (dataCte[0].nf_dt_descargando) {
          return;
        }
        if (!dataCte[0].nf_dt_llegada) {
          setErrorString('llegada_urbanos');
          return;
        }
        break;
      case 'E':
        if (dataCte[0].fin_carga) {
          return;
        }
        if (dataCte[0].movilidad_cargue_paso.length < 6) {
          setErrorString('entrega_urbanos');
          return;
        }
        step = 6;
        break;
      case 'S':
        if (dataCte[0].inicio_viaje_p) {
          return;
        }
        if (!dataCte[0].fin_carga) {
          setErrorString('entrega_urbanos');
          return;
        }
        step = 7;
        break;
    }
    adminRemission(type, step);
  };

  const adminRemission = async (operation_type: any, step: any) => {
    setLoading(true);
    let estadoPedido = '';
    if (operation_type !== 'S') {
      if (!dataCte[0].estado_pedido) {
        estadoPedido = dataCte[0].estadoPedido;
      }
    }
    if (operation_type == 'E') {
      estadoPedido = 'P';
    }

    const coords = await Location.getCurrentPosition();

    if (coords !== undefined) {
      sendEmptyRemission(
        navigation.state.params.userId,
        dataCte[0],
        operation_type == 'S' ? 'C' : estadoPedido,
        '',
        coords.latitude,
        coords.longitude,
        '',
        '',
        step,
        '',
        '',
        operation_type,
      )
        .then(async () => {
          await getCtesRemmitances(navigation.state.params.moto_id);
          getNfs();
          if (operation_type == 'S') {
            navigation.goBack();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const renderItems = ({item}: any) => {
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerBody}>
          <View style={styles.headerCard}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              {item.nf_id}
            </Text>
          </View>
          <View style={styles.containerButton}>
            <View style={{height: 10}} />
            {buttonsObject.map((item, index:number) => {
              return (
                <>
                  <View style={{height: 10}} />
                  <TouchableOpacity
                    onPress={async () => {
                      console.log(index, index);
                      if (index == 1) {
                        Logger.log('button 1 pressed');
                        setCargueModal(true);
                        return;
                      } else if (
                        (!item.disable && index == 0) ||
                        (!item.disable && buttonsObject[index - 1].disable)
                      ) {
                        setLoading(true);
                        // get distance diff
                        const distance = await calculateDistanceBetweenPoints();
                        setLoading(false);
                        if (!distance) return;
                        setMetersDiff(distance);
                        // update modal
                        setModalToRender(index);
                      } else if (
                        !item.disable &&
                        !buttonsObject[index - 1].disable
                      ) {
                        setModalStep(true);
                      }
                    }}>
                    <View
                      style={
                        !item.disable
                          ? styles.buttonsDeliveries
                          : styles.buttonsDeliveriesDisable
                      }>
                      <Text style={styles.fontButtons}>{t(item.name)}</Text>
                    </View>
                  </TouchableOpacity>
                </>
              );
            })}
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => {
                if (!disableButton) {
                  navigation.navigate('SACReportStack', {
                    nf_id: navigation.state.params.cteId,
                    screenState: screenState,
                    sacReport: sacReport,
                    sacMenu: navigation.state.params.sacMenu,
                  });
                }
              }}>
              <View
                style={
                  !disableButton
                    ? styles.buttonReport
                    : styles.buttonsDeliveriesDisable
                }>
                {/* <Image 
                    source={require("../img/icons/report_sac_icon.png")} 
                    style={{height: 32, width: 25}} />  */}

                <View style={{justifyContent: 'center'}}>
                  <Text style={styles.fontButtons}>{t('colecta.report')}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
      />
    );
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={(payload) => getNfs()} />
      <Loading show={loading} />
      {renderHeader()}
      {/* {this.renderFinishCte()} */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderList()}
      </ScrollView>
      {renderPhotoRegister()}
      {renderPhotoRegisterPhoto1()}
      {modalRender()}
      {renderDeliveryConfirm()}
      {renderModalStep()}
      {renderModalGeoCercas()}
      {endStep()}
      {errorModal()}
      {cargueMercancia()}
      <ModalScanBoxes
        isVisible={modalBoxes}
        OnCloseModal={() => {
          setModalBoxes(false);
        }}
        OnDoneAction={doneBoxes}
        pedido={dataCte[0]}
      />
    </View>
  );
};

export default Colectas;

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
    backgroundColor: '#22b14c',
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
});
