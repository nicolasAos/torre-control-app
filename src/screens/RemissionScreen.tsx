import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Card, Button, Loading, Modal,} from '../components';
import {
  checkIn,
  getCheckIn,
  checkOut,
  getNfsSupervisorOffline,
  sendEmptyRemission,
  sendEvidenceArr,
} from '../actions/driver';
import {
  loginSelector,
  locationSelector,
  deviceIdSelector,
} from '../reducers/selectors';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ScreenState from '../utils/ScreenState.class';
import {withTranslation} from 'react-i18next';
import {getDateBD} from '../configs/utils';
import Geolocation from '@react-native-community/geolocation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getCtesRemmitances} from '../actions/driver';
import ModalValue from '../components/ModalValue';
import GeoCoding from '../actions/geoCoding';
import generatePdf from '../utils/pdfGenerator';
// utils
import {Logger, AsyncStorage, Offline} from '../utils';
// botonesRemesas.lle E

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

let screenState = null;

const modalText = [
  {
    number: 1,
    text: 'remission.modalOne',
  },
  {
    number: 2,
    text: 'remission.modalTwo',
  },
  {
    number: 3,
    text: 'remission.modalThree',
  },
];
const modals = {
  fluxOne: [
    {number: 1, text: 'remission.remissionOne.registroFoto'},
    {number: 2, text: 'remission.remissionOne.secondModal'},
  ],
  fluxTwo: [
    {number: 1, text: 'remission.remissionTwo.registroFoto'},
    {number: 2, text: 'remission.remissionTwo.secondModal'},
    {number: 3, text: 'remission.remissionTwo.modalThree'},
  ],
};
const namePhotos = {
  fluxOne: ['planilla', 'cajas'],
  fluxTwo: ['documentos', 'planilla', 'factura'],
};
let screenStack = null;
const TAG = 'screens/RemissionScreen';
class RemissionClass extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      dataCte: [],
      //empresa: props.navigation.getParam('empresa', ''),
      cteId: props.navigation.getParam('cteId', ''),
      firma: '',
      //romId: props.navigation.getParam('romId', ''),
      //romInicio: props.navigation.getParam('romInicio', ''),
      loading: true,
      show: false,
      parametro_checkin: false,
      paramsCheckIn: {},
      checkIn: {},
      checkInDisable: false,
      dataStr: '',
      deliveryAlert: false,
      detailDelivery: false,
      photoRegister: false,
      takePhoto: false,
      photoRegisterIndex: 4,
      photos: [],
      soportePhotos: [],
      contPhotos: 0,
      step: 1,
      deliveryConfirm: false,
      puntoFijo: false,
      soporteModal: false,
      disableButton: true,
      latitude: 0,
      longitude: 0,
      estado: '',
      indiMercancia: '',
      sacReport: false,
      photoRegisterType: '',
      photoRegisterNo: false,
      cadenaDeFrioModal: false,
      cadenaDeFrioValue: '',
      finalModal: false,
      locationPedido: {
        lat: 0,
        lng: 0,
      },
      errorModal: '',
      remFin: true,
      remSalida: true,
      remEntregaCompleta: false,
      entregadoButton: true,
      docPendiente: '',
    };
  }

  componentDidMount() {
    Logger.log('mount Remission screen');
    this.checkIfItsAlreadyDelivered();
    this.props.navigation.addListener('didFocus', () => {
      this.setState({loading: true}, () => {
        this.getNfs();
        this.checkIfRemesaHasBeenDownloaded();
      });
      this.getLocalState();
      this.getLocate();
    });
  }

  async getLocalState() {
    const cteID = this.props.navigation.getParam('cteId');
    try {
      const localState = await AsyncStorage.getData(
        `RemissionScreenState_${cteID}`,
      );
      if (localState) {
        this.setState({
          dataCte: [{...localState}],
        });
      }
    } catch (error) {
      Logger.recordError(error);
    }
  }

  /**
   * Mark remesa as finished to continue with flow
   */
  async checkIfRemesaHasBeenDownloaded() {
    const cteID = this.props.navigation.getParam('cteId');
    const result = await AsyncStorage.getData(`${cteID}Downloaded`);
    if (result) {
      // update state to next step
      setTimeout(() => {
        this.state.dataCte[0].nf_dt_descargando = new Date().toISOString();

        this.setState({
          remDescargue: true,
          dataCte: this.state.dataCte,
          disableButton: false,
        });
      }, 100);
    }
  }

  async checkIfItsAlreadyDelivered() {
    const cteId = this.state.cteId;
    try {
      Logger.log(`check if ${cteId} is already delivered`);
      const resposne = await AsyncStorage.getData(cteId);
      if (resposne) {
        Alert.alert(`El pedido ${cteId} ya fue entregado`, '', [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.goBack();
            },
          },
        ]);
      }
    } catch (e) {
      Logger.recordError(e, TAG);
    }
  }

  componentWillUnmount(): void {
    Logger.log('unmount Remission screen');
  }

  getNfs = () => {
    if (screenState == null) {
      screenState = new ScreenState();
    }
    let newFirma = '';
    let putDetailDelivery = false;
    let disable = false;
    const firma = screenState.getFirma();
    const sacReport = screenState.getSendSac();
    if (firma !== undefined && firma !== null && firma !== '') {
      newFirma = firma.pathName;
      putDetailDelivery = true;
      screenState.deleteFirma();
    }
    if (sacReport) {
      disable = true;
      screenState.deleteSendSaC();
    }
    // get delivery info
    getNfsSupervisorOffline(
      this.state.cteId /*this.props.login.moto_id, this.state.cteId*/,
    )
      .then(async (data) => {
        const locationPedido = {lat: 0, lng: 0};
        // update state
        this.setState({
          dataCte: [data[0]], // data: data,
          loading: false,
          dataStr: data,
          deliveryDetail: this.state.itemSignature !== '' ? true : false,
          firma: newFirma,
          detailDelivery: putDetailDelivery,
          disableButton: true,
          locationPedido: locationPedido,
          remEntregaCompleta: false,
        });
      })
      .catch((e) => {
        Logger.recordError(e, TAG);
      });
  };

  reset = () => {
    this.setState({
      photos: [],
      latitude: 0,
      longitude: 0,
      estado: '',
      indiMercancia: '',
      cadenaDeFrioValue: '',
      deliveryAlert: false,
      photoRegisterIndex: 4,
      photoRegisterType: '',
      errorModal: '',
      loading: false,
    });
  };

  sendRemission = (estado: any, movilidad: any, indiMercancia: any) => {
    Logger.log('send remission');
    this.state.dataCte[0].entregado = new Date().toISOString();
    this.setState({loading: true, dataCte: this.state.dataCte});
    let evidenceArr = this.state.photos;
    if (this.state.firma !== '') {
      evidenceArr = [
        {
          name: `firma_electronica_${this.state.dataCte[0].nf_id}.png`,
          uri: `file://${this.state.firma}`,
          type: 'image/png',
          evidence_type: 'firma_electronica',
        },
        ...this.state.photos,
      ];
    }
    sendEmptyRemission(
      this.props.navigation.state.params.userId,
      this.state.dataCte[0],
      this.state.estado,
      this.state.indiMercancia,
      this.state.latitude,
      this.state.longitude,
      '',
      '',
      '',
      '',
      this.state.cadenaDeFrioValue,
      'C',
      this.state.docPendiente,
    )
      .then(async () => {
        await getCtesRemmitances(this.props.login.moto_id);
        await this.sendAllEvidencias(evidenceArr);
        if (screenState == null) {
          screenState = new ScreenState();
        }
        screenState.deleteFirma();
        this.setState({
          deliveryConfirm: false,
          remEntregaCompleta: true,
          entregadoButton: false,
        });
        this.props.navigation.goBack();
      })
      .catch(async (e) => {
        //await getCtesRemmitances(this.props.login.moto_id);
        await this.sendAllEvidencias(evidenceArr);
        if (screenState == null) {
          screenState = new ScreenState();
        }
        screenState.deleteFirma();
        this.setState({
          deliveryConfirm: false,
          remEntregaCompleta: true,
          entregadoButton: false,
        });
        await this.markAsDelivered();
        this.props.navigation.goBack();
        Logger.recordError(e, TAG);
      });
  };

  async markAsDelivered() {
    const cteId = this.state.cteId;
    try {
      Logger.log(`mark ${cteId} as delivered`);
      await AsyncStorage.storeData(cteId, true);
    } catch (e) {
      Logger.recordError(e, TAG);
    }
  }

  getLocate = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        this.setState({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      (error) => this.setState({errorModal: 'error.geolocation'}),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  sendAllEvidencias = async (evidenceArr: any) => {
    Logger.log('sendAllEvidencias');
    await sendEvidenceArr(this.state.dataCte[0], evidenceArr, '')
      .then(async () => {
        // await getCtesRemmitances(this.props.login.moto_id);
        this.setState({disableButton: true, loading: false, finalModal: false});
      })
      .catch((e) => {
        Logger.log('sendAllEvidencias catched');
        const data = {dataCte: this.state.dataCte[0], evidenceArr, extra: ''};
        Offline.catchEvent('recepcion-evidencias', data);
        Logger.recordError(e, TAG);
      });
  };

  sendEndEvidencias = async () => {
    Logger.log('sendEndEvidencias');
    this.setState({loading: true});
    await sendEvidenceArr(this.state.dataCte[0], soportePhotos)
      .then(() => {
        getCtesRemmitances(this.props.login.moto_id);
        this.setState({disableButton: true, loading: false, firma: ''});
      })
      .catch((e) => {
        this.setState({disableButton: true, loading: false, firma: ''});
        Logger.recordError(e, TAG);
      });
  };

  submitCheckIn = () => {
    Logger.log('submitCheckIn');
    checkIn(
      this.props.login.moto_id,
      this.state.paramsCheckIn,
      this.props.device_id,
      this.props.location,
    )
      .then((checkIn) =>
        this.setState({
          checkIn,
          loading: false,
          checkInDisable: checkIn.checkIn,
        }),
      )
      .catch((checkIn) =>
        this.setState({
          checkIn,
          loading: false,
          checkInDisable: checkIn.checkIn,
        }),
      );
  };

  onDoneFridgeModal = (value: any) => {
    if (this.state.dataCte[0].punto_fijo !== 'S') {
      this.setState({
        deliveryAlert: true,
        // estado: 'C',
        // indiMercancia: 'N',
        cadenaDeFrioValue: value,
        cadenaDeFrioModal: false,
      });
    } else {
      this.setState({
        puntoFijo: true,
        // estado: 'C',
        // indiMercancia: 'D',
        cadenaDeFrioValue: value,
        cadenaDeFrioModal: false,
      });
    }
  };

  submitFinishCte = async () => {
    Logger.log('submitFinishCte');
    try {
      const ckIn = await getCheckIn(
        this.props.login.moto_id,
        this.state.paramsCheckIn,
      );
      if (ckIn.checkIn) {
        checkOut(ckIn[0], this.props.location).then(() => {
          this.setState({loading: false}, () =>
            this.props.navigation.dispatch(StackActions.pop()),
          );
        });
      } else {
        this.setState({loading: false}, () =>
          this.props.navigation.dispatch(StackActions.pop()),
        );
      }
    } catch (error) {
      Logger.recordError(error);
    }
  };

  renderHeader = () => {
    const {t} = this.props;
    if (this.state.dataCte.length === 0) {
      return;
    }
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.client')}:</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {this.state.dataCte[0].cliente}
          </Text>
          {/* <Text style={styles.headerLabel}>{t('remission.CT-e')}:</Text>
          <Text style={styles.headerItem} numberOfLines={1}>
            {this.state.dataCte.cte_numero} - ({this.state.dataCte.cte_ordem})
          </Text> */}
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.recipient')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {this.state.dataCte[0].destinatario}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.address')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {this.state.dataCte[0].direccion}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>Gestión en el punto:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {/* {this.state.dataCte[0].direccion} */}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>Teléfono:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {/* {this.state.dataCte[0].direccion} */}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.executive')}:</Text>
          <Text style={[styles.headerItem, {width: width / 1.4}]}>
            {this.state.dataCte[0].ejecutivo}
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
              Linking.openURL(`tel:${this.state.dataCte[0].telefono_ejecutivo}`)
            }>
            {this.state.dataCte[0].telefono_ejecutivo}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('remission.boxesDry')}:</Text>
          <Text style={[styles.headerItem]}>
            {this.state.dataCte[0].cajas}
            {' | '}
          </Text>
          <Text style={styles.headerLabel}>{t('remission.boxesCold')}:</Text>
          <Text style={[styles.headerItem]}>
            {this.state.dataCte[0].cajas_en_frio}
            {' | '}
          </Text>
          <Text style={styles.headerLabel}>{t('remission.boxes')}:</Text>
          <Text style={[styles.headerItem]}>
            {this.state.dataCte[0].total_cajas}
          </Text>
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
                  this.props.navigation.navigate('MapFull', {
                    pedido: true,
                    lat: this.state.locationPedido.lat,
                    lng: this.state.locationPedido.lng,
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

  deliveryOnPress = (bandera, required) => {
    if (bandera === 'delivery') {
      this.setState({deliveryAlert: false});
      this.props.navigation.navigate('SignatureRemissionStack', {
        screenState: screenState,
        form: {
          nfs: this.state.dataCte[0],
          estado: this.state.estado,
          indiMercancia: this.state.indiMercancia,
          lat: this.state.latitude,
          lng: this.state.longitude,
          cadenaDeFrio: this.state.cadenaDeFrioModal,
          cadenaDeFrio: this.state.cadenaDeFrioModal,
        },
        firma: this.state.firma,
      });
    }
    if (bandera === 'photoRegister') {
      this.renderCamera();
    }
  };

  validateButtonTypes = (type: any) => {
    Logger.log('validateButtonTypes');
    switch (type) {
      case 'I':
        this.getLocate();
        if (this.state.dataCte[0].cadena_frio !== 'N') {
          this.setState({cadenaDeFrioModal: true, indiMercancia: 'S'});
        } else {
          if (this.state.dataCte[0].punto_fijo !== 'S') {
            this.setState({
              deliveryAlert: true,
              // estado: 'C',
              estado: 'C',
              // entregadoButton: false,
              indiMercancia: 'S',
            });
          } else {
            // this.setState({puntoFijo: true, estado: 'C', indiMercancia: 'S'});
            this.setState({
              estado: 'C',
              puntoFijo: true,
              indiMercancia: 'S',
              // entregadoButton: false,
            });
          }
        }
        break;
      case 'N':
        this.getLocate();
        if (this.state.dataCte[0].cadena_frio !== 'N') {
          this.setState({cadenaDeFrioModal: true, indiMercancia: 'N'});
        } else {
          if (this.state.dataCte[0].punto_fijo !== 'S') {
            this.setState({
              deliveryAlert: true,
              // estado: 'C',
              estado: 'C',
              // entregadoButton: false,
              indiMercancia: 'N',
            });
          } else {
            // this.setState({puntoFijo: true, estado: 'C', indiMercancia: 'D'});
            this.setState({
              estado: 'C',
              puntoFijo: true,
              indiMercancia: 'N',
              // entregadoButton: false,
            });
          }
        }
        break; 
      case 'S':
        this.reset();
        this.props.navigation.navigate('SACReportStack', {
          nf_id: this.state.dataCte[0].nf_id,
          screenState: screenState,
          sacReport: this.state.sacReport,
          sacMenu: this.props.navigation.state.params.sacMenu,
        });
        break;
    }
  };

  adminRemission = async (TypeBtn: any) => {
    Logger.log(`adminRemission ${TypeBtn}`);
    this.setState({loading: true});

    if (TypeBtn === 'A') {
      const cteID = this.props.navigation.getParam('cteId');
      // go to boxes
      this.state.dataCte[0].inicio_viaje_p = new Date().toISOString();
      this.setState({
        dataCte: this.state.dataCte,
      });
      await AsyncStorage.storeData(
        `RemissionScreenState_${cteID}`,
        this.state.dataCte[0],
      );
    }

    if (TypeBtn === 'U') {
      this.setState({loading: false});
      const coords = {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      };
      const order = this.state.dataCte[0];
      // just for dev
      //order.cadena_frio = 'Y';
      //order.total_cajas = 10;

      this.props.navigation.navigate('remesaBoxesStack', {order, coords});
      return;
      /*
      this.state.dataCte[0].nf_dt_descargando = new Date().toISOString();

      this.setState({
        remDescargue: true,
        dataCte: this.state.dataCte,
        disableButton: false,
      });
      */
    }

    Geolocation.getCurrentPosition(
      (info) => {
        sendEmptyRemission(
          this.props.navigation.state.params.userId,
          this.state.dataCte[0],
          this.state.estado,
          this.state.indiMercancia,
          this.state.latitude,
          this.state.longitude,
          '',
          '',
          '',
          '',
          this.state.cadenaDeFrioValue,
          'C',
          '',
          TypeBtn === 'A' ? new Date().toISOString() : null,
        )
          .then(async () => {
            await getCtesRemmitances(this.props.login.moto_id);
            this.setState({loading: false});
            if (this.state.dataCte[0].fecha_fin) {
              this.props.navigation.goBack();
            }
            if (this.state.estado === 'C') {
              this.props.navigation.goBack();
            }
          })
          .catch((e) => {
            this.setState({loading: false});
            Logger.recordError(e, TAG);
          });
      },
      (e) => {
        this.setState({loading: false});
        Logger.recordError(e, TAG);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  renderItems = ({item}) => {
    const {t} = this.props;
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerBody}>
          <View style={styles.headerCard}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              {item.nf_id}
            </Text>
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Confirma llegada al cliente', '', [
                  {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {text: 'Si', onPress: () => this.adminRemission('A')},
                ])
              }
              disabled={this.state.dataCte[0].inicio_viaje_p ? true : false}>
              <View
                style={[
                  styles.buttonsDeliveries,
                  this.state.dataCte[0].inicio_viaje_p
                    ? {backgroundColor: '#D1D1D1'}
                    : {},
                ]}>
                <Text style={styles.fontButtons}>
                  {t('botonesRemesas.llegadaRemesas')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => this.adminRemission('U')}
              disabled={
                !this.state.dataCte[0].inicio_viaje_p
                  ? true
                  : this.state.dataCte[0].nf_dt_descargando
                  ? true
                  : false
              }>
              <View
                style={[
                  styles.buttonsDeliveries,
                  !this.state.dataCte[0].inicio_viaje_p
                    ? {backgroundColor: '#D1D1D1'}
                    : this.state.dataCte[0].nf_dt_descargando
                    ? {backgroundColor: '#D1D1D1'}
                    : {},
                ]}>
                <Text style={styles.fontButtons}>
                  {t('botonesRemesas.descargandoRemesas')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => this.validateButtonTypes('I')}
              disabled={
                !this.state.dataCte[0].nf_dt_descargando
                  ? true
                  : this.state.dataCte[0].estado_pedido == 'P' ||
                    !this.state.entregadoButton
                  ? true
                  : false
              }>
              <View
                style={
                  !this.state.dataCte[0].nf_dt_descargando
                    ? styles.buttonsDeliveriesDisable
                    : this.state.dataCte[0].estado_pedido == 'P' ||
                      !this.state.entregadoButton
                    ? styles.buttonsDeliveriesDisable
                    : styles.buttonsDeliveries
                }>
                {/* <Image 
                    source={require("../img/icons/check_icon.png")} 
                    style={{height: 38, width: 25}} />  */}

                <Text style={styles.fontButtons}>
                  {t('ctesScreen.inventory')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity
              onPress={() => this.validateButtonTypes('N')}
              disabled={
                !this.state.dataCte[0].nf_dt_descargando
                  ? true
                  : this.state.dataCte[0].estado_pedido == 'P' ||
                    !this.state.entregadoButton
                  ? true
                  : false
              }>
              <View
                style={
                  !this.state.dataCte[0].nf_dt_descargando
                    ? styles.buttonsDeliveriesDisable
                    : this.state.dataCte[0].estado_pedido == 'P' ||
                      !this.state.entregadoButton
                    ? styles.buttonsDeliveriesDisable
                    : styles.buttonsDeliveries
                }>
                {/* <Image 
                    source={require("../img/icons/check_icon.png")} 
                    style={{height: 38, width: 25}} />  */}

                <Text style={styles.fontButtons}>
                  {t('ctesScreen.noInventory')}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 10}} />
            <TouchableOpacity onPress={() => this.validateButtonTypes('S')}>
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

            {/* *************** Nuevos Botones *************************** */}
            {/* <View style={styles.bottomButtonsContainer}>
              <View style={{flex: 1, padding: 3}}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => this.adminRemission('A')}
                  disabled={
                    this.state.dataCte[0].inicio_viaje_p ? true : false
                  }>
                  <View
                    style={[
                      styles.buttonsBottom,
                      this.state.dataCte[0].inicio_viaje_p
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('botonesRemesas.llegadaRemesas')}
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
                  onPress={() => this.adminRemission('U')}
                  disabled={
                    !this.state.dataCte[0].inicio_viaje_p
                      ? true
                      : this.state.dataCte[0].nf_dt_descargando
                      ? true
                      : false
                  }>
                  <View
                    style={[
                      styles.buttonsBottom,
                      !this.state.dataCte[0].inicio_viaje_p
                        ? {backgroundColor: '#D1D1D1'}
                        : this.state.dataCte[0].nf_dt_descargando
                        ? {backgroundColor: '#D1D1D1'}
                        : {},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('botonesRemesas.descargandoRemesas')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View> */}
            {/* *************** Nuevos Botones: Adicionales **************** */}
            {/* <View style={styles.bottomButtonsContainer}> */}
            {/* <View style={{flex: 1, padding: 3}}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => this.adminRemission('S')}
                  disabled={
                    this.state.dataCte[0].estado_pedido == 'P' ||
                    !this.state.entregadoButton
                      ? false
                      : true
                  }>
                  <View
                    style={[
                      styles.buttonsBottom,
                      this.state.dataCte[0].estado_pedido == 'P' ||
                      !this.state.entregadoButton
                        ? {}
                        : {backgroundColor: '#D1D1D1'},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {t('botonesRemesas.entregadoRemesas')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            {/* <View style={{flex: 1, padding: 3}}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: 2,
                  }}
                  onPress={() => this.adminRemission('S')}
                  disabled={this.state.remEntregaCompleta && this.state.remFinalizacionCargue ? false: true}>
                  <View
                    style={[
                      styles.buttonsBottom, this.state.remEntregaCompleta && this.state.remFinalizacionCargue
                      ? {} : {backgroundColor: '#D1D1D1'},
                    ]}>
                    <Text style={styles.fontButtons}>
                      {('SALIDA DEL PUNTO')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            {/* </View> */}
          </View>
        </View>

        {/* {item.cte_type_delivery === 'D' &&
          <View style={styles.containerTitleDelivery}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>
                {t('remission.delivery')}
                {item.rom_id_controle} - {item.cte_ordem}
              </Text>
            </View>
          </View>
        }

        {item.cte_type_delivery === 'P' &&
          <View style={styles.containerTitlePickup}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>
                {t('remission.pickup')}
                {item.rom_id_controle} - {item.cte_ordem}
              </Text>
            </View>
          </View>
        }
        <View style={styles.containerBody}>
          <View style={styles.body}>
            <Text style={styles.label}>{t('remission.volume')}:</Text>
            <Text style={styles.item}>{parseFloat(item.nf_volume)}</Text>
          </View>
          {!item.closed && (
            <View style={styles.containerButton}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate('lowStack', {
                    data: item.nf,
                    romInicio: this.state.romInicio,
                  })
                }
                title="delivery"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    backgroundColor:
                      this.state.parametro_checkin && !this.state.checkInDisable
                        ? '#666'
                        : global.COLOR_MAIN,
                  },
                ]}
                disabled={
                  this.state.parametro_checkin && !this.state.checkInDisable
                }
              />
              <Button
                onPress={() =>
                  this.props.navigation.navigate('occurrenceStack', {
                    data: item.nf,
                  })
                }
                title="occurrence"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    backgroundColor:
                      this.state.parametro_checkin && !this.state.checkInDisable
                        ? '#666'
                        : 'red',
                  },
                ]}
                disabled={
                  this.state.parametro_checkin && !this.state.checkInDisable
                }
              />
            </View>
          )}
        </View> */}
      </Card>
    );
  };

  renderButtonCheckIn = () => {
    if (this.state.parametro_checkin) {
      return (
        <Button
          onPress={() =>
            this.setState({loading: true}, () => this.submitCheckIn())
          }
          title="checkin"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
          }}
          buttonStyle={[
            styles.checkIn,
            {
              backgroundColor: this.state.checkInDisable ? 'grey' : 'orange',
            },
          ]}
          disabled={this.state.checkInDisable}
        />
      );
    }
  };

  renderList = () => {
    return (
      <FlatList
        data={this.state.dataCte}
        renderItem={this.renderItems}
        keyExtractor={(item) => item.nf_type_number}
        extraData={this.state.parametro_checkin && !this.state.checkInDisable}
      />
    );
  };

  // renderFinishCte = () => {
  //   if (this.state.data.isClosedCte) {
  //     let message = '';
  //     if (this.state.checkInDisable) {
  //       message = 'checkout-automatically';
  //     }
  //     return (
  //       <Modal
  //         isVisible={this.state.show}
  //         title="attention"
  //         bodyText={'cte-finalized'}
  //         buttons={[
  //           {
  //             onPress: () => {
  //               this.setState({show: false});
  //               setTimeout(
  //                 () =>
  //                   this.setState({loading: true}, () =>
  //                     this.submitFinishCte(),
  //                   ),
  //                 500,
  //               );
  //             },
  //             text: 'ok-got-it',
  //             backgroundColor: global.COLOR_MAIN,
  //           },
  //         ]}
  //       />
  //     );
  //   }
  // };

  renderModal = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.deliveryAlert}
        title={t('remission.signatureTitle')}
        bodyText={t('remission.signatureText')}
        buttons={[
          {
            onPress: () => {
              this.reset();
            },
            text: 'cancel',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              this.deliveryOnPress('delivery');
            },
            text: 'accept',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  errorModal = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.errorModal !== ''}
        title={t('attention')}
        bodyText={this.state.errorModal}
        buttons={[
          {
            onPress: () => {
              this.reset();
            },
            text: 'accept',
            backgroundColor: '#42c790',
          },
        ]}
      />
    );
  };

  renderDeliveryDetail = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.detailDelivery}
        title={t('remission.deliveryTitle')}
        bodyText={t('remission.deliveryDetailText')}
        buttons={[
          {
            onPress: () => {
              this.setState({
                detailDelivery: false,
                photoRegisterType: 'fluxTwo',
                photoRegisterIndex: 0,
                docPendiente: 'N',
              });
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              this.setState({
                detailDelivery: false,
                photoRegisterType: 'fluxOne',
                photoRegisterIndex: 0,
                docPendiente: 'S',
              });
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  renderDeliveryConfirm = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.deliveryConfirm}
        title={t('remission.deliveryTitle')}
        bodyText={t('remission.deliveryConfirmText')}
        buttons={[
          {
            onPress: () => {
              this.sendRemission();
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              this.renderCamera();
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  renderPuntofijoConfirm = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.puntoFijo}
        title={t('remission.signatureTitle')}
        bodyText={t('remission.deliveryPuntofijoText')}
        buttons={[
          {
            onPress: () => {
              this.sendRemission(), this.setState({puntoFijo: false});
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              this.setState({puntoFijo: false, deliveryAlert: true});
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };
  /*
  renderSoporteModal = () => {
    const {t} = this.props
    return (
      <Modal
        isVisible={this.state.soporteModal}
        title={t('remission.modalPhotoTitle')}
        bodyText={t('remission.soporteModalText')}
        buttons={[
          {
            onPress: () => {
             this.setState(state)
            },
            text: 'No',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.renderCamera('soporte')
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          }
        ]}
      />
    );
  };
  */

  backAndErasePhoto = () => {
    let newArr = this.state.photos;
    newArr.splice(-1);
    let newIndex = this.state.photoRegisterIndex - 1;
    if (newIndex < 0) {
      newIndex = 3;
    }
    this.setState({photos: newArr, photoRegisterIndex: newIndex});
    if (newIndex == 3) {
      switch (this.state.photoRegisterType) {
        case 'si':
          this.setState({photoRegister: true});
          break;
        case 'no':
          this.setState({photoRegisterNo: true});
          break;
      }
    }
  };

  renderPhotoRegisterPhoto1 = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={
          this.state.photoRegisterIndex <= 1 &&
          this.state.photoRegisterType !== '' &&
          this.state.photoRegisterType == 'fluxOne'
        }
        title={t('remission.modalPhotoTitle')}
        bodyText={t(
          modals['fluxOne'] !== undefined
            ? modals['fluxOne'][this.state.photoRegisterIndex]?.text
            : '',
        )}
        buttons={[
          {
            onPress: () => {
              this.reset();
            },
            text: 'Cancelar',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              this.deliveryOnPress('photoRegister');
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
            color: 'blue',
          },
        ]}
      />
    );
  };

  renderPhotoRegisterPhoto2 = () => {
    const {t} = this.props;
    return (
      <Modal
        isVisible={
          this.state.photoRegisterIndex <= 2 &&
          this.state.photoRegisterType !== '' &&
          this.state.photoRegisterType == 'fluxTwo'
        }
        title={t('remission.modalPhotoTitle')}
        bodyText={t(
          modals['fluxTwo'] !== undefined
            ? modals['fluxTwo'][this.state.photoRegisterIndex]?.text
            : '',
        )}
        buttons={[
          {
            onPress: () => {
              this.reset();
            },
            text: 'Cancelar',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              // if (this.state.photoRegisterIndex == 0) {
              // this.setState({photoRegisterIndex: 1});
              // } else {
              this.deliveryOnPress('photoRegister');
              // }
            },
            text: 'Aceptar',
            backgroundColor: global.COLOR_TITLE_CARD,
            color: 'blue',
          },
        ]}
      />
    );
  };
  afterTakePhoto = (photoArr) => {
    let deliverConfirmState = false;
    if (
      (this.state.photoRegisterType == 'fluxOne' && photoArr.length >= 2) ||
      (this.state.photoRegisterType == 'fluxTwo' && photoArr.length >= 3)
    ) {
      deliverConfirmState = true;
    }
    const newIndex = this.state.photoRegisterIndex + 1;
    this.setState({
      takePhoto: false,
      photoRegisterIndex: newIndex,
      photos: photoArr,
      deliveryConfirm: deliverConfirmState,
      loading: false,
    });
    ////this.render();
  };

  async renderCamera() {
    this.setState({loading: true});
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
            this.setState({loading: false});
            return;
          }
          const img = response.assets[0];
          console.log('IMG SIZE PREVIUS')
          console.log(JSON.stringify(img, null, 2));
          ImageResizer.createResizedImage(
            img.uri,
            1280,
            960,
            'JPEG',
            50,
            0,
          ).then((image) => {
            console.log('IMG SIZE AFTER')
            console.log(JSON.stringify(image, null, 2));
            const name = namePhotos[this.state.photoRegisterType][
              this.state.photos.length
            ]
              ? namePhotos[this.state.photoRegisterType][
                  this.state.photos.length
                ]
              : 'Extra';
            const newPhoto = {
              name: `${name}_${this.state.dataCte[0].nf_id}_${this.state.photoRegisterIndex}.jpeg`,
              uri: image.uri,
              type: 'image/jpeg',
              evidence_type: name,
            };
            let newStatePhotos = [...this.state.photos, newPhoto];
            this.afterTakePhoto(newStatePhotos);
          });
        });
      } else {
        this.reset();
        this.setState({loading: false});
        Alert.alert('Necesitamos permisos para acceder a esta función');
      }
    } catch (err) {
      this.setState({loading: false});
      console.log(error);
    }
  }

  render() {
    const {t} = this.props;
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        {this.renderHeader()}
        {/* {this.renderFinishCte()} */}
        {this.state.deliveryAlert ? this.renderModal() : false}
        {/*this.renderSoporteModal()*/}
        {this.renderPuntofijoConfirm()}
        {this.renderDeliveryConfirm()}
        {this.renderDeliveryDetail()}
        {this.renderPhotoRegisterPhoto1()}
        {this.renderPhotoRegisterPhoto2()}
        {this.errorModal()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderList()}
          {/*
            this.state.photos.length >= 3 &&
            <View style={styles.footerTextContainer}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() =>{
                  if (this.state.soportePhotos.length < 1) {
                    this.setState({ soporteModal: true})
                  }
                }}
              >
                <Text style={styles.footerText}>
                  {t('ctesScreen.support')}
                </Text> 
                <View
                  style={{ padding: 3 }}
                />
                <FontAwesome5
                name="camera"
                color="red"
                size={26}
              />
              </TouchableOpacity>
            </View>
          */}
        </ScrollView>
        {this.renderButtonCheckIn()}
        <ModalValue
          isVisible={this.state.cadenaDeFrioModal}
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
          OnDoneModal={this.onDoneFridgeModal}
          withClose={false}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    location: locationSelector(state),
    device_id: deviceIdSelector(state),
  };
};

const Remission = withTranslation('screens')(RemissionClass);
export default connect(mapStateToProps)(Remission);

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
