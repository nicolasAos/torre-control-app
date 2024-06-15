import React, {useState, useEffect, useContext} from 'react';
import {View, Dimensions, Switch, Text, StyleSheet} from 'react-native';
import ReactNativePicker from 'react-native-picker-select';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginSelector,
  cnhSelector,
  vehiclesSelector,
  truckBodiesSelector,
  deviceIdSelector,
} from '../../reducers/selectors';
import {getAvailability, setAvailability} from '../../actions/freightWish';
import {Loading, Modal, Card} from '../../components';
import {NavigationContext, StackActions} from 'react-navigation';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');

const placeholderPickerVehicles = {
  label: '',
  value: null,
  color: '#9EA0A4',
};

const placeholderPickerTruckBodies = {
  label: '',
  value: null,
  color: '#9EA0A4',
};

const FreightWish = () => {
  const navigation = useContext(NavigationContext);

  const dispatch = useDispatch();

  const {cnh, login, vehicles, truckBodies, deviceId} = useSelector(
    (state) => ({
      cnh: cnhSelector(state),
      login: loginSelector(state),
      vehicles: vehiclesSelector(state, true),
      truckBodies: truckBodiesSelector(state, true),
      deviceId: deviceIdSelector(state),
    }),
  );

  const [t] = useTranslation('screens');

  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [truckBodyRequired, setTruckBodyRequired] = useState(0);
  const [vehicleId, setVehicleId] = useState(null);
  const [truckBodyId, setTruckBodyId] = useState(null);
  const [message, setMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [enabledFreight, setEnabledFreight] = useState(false);
  const [showDirectRoute, setShowDirectRoute] = useState(false);
  const [enabledIdStatus, setEnabledIdStatus] = useState(false);
  const [isTravel, setIsTravel] = useState(false);
  const [vehicle, setVehicle] = useState({});

  useEffect(() => {
    dispatch(getAvailability(cnh.id, login.moto_id))
      .then(({data, isTravelValue}) => {
        setLoading(false);
        setIsTravel(isTravelValue);

        if (data) {
          setId(data.id);
          setEnabledFreight(data.ativo == 1 ? true : false);
          setVehicleId(parseInt(data.veiculo_id));
          setEnabledIdStatus(parseInt(data.status_disponibilidades_id));
          setTruckBodyId(parseInt(data.carroceria_id));
        }
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setMessage(error.message);
          setShowDirectRoute(true);
        }, 500);
      });
  }, [dispatch, cnh, login]);

  function enableDisableAvailability() {
    if (enabledFreight) {
      // saveAvailability();
    } else {
      setLoading(false);

      setTimeout(() => setShowDisable(true), 500);
    }
  }

  function saveAvailability() {
    dispatch(
      setAvailability({
        cnh_id: cnh.id,
        deviceId: deviceId,
        loading: loading,
        id: id,
        truckBodyRequired: truckBodyRequired,
        vehicleId: vehicleId,
        truckBodyId: truckBodyId,
        message: message,
        showError: showError,
        showSuccess: showSuccess,
        showDisable: showDisable,
        enabledFreight: enabledFreight,
        showDirectRoute: showDirectRoute,
        enabledIdStatus: enabledIdStatus,
        isTravel: isTravel,
      }),
    )
      .then((data) => {
        setLoading(false);
        setVehicleId(enabledFreight ? vehicleId : null);
        setTruckBodyId(enabledFreight ? truckBodyId : null);
        setId(data.id);

        setTimeout(() => {
          setMessage(
            enabledFreight
              ? 'wanna-freight.available-success'
              : 'wanna-freight.available-failed',
          );
          setShowSuccess(true);
        }, 500);
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          setEnabledFreight(!enabledFreight);
          setMessage(error.message);
          setShowSuccess(true);
        }, 500);
      });
  }

  function renderAlert() {
    return (
      <View style={[styles.containerCards, {alignItems: 'center'}]}>
        <Text style={styles.alert}>
          {t('menu.offers.wanna-freight.warning-preferences')}
        </Text>
      </View>
    );
  }

  function renderInputVehicles() {
    return (
      <View>
        <Text style={{marginTop: 10, color: 'black', fontSize: 16}}>
          {t('menu.offers.wanna-freight.vehicle')}
        </Text>
        <Card>
          <View style={styles.containerPlate}>
            <View style={styles.plateText}>
              <Text style={[styles.titlePlate, {color: 'white', fontSize: 20}]}>
                {vehicle &&
                vehicle.tipo_veiculo &&
                vehicle.tipo_veiculo.descricao
                  ? vehicle.tipo_veiculo.descricao
                  : t('menu.offers.wanna-freight.license-plate').toUpperCase()}
              </Text>
            </View>
            <View style={styles.plate}>
              <ReactNativePicker
                selectedValue={vehicleId}
                value={vehicleId}
                disabled={enabledFreight}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: {
                    textAlign: 'center',
                    alignItems: 'center',
                    width: width / 1.1,
                    fontSize: 30,
                    borderRadius: 8,
                    color: 'black',
                    fontWeight: 'bold',
                  },
                  inputIOS: {
                    textAlign: 'center',
                    alignItems: 'center',
                    width: width / 1.1,
                    fontSize: 30,
                    borderRadius: 8,
                    color: 'black',
                    fontWeight: 'bold',
                  },
                }}
                onValueChange={(itemValue, itemIndex) => {
                  setVehicleId(itemValue);
                  setTruckBodyId(
                    itemValue != null
                      ? vehicles[itemIndex - 1].tipo_carroceria !== null
                        ? null
                        : truckBodyId
                      : null,
                  );
                  setVehicle(itemValue != null ? vehicles[itemIndex - 1] : {});
                  setTruckBodyRequired(
                    itemValue != null
                      ? vehicles[itemIndex - 1].tipo_veiculo.requer_carreta
                      : 0,
                  );
                }}
                placeholder={placeholderPickerVehicles}
                items={vehicles}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  }

  function renderInputTruckBodies() {
    if (truckBodyRequired != 1) {
      return;
    }

    return (
      <View>
        <Text style={{marginTop: 10, color: 'black', fontSize: 16}}>
          Carroceria
        </Text>
        <Card>
          <View style={styles.containerPlate}>
            <View style={styles.plateText}>
              <Text style={[styles.titlePlate, {color: 'white', fontSize: 20}]}>
                {t('menu.offers.wanna-freight.license-plate').toUpperCase()}
              </Text>
            </View>
            <View style={styles.plate}>
              <ReactNativePicker
                selectedValue={truckBodyId}
                value={truckBodyId}
                disabled={enabledFreight}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: {
                    textAlign: 'center',
                    alignItems: 'center',
                    width: width / 1.1,
                    fontSize: 30,
                    borderRadius: 8,
                    color: 'black',
                    fontWeight: 'bold',
                  },
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setTruckBodyId(itemValue)
                }
                placeholder={placeholderPickerTruckBodies}
                items={truckBodies}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  }

  function renderAvailable() {
    return (
      <View style={styles.containerHorizontal}>
        <Text style={styles.text}>
          {t('menu.offers.wanna-freight.i-am-available')}
        </Text>
        <Switch
          onValueChange={(value) => {
            setLoading(true);
            setEnabledFreight(value);

            enableDisableAvailability();
          }}
          value={enabledFreight}
          disabled={enabledIdStatus == 3 || isTravel}
          thumbTintColor={enabledFreight ? '#273381' : 'white'}
          trackColor={{true: '#2E5B88', false: '#C0C0C0'}}
          style={{transform: [{scaleX: 1.8}, {scaleY: 1.8}]}}
        />
      </View>
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
            onPress: () => {
              setMessage('');
              setShowSuccess(false);
            },
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
              setMessage('');
              setShowError(false);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalDisable() {
    return (
      <Modal
        isVisible={showDisable}
        title="attention"
        bodyText="actions.freigth-offers.remove-vehicle-warning"
        buttons={[
          {
            onPress: () => {
              setShowDisable(false);
              setEnabledFreight(!enabledFreight);
            },
            text: 'cancel',
            backgroundColor: 'red',
          },
          {
            onPress: () => {
              setShowDisable(false);
              setTimeout(() => {
                setLoading(true);
                // saveAvailability();
              }, 500);
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  function renderModalDirect() {
    return (
      <Modal
        isVisible={showDirectRoute}
        title="attention"
        bodyText={message}
        buttons={[
          {
            onPress: () => {
              setShowDirectRoute(false);
              navigation.dispatch(StackActions.pop());
            },
            text: 'ok-got-it',
            backgroundColor: global.COLOR_MAIN,
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      {renderModalSuccess()}
      {renderModalError()}
      {renderModalDisable()}
      {renderModalDirect()}
      {renderAlert()}
      {renderInputVehicles()}
      {renderInputTruckBodies()}
      {renderAvailable()}
    </View>
  );
};

export default FreightWish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.COLOR_BACKGROUND,
    alignItems: 'center',
  },
  containerCards: {
    backgroundColor: '#E96734',
    elevation: 2,
    height: 60,
    width,
    justifyContent: 'center',
  },
  containerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: width / 1.1,
    marginTop: 20,
  },
  text: {
    color: 'black',
    fontSize: 22,
  },
  alert: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
  plateText: {
    width: width / 1.1,
    backgroundColor: 'blue',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    marginTop: 3,
    paddingVertical: 5,
  },
  plate: {
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    width: width / 1.1,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPlate: {
    borderWidth: 5,
    borderRadius: 15,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  titlePlate: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
