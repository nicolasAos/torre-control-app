import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import {StackActions} from 'react-navigation';
import {Button, DatePicker, Photo, Modal, Loading} from '../components';
import {loginSelector, latlongSelector} from '../reducers/selectors';
import {sendLow, sendLowByCte} from '../actions/low';
import {getParsedDate, getDateBD, getMilis} from '../configs/utils';
import moment from 'moment';
import {launchCamera} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {withTranslation} from 'react-i18next';
//import i18n from '../locales';
//import {color} from 'react-native-reanimated';
import {getLowOffline} from '../actions/driver';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';
import {setLow, setLowByCte} from '../database/models/low';
//import NetInfo from '@react-native-community/netinfo';
import {getLowOnline} from '../actions/driver';
import {Mixpanel} from '../analitycs';
// utils
import {Logger, AsyncStorage, BackgroundService, ForegroundService} from '../utils';

const options = {
  cameraType: 'back',
  mediaType: 'photo',
  // includeBase64: true,
  // maxWidth: 620,
  // maxHeight: 480,
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
};

let timer: any;
const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
  t:any;
  login:any;
}

class LowClass extends Component<Props> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      idBanco: null,
      deliveryDate: '',
      deliveryArrived: '',
      deliveryStart: '',
      deliveryEnd: '',
      data: props.navigation.getParam('data', []),
      invoices: props.navigation.getParam('invoices', []),
      romInicio: props.navigation.getParam('romInicio', ''),
      pathDelivery: '',
      show: false,
      showError: false,
      error: '',
      success: '',
      showDatepickerArrived: false,
      showDatepickerStart: false,
      showDatepickerEnd: false,
      photosRealme: null,
      verify: false,
      photos: [],
      start: false,
      arrived: false,
      end: false,
      variableMessage: '¿Quieres confirmar fecha de llegada?',
    };
  }

  componentDidMount() {
    Logger.log(`mount Low screen`);
    Mixpanel.log('Low Screen Visited');
    this.getLowByServer();

    timer = setInterval(() => {
      this.getLowByServer();
    }, 60000);

    setTimeout(async () => {
      try {
        await fetch('https://reactnative.dev/movies.json');
      } catch (error) {
        this.updateState();
      }
    }, 500);
  }

  componentWillUnmount(): void {
    Logger.log(`unmount Low screen`);
    if (timer) {
      clearInterval(timer);
    }
  }

  async updateState() {
    try {
      const localState = await AsyncStorage.getData(
        `low_d_${this.state.data.cte_numero}`,
      );
      this.setState({...localState});
    } catch (error) {}
  }

  validate = (arrived: any, start: any, end: any, name: any) => {
    if (arrived && start && end && name) {
      this.setState({verify: true});
    } else {
      this.setState({verify: false});
    }
  };

  setLow = async () => {
    Logger.log(`set low`);
    let endPedido = false;
    const data = this.state.data;
    const {t} = this.props;
    if (
      this.state.deliveryArrived &&
      this.state.deliveryStart &&
      this.state.deliveryEnd &&
      this.state.name
    ) {
      endPedido = true;
    }
    data.update_or_end = endPedido;
    let idBanco;
    try {
      // get smth from realm
      const lowById = await getLowOffline(this.state.data.nf_type_number);
      idBanco = lowById.id;
    } catch (e) {
      idBanco = null;
    }

    data.idBanco = idBanco;
    data.start_travel = this.state.romInicio;
    data.canhoto_img = this.state.pathDelivery;
    data.nf_lat_long_entrega = this.props.latlong;
    data.nf_dt_llegada = this.state.deliveryArrived //Data de chegada
      ? getParsedDate(this.state.deliveryArrived)
      : null;
    data.nf_dt_descargando = this.state.deliveryStart //Inicio da descarga
      ? getParsedDate(this.state.deliveryStart)
      : null;
    data.nf_dt_entrega = this.state.deliveryEnd //Data de chegada
      ? getParsedDate(this.state.deliveryEnd)
      : null;
    data.nf_dt_canhoto = getDateBD();
    data.nf_dt_inicio_viaje_p = this.state.type == 'D' ? getDateBD() : null;
    data.nf_resp_receber = this.state.name ? this.state.name : null;
    data.photos = this.state.photos;
    await sendLow(this.props.login.moto_id, data, this.props.login.user_id)
      .then(() => {
        this.setState({
          loading: false,
          success:
            this.state.data.cte_type_delivery == 'D'
              ? 'delivery-confirmed'
              : 'pickup-confirmed',
        });
        setTimeout(() => this.setState({showSuccess: true}), 500);
      })
      .catch((error) => {
        this.setState({loading: false, error: error.message});
        setTimeout(() => this.setState({showError: true}), 500);
      });
  };

  getLowByServer = async () => {
    Logger.log('getLowByServer');
    this.setState({loading: true});
    const {navigation} = this.props;
    const params = navigation.state.params.data;
    let newData;
    let newPhotos = [];
    try {
      newData = await getLowOnline(
        params.rom_id,
        params.cte_type_delivery,
        params.cte_ordem,
      );
      newPhotos = [];
      newData.name = newData.descripcion;
    } catch (e) {
      newData = await getLowOffline(this.state.data.nf_type_number);
      if (!newData) {
        this.setState({loading: false});
        return;
      }
      newPhotos = newData.photos;
      newData.name = newData.nf_resp_receber;
      /* handle error */
    }
    let dataLlegada = newData.dt_llegada
      ? moment(newData.dt_llegada).format('DD/MM/YYYY HH:mm:ss')
      : '';
    let dataDescargando = newData.dt_descargando_carg
      ? moment(newData.dt_descargando_carg).format('DD/MM/YYYY HH:mm:ss')
      : '';
    let dataFim = newData.dt_fin_descargue
      ? moment(newData.dt_fin_descargue).format('DD/MM/YYYY HH:mm:ss')
      : '';
    let idBanco;
    try {
      const lowById = await getLowOffline(this.state.data.nf_type_number);
      idBanco = lowById.id;
    } catch (e) {
      idBanco = null;
    }
    if (
      newData.dt_llegada &&
      newData.dt_descargando_carg &&
      newData.dt_fin_descargue
    ) {
      newData.nf_dt_llegada = newData.dt_llegada;
      newData.nf_dt_descargando = newData.dt_descargando_carg;
      newData.nf_dt_entrega = newData.dt_fin_descargue;
      newData.cte_info_controle = newData.cte_type_delivery + newData.cte_ordem;
      newData.nf_dt_canhoto = getDateBD();
      newData.nf_dt_inicio_viaje_p = newData.inicio_viaje_p;
      const idBanco = idBanco;
      newData.cte_chave = newData.cte_info_controle;
      newData.idBanco = idBanco;
      newData.photos = [];
      newData.update_or_end = true;
      newData.nf_type_number = this.state.data.nf_type_number;
      newData.nf_resp_receber = 'Actualizacion local';
      await sendLow(this.props.login.moto_id, newData);
      this.setState({
        loading: false,
        success:
          params.cte_type_delivery == 'D'
            ? 'delivery-confirmed'
            : 'pickup-confirmed',
      });
      setTimeout(() => this.setState({showSuccess: true}), 500);
      return;
    }
    this.setState({
      idBanco: idBanco,
      name: '',
      deliveryArrived: this.state.deliveryArrived ? this.state.deliveryArrived : dataLlegada,
      deliveryStart: this.state.deliveryStart ? this.state.deliveryStart : dataDescargando,
      deliveryEnd: this.state.deliveryEnd ? this.state.deliveryEnd : dataFim,
      photos: newPhotos,
      type: newData.type,
      loading: false,
    });
  };

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText={this.state.variableMessage}
        buttons={[
          {
            onPress: () => this.setState({show: false}),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({show: false});
              setTimeout(
                () => this.setState({loading: true}, () => this.setLow()),
                500,
              );
            },
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  updateLow(stateParams: any) {
    if (stateParams.deliveryArrived) {
      this.state.deliveryArrived = stateParams.deliveryArrived;
    }
    if (stateParams.deliveryStart) {
      this.state.deliveryStart = stateParams.deliveryStart;
    }
    if (stateParams.deliveryEnd) {
      this.state.deliveryEnd = stateParams.deliveryEnd;
    }
    // store sate loccally
    AsyncStorage.storeData(`low_d_${this.state.data.cte_numero}`, this.state);
    this.setState({...stateParams});
  }

  renderModalError = () => {
    return (
      <Modal
        isVisible={this.state.showError}
        title="attention"
        bodyText={this.state.error}
        buttons={[
          {
            onPress: () => this.setState({showError: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalSuccess = () => {
    return (
      <Modal
        isVisible={this.state.showSuccess}
        title="attention"
        bodyText={
          this.state.data.cte_type_delivery == 'D'
            ? 'Información actualizada con éxito!'
            : 'Información actualizada con éxito!'
        }
        buttons={[
          {
            onPress: () => {
              this.setState({showSuccess: false}, () =>
                this.props.navigation.dispatch(StackActions.pop()),
              );
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderHeader = () => {
    const {t} = this.props;
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.cte-E')}</Text>
          <Text style={styles.headerItem}>{this.state.data.nf_id}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('low.volume')}</Text>
          <Text style={styles.headerItem}>
            {parseFloat(this.state.data.nf_volume)}
          </Text>
        </View>
      </View>
    );
  };

  renderHeaderCte = () => {
    const {t} = this.props;
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('invoices.CT-e')}:</Text>
          <Text style={styles.headerItem}>{this.state.data.nf_id}</Text>
        </View>
      </View>
    );
  };

  renderName = () => {
    const {t} = this.props;
    return (
      <TextInput
        ref={(input) => (this.nameTextInput = input)}
        style={styles.textInputs}
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        placeholder={t('low.name')}
      />
    );
  };

  renderCamera = async () => {
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
        launchCamera(options, async (response) => {
          if (response.didCancel) {
            this.setState({loading: false});
            return;
          }

          const storage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Torre de Control solicita permisos',
              message:
                '¿Desea dar permisio para escribir en el almacenamiento del dispositivo?',
              buttonNeutral: 'Preguntame mas tarde',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          if (storage !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Error',
              'Necesitamos permisos para acceder a esta función',
            );
            return;
          }
          const verifyFilesPath = await RNFS.exists(
            '/storage/emulated/0/DCIM/torreControl',
          );
          if (!verifyFilesPath) {
            await RNFS.mkdir('/storage/emulated/0/DCIM/TorreControl');
          }
          const img = response.assets[0];
          ImageResizer.createResizedImage(
            img.uri, // path
            840, // width
            480, // height
            'JPEG', // compressFormat
            50, // quality
            0, // rotation
            '/storage/emulated/0/DCIM/torreControl', // outputPath
          )
            .then((image) => {
              const {navigation} = this.props;
              const params = navigation.state.params.data;
              let data = this.state.data;
              let number = this.state.photos.length;
              let name = `${params.rom_id}_${params.cte_type_delivery}_${
                params.cte_ordem
              }_${number}_${new Date().toISOString()}.JPEG`;
              this.setState({
                photos: [
                  ...this.state.photos,
                  {
                    fileName: name,
                    uri: image.uri,
                    type: 'image/jpeg',
                    id: name,
                    path: image.path,
                    type: 'offline',
                    // base64: img.base64
                  },
                ],
                loading: false,
              });
            })
            .catch((err) => {
              Alert.alert(JSON.stringify(err));
            });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDelete = async (i) => {
    const storage = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Torre de Control solicita permisos',
        message:
          '¿Desea dar permisio para escribir en el almacenamiento del dispositivo?',
        buttonNeutral: 'Preguntame mas tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (storage !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Error', 'Necesitamos permisos para acceder a esta función');
      return;
    }
    if (this.state.photos[i].type == 'offline') {
      await RNFS.unlink(this.state.photos[i].path);
    }
    const photos = this.state.photos.filter((item, index) => index !== i);
    let dataCte = this.state.data;
    dataCte.idBanco = this.state.idBanco;
    dataCte.photos = photos;
    await setLow(this.props.login.moto_id, dataCte, 0);
    this.setState({photos: photos});
  };

  renderPhoto = () => {
    let data = this.state.data;
    let nfId = data.nf_id ? data.nf_id : 0;
    return (
      <ScrollView
        horizontal
        style={{
          flexDirection: 'row',
          width: '100%',
        }}>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 20,
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.renderCamera();
            }}>
            <View
              style={{
                width: 105,
                height: 105,
                borderRadius: 105,
                overflow: 'hidden',
                backgroundColor: 'gray',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome5 name="camera" color="white" size={40} />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.photos.map((item, index) => {
          return (
            <View
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 20,
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  width: 105,
                  height: 105,
                  borderRadius: 85,
                  overflow: 'hidden',
                  backgroundColor: 'gray',
                }}>
                <ImageBackground
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  source={{uri: item.uri}}
                />
              </View>
              <View
                style={{
                  bottom: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.handleDelete(index);
                  }}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 35,
                      backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5 name="trash" size={18} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  renderDeliveryArrived = () => {
    const {t} = this.props;
    return (
      <View style={{width: '100%'}}>
        {this.state.deliveryArrived !== '' && (
          <Text style={{fontWeight: 'bold', fontSize: 12, marginStart: 5}}>
            {t('date-picker.delivery-arrived')}
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: '70%',
              paddingRight: 5,
            }}>
            <DatePicker
              disabled={this.state.deliveryArrived}
              date={this.state.deliveryArrived}
              placeholder="delivery-arrived"
              title="select-date"
              mode="datetime"
              isDatePickerVisible={this.state.showDatepickerArrived}
              maximumDate={new Date()}
              onPress={() => {
                this.setState({showDatepickerArrived: false});
              }}
              onConfirm={() => {
                this.setState({
                  deliveryArrived: moment().format('DD/MM/YYYY HH:mm:ss'),
                  showDatepickerArrived: false,
                  variableMessage: '¿Quieres confirmar fecha de llegada?',
                });
              }}
              onCancel={() => {
                this.setState({showDatepickerArrived: false});
              }}
            />
          </View>
          <View style={{width: '30%', paddingLeft: 5}}>
            <Button
              title="get-hour"
              titleStyle={{
                alignSelf: 'center',
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              }}
              onPress={() => {
                if (this.state.deliveryArrived == '') {
                  if(this.state.data.cte_type_delivery !== 'P'){
                    //BackgroundService.stop();
                    ForegroundService.stop();
                  }
                  this.updateLow({
                    deliveryArrived: moment(getDateBD()).format(
                      'DD/MM/YYYY HH:mm:ss',
                    ),
                  });
                }
              }}
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor:
                  this.state.deliveryArrived == '' ? global.COLOR_MAIN : 'gray',
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  renderDeliveryStart = () => {
    const {t} = this.props;
    return (
      <View style={{width: '100%'}}>
        {this.state.deliveryStart !== '' && (
          <Text style={{fontWeight: 'bold', fontSize: 12, marginStart: 5}}>
            {this.state.data.cte_type_delivery == 'P'
              ? t('date-picker.pickup-start')
              : t('date-picker.delivery-start')}
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: '70%',
              paddingRight: 5,
            }}>
            <DatePicker
              date={this.state.deliveryStart}
              placeholder={
                this.state.data.cte_type_delivery == 'P'
                  ? 'pickup-start'
                  : 'delivery-start'
              }
              title="select-date"
              mode="datetime"
              isDatePickerVisible={this.state.showDatepickerStart}
              maximumDate={new Date()}
              onPress={() => {
                this.setState({showDatepickerStart: false});
              }}
              onConfirm={(deliveryStart) => {
                deliveryStart = moment(deliveryStart).format(
                  'DD/MM/YYYY HH:mm:ss',
                );
                this.setState({deliveryStart, showDatepickerStart: false});
              }}
              onCancel={() => {
                this.setState({showDatepickerStart: false});
              }}
            />
          </View>
          <View style={{width: '30%', paddingLeft: 5}}>
            <Button
              title="get-hour"
              titleStyle={{
                alignSelf: 'center',
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              }}
              onPress={() => {
                if (
                  this.state.deliveryStart == '' &&
                  this.state.deliveryArrived !== ''
                ) {
                  let date = new Date();
                  date = `${JSON.stringify(date).substring(
                    0,
                    11,
                  )} ${JSON.stringify(date).substring(12, 20)}`;
                  this.updateLow({
                    deliveryStart: moment(getDateBD()).format(
                      'DD/MM/YYYY HH:mm:ss',
                    ),
                    variableMessage:
                      this.state.data.cte_type_delivery == 'P'
                        ? '¿Quieres confirmar fecha de carga?'
                        : '¿Quieres confirmar fecha de descarga?',
                  });
                }
              }}
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor:
                  this.state.deliveryStart == '' ? global.COLOR_MAIN : 'gray',
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  renderDeliveryEnd = () => {
    const {t} = this.props;
    return (
      <View style={{width: '100%'}}>
        {this.state.deliveryEnd !== '' && (
          <Text style={{fontWeight: 'bold', fontSize: 12, marginStart: 5}}>
            {this.state.data.cte_type_delivery == 'P'
              ? t('date-picker.pickup-end')
              : t('date-picker.delivery-end')}
          </Text>
        )}
        <View style={{flexDirection: 'row', margim: 5}}>
          <View
            style={{
              width: '70%',
              justifyContent: 'center',
              paddingRight: 5,
            }}>
            <DatePicker
              date={this.state.deliveryEnd}
              placeholder={
                this.state.data.cte_type_delivery == 'P'
                  ? 'pickup-end'
                  : 'delivery-end'
              }
              title="send"
              mode="datetime"
              isDatePickerVisible={this.state.showDatepickerEnd}
              maximumDate={new Date()}
              onPress={() => {
                this.setState({showDatepickerEnd: false});
              }}
              onConfirm={(deliveryEnd) => {
                deliveryEnd = moment(deliveryEnd).format('DD/MM/YYYY HH:mm:ss');
                this.setState({deliveryEnd, showDatepickerEnd: false});
                this.validate();
              }}
              onCancel={() => {
                this.setState({showDatepickerEnd: false});
              }}
            />
          </View>
          <View style={{width: '30%', paddingLeft: 5}}>
            <Button
              title="get-hour"
              titleStyle={{
                alignSelf: 'center',
                fontSize: 14,
                color: 'white',
                fontWeight: 'bold',
              }}
              onPress={() => {
                if (
                  this.state.deliveryEnd == '' &&
                  this.state.deliveryStart !== ''
                ) {
                  this.updateLow({
                    deliveryEnd: moment(getDateBD()).format(
                      'DD/MM/YYYY HH:mm:ss',
                    ),
                    variableMessage:
                      this.state.data.cte_type_delivery == 'P'
                        ? '¿Quieres confirmar fin de carga?'
                        : '¿Quieres confirmar fin de descarga?',
                  });
                }
              }}
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor:
                  this.state.deliveryEnd == '' ? global.COLOR_MAIN : 'gray',
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  verifySend = () => {
    !this.state.loading ? this.setState({show: true}) : null;
  };

  finish = async () => {
    this.validate();
    await this.verifySend();
  };

  renderButtonSend = () => {
    return (
      <View style={{marginTop: 20}}>
        <Button
          title={
            this.state.data.cte_type_delivery === 'D'
              ? this.state.verify === true
                ? 'end'
                : 'refresh'
              : this.state.verify === true
              ? 'start-trip'
              : 'refresh'
          }
          titleStyle={{
            alignSelf: 'center',
            fontSize: 14,
            color: 'white',
            fontWeight: 'bold',
          }}
          onPress={() => this.finish()}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  };
  render() {
    const {cte_type_delivery: cteTypeDelivery} = this.state.data;
    return (
      <>
        <View>
          {cteTypeDelivery ? this.renderHeaderCte() : this.renderHeader()}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.areaScroll}>
          <Loading show={this.state.loading} />
          {this.renderPhoto()}
          {this.renderName()}
          {this.renderDeliveryArrived()}
          {this.renderDeliveryStart()}
          {this.renderDeliveryEnd()}
          {this.renderModal()}
          {this.renderModalError()}
          {this.renderModalSuccess()}
          {this.renderButtonSend()}
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
    latlong: latlongSelector(state, props),
  };
};

const Low = withTranslation('screens')(LowClass);
export default connect(mapStateToProps)(Low);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  areaScroll: {
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    marginTop: 5,
  },
  containerHeader: {
    height: 70,
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width,
    marginBottom: 10,
  },
  containerHeaderItem: {
    flexDirection: 'row',
  },
  headerLabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerItem: {
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 5,
  },
  buttonStyle: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '100%',
    //marginVertical: 10,
    borderRadius: 50,
  },
  buttonIconStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 1.1,
    marginVertical: 10,
    borderRadius: 50,
  },
  textInputs: {
    width: width / 1.1,
    height: 60,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },
});

// // setLowByCte = () => {
// //   const {data, name, deliveryDate, pathDelivery, invoices} = this.state;

// //   data.canhoto_img = pathDelivery;
// //   data.nf_lat_long_entrega = this.props.latlong;
// //   data.nf_dt_entrega = this.state.deliveryDate.format('YYYY-MM-DD HH:mm:ss');
// //   //data.nf_dt_entrega = deliveryDate ? getParsedDate(deliveryDate) : '';
// //   data.nf_dt_canhoto = getDateBD();
// //   data.nf_resp_receber = name;

// //   sendLowByCte(this.props.login.moto_id, data, invoices)
// //     .then(() => {
// //       this.setState({
// //         loading: false,
// //         success: 'delivery-confirmed',
// //       });
// //       setTimeout(() => this.setState({showSuccess: true}), 500);
// //     })
// //     .catch((error) => {
// //       this.setState({loading: false, error: error.message});
// //       setTimeout(() => this.setState({showError: true}), 500);
// //     });
// // };
