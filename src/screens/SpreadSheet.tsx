import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {StackActions} from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Card, Button, Modal, Loading} from '../components';
import {startTransportTorre, finishedTransport} from '../actions/transport';
import {getSpreadSheetsOffline} from '../actions/driver';
import {
  loginSelector,
  latlongSelector,
  deviceIdSelector,
} from '../reducers/selectors';
import {getDateBD} from '../configs/utils';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import BackgroundServiceNative from 'react-native-background-actions';
//import BackgroundTimer from 'react-native-background-timer';
import {sendLocationPrime} from '../actions/geolocation';
//
import {Mixpanel} from '../analitycs';
// utils
import {
  Logger,
  Location,
  sleep,
  ForegroundService,
  Permissions,
} from '../utils';

const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
  latlong: any;
  login: any;
  dispatch: any;
  t: any;
}

class SpreadSheetClass extends Component<Props> {
  constructor(props: any) {
    super(props);
    this.state = {
      empresa: props.navigation.getParam('empresa', ''),
      show: false,
      item: '',
      loading: true,
      showMessage: false,
      showFinished: false,
      showFinishedSuccess: false,
      data: {},
      startTravel: '',
      banderaViajes: true,
    };
  }

  async componentDidMount() {
    Mixpanel.log('SpreadSheet Screen Visited');
    Logger.log(`mount SpreadSheet screen`);
    this.props.navigation.addListener('didFocus', async () => {
      this.getSpreadSheets();
    });
  }

  componentWillUnmount(): void {
    Logger.log(`unmount SpreadSheet screen`);
  }

  /**
   * getSpreadSheets
   */
  getSpreadSheets = async () => {
    this.setState({loading: true});
    // get smth from realm
    await getSpreadSheetsOffline(this.props.login.moto_id)
      .then((data) => {
        this.setState({data: data, loading: false});
      })
      .catch((e) => {
        this.setState({loading: false});
      });
  };

  onModalScan = (data: any, type: any) => {
    this.search(data);
    this.setState({renderScanner: false});
  };

  /**
   * Start travel
   */
  startTravel = async () => {
    Logger.log(`start travel`);
    Mixpanel.log('Start Travel');
    // ask permission
    //const result = await Permissions.askBackgroundLocation();
    //console.log({result})
    //if(!result){
    //return
    //}
    const item = this.state.item;
    item.rom.rom_lat_long_inicio = this.props.latlong;
    item.rom.rom_device_id = this.props.login.user_id;
    item.rom.rom_chat_key = '';
    item.rom.rom_inicio_transp = getDateBD();

    this.props
      .dispatch(startTransportTorre(this.props.login.moto_id, item))
      .then(() => {
        this.sendLocationEveryMinute(item);
        this.setState({loading: false, startTravel: getDateBD()}, () =>
          this.props.navigation.navigate('ctesStack', {
            empresa: this.state.empresa,
            romId: this.state.item.rom.rom_id,
            romInicio: this.state.startTravel,
          }),
        );
      })
      .catch((error: any) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showMessage: true}), 500);
      });
  };

  finished = () => {
    const item = this.state.item;
    item.rom.rom_lat_long_fim = this.props.latlong;
    item.rom.rom_resp_fim = this.props.login.moto_nome;
    item.rom.rom_fim_transp = getDateBD();

    this.props
      .dispatch(finishedTransport(this.props.login.moto_id, item))
      .then(() => {
        this.setState({loading: false});
        setTimeout(() => this.setState({showFinishedSuccess: true}), 500);
      })
      .catch((error) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showMessage: true}), 500);
      });
  };

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.show}
        title="attention"
        bodyText="start-the-journey"
        buttons={[
          {
            onPress: () => this.setState({show: false}),
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({show: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () => {
                    this.startTravel();
                  }),
                500,
              );
            },
            text: 'start',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalMessage = () => {
    return (
      <Modal
        isVisible={this.state.showMessage}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => this.setState({showMessage: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalFinished = () => {
    return (
      <Modal
        isVisible={this.state.showFinished}
        title="attention"
        bodyText="end-trip"
        buttons={[
          {
            onPress: () => this.setState({showFinished: false}),
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({showFinished: false});
              setTimeout(
                () => this.setState({loading: true}, () => this.finished()),
                500,
              );
            },
            text: 'end-trip',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalFinishedSuccess = () => {
    return (
      <Modal
        isVisible={this.state.showFinishedSuccess}
        title="attention"
        bodyText="finished trip"
        buttons={[
          {
            onPress: () => {
              this.setState({showFinishedSuccess: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () =>
                    this.props.navigation.dispatch(StackActions.pop()),
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
  };

  handleStartedTravel = () => {};

  async sendLocationTask(taskDataArguments: any) {
    Logger.log('sendLocationTask');
    const {delay, coords, romDeviceId, item} = taskDataArguments;
    try {
      await new Promise(async (resolve) => {
        for (let i = 0; BackgroundServiceNative.isRunning(); i++) {
          const coords = await Location.getCurrentPosition(false);
          if (coords) {
            sendLocationPrime(
              coords,
              this.props.login.user_id,
              item.rom.placa,
              romDeviceId,
            );
          } else {
            Logger.log('location is undefined');
          }
          await sleep(delay);
        }
        resolve(true);
      });
    } catch (error) {
      Logger.recordError(error);
    }
  }

  async sendLocationEveryMinute(item: any) {
    const _item = item ? item : this.state.item;
    const romDeviceId = _item.rom.rom_device_id;
    // start the task here
    ForegroundService.start(
      this.props.login.user_id,
      item.rom.placa,
      romDeviceId,
    );
    /*
    const coords = await Location.getCurrentPosition();
    if (coords) {
      BackgroundService.start(() =>
        this.sendLocationTask({delay: 60000, coords, romDeviceId, item: _item}),
      );
    } else {
      Logger.log('no location available');
    }
    */
  }

  /**
   * Nacionales
   * @param param0
   * @returns
   */
  renderItems = ({item, index}: any) => {
    const {t} = this.props;

    return (
      <TouchableOpacity
        onPress={
          !item.startedTravel
            ? item.travels
              ? () =>
                  this.setState({
                    showMessage: true,
                    message: 'end-the-trip-started',
                  })
              : () => this.setState({show: true, item})
            : !item.close
            ? () => {
                //this.sendLocationEveryMinute(item);
                this.props.navigation.navigate('ctesStack', {
                  empresa: this.state.empresa,
                  romId: item.rom.rom_id,
                  romInicio: item.rom.rom_inicio_transp,
                });
              }
            : () => {}
        }
        key={String((Math.random() * 0xffffff) << 0)}>
        <Card containerStyle={styles.card}>
          <View style={styles.containerTitle}>
            <View style={styles.containerIconTitle}>
              <Text style={styles.title}>{item.rom.rom_id}</Text>
              {item.startedTravel && (
                <TouchableOpacity
                  style={styles.alert}
                  onPress={() => console.log('Hello')}>
                  <FontAwesome5
                    name="exclamation-triangle"
                    color="orange"
                    size={45}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.containerBody}>
            <View style={styles.body}>
              <Text style={styles.label}>{t('spreadsheet.manifest')}</Text>
              <Text style={styles.item}>{item.rom.rom_manifesto}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('spreadsheet.date-init')}:</Text>
              <Text style={styles.item}>
                {moment(item.rom.rom_dt_manifesto).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('spreadsheet.origin')}:</Text>
              <Text style={styles.item}>{item.rom.origem}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>
                {t('spreadsheet.final-destination')}:
              </Text>
              <Text style={styles.item}>{item.rom.rom_destino}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.label}>{t('spreadsheet.deliveries')}:</Text>
              <Text style={styles.item}>{item.rom.entrega}</Text>
            </View>
            <View style={styles.viewButtonRoute}>
              <Button
                title="Mapas"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                buttonStyle={styles.buttonTravelMaps}
                onPress={() =>
                  this.props.navigation.navigate('deliveryRouteStack', {
                    //origem: item.rom.rom_origem,
                    //destino: item.rom.rom_destino,
                    romId: item.rom.rom_id,
                  })
                }
              />
            </View>
          </View>
          {!item.close ? (
            <View style={[styles.body, styles.bodyBottomCard]}>
              {item.startedTravel ? (
                <>
                  <FontAwesome
                    name="clock-o"
                    color={'green'}
                    size={22}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'green',
                      marginHorizontal: 5,
                    }}>
                    {t('spreadsheet.trip-started')}
                  </Text>
                  <View />
                </>
              ) : (
                <>
                  {!item.travels ? (
                    <Button
                      title="start-trip"
                      titleStyle={{
                        alignSelf: 'center',
                        fontSize: 14,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                      onPress={
                        item.travels
                          ? () =>
                              this.setState({
                                showMessage: true,
                                message: 'end-the-trip-started',
                              })
                          : () => {
                              this.setState({
                                show: true,
                                item,
                              });
                            }
                      }
                      buttonStyle={styles.buttonTravel}
                    />
                  ) : (
                    <>
                      <FontAwesome
                        name="clock-o"
                        color={'orange'}
                        size={22}
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'orange',
                          marginHorizontal: 5,
                        }}>
                        {t('spreadsheet.finish-the-previous-trip')}
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={[styles.body, styles.bodyBottomCard]}>
              <Button
                title="end-trip"
                titleStyle={{
                  alignSelf: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
                onPress={() => this.setState({showFinished: true, item})}
                buttonStyle={styles.buttonTravel}
              />
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  renderList = () => {
    let existeCondicion = false;
    return (
      <FlatList
        refreshing={this.state.loading}
        data={this.state?.data?.romaneio
          ?.sort((a, b) => b.startedTravel - a.startedTravel)
          .map((elemento, indice) => {
            if (
              elemento.startedTravel === false &&
              elemento.travels === true &&
              indice === 0
            ) {
              existeCondicion = true;
            }
            if (existeCondicion) {
              elemento.startedTravel = false;
              elemento.travels = false;
              return elemento;
            }
            return elemento;
          })}
        renderItem={this.renderItems}
        keyExtractor={(item) => String(item?.rom.rom_id)}
        onRefresh={this.getSpreadSheets}
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%', alignItems: 'center'}}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Loading show={this.state.loading} />
        {this.renderList()}
        {this.renderModal()}
        {this.renderModalMessage()}
        {this.renderModalFinished()}
        {this.renderModalFinishedSuccess()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: loginSelector(state),
    latlong: latlongSelector(state),
    deviceId: deviceIdSelector(state),
  };
};

const SpreadSheet = withTranslation('screens')(SpreadSheetClass);
export default connect(mapStateToProps)(SpreadSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    width: width / 1.1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    borderRadius: 20,
    zIndex: 99,
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
    justifyContent: 'space-evenly',
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  body: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bodyBottomCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  item: {
    marginHorizontal: 5,
    width: width / 1.6,
  },
  buttonTravel: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 2,
    borderRadius: 50,
    marginVertical: 15,
  },
  buttonTravelMaps: {
    backgroundColor: '#ec6036',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: -10,
    width: width / 2,
    borderRadius: 50,
    marginVertical: 15,
  },
  alert: {
    position: 'absolute',
    top: -20,
    right: 3,
    //elevation: 5,
    width: 80,
    height: 80,
    borderRadius: 40,
    //backgroundColor: '#cccd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonRoute: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
});
