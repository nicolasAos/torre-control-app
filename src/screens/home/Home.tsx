import React, {useContext, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  NativeModules,
  ImageBackground,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
// utils
import {Logger, Permissions} from '../../utils';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {doLogout} from '../../actions/login';
//import {deviceId as getDeviceId, setDevices} from '../../actions/home';
//import {getPreventiveMonitoringByCnhId} from '../../actions/monitoringPreventive';
import {
  Loading,
  Button,
  Modal,
  TextInputPassword,
  VersionChecker,
} from '../../components';
import {
  loginSelector,
  loginHomologSelector,
  cnhSelector,
  pushPreventiveMonitoringSelector,
  isTravelSelector,
  freightWishSelector,
} from '../../reducers/selectors';
import {globalProfileMenu} from '../../configs/menus';
import {isObjectEmpty} from '../../configs/utils';
import {
  alterPasswordTemporary,
  getCtesRemmitances,
  getCTEsByDriver,
} from '../../actions/driver';
import {useTranslation, Trans} from 'react-i18next';
import {NavigationContext} from 'react-navigation';
import {getMessages} from '../../actions/notifications';
import {NavigationEvents} from 'react-navigation';
import ListContainer from '../../components/ListContainerOneColumn';
//import moment from 'moment';
import GeoLocation from '@react-native-community/geolocation';
import {sendEmptyRemission} from '../../actions/driver';
//import {sendLocationPrime} from '../../actions/geolocation';
import BackgroundTimer from 'react-native-background-timer';
const {width} = Dimensions.get('window');
import ScreenState from '../../utils/ScreenState.class';
//import {getDateBD} from '../../configs/utils';
// analitycs
import {Mixpanel} from '../../analitycs';

export default function Home() {
  const {login, homolog, cnh, monitoring, isTravel, freightWish} = useSelector(
    (state) => ({
      login: loginSelector(state),
      homolog: loginHomologSelector(state),
      cnh: cnhSelector(state),
      monitoring: pushPreventiveMonitoringSelector(state),
      isTravel: isTravelSelector(state),
      freightWish: freightWishSelector(state),
    }),
  );

  const [password, setPassword] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [disAux, setDisAux] = useState('');
  const [license, setLicense] = useState('');
  const [travelId, setTravelId] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showInspectAlert, setShowInspectAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  const [badge, setBadge] = useState({status: false, number: 0});
  const [showPassword, setShowPassword] = useState(
    login.senha_temporaria == 1 ? true : false,
  );
  const [modalAlertaNoLlegadaAmarillo, setModalAlertaNoLlegadaAmarillo] =
    useState(false);
  const [modalAlertaNoLlegadaRojo, setModalAlertaNoLlegadaRojo] =
    useState(false);
  const [itemNoLlegadaTiempo, setItemNoLlegadaTiempo] = useState({});
  const [geoCercas, setGeoCercas] = useState();
  const [geoCercasFinal, setGeoCercasFinal] = useState();
  const [placaId, setPlacaId] = useState();
  const [validatePopUpInspection, setValidatePopUpInspection] = useState(true);

  useEffect(() => {
    Logger.log('mount home screen');
    setTimeout(askPermissins, 1000);
    Mixpanel.log('Home Screen Visited');
    if (login.user_id) {
      Mixpanel.identify(login.user_id);
    }

    return () => {
      Logger.log('unmount home screen');
    };
  }, []);

  async function askPermissins() {
    const fineLocation = await Permissions.askFineLocation();
    const backgrounfLocation = await Permissions.askBackgroundLocation();
  }

  const [t] = useTranslation('screens');

  const [m] = useTranslation('modal');
  const dispatch = useDispatch();

  const navigation = useContext(NavigationContext);

  const passwordConfirmTextInput = useRef();

  const sendRemission = async (step: any) => {
    setLoading(true);
    GeoLocation.getCurrentPosition((info) => {
      sendEmptyRemission(
        step == 1 ? geoCercas : geoCercasFinal,
        '',
        '',
        info.coords.lat,
        info.coords.lng,
        '',
        '',
        step,
        '',
      ).then(async () => {
        let listasCtes = await getCtesRemmitances(login.moto_id);
        //setPlacaId(listasCtes[listasCtes.length - 1].placa);
        setLoading(false);
      });
    });
    setLoading(false);
  };

  function changePassword() {
    dispatch(
      alterPasswordTemporary(login.moto_id, password, passwordConfirm, 0),
    )
      .then((data) => {
        setTimeout(() => {
          setMessage(data.message);
          setShowSuccess(true);
        }, 500);
      })
      .catch((error) => {
        setTimeout(() => {
          setMessage(error.message);
          setShowError(true);
        }, 500);
      });
  }

  function submitLogout() {
    BackgroundTimer.stopBackgroundTimer();
    //setPlacaId(null);
    dispatch(doLogout(login.moto_id, login.user_id))
      .then(() => {
        setLoading(false);
        navigation.navigate('Auth');
      })
      .catch(() => setLoading(false));
  }

  const getRandomTruckData = async () => {
    Logger.log(`get Random Truck Data`);
    setLoading(true);
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

    getMessages(login.user_id, 2)
      .then((data) => {
        const getIfNotificationsUnread = data.filter(
          (iNoti) => iNoti.status == 2,
        );
        if (getIfNotificationsUnread.length > 0) {
          setBadge({status: true, number: getIfNotificationsUnread.length});
        } else {
          setBadge({status: false, number: 0});
        }
      })
      .catch((e) => Logger.recordError(e));

    let listasCtes: any = [];
    if (login.pantalla_id?.includes(2)) {
      listasCtes = await getCtesRemmitances(login.moto_id);
      if (!placaId) {
        //setPlacaId(listasCtes[0].placa);
      }
    } else if (login.pantalla_id?.includes(1)) {
      listasCtes = await getCTEsByDriver(login.moto_id);
      setLoading(false);
      if (!placaId) {
        //setPlacaId(listasCtes[0].placa);
      }
      return;
    }
    //await loopCtes(listasCtes)
    setLoading(false);
  };

  // Converts numeric degrees to radians
  const toRad = (Value) => {
    return (Value * Math.PI) / 180;
  };

  const renderModalAlertaNoLlegadaAmarillo = () => {
    return (
      <Modal
        isVisible={modalAlertaNoLlegadaAmarillo}
        complementBody={`Cte: ${itemNoLlegadaTiempo.cliente}`}
        title={'attention'}
        bodyText={'colecta_avisos.amarillo'}
        buttons={[
          {
            onPress: () => {
              setModalAlertaNoLlegadaAmarillo(false);
            },
            text: 'Ok',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              setModalAlertaNoLlegadaAmarillo(false);
              navigation.navigate('SACReportStack', {
                nf_id: itemNoLlegadaTiempo.nf_id,
                screenState: new ScreenState(),
                sacReport: false,
                sacMenu: 3,
              });
            },
            text: 'Repostar',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderModalAlertaNoLlegadaRojo = () => {
    return (
      <Modal
        isVisible={modalAlertaNoLlegadaRojo}
        title={'attention'}
        bodyText={'colecta_avisos.rojo'}
        complementBody={`Cte: ${itemNoLlegadaTiempo.cliente}`}
        buttons={[
          {
            onPress: () => {
              setModalAlertaNoLlegadaRojo(false);
            },
            text: 'Ok',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              setModalAlertaNoLlegadaRojo(false);
              navigation.navigate('SACReportStack', {
                nf_id: itemNoLlegadaTiempo.nf_id,
                screenState: new ScreenState(),
                sacReport: false,
                sacMenu: 3,
              });
            },
            text: 'Reportar',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderModalGeoCercas = () => {
    return (
      <Modal
        isVisible={geoCercas !== undefined}
        title={'attention'}
        bodyText={'geoCercas.stepOne'}
        buttons={[
          {
            onPress: () => {
              setGeoCercas(undefined);
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              sendRemission(1);
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };

  const renderModalGeoCercasFinal = () => {
    return (
      <Modal
        isVisible={geoCercasFinal !== undefined}
        title={'attention'}
        bodyText={'geoCercas.stepOne'}
        buttons={[
          {
            onPress: () => {
              setGeoCercas(undefined);
            },
            text: 'No',
            backgroundColor: '#42c790',
          },
          {
            onPress: () => {
              sendRemission(4);
            },
            text: 'Si',
            backgroundColor: global.COLOR_TITLE_CARD,
          },
        ]}
      />
    );
  };
  function renderHeader() {
    let counter = 0;

    useEffect(() => {
      Logger.log('render avatar');
      return () => {
        counter = 0;
      };
    }, []);

    function count() {
      const limit = 20;
      counter++;
      if (counter === limit) {
        navigation.navigate('logger');
        counter = 0;
      }
      //navigation.navigate('menuRegisterStack')
    }

    return (
      <View style={styles.containerHeader}>
        <ImageBackground
          source={require('../../imgs/background_torre.png')}
          style={{width: '100%', height: '100%'}}>
          <View style={styles.containerHeaderInfo}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity activeOpacity={1} onPress={count}>
                <Image
                  source={
                    login.foto == null
                      ? require('../../imgs/placeholder.png')
                      : {uri: login.foto}
                  }
                  style={styles.containerHeaderProfilePicture}
                />
              </TouchableOpacity>
              <View style={{flex: 1, justifyContent: 'center', marginLeft: 20}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('myRegisterUserStack')}
                  disabled>
                  <Text style={{flexDirection: 'row'}}>
                    <Text style={styles.textHeader}>
                      {t('menu.header.welcome')}, {'\n'}
                    </Text>

                    <Text style={styles.textHeaderName}>{login.moto_nome}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.areaNotification}>
              {badge.status && (
                <View style={styles.badge}>
                  <Text
                    style={{
                      fontSize: 9,
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {badge.number}
                  </Text>
                </View>
              )}
              <SimpleLineIcons
                name={'bell'}
                color={'white'}
                size={30}
                onPress={() => {
                  navigation.navigate('notificationStack');
                }}
                disabled
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function renderHomolog() {
    if (homolog) {
      return (
        <View style={styles.homolog}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
            {t('menu.header.testing-message')}
          </Text>
        </View>
      );
    }
  }

  function renderBody() {
    return (
      <ListContainer
        data={globalProfileMenu}
        onRefresh={() => {}}
        refreshing={false}
        renderEmptyList={() => {
          return <View />;
        }}
        itemSeparator={<View style={{width: 16, backgroundColor: 'pink'}} />}
        renderItem={({item}: any) => {
          if (
            login.pantalla_id?.includes(item.permissionLevel) ||
            item.permissionLevel == 'g'
          ) {
            if (item.permissionLevel === 5 && validatePopUpInspection) {
              setShowInspectAlert(true);
              setValidatePopUpInspection(false);
            }

            return <RenderItems item={item} />;
          }
        }}
      />
    );
  }
  function optionsMenus(id: any, stack: any) {
    Logger.log(`home menu tap: id=${id} stack=${stack}`);
    switch (true) {
      case id === 9:
        setLoading(true);
        submitLogout();
        break;
      case id === 1:
        homolog
          ? navigation.navigate('lowByCtesStack', {
              empresa: 2,
              romId: '3135255',
            })
          : {};
        break;
      case id === 6:
        navigation.navigate(stack, {
          auditDate: auditDate,
          driverName: driverName,
          disAux: disAux,
          license: license,
          travelId: travelId,
          userId: login.user_id,
        });
        break;

      default:
        navigation.navigate(stack, {
          datosUsuario: login,
        });
        break;
    }
  }

  function RenderItems(item: any) {
    const {id, stack, image, nameMenu} = item.item;

    if (!homolog && id === 1) {
      return;
    }
    return (
      <TouchableOpacity onPress={() => optionsMenus(id, stack)}>
        <View style={styles.containerItem}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={image} style={{height: 70, width: 70}} />
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.textMenu}>{t(nameMenu)}</Text>
          </View>
          {id == 2 && !isObjectEmpty(monitoring) && (
            <FontAwesome5
              name="exclamation-triangle"
              color="orange"
              size={26}
            />
          )}
          <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
            <SimpleLineIcons
              name={'arrow-right'}
              color={global.COLOR_MAIN}
              size={26}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderModalNewPassword() {
    return (
      <Modal
        isVisible={showPassword}
        title="new-password"
        body={
          <View>
            <Text
              style={{
                width: width / 1.5,
                color: 'black',
                marginVertical: 10,
              }}>
              {t('menu.new-password.body')}
            </Text>
            <TextInputPassword
              onSubmitEditing={() => passwordConfirmTextInput.current.focus()}
              onChangeText={(value) => setPassword(value)}
              containerStyle={styles.containerStyle}
              value={password}
              placeholder="new-password"
              returnKeyType="next"
            />
            <TextInputPassword
              ref={passwordConfirmTextInput}
              onSubmitEditing={() => {
                setShowPassword(false);
                setTimeout(() => {
                  setLoading(true);
                  changePassword();
                }, 500);
              }}
              containerStyle={styles.containerStyle}
              onChangeText={(value) => setPasswordConfirm(value)}
              value={passwordConfirm}
              placeholder="confirm-new-password"
            />
          </View>
        }
        buttons={[
          {
            onPress: () => {
              setShowPassword(false);
              setTimeout(() => {
                setLoading(true);
                changePassword();
              }, 500);
            },
            text: 'ok',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalAlert() {
    return (
      <Modal
        isVisible={showAlert}
        title="attention"
        bodyText="access-denied"
        buttons={[
          {
            onPress: () => setShowAlert(false),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalInspectAlert() {
    return (
      <Modal
        isVisible={showInspectAlert}
        title="inspect-alert-title"
        body={
          <View>
            <Text>
              <Trans values={{license: license}}>
                {m('inspect-alert', {name: license})}
              </Trans>
            </Text>
          </View>
        }
        buttons={[
          {
            onPress: () => {
              setShowInspectAlert(false);
              navigation.navigate('inspectStack', {
                auditDate: auditDate,
                driverName: driverName,
                disAux: disAux,
                license: license,
                travelId: travelId,
                userId: login.user_id,
              });
            },
            text: 'ok-inspect',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalSuccess() {
    return (
      <Modal
        isVisible={showSuccess}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => setShowSuccess(false),
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalError() {
    return (
      <Modal
        isVisible={showError}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => {
              setShowError(false);
              setTimeout(() => setShowPassword(true), 500);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: homolog ? 'orange' : global.COLOR_MAIN,
      }}>
      <NavigationEvents onWillFocus={getRandomTruckData} />
      <Loading show={loading} />
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <VersionChecker />
        {renderHomolog()}
        {renderHeader()}
        {renderBody()}
        {renderModalNewPassword()}
        {renderModalSuccess()}
        {renderModalError()}
        {renderModalAlert()}
        {renderModalInspectAlert()}
        {renderModalAlertaNoLlegadaAmarillo()}
        {renderModalAlertaNoLlegadaRojo()}
        {renderModalGeoCercas()}
        {renderModalGeoCercasFinal()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  containerHeader: {
    justifyContent: 'center',
    backgroundColor: global.COLOR_MAIN,
    height: '30%',
    width,
    //zIndex: 1,
  },
  containerHeaderProfilePicture: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
  },
  containerHeaderInfo: {
    flexDirection: 'row',
    width: width / 1.1,
    marginTop: 40,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeader: {
    color: 'white',
  },
  textHeaderName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  containerHeaderNumbers: {
    flexDirection: 'row',
    width: width / 1.1,
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textNumber: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textLabel: {
    fontSize: 10,
  },
  containerTextInfo: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 5,
  },
  containerTextInfoCenter: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    paddingBottom: 5,
  },
  containerItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#DEDEDE',
    flexDirection: 'row',
    width: width / 1.1,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textMenu: {
    fontSize: 16,
    fontWeight: 'bold',
    color: global.COLOR_MAIN,
  },
  buttonStyle: {
    width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 0,
  },
  homolog: {
    width,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 0,
    backgroundColor: 'orange',
  },
  containerStyle: {
    width: width / 1.5,
    height: 45,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingLeft: 20,
    borderColor: '#666',
    borderWidth: 1,
    marginVertical: 10,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaNotification: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
  },
});

/*
function renderStatus() {
    return (
      <Button
        buttonStyle={[
          styles.buttonStyle,
          {
            backgroundColor: isTravel
              ? global.COLOR_MAIN
              : freightWish.length > 0
              ? 'green'
              : 'red',
          },
        ]}
        onPress={() => {
          if (isTravel) {
            navigation.navigate('myTravelsStack');
          } else {
            if (freightWish.length > 0) {
              navigation.navigate('freightOffersStack');
            } else {
              navigation.navigate('freightWishStack');
            }
          }
        }}
        title={
          isTravel
            ? 'traveling'
            : freightWish.length > 0
            ? 'available'
            : 'unavailable'
        }
        titleStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
      />
    );
  }
  */

/*
 const loopCtes = (listasCtes) => {
    let stopLoop = false    
    for (const pedido of listasCtes) {
      let km = 0
      if (pedido.tipo_pedido == 'O' ) {
        const initialTime = moment(new Date())
        const endTime = moment(pedido.cte_previsao)
        const duration = moment.duration(endTime.diff(initialTime)).asHours()
        if (pedido.sucursal_origen) {
          if (
            JSON.parse(pedido.movilidad_cargue_paso).length == 0
          ) {
            GeoLocation.getCurrentPosition(info => {
              const currentLocation = {
                lat: info.coords.latitude,
                lng: info.coords.longitude,
              }
              const secondModal = JSON.parse(`[${pedido.sucursal_origen}]`)
              km = calcCrow(currentLocation.lat, currentLocation.lng, secondModal[0], secondModal[1])
              if ( km <= .1 ) {
                setGeoCercas(pedido)
                stopLoop = true
                return
              }
            }, error => 
              console.log('Error', JSON.stringify(error)),
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
            ) 
          }
          if (stopLoop) {
            break;
          }
        }
 
        if (pedido.cte_local_entrega) {
          console.log(pedido.movilidad_cargue_paso)
          if (JSON.parse(pedido.movilidad_cargue_paso).length == 3) {
            GeoLocation.getCurrentPosition(info => {
              const currentLocation = {
                lat: info.coords.latitude,
                lng: info.coords.longitude,
              }
              console.log('1')
              const firsModalLocation = JSON.parse(`[${pedido.cte_local_entrega}]`)
              km = calcCrow(currentLocation.lat, currentLocation.lng, firsModalLocation[0], firsModalLocation[1])
              if (km <= .1 ) {
                setGeoCercasFinal(pedido)
                stopLoop = true
                return
              }
            }, error => 
              Alert.alert('Error', JSON.stringify(error)),
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
            ) 
            console.log(2)
          }
          if (stopLoop) {
            break
          }
        }
    
        if (JSON.parse(pedido.movilidad_cargue_paso).length < 4) { 
          if (duration < 3 && duration > 1) {
            setItemNoLlegadaTiempo(pedido)
            setModalAlertaNoLlegadaAmarillo(true)
            stopLoop = true
            return;
          } else if (duration <= 1) {
            setItemNoLlegadaTiempo(pedido)
            setModalAlertaNoLlegadaRojo(true)
            stopLoop = true
            return;
          } 
        }
        if (stopLoop) {
          break;
        }
      }
      
    }
    setLoading(false)
  }

    const calcCrow = (lat1, lon1, lat2, lon2) => {
    let R = 6371; // km
    let dLat = toRad(lat2 - lat1);
    let dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  };
  */

/*
  useEffect(() => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
        enableHeadless: true,
      },
      (taskId) => {
        console.log('[js] Received background-fetch event');
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });

    // BackgroundTimer.runBackgroundTimer(async () => {
    // //   //await syncData();

    // //   deleteData();
    // // }, 60000);

    // // return () => {
    // //   BackgroundTimer.stopBackgroundTimer();
    // //   BackgroundTimer.stop();
    // // };
  }, []);
  */

/*
  useEffect(() => {
    function onReceived(notification) {
      console.log('Notification received: ', notification);
      dispatch(getPreventiveMonitoringByCnhId(cnh.id));
    }

    function onOpened(openResult) {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
    }
    
    function onIds(device) {
      dispatch(getDeviceId(device.userId));

      setDevices(login.moto_id, device.userId);
      if (Platform.OS === 'android') {
        NativeModules.SmiSdkReactModule.updateUserId(device.userId);
      } else {
        NativeModules.RnSmiSdk.updateUserId(device.userId);
      }
    }

    // OneSignal.init(global.ONESIGNAL_APP_ID);

    // OneSignal.addEventListener('received', onReceived);

    // OneSignal.addEventListener('opened', onOpened);

    // OneSignal.addEventListener('ids', onIds);

    return () => {
      // OneSignal.removeEventListener('received', onReceived);
      // OneSignal.removeEventListener('opened', onOpened);
      // OneSignal.removeEventListener('ids', onIds);
    };
  }, [cnh.id, dispatch, login.moto_id]);
  */
