import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Linking,
  Platform,
} from 'react-native';

import {StackActions} from 'react-navigation';
import {
  Card,
  Loading,
  Modal,
  DoubleButtonRedirecting,
  Button,
} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  getCtesOffline,
  getLowOffline,
  getCtesRemmitances,
  getLowOnline,
  getCheckIn,
} from '../actions/driver';

import {finishedTransport} from '../actions/transport';
import {
  latlongSelector,
  loginSelector,
  cnhSelector,
  vehiclesSelector,
  etaCalculationSelector,
} from '../reducers/selectors';
import moment from 'moment';
import {getDateBD, isObjectEmpty} from '../configs/utils';
import {sendLow} from '../actions/low';
import {withTranslation} from 'react-i18next';
// import i18n from '../locales';
// import etaCalculation from '../reducers/etaCalculation';
import {TextInput} from 'react-native-gesture-handler';
// import {CURRENT_TRIP, IS_TRAVEL} from '../actions/types';
// import {syncTravelData} from '../actions/syncTravelsManual';
import ScannerModal from '../components/ScannerModal';
import BackgroundTimer from 'react-native-background-timer';
const {width} = Dimensions.get('window');
// import {getTerm} from '../actions/term';
//
import {Mixpanel} from '../analitycs';
// utils
import {Logger} from '../utils';

interface Props {
  navigation: any;
}

class CTesClass extends Component<Props> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      //empresa: props.navigation.getParam('empresa', ''),
      romId: props.navigation.getParam('romId', ''),
      romInicio: props.navigation.getParam('romInicio', ''),
      loading: true,
      show: false,
      showAvailable: false,
      showMapsAlert: false,
      showError: false,
      message: '',
      latlong: '',
      destinatario: '',
      etaDelivery: null,
      etaPickup: null,
      cteList: '',
      cteListCopy: '',
      searchValue: '',
      lowCte: [],
      globalError: '',
      endModal: false,
      reporteSacInfo: '',
      fechaDeInicioViaje: '',
      bandera: true,
    };
  }

  componentDidMount() {
    Mixpanel.log('CTes Screen Visited');
    Logger.log(`mount CTes screen`);
    this.props.navigation.addListener('didFocus', () =>
      this.setState({loading: true}, () => this.getCtes()),
    );
    this.updateDataContinue();
  }

  componentWillUnmount() {
    Logger.log(`unmount CTes screen`);
    clearTimeout(this.updateDataContinue);
  }

  updateDataContinue = () => {
    return setInterval(() => {
      this.setState({loading: true});
      this.getCtes();
    }, 60000); // min
  };

  /**
   * Get Ctes
   */
  getCtes = async () => {
    Logger.log('getCtes');
    this.setState({searchValue: ''});
    let sacTemp = [];
    let timeTemp = [];
    // get smth from realm
    await getCtesOffline(this.props.login.moto_id, this.state.romId).then(
      async (dataCte) => {
        for (const lowPedido of dataCte.ctesKeys) {
          try {
            let newData = await getLowOnline(
              this.state.romId,
              lowPedido.ctes.cte_type_delivery,
              lowPedido.ctes.cte_ordem,
            );
            if (
              newData.dt_llegada &&
              newData.dt_descargando_carg &&
              newData.dt_fin_descargue &&
              !lowPedido.isClosedCte
            ) {
              newData.nf_dt_llegada = newData.dt_llegada;
              newData.nf_dt_descargando = newData.dt_descargando_carg;
              newData.nf_dt_entrega = newData.dt_fin_descargue;
              newData.cte_info_controle =
                newData.cte_type_delivery + newData.cte_ordem;
              newData.nf_dt_canhoto = getDateBD();
              newData.nf_dt_inicio_viaje_p = newData.inicio_viaje_p;
              const lowById = await getLowOffline(
                lowPedido.ctes.nf_type_number,
              );
              const idBanco = lowById?.id ? lowById.id : null;
              newData.cte_chave = newData.cte_info_controle;
              newData.idBanco = idBanco;
              newData.photos = [];
              newData.update_or_end = true;
              newData.nf_type_number = lowPedido.ctes.nf_type_number;
              newData.nf_resp_receber = 'Actualizacion local';
              await sendLow(
                this.props.login.moto_id,
                newData,
                this.props.user_id,
              );
              await getCheckIn(newData.moto_id, {
                chave_cte: newData.cte_type_delivery + newData.cte_ordem,
                cte: lowPedido.ctes.cte_type_delivery,
                cte_id: lowPedido.ctes.cte_numero,
              });
            }
            sacTemp = [...sacTemp, newData.date_eta];
            timeTemp = [
              ...timeTemp,
              newData.inicio_viaje_p && newData.inicio_viaje_p,
            ];
          } catch (e) {
            console.log('network err', e);
          }
        }
      },
    );
    // get smth from realm
    await getCtesOffline(this.props.login.moto_id, this.state.romId).then(
      async (data) => {
        let getLow = [];
        let idLow = 0;
        for (const lowPedido of data.ctesKeys) {
          if (lowPedido.ctes.cte_type_delivery == 'P') {
            getLow[0] = await getLowOffline(lowPedido.ctes.nf_type_number);
            idLow = lowPedido.ctes.nf_type_number;
            if (!getLow[0]) {
              getLow = [];
            } else {
              getLow[0] = {
                ...getLow[0],
                fecha_salida: lowPedido.ctes.inicio_viaje_p,
              };
            }
            break;
          }
        }
        // const datosAMostrar = data.ctesKeys.filter(dato => !dato.ctes.inicio_viaje_p);
        // console.log("Datos a mostrar", datosAMostrar);
        // data.ctesKeys = datosAMostrar;
        // console.log();
        this.setState({
          data: data,
          loading: false,
          lowCte: getLow,
          idNf: idLow,
          reporteSacInfo: sacTemp,
          fechaDeInicioViaje: timeTemp,
        });
        this.getEta();
        setTimeout(() => this.setState({show: data.travelFinished}), 500);
      },
    );
  };

  startTrip = async () => {
    Logger.log('startTrip');
    Mixpanel.log('Start Trip');
    this.setState({loading: true});
    let newItem = this.state.lowCte[0];
    newItem.cte_chave = newItem.cte_info_controle;
    newItem.nf_dt_inicio_viaje_p = getDateBD();
    newItem.idBanco = newItem.id;
    newItem.photos = [];
    await sendLow(this.props.login.moto_id, newItem, this.props.user_id);
    await this.getCtes();
    this.setState({loading: false});
  };

  getEta = () => {
    this.setState({
      cteList: this.state.data.ctesKeys,
      cteListCopy: this.state.data.ctesKeys,
    });
  };

  onModalScan = (data, type) => {
    this.search(data);
    this.setState({renderScanner: false});
  };

  submitFinishTravel = async () => {
    BackgroundTimer.stopBackgroundTimer();
    const item = this.state.data;
    item.rom.rom_lat_long_fim = item.rom.cte_local_entrega;
    item.rom.rom_resp_fim = this.props.login.moto_nome;
    item.rom.rom_fim_transp = getDateBD();
    this.props
      .dispatch(finishedTransport(this.props.login.moto_id, item))
      .then(() => {
        if (!isObjectEmpty(this.props.cnh) && this.props.veihicles.length > 0) {
          this.setState({loading: false});
          setTimeout(() => this.setState({showAvailable: true}), 500);
        } else {
          this.setState({loading: false}, () =>
            this.props.navigation.dispatch(StackActions.pop({n: 2})),
          );
        }
      })
      .catch((error) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showError: true}), 500);
      });
  };

  submitMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = this.state.latlong;
    const label = this.state.destinatario;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  submitPhone = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  renderHeader = () => {
    const {t} = this.props;
    if (this.state.data.length === 0) {
      return;
    }
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.spreadsheet')}:</Text>
          <Text style={styles.headerItem}>{this.state.data.rom.rom_id}</Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.manifest')}:</Text>
          <Text style={styles.headerItem}>
            {this.state.data.rom.rom_manifesto}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.date-init')}:</Text>
          <Text style={styles.headerItem}>
            {moment(this.state.data.rom.rom_dt_manifesto).format(
              'DD/MM/YYYY HH:mm',
            )}
          </Text>
        </View>
      </View>
    );
  };

  showButton = () => {
    if (
      this.state.lowCte.length !== 0 &&
      !this.state.lowCte[0].inicio_viaje_p &&
      this.state.data.ctesKeys[1].isClosedCte
    ) {
      if (this.state.fechaDeInicioViaje[1] && this.state.bandera) {
        this.startTrip(this.state.data.ctesKeys[1].ctes);
        this.setState({bandera: false});
        // return null;
      }

      return (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <Button
            onPress={() => {
              this.startTrip(this.state.data.ctesKeys[1].ctes);
            }}
            title="Iniciar viaje"
            titleStyle={{
              alignSelf: 'center',
              fontSize: 14,
              color: 'white',
              fontWeight: 'bold',
            }}
            buttonStyle={[
              styles.buttonStyle,
              {backgroundColor: global.COLOR_MAIN},
            ]}
            disabled={false}
          />
        </View>
      );
    }
    return null;
  };
  handleTheRoute = (item: any) => {
    Logger.log(`item tapped`);
    if (item.isClosedCte) {
      return null;
    }

    if (this.state.cteList.length >= 2 && item.ctes.cte_type_delivery === 'D') {
      if (
        this.state.lowCte.length == 0 ||
        this.state.lowCte[0]?.inicio_viaje_p == null
      ) {
        for (const pedido of this.state.cteList) {
          if (pedido.isOccurrence) {
            this.props.navigation.navigate('invoicesStack', {
              //empresa: this.state.empresa,
              cteId: item.ctes.cte_numero,
              romId: this.state.romId,
              romInicio: this.state.romInicio,
              ordem: item.ctes.cte_ordem,
              type: item.ctes.cte_type_delivery,
            });
            return;
          }
        }
        this.setState({globalError: 'blockbypickup'});
        return;
      }
    }

    this.props.navigation.navigate('invoicesStack', {
      //empresa: this.state.empresa,
      cteId: item.ctes.cte_numero,
      romId: this.state.romId,
      romInicio: this.state.romInicio,
    });

    // if (item.ctes.cte_type_delivery) {
    //   this.props.navigation.navigate('invoicesByCteStack', {
    //     //empresa: this.state.empresa,
    //     cteId: item.ctes.cte_id,
    //   });
    //   return;
    // }
  };

  renderItems = ({item, index}) => {
    const {t} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          if (
            this.state.lowCte.length !== 0 &&
            !this.state.lowCte[0].inicio_viaje_p &&
            this.state.data.ctesKeys[1].isClosedCte
          ) {
            Logger.log('need to start travel');
          } else {
            this.handleTheRoute(item);
          }
        }}
        key={`${item.ctes.cte_id}-${item.cte_numero}`}>
        <Card containerStyle={styles.card}>
          <View style={styles.containerTitle}>
            <View style={styles.containerIconTitle}>
              {item.ctes.nf_cli_vip == 1 ? (
                <FontAwesome
                  name="star"
                  color="#ffff00"
                  size={22}
                  style={{alignSelf: 'center'}}
                />
              ) : (
                <View />
              )}
              <Text style={styles.title}>{item.ctes.nf_id}</Text>
              {item.isClosedCte ? (
                <>
                  {!item.isOccurrence ? (
                    <FontAwesome
                      name="check-square"
                      color="green"
                      size={22}
                      style={{alignSelf: 'center'}}
                    />
                  ) : (
                    <FontAwesome
                      name="check-square"
                      color="green"
                      size={22}
                      style={{alignSelf: 'center'}}
                    />
                  )}
                </>
              ) : (
                <>
                  {!item.isStart ? (
                    <FontAwesome
                      name={'exclamation-circle'}
                      color={'#daa520'}
                      size={22}
                      style={{alignSelf: 'center'}}
                    />
                  ) : (
                    <View />
                  )}
                </>
              )}
            </View>
          </View>
          <View style={styles.containerBody}>
            <View style={{width: '100%', alignItems: 'center', padding: 5}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#5BB85D',
                }}>
                {item.ctes.cte_type_delivery !== 'P'
                  ? t('ctes.delivery')
                  : t('ctes.pickup')}
              </Text>
            </View>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.client')}: </Text>
              <Text>{item.ctes.remetente}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.addressee')}: </Text>
              <Text>{item.ctes.direccion}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.destination')}: </Text>
              <Text>
                {item.ctes.cte_type_delivery == 'P'
                  ? item.ctes.rom_origem
                  : item.ctes.rom_destino}
              </Text>
            </Text>
            {/* <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.volumes')}: </Text>
              <Text>{item.volTotal}</Text>
            </Text> */}
            <Text style={styles.text}>
              {/* <Text style={styles.label}>{t('ctes.scheduling')}: </Text> */}
              <Text style={styles.label}>
                Fecha de{' '}
                {item.ctes.cte_type_delivery !== 'P'
                  ? t('ctes.delivery')
                  : t('ctes.pickup')}
                :{' '}
              </Text>
              <Text>
                {item.ctes.cte_data_agenda
                  ? moment(
                      item.ctes.cte_data_agenda.substr(
                        0,
                        item.ctes.cte_data_agenda.length - 7,
                      ),
                    ).format('DD/MM/YYYY')
                  : ''}{' '}
                {item.ctes.cte_data_agenda
                  ? JSON.stringify(item.ctes.cte_data_agenda)
                      .substring(12)
                      .slice(0, -15)
                  : ''}
              </Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.eta')}: </Text>
              <Text>
                {this.state.reporteSacInfo && this.state.reporteSacInfo[index]
                  ? moment(this.state.reporteSacInfo[index]).format(
                      'DD/MM/YYYY',
                    )
                  : ''}
                {this.state.reporteSacInfo && this.state.reporteSacInfo[index]
                  ? ' ' +
                    JSON.stringify(this.state.reporteSacInfo[index])
                      .substring(12)
                      .slice(0, 5)
                  : ''}
              </Text>
            </Text>
            {/* <View>
              {item.ctes.cte_type_delivery === 'P' ? (
                <Text style={styles.text}>
                  <Text style={styles.label}>{t('ctes.eta')}: </Text>
                  <Text>
                    {this.state.eta[0].date_eta}

                  </Text>
                </Text>
              ) : (
                <Text style={styles.text}>
                  <Text style={styles.label}>{t('ctes.eta')}: </Text>
                  <Text>
                  {this.state.eta[0].date_eta}

                  </Text>
                </Text>
              )}
            </View> */}

            {/* <View style={styles.viewTypeLow}>
              {/* <FontAwesome5
                name={item.ctes.cte_type_delivery ? 'copy' : 'file-alt'}
                color={global.COLOR_GRE_DARK}
                size={35}
              />
              <Text style={styles.viewTypeLowText}>
                {item.ctes.cte_type_delivery ? 'CT-e' : 'NF-e'}
              </Text>
            </View> */}
          </View>
          {/* <View style={styles.bodyBottomCard}>
            <DoubleButtonRedirecting
              onPressLeft={() =>
                this.submitPhone(item.ctes.cte_tel_destinatario)
              }
              onPressRight={() =>
                this.setState({
                  showMapsAlert: true,
                  latlong: item.ctes.cte_local_entrega,
                  destinatario: item.ctes.destinatario,
                })
              }
            />
          </View> */}
        </Card>
      </TouchableOpacity>
    );
  };
  search = (s) => {
    let arr = JSON.parse(JSON.stringify(this.state.cteList));
    this.setState({
      cteListCopy: arr.filter((d) => d.ctes.nf_id.includes(s)),
      searchValue: s,
    });
  };

  renderSearch = () => {
    const {t} = this.props;
    return (
      <View style={styles.search}>
        <TouchableOpacity
          onPress={() => {
            this.setState({renderScanner: true});
          }}>
          <FontAwesome5 name="barcode" size={25} color="#aaa" />
        </TouchableOpacity>
        <TextInput
          //style={styles.search}
          value={this.state.searchValue}
          placeholderTextColor="#aaa"
          placeholder={t('ctes.search')}
          onChangeText={(s) => this.search(s)}
        />
      </View>
    );
  };
  renderList = () => {
    return (
      <FlatList
        data={this.state.cteListCopy}
        renderItem={this.renderItems}
        keyExtractor={(item) => item.ctes.cte_numero.toString()}
      />
    );
  };

  renderModalFinishTravel = () => {
    if (this.state.data && this.state.data.travelFinished) {
      return (
        <Modal
          isVisible={this.state.show}
          title="attention"
          bodyText={'all-ctes-completed'}
          buttons={[
            {
              onPress: async () => {
                this.setState({show: false, loading: true});
                await this.submitFinishTravel();
              },
              text: 'ok-got-it',
              backgroundColor: global.COLOR_MAIN,
            },
          ]}
        />
      );
    }
  };

  renderGlobalError = () => {
    return (
      <Modal
        isVisible={this.state.globalError !== ''}
        title="attention"
        bodyText={this.state.globalError}
        buttons={[
          {
            onPress: () => {
              this.setState({globalError: ''});
            },
            text: 'Ok, entendi',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalError = () => {
    return (
      <Modal
        isVisible={this.state.showError}
        title="attention"
        bodyText={`${this.state.message}. press-the-button`}
        buttons={[
          {
            onPress: () => {
              this.setState({showError: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () =>
                    this.submitFinishTravel(),
                  ),
                500,
              );
            },
            text: 'Ok, entendi',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalAvailable = () => {
    return (
      <Modal
        isVisible={this.state.showAvailable}
        title="Attention"
        bodyText={'hello-driver-avaliable'}
        buttons={[
          {
            onPress: () =>
              this.setState({showAvailable: false}, () =>
                this.props.navigation.dispatch(StackActions.pop({n: 2})),
              ),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () =>
              this.setState({showAvailable: false}, () => {
                this.props.navigation.dispatch(StackActions.popToTop());
                this.props.navigation.navigate('freightWishStack');
              }),
            text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalMaps = () => {
    return (
      <Modal
        isVisible={this.state.showMapsAlert}
        title="attention"
        bodyText={'sponsor-mobile-data'}
        buttons={[
          {
            onPress: () => this.setState({showMapsAlert: false}),
            text: 'no',
            backgroundColor: 'red',
          },
          {
            onPress: () =>
              this.setState({showMapsAlert: false}, () => this.submitMaps()),
            Text: 'yes',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        {this.renderHeader()}
        {this.renderSearch()}
        {this.showButton()}
        {this.renderModalFinishTravel()}
        {this.renderModalError()}
        {this.renderModalAvailable()}
        {this.renderModalMaps()}
        {this.renderGlobalError()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderList()}
        </ScrollView>
        <ScannerModal
          scanCallback={this.onModalScan}
          isVisible={this.state.renderScanner}
          OnCloseModal={() => {
            this.setState({renderScanner: false});
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    login: loginSelector(state, props),
    latlong: latlongSelector(state),
    cnh: cnhSelector(state),
    veihicles: vehiclesSelector(state),
    etaCalculation: etaCalculationSelector(state, props),
  };
};

const CTes = withTranslation('screens')(CTesClass);
export default connect(mapStateToProps)(CTes);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    width: width / 1.1,
    borderRadius: 20,
  },
  containerTitle: {
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerIconTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerBody: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  containerHeader: {
    height: 80,
    backgroundColor: global.COLOR_TOOLBAR,
    padding: 10,
    width,
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
  text: {
    margin: 2,
    fontSize: 15,
  },
  bodyBottomCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  viewTypeLow: {
    width: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginRight: 10,
    marginBottom: 10,
    right: 0,
    bottom: 0,
  },
  viewTypeLowText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 15,
    color: 'black',
    elevation: 2,
  },
  buttonStyle: {
    width: width / 2.7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 50,
  },
});
