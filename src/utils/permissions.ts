import {Alert, PermissionsAndroid} from 'react-native';
// utils
import {Logger} from '.';
import {Mixpanel} from '../analitycs';

const TAG = 'src/utils/permissins';

/**
 * Ask fine location permission
 * @returns
 */
async function askFineLocation() {
  Logger.log('request ACCESS_FINE_LOCATION');
  return new Promise(async (resolve, _) => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Torre de control necesita acceder a su ubicación',
          message:
            'Para localizar los pedidos que se encuentran a su alrededor',
          //buttonNeutral: 'Ask Me Later',
          //buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      Logger.log(`request ACCESS_FINE_LOCATION ${result}`);
      Mixpanel.log(`ACCESS FINE LOCATION`, {result});
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(true);
      } else {
        Alert.alert('Necesitamos su permiso para continuar');
        resolve(false);
      }
    } catch (error) {
      Logger.recordError(error, TAG);
      resolve(false);
    }
  });
}

async function askBackgroundLocation() {
  Logger.log('request ACCESS_BACKGROUND_LOCATION');
  return new Promise(async (resolve, _) => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Torre de control necesita acceder a su ubicación',
          message:
            'Para localizar los pedidos que se encuentran a su alrededor, porfavor seleccione SIEMPRE en los permisos de ubicación',
          //buttonNeutral: 'Ask Me Later',
          //buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      Logger.log(`request ACCESS_BACKGROUND_LOCATION ${result}`);
      Mixpanel.log(`ACCESS BACKGROUND LOCATION`, {result});
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(true);
      } else {
        Alert.alert('Necesitamos acceder a tu ubicación para continuar');
        resolve(false);
      }
    } catch (error) {
      Logger.recordError(error, TAG);
      resolve(false);
    }
  });
}

/*
export async function getGlobalPermission() {
  Logger.log('request ACCESS_FINE_LOCATION');
  const fineLocationGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Torre de control necesita acceder a su ubicación',
      message: 'Para localizar los pedidos que se encuentran a su alrededor',
      //buttonNeutral: 'Ask Me Later',
      //buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  Mixpanel.log(`ACCESS FINE LOCATION`, {result: fineLocationGranted})
  if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
    Alert.alert('Necesitamos su permiso para continuar');
    getGlobalPermission();
  }
  Logger.log('request ACCESS_BACKGROUND_LOCATION');
  const backgrounfLocationGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    {
      title: 'Torre de control necesita acceder a su ubicación',
      message:
        'Para localizar los pedidos que se encuentran a su alrededor, porfavor seleccione SIEMPRE en los permisos de ubicación',
      //buttonNeutral: 'Ask Me Later',
      //buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  Mixpanel.log(`ACCESS BACKGROUND LOCATION`, {result: backgrounfLocationGranted})
  if (backgrounfLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
    Alert.alert('Necesitamos su permiso para continuar');
    getGlobalPermission();
  }
}
*/

export default {
  askFineLocation,
  askBackgroundLocation,
};
