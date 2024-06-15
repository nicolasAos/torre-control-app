import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getCTEsByDriver, getCTEsByDriverOffline} from '../actions/driver';
import {getTerms, getTerm} from '../actions/term';
import {setGaveBad, setGaveGood} from '../actions/monitoringPreventive';
import {
  loginSelector,
  pushPreventiveMonitoringSelector,
  statusReasonMonitoringSelector,
} from '../reducers/selectors';
import {
  Loading,
  Empty,
  Modal,
  Button,
  DatePicker,
  ButtonIcon,
} from '../components';
import moment from 'moment';
import ReactNativePicker from 'react-native-picker-select';
import {isObjectEmpty} from '../configs/utils';
import {syncTravelData} from '../actions/syncTravelsManual';
import {getTravelsToSync} from '../actions/transport';

// utils
import {Logger} from '../utils';
/* Themes */
import {shadows} from '../theme/shadow';

/* Services */
import {getMonitoringPreventiveLog} from '../services/MonitoringPreventive';

const {width} = Dimensions.get('window');

import {withTranslation} from 'react-i18next';

interface Props {
  navigation: any;
  t: any;
  login: any;
  monitoring: any;
  dispatch: any;
  reason: any;
}

interface ScreenState {
  loading: boolean;
  show: boolean;
  showModal: boolean;
  showModalBad: boolean;
  showModalGood: boolean;
  showModalAlert: boolean;
  message: string;
  term: string;
  agv: number;
  agv2: number;
  empresa: string;
  showSpread: boolean;
  showGaveBad: boolean;
  showGaveGood: boolean;
  isDelay: boolean;
  isArrive: boolean;
  occurrence: string;
  delayDate: string;
  hour: string;
  rescheduledDate: string;
  showDatePicker: boolean;
  travelsSync: any;
}

class MyTravelsClass extends Component<Props, ScreenState> {
  constructor(props: any) {
    super(props);
  }

  state: ScreenState = {
    loading: true,
    show: true,
    showModal: false,
    showModalBad: false,
    showModalGood: false,
    showModalAlert: false,
    message: '',
    term: '',
    agv: 0,
    agv2: 0,
    empresa: '',
    showSpread: false,
    showGaveBad: false,
    showGaveGood: false,
    isDelay: true,
    isArrive: false,
    occurrence: '',
    delayDate: '',
    hour: '',
    travelsSync: [],
    rescheduledDate: '',
    showDatePicker: false,
  };

  componentDidMount() {
    Logger.log('mount Travels screen');
    this.props.navigation.addListener('didFocus', () => {
      this.getTravels();
    });
  }

  componentWillUnmount(): void {
    Logger.log('unmount Travels screen');
  }

  /**
   * Get travels
   */
  getTravels = async () => {
    Logger.log('get travels');
    this.setState({loading: true});
    try {
      // get smth from the API
      await getCTEsByDriver(this.props.login.moto_id);
      // get travels from realm
      const travelsSync = await getTravelsToSync(this.props.login.moto_id);
      // get smth from realm
      await getCTEsByDriverOffline(this.props.login.moto_id).then((data) => {
        this.setState({
          agv: data.data.qtdTravels,
          agv2: data.data2.qtdTravels,
        });
      });
      // get smth from the API
      await this.fetchMonitoringPreventiveLog();
      this.setState({loading: false, travelsSync: travelsSync});
    } catch (e) {
      this.setState({loading: false});
      Alert.alert('error', JSON.stringify(e));
    }
  };

  /**
   * fetchMonitoringPreventiveLog
   * @returns
   */
  fetchMonitoringPreventiveLog = async () => {
    Logger.log(`fetchMonitoringPreventiveLog`);
    const {id} = this.props.monitoring;

    if (!id) {
      Logger.log(`fetchMonitoringPreventiveLog: no id`);
      return;
    }
    try {
      // get smth from the API
      const monitoringPreventiveLogs = await getMonitoringPreventiveLog(id);
      if (monitoringPreventiveLogs.length) {
        const lastLog = monitoringPreventiveLogs.pop();

        const dateFormated = moment(lastLog.data_reprogramado).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.setState({rescheduledDate: dateFormated});
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTerm = (empresa: any) => {
    // get smth from API
    getTerms(this.props.login.moto_id).finally(() => {
      // get smth from realm
      getTerm(this.props.login.moto_id, empresa)
        .then((data) => {
          this.setState({loading: false}, () =>
            this.props.navigation.navigate('spreadSheetStack', {
              empresa: empresa,
            }),
          );
        })
        .catch(() => this.setState({loading: false}));
    });
  };

  actionMonitoringPreventive = () => {
    if (isObjectEmpty(this.props.monitoring)) {
      this.setState({
        message: 'scheduled-collection',
        showModal: true,
      });
    } else if (this.state.agv + this.state.agv2 > 0) {
      this.setState({
        showModalAlert: true,
        hour: moment(this.props.monitoring.data_coleta).format('HH:mm'),
      });
    } else {
      this.setState({
        showSpread: true,
        hour: moment(this.props.monitoring.data_coleta).format('HH:mm'),
      });
    }
  };

  actionGaveBad = () => {
    this.props
      .dispatch(
        setGaveBad({
          state: this.state,
          moto_id: this.props.login.moto_id,
          idMonitoring: this.props.monitoring.id,
        }),
      )
      .then((message: any) => {
        this.setState({
          loading: false,
          message,
          occurrence: '',
          isDelay: false,
          isArrive: false,
          delayDate: '',
        });
        this.fetchMonitoringPreventiveLog();
        setTimeout(() => this.setState({showModal: true}), 500);
      })
      .catch((error: any) => {
        this.setState({
          loading: false,
          message: error.message,
          occurrence: '',
        });
        setTimeout(() => this.setState({showModalBad: true}), 500);
      });
  };

  actionGaveGood = () => {
    this.props
      .dispatch(
        setGaveGood({
          state: this.state,
          moto_id: this.props.login.moto_id,
          idMonitoring: this.props.monitoring.id,
        }),
      )
      .then(() => {
        this.setState({
          loading: false,
          message: 'go-to-the-concierge',
          occurrence: '',
          isDelay: false,
          isArrive: false,
          delayDate: '',
        });
        setTimeout(() => this.setState({showModal: true}), 500);
      })
      .catch((error: any) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showModalGood: true}), 500);
      });
  };

  navigationMonitoring = (location: any) => {
    if (location != null) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${location.latitude}, ${location.longitude}`;
      const url = Platform.select({
        ios: `${scheme}${location.endereco}@${latLng}`,
        android: location.endereco
          ? `${scheme}${location.endereco}`
          : `${scheme}${latLng}`,
      });
      if (url) {
        Linking.openURL(url);
      } else {
        Logger.log(`url is undefined`);
      }
    }
  };

  syncTravels = async () => {
    syncTravelData()
      .then(() => {
        this.setState({
          loading: false,
          message: 'trip-update',
          travelsSync: [],
        });
        setTimeout(() => this.setState({showModal: true}), 500);
      })
      .catch((error) => {
        this.setState({loading: false, message: error.message});
        setTimeout(() => this.setState({showModal: true}), 500);
      });
  };

  renderItemAgv1 = () => {
    if (this.state.agv > 0 && !this.state.loading) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.setState({loading: true}, () => this.getTerm('2'))
          }
          style={{height: 130, marginTop: 50}}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{this.state.agv}</Text>
          </View>
          <View style={[styles.containerItem, {backgroundColor: '#1f2b52'}]}>
            <Image
              resizeMode={'contain'}
              source={require('../imgs/solistica-logo.png')}
              style={{width: '90%', height: 70}}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  renderEmpty = () => {
    const {t} = this.props;
    if (this.state.agv == 0 && this.state.agv2 == 0 && !this.state.loading) {
      return (
        <Empty
          text={t('my-travels.no-travel')}
          styleContainer={styles.styleContainerEmpty}
        />
      );
    }
  };

  renderButtonResume = () => {
    const {t} = this.props;
    if (!this.state.loading && this.state.travelsSync.length > 0) {
      return (
        <Button
          title="no-travel"
          titleStyle={{
            alignSelf: 'center',
            fontSize: 18,
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          onPress={() =>
            this.setState({loading: true}, () => this.syncTravels())
          }
          buttonStyle={{
            width: '90%',
            height: 70,
            backgroundColor: 'orange',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            borderRadius: 50,
            shadows: shadows.primary,
          }}
        />
      );
    }
  };

  renderModalSpreadSheet = () => {
    const {t} = this.props;
    const {monitoring} = this.props;
    return (
      <Modal
        isVisible={this.state.showSpread}
        title="congratulations"
        body={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.titleModal, {color: 'blue'}]}>
              {t('my-travels.new-collection')}
            </Text>
            <Text style={{fontSize: 14, marginBottom: 5}}>
              {t('my-travels.collection-information')}Dados da coleta
            </Text>
            <Text style={styles.textsModalTitle}>
              {t('my-travels.date-and-time')}
            </Text>
            <Text style={styles.textsModal}>
              {moment(monitoring.data_coleta).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text style={styles.textsModalTitle}>Local</Text>
            <Text style={styles.textsModal}>
              {monitoring.origem_carregamento != null
                ? monitoring.origem_carregamento.endereco
                : ''}
            </Text>
            <ButtonIcon
              onPress={() =>
                this.navigationMonitoring(monitoring.origem_carregamento)
              }
              nameIcon="location-arrow"
              colorIcon="white"
              buttonStyle={styles.buttonStyleNavigation}
            />
            <Text style={[styles.titleModal, {color: 'blue', marginTop: 20}]}>
              {t('my-travels.trip-number')} {monitoring.romaneio}
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () => {
              this.setState({showSpread: false});
              setTimeout(() => this.setState({showGaveBad: true}), 500);
            },
            text: 'occurrence',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({showSpread: false});
              setTimeout(() => this.setState({showGaveGood: true}), 500);
            },
            text: 'i-arrived',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
        onPressClosed={() => this.setState({showSpread: false})}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModalGaveBad = () => {
    const {t} = this.props;
    const {monitoring} = this.props;
    return (
      <Modal
        isVisible={this.state.showGaveBad}
        title="occurrence"
        body={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.titleModal, {color: 'red'}]}>
              {t('my-travels.tell-me-what-happened')}
            </Text>

            <View style={styles.wrapperMenuModalBad}>
              <View style={styles.wrapperMenuModalBadItem}>
                <TouchableOpacity
                  style={styles.wrapperMenuModalBadItem}
                  onPress={() =>
                    this.setState({
                      isDelay: !this.state.isDelay,
                    })
                  }>
                  <View style={styles.wrapperMenuModalBadItemText}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {t('my-travels.im-going-to-be-late')}
                    </Text>
                  </View>

                  <View style={styles.wrapperMenuModalBadItemIcon}>
                    <FontAwesome5
                      name={'check'}
                      size={30}
                      color={
                        this.state.isDelay
                          ? global.COLOR_SUCCESS
                          : global.COLOR_GREY_LIGHT
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.diviser} />
              <View style={styles.wrapperMenuModalBadItem}>
                <TouchableOpacity
                  style={styles.wrapperMenuModalBadItem}
                  onPress={() =>
                    this.setState({
                      isDelay: !this.state.isDelay,
                    })
                  }>
                  <View style={styles.wrapperMenuModalBadItemText}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      {t('my-travels.i-will-not-collect')}
                    </Text>
                  </View>
                  <View style={styles.wrapperMenuModalBadItemIcon}>
                    <FontAwesome5
                      name={'check'}
                      size={30}
                      color={
                        !this.state.isDelay
                          ? global.COLOR_SUCCESS
                          : global.COLOR_GREY_LIGHT
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.diviser, {marginTop: 10, marginBottom: 10}]} />
            {this.state.isDelay ? (
              <Fragment>
                <Text
                  style={{
                    width: '100%',
                    fontSize: 14,
                    marginVertical: 10,
                  }}>
                  {t('my-travels.i-can-arrive-at')}
                </Text>
                <DatePicker
                  buttonStyle={[styles.textInputs, shadows.primary]}
                  date={this.state.delayDate}
                  mode="datetime"
                  placeholder={t('my-travels.select-the-date')}
                  minimumDate={new Date(moment().subtract(1, 'days'))}
                  isDatePickerVisible={this.state.showDatePicker}
                  disabled={!this.state.isDelay}
                  onPress={() => {
                    this.setState({showDatePicker: true});
                  }}
                  onConfirm={(delayDate) => {
                    delayDate = moment(delayDate).format('DD/MM/YYYY HH:mm');
                    this.setState({delayDate, showDatePicker: false});
                  }}
                  onCancel={() => {
                    this.setState({showDatePicker: false});
                  }}
                />
              </Fragment>
            ) : null}

            <View style={styles.containerOccurrence}>
              <ReactNativePicker
                selectedValue={this.state.occurrence}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({
                    occurrence: itemValue,
                  })
                }
                placeholder={{
                  label: t('my-travels.what-happened'),
                  value: null,
                  color: '#9EA0A4',
                }}
                items={this.props.reason}
                style={{
                  inputAndroid: {
                    color: 'black',
                  },
                }}
              />
            </View>

            <Text style={[styles.titleModal, {color: 'red', marginTop: 20}]}>
              Planilha {monitoring.romaneio}
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () =>
              this.setState({
                showGaveBad: false,
                occurrence: '',
                isDelay: true,
              }),
            text: 'return',
            backgroundColor: 'red',
          },
          {
            disabled: this.handleButtonSubmitGaveBad(),
            onPress: () => {
              this.setState({showGaveBad: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () => this.actionGaveBad()),
                500,
              );
            },
            text: 'notify',
            backgroundColor: this.handleButtonSubmitGaveBad()
              ? 'grey'
              : 'green',
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModalGaveGood = () => {
    const {t} = this.props;
    const {monitoring} = this.props;
    return (
      <Modal
        isVisible={this.state.showGaveGood}
        title="i-arrived"
        body={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.titleModal, {color: 'green'}]}>
              {t('my-travels.already-here-at-the-entrance')}
            </Text>
            <Text style={{fontSize: 14, marginVertical: 10}}>
              {t('my-travels.glad-you-came')}
            </Text>
            <Text style={{fontSize: 14, marginVertical: 10}}>
              {t('my-travels.release-entry')}
            </Text>
            <Text style={{fontSize: 14, marginVertical: 10}}>
              {t('my-travels.dont-forget-your-trip-number')}
            </Text>
            <Text style={[styles.titleModal, {color: 'green', marginTop: 20}]}>
              {t('my-travels.trip-number')}
              {monitoring.romaneio}
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () => this.setState({showGaveGood: false}),
            text: 'return',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              this.setState({showGaveGood: false});
              setTimeout(
                () =>
                  this.setState({loading: true}, () => this.actionGaveGood()),
                500,
              );
            },
            text: 'i-arrived',
            backgroundColor: 'green',
          },
        ]}
        bodyStyle={styles.containerBody}
        containerStyle={styles.containerStyle}
      />
    );
  };

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.showModal}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => this.setState({message: '', showModal: false}),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalAlertBad = () => {
    return (
      <Modal
        isVisible={this.state.showModalBad}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => {
              this.setState({message: '', showModalBad: false});
              setTimeout(() => this.setState({showGaveBad: true}), 500);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  renderModalAlertGood = () => {
    return (
      <Modal
        isVisible={this.state.showModalGood}
        title="attention"
        bodyText={this.state.message}
        buttons={[
          {
            onPress: () => {
              this.setState({message: '', showModalGood: false});
              setTimeout(() => this.setState({showGaveGood: true}), 500);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  };

  /*************************************************
   * Métodos do PRÓXIMA COLETA
   *************************************************/
  monitoringPreventiveGaveBad = () => {
    const {data_coleta} = this.props.monitoring;
    const {rescheduledDate} = this.state;

    const initialDelayDate = rescheduledDate ? rescheduledDate : data_coleta;

    this.setState({
      showGaveBad: true,
      delayDate: moment(initialDelayDate).format('DD/MM/YYYY HH:mm'),
    });
  };

  monitoringPreventiveGaveGood = () => {
    this.setState({showGaveGood: true});
  };

  handleButtonSubmitGaveBad = () => {
    const {occurrence, rescheduledDate, data_coleta, isDelay, delayDate} =
      this.state;

    if (isDelay) {
      const initialDelayDate = rescheduledDate
        ? moment(rescheduledDate).format('YYYY-MM-DD HH:mm:ss')
        : moment(data_coleta).format('YYYY-MM-DD HH:mm:ss');

      const formatedDelayDate = moment(delayDate, 'DD/MM/YYYY HH:mm:ss')
        .subtract(1, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');

      const dateDiff = !moment().isAfter(formatedDelayDate)
        ? moment(formatedDelayDate).isAfter(initialDelayDate)
        : false;

      return !occurrence || !dateDiff;
    }

    return !occurrence;
  };

  render() {
    const {loading, rescheduledDate} = this.state;

    return (
      <>
        <ScrollView style={styles.container}>
          {!loading ? (
            <Fragment>
              {/* {this.renderButtonMonitoring()} */}
              {/* <NextCollect
                monitoring={this.props.monitoring}
                rescheduledDate={rescheduledDate}
                onGaveBad={this.monitoringPreventiveGaveBad}
                onGaveGood={this.monitoringPreventiveGaveGood}
                onNavigation={this.navigationMonitoring}
              /> */}
              <View style={styles.containerItems}>
                {this.renderItemAgv1()}
                {/* {this.renderItemAgv2()} */}
                {this.renderEmpty()}
              </View>
              {this.renderModal()}
              {this.renderModalAlertBad()}
              {this.renderModalAlertGood()}
              {/* {this.renderModalAlert()} */}

              {this.renderModalSpreadSheet()}
              {this.renderModalGaveBad()}
              {this.renderModalGaveGood()}
            </Fragment>
          ) : (
            <Loading show={this.state.loading} />
          )}
        </ScrollView>
        {/* <View style={{marginBottom: 10}}>{this.renderButtonResume()}</View> */}
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    login: loginSelector(state),
    monitoring: pushPreventiveMonitoringSelector(state),
    reason: statusReasonMonitoringSelector(state, true),
  };
};

const MyTravels = withTranslation('screens')(MyTravelsClass);
export default connect(mapStateToProps)(MyTravels);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 100,
  },
  containerButtonMonitoring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerItems: {
    flex: 1,
    width: width / 1.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  styleContainerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerItem: {
    height: 120,
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'orange',
    borderRadius: 50,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIconStyle: {
    height: 30,
    width: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    zIndex: 1,
  },
  textInputs: {
    width: width / 1.5,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  containerOccurrence: {
    backgroundColor: 'white',
    elevation: 2,
    width: width / 1.5,
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonStyleNavigation: {
    borderColor: global.COLOR_MAIN,
    backgroundColor: global.COLOR_MAIN,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: width / 2,
    alignSelf: 'center',
    borderRadius: 50,
  },
  textsModalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textsModal: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  titleModal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  containerBody: {
    marginVertical: 2,
    marginHorizontal: 3,
    paddingHorizontal: 30,
  },
  containerStyle: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: width / 1.3,
    alignItems: 'center',
    alignSelf: 'center',
  },
  wrapperMenuModalBad: {
    width: '100%',
    minHeight: 80,
  },
  wrapperMenuModalBadItem: {
    flex: 1,
    minHeight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignContent: 'space-between',
  },
  wrapperMenuModalBadItemText: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  wrapperMenuModalBadItemIcon: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diviser: {
    width: '100%',
    height: 1,
    backgroundColor: '#f5f4f5',
    marginTop: 3,
    marginBottom: 3,
  },
});
