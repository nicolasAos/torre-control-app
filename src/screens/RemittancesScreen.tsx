import React, {Component, useState} from 'react';
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
  Image,
  TouchableHighlight,
} from 'react-native';

import {StackActions} from 'react-navigation';
import {Card, Loading, Modal} from '../components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getCtesSupervisorOffline, getCtesRemmitances} from '../actions/driver';
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
import ScannerModal from '../components/ScannerModal';
import {withTranslation} from 'react-i18next';
import {State, TextInput} from 'react-native-gesture-handler';
// types
import {Orders, BaseOrderInterface, OrdersArr} from '../types';
// utils
import {Logger} from '../utils';

import {Mixpanel} from '../analitycs';

let dataCtesGlobal: any = []; // to filter data
const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
  t: any;
  login: {
    moto_id: string;
    user_id: string;
  };
  dispatch: () => void;
}

interface RemittancesState {
  data: [];
  dataCtes: OrdersArr;
  empresa: string;
  romId: string;
  romInicio: string;
  loading: boolean;
  show: boolean;
  showAvailable: boolean;
  showMapsAlert: boolean;
  showError: boolean;
  message: string;
  latlong: string;
  destinatario: string;
  etaDelivery: any;
  etaPickup: any;
  cteList: [];
  cteListCopy: [];
  travelsSync: [];
  renderScanner: boolean;
  searchValue: string;
  dataUser: any;
}

class RemittancesClass extends Component<Props, RemittancesState> {
  constructor(props: any) {
    super(props);
    /*
    this.state = {
      data: [],
      dataCtes: [],
      //empresa: props.navigation.getParam('empresa', ''),
      empresa: '2',
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
      cteList: [],
      cteListCopy: [],
      travelsSync: [],
      renderScanner: false,
      searchValue: '',
      dataUser: props.navigation.getParam('datosUsuario'),
    };
    */
  }

  state: RemittancesState = {
    data: [],
    dataCtes: [],
    //empresa: props.navigation.getParam('empresa', ''),
    empresa: '2',
    romId: this.props.navigation.getParam('romId', ''),
    romInicio: this.props.navigation.getParam('romInicio', ''),
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
    cteList: [],
    cteListCopy: [],
    travelsSync: [],
    renderScanner: false,
    searchValue: '',
    dataUser: this.props.navigation.getParam('datosUsuario'),
  };

  componentDidMount() {
    Logger.log('mount Remittances screen');
    Mixpanel.log('Remittances Screen Visited');
    this.props.navigation.addListener('didFocus', () => {
      this.setState({loading: true});
      this.getCtes();
      this.getEta();
    });
  }

  componentWillUnmount(): void {
    Logger.log('unmount Remittances screen');
  }

  getCtes = async () => {
    await getCtesSupervisorOffline().then((data: any) => {
      let newData: any = {};
      for (const pedido of data) {
        if (!newData[pedido.rom_id]) {
          newData[pedido.rom_id] = [];
        }
        newData[pedido.rom_id].push(pedido);
        newData[pedido.rom_id].sort(
          (a: any, b: any) => a.cte_ordem - b.cte_ordem,
        );
      }
      newData = Object.values(newData);
      let finalArr: OrdersArr = [];
      for (const arrPedido of newData) {
        arrPedido.map((item: any) => {
          finalArr.push(item);
        });
      }

      dataCtesGlobal = [...finalArr];

      /**
       * TODO:
       * [ ]: remove this filter below
       */
      this.setState({
        //data: data,
        dataCtes: finalArr, //finalArr.filter((D: any) => D.tipo_pedido === 'E'), //finalArr,
        loading: false,
      });

      this.getEta();
      setTimeout(() => this.setState({show: data.travelFinished}), 500);
    });

    /*await getCtesRemmitances(this.props.login.moto_id).then(
      (data) => {
        this.setState({
          //data: data,
          dataCtes: data,
          loading: false,
        });

        this.getEta();
        setTimeout(() => this.setState({show: data.travelFinished}), 500);
      },
    );*/
  };

  /**
   * Filter package types by type
   * @param type Package
   */
  filterItems(type: Orders) {
    Logger.log(`filter items: ${type}`);
    if (type === 'E') {
      // show remesas
      const dataCtes = dataCtesGlobal.filter(
        (D: any) => D.tipo_pedido === type,
      );
      console.log(dataCtes);
      console.log(dataCtes.length);
      this.setState({dataCtes});
    } else if (type === 'R') {
      // show red
      const dataCtes = dataCtesGlobal.filter(
        (D: any) => D.tipo_pedido === type,
      );
      console.log(dataCtes);
      console.log(dataCtes.length);
      this.setState({dataCtes});
    } else if (type === 'O') {
      // show colectas
      const dataCtes = dataCtesGlobal.filter(
        (D: any) => D.tipo_pedido === type,
      );
      console.log(dataCtes);
      console.log(dataCtes.length);
      this.setState({dataCtes});
    } else {
      // show all
      const dataCtes = dataCtesGlobal;
      console.log(dataCtes);
      console.log(dataCtes.length);
      this.setState({dataCtes});
    }
  }

  getEta = () => {
    this.setState({
      cteList: this.state.dataCtes, //this.state.data.ctesKeys,
      cteListCopy: this.state.dataCtes, //this.state.data.ctesKeys,
    });
  };

  /*await getCtesRemmitances(this.props.login.moto_id).then(
      (data) => {
        this.setState({
          //data: data,
          dataCtes: data,
          loading: false,
        });

        this.getEta();
        setTimeout(() => this.setState({show: data.travelFinished}), 500);
      },
    );*/

  submitFinishTravel = () => {
    const item = this.state.data;
    item.rom.rom_lat_long_fim = this.props.latlong;
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

  submitPhone = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  getTypeBackground = (
    tipo: Orders,
    tiempo: any,
    cadena_frio: string,
    cita: any,
    cita_tiempo: any,
  ) => {
    if (cadena_frio !== 'N') {
      return '#5294e2';
    }
    switch (tipo) {
      case 'E':
        if (cita == 'S') {
          const currentTime = moment(new Date());
          const citaTime = moment(cita_tiempo);
          const duration = moment
            .duration(citaTime.diff(currentTime))
            .asHours();
          if (duration < 0) {
            return '#f44269';
          }
          return '#42c790';
        }
        return 'white';
      case 'R':
        return global.COLOR_CARD_GRAY;
      case 'O':
        const initialTime = moment(new Date());
        const endTime = moment(tiempo);
        const duration = moment.duration(endTime.diff(initialTime)).asHours();
        if (duration >= 3) {
          return '#22B14C';
        } else if (duration < 3 && duration > 1) {
          return '#F7AE17';
        } else if (duration <= 1) {
          return '#ED1C24';
        }
        break;
    }
  };

  refreshCtes = async () => {
    this.setState({loading: true});
    await getCtesRemmitances(this.props.login.moto_id);
    await this.getCtes();
  };

  renderHeader = () => {
    const {t} = this.props;
    if (this.state.dataCtes.length === 0) {
      return;
    }
    return (
      <View style={styles.containerHeader}>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.date-init')}:</Text>
          <Text style={styles.headerItem}>
            {moment(this.state.dataCtes[0].rom_dt_manifesto).format(
              'DD/MM/YYYY HH:mm',
            )}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>
            {t('ctes.number_spreadsheets')}:
          </Text>
          <Text style={styles.headerItem}>
            {this.state.dataCtes[0].total_planilla}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>
            {t('ctes.processed_documents')}:
          </Text>
          <Text style={styles.headerItem}>
            {this.state.dataCtes[0].doc_procesados}
          </Text>
        </View>
        <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.boxes_delivered')}:</Text>
          <Text style={styles.headerItem}>
            {this.state.dataCtes[0].cajas_entregadas}
          </Text>
        </View>
        {/* <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.spreadsheet')}:</Text>
          <Text style={styles.headerItem}>{this.state.dataCtes.rom_id}</Text>
        </View> */}
        {/* <View style={styles.containerHeaderItem}>
          <Text style={styles.headerLabel}>{t('ctes.manifest')}:</Text>
          <Text style={styles.headerItem}>
            {this.state.dataCtes.rom_manifesto}
          </Text>
        </View> */}
      </View>
    );
  };

  handleTheRoute = (item: BaseOrderInterface) => {
    this.setState({searchValue: ''});
    switch (item.tipo_pedido) {
      case 'E':
        // remesa
        this.props.navigation.navigate('RemissionStack', {
          //empresa: this.state.empresa,
          cteId: item.nf_id, // item.cte_numero,
          itemSignature: '',
          sacMenu: 4,
          userId: this.props.login.user_id,
          //romId: this.state.romId,
          //romInicio: this.state.romInicio,
        });
        break;
      case 'R':
        // red
        this.props.navigation.navigate('pickingStack', {
          //empresa: this.state.empresa,
          cteId: item.nf_id,
          moto_id: this.props.login.moto_id,
          sacMenu: 5,
          userId: this.props.login.user_id,
          // item.cte_numero,
          //romId: this.state.romId,
          //romInicio: this.state.romInicio,
        });
        break;
      case 'O':
        // colecta
        this.props.navigation.navigate('colectasStack', {
          cteId: item.nf_id,
          moto_id: this.props.login.moto_id,
          sacMenu: 3,
          userId: this.props.login.user_id,
        });
        break;
    }
    /*if (item.isClosedCte) {
      return null;
    }*/

    // if (item.ctes.cte_type_delivery) {
    //   this.props.navigation.navigate('invoicesByCteStack', {
    //     //empresa: this.state.empresa,
    //     cteId: item.ctes.cte_id,
    //   });
    //   return;
    // }
  };

  renderItems = ({item, index}: any) => {
    const {t} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.estado_pedido !== 'C') {
            this.handleTheRoute(item);
          }
        }}
        key={`${item.nf_id.toString()}${item.cte_numero.toString()}${index}`}>
        <Card containerStyle={styles.card}>
          <View style={styles.containerTitle}>
            <View style={styles.containerIconTitle}>
              {item.cadena_frio !== 'N' && item.nf_cli_vip !== 1 && (
                <Image
                  source={require('../imgs/cadena_frio.png')}
                  style={{width: 30, height: 30}}
                />
              )}
              {item.nf_cli_vip == 1 ? (
                <FontAwesome
                  name="star"
                  color="#ffff00"
                  size={22}
                  style={{alignSelf: 'center'}}
                />
              ) : (
                <View />
              )}
              <Text style={styles.title}>{item.nf_id}</Text>
              <>
                {item.estado_pedido == 'C' && (
                  <FontAwesome
                    name="check-square"
                    color="green"
                    size={22}
                    style={{alignSelf: 'center'}}
                  />
                )}
                {item.estado_pedido !== 'C' && (
                  <FontAwesome
                    name={'warning'}
                    color={'transparent'}
                    size={22}
                    style={{alignSelf: 'center'}}
                  />
                )}
              </>
            </View>
          </View>
          <View
            style={[
              styles.containerBody,
              {
                backgroundColor: this.getTypeBackground(
                  item.tipo_pedido,
                  item.cte_previsao,
                  item.cadena_frio,
                  item.movilidad_cita,
                  item.cte_data_agenda,
                ),
              },
            ]}>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.client')}: </Text>
              <Text>{item.cliente}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.recipient')}: </Text>
              <Text>{item.destinatario}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.addressee')}: </Text>
              <Text>{item.direccion}</Text>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{t('ctes.eta')}: </Text>
              <Text>{item.date_eta}</Text>
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  search = (s: string) => {
    let arr = this.state.cteList;
    let newArr = arr.filter((d: BaseOrderInterface) => d.nf_id.includes(s));
    this.setState({
      cteListCopy: newArr,
      searchValue: s,
    });
  };

  searching = () => {
    if (this.state.searchValue == '') {
      return this.state.cteList;
    }
    return this.state.cteList.filter((d) =>
      d.nf_id.includes(this.state.searchValue),
    );
  };

  onModalScan = (data: any) => {
    this.search(data);
    this.setState({renderScanner: false});
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

  renderListo = () => {
    return (
      <ScrollView style={{width: '100%'}}>
        {this.state.searchingLoader && (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text>Buscando...</Text>
          </View>
        )}
        {this.searching().map((item, index) => {
          return (
            <View
              key={`${item.nf_id}-${item.cte_numero}-${index}`}
              style={{width: '100%', alignItems: 'center'}}>
              {this.renderItems(item)}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  renderList = () => {
    return (
      <FlatList
        data={this.state.cteListCopy}
        renderItem={this.renderItems}
        keyExtractor={(item: BaseOrderInterface, index) =>
          `${item.nf_id.toString()}${item.cte_numero.toString()}${index}`
        }
        onRefresh={this.refreshCtes}
        refreshing={this.state.loading}
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%', alignItems: 'center'}}
      />
    );
  };

  renderFooter = () => {
    return (
      <View
        style={{
          position: 'absolute',
          flex: 0.1,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          flexDirection: 'row',
          height: 60,
          alignItems: 'center',
        }}>
        <TouchableHighlight
          style={styles.bottomButtons}
          onPress={() => {
            this.props.navigation.navigate('PedidosCompletoNovedadScreen', {
              namePed: 'Pedidos completos',
              dataUser: this.state.dataUser,
            });
          }}>
          <Text style={styles.footerText}>
            {' '}
            <Image
              style={{width: 15, height: 15}}
              source={require('../imgs/check-travel.png')}
            />{' '}
            Pedidos completos
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.bottomButtons}
          onPress={() =>
            this.props.navigation.navigate('PedidosCompletoNovedadScreen', {
              namePed: 'Pedidos con incidencia',
              dataUser: this.state.dataUser,
            })
          }>
          <Text style={styles.footerText}>
            {' '}
            <Image
              style={{width: 15, height: 15}}
              source={require('../imgs/message-notification.png')}
            />{' '}
            Pedidos con incidencia
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderModalFinishTravel = () => {
    if (this.state.data && 1 == 2 /*this.state.data.travelFinished*/) {
      return (
        <Modal
          isVisible={this.state.show}
          title="attention"
          bodyText={'all-ctes-completed'}
          buttons={[
            {
              onPress: () => {
                this.setState({show: false});
                setTimeout(
                  () =>
                    this.setState({loading: true}, () =>
                      this.submitFinishTravel(),
                    ),
                  500,
                );
              },
              text: 'ok-got-it',
              backgroundColor: global.COLOR_MAIN,
            },
          ]}
        />
      );
    }
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
            text: 'yes',
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
        {/*__DEV__
          ? ['E', 'R', '0', 'ALL'].map((val, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => this.filterItems(val)}>
                <View>
                  <Text>{val}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        : null*/}
        {this.renderModalFinishTravel()}
        {this.renderModalError()}
        {this.renderModalAvailable()}
        {this.renderModalMaps()}
        {this.renderList()}
        {this.renderFooter()}
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

const mapStateToProps = (state: RemittancesState, props: Props) => {
  return {
    login: loginSelector(state, props),
    latlong: latlongSelector(state),
    cnh: cnhSelector(state),
    veihicles: vehiclesSelector(state),
    etaCalculation: etaCalculationSelector(state, props),
  };
};

const Remittances = withTranslation('screens')(RemittancesClass);
export default connect(mapStateToProps)(Remittances);

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
    overflow: 'hidden',
  },
  containerTitle: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 40,
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
    height: 95,
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
  },
  containerBodyGray: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
    backgroundColor: global.COLOR_TITLE_CARD,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 14,
  },
});
