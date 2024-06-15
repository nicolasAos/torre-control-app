import api from '../services/api';
import apiTorre from '../services/apiTorreControl';
import {ETA_CALCULATION, LOCATION_SUCCESS} from './types';
import {getDateBD} from '../configs/utils';
import {getTravel, setTransportStatusGps} from '../database/models/transport';
import {setTracking} from '../database/models/tracking';
import {store} from '../store';
import {motoIdSelector, deviceIdSelector} from '../reducers/selectors';
import moment from 'moment';
// import { GOOGLE_MAPS_KEY } from "@env";
import {Mixpanel} from '../analitycs';
import {Logger, Offline} from '../utils';

const TAG = 'src/actions/geolocation';

export const sendLocation = (location: any) =>
  new Promise(async (resolve) => {
    Logger.log('API post => sendLocation');
    store.dispatch({type: LOCATION_SUCCESS, payload: location});
    const uri = 'location-device';
    const moto_id = motoIdSelector(store.getState());
    const device_id = deviceIdSelector(store.getState());
    const data = await getTravel(moto_id);
    if (data.length > 0) {
      const evento =
        'actions.geolocation.transport-position ' +
        data[0].rom_id +
        ' (' +
        getDateBD() +
        ')';
      const id_geo = data[0].rom_id;
      const bodyData = {
        latitude: location.latitude,
        longitude: location.longitude,
        device_data: moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z'),
        device_id: device_id,
        id_geo,
        evento,
      };
      console.log({device_id});

      if (device_id !== {}) {
        apiTorre
          .post(uri, bodyData)
          .then((response) => response.data)
          .then(async (data) => {
            if (!data.success) {
              await setTracking({
                moto_id,
                device_id,
                latitude: location.latitude.toString(),
                longitude: location.longitude.toString(),
                device_data: moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z'),
                id_geo,
                evento,
                sync: 0,
              });
              Logger.log(`Api post => sendLocation successful ✅`);
            }
            resolve();
          })
          .catch(async () => {
            Logger.log('API post => sendLocation failed ❌');
            await setTracking({
              moto_id,
              device_id,
              latitude: location.latitude.toString(),
              longitude: location.longitude.toString(),
              device_data: moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z'),
              id_geo,
              evento,
              sync: 0,
            });
            resolve();
          });
      }
    } else {
      resolve();
    }
  });

/**
 * Send current location to the API
 * [x]: Catched
 * @param location
 * @param user_id
 * @param placa_id
 * @param deviceID
 * @returns
 */
export const sendLocationPrime = (
  location: any,
  user_id: any,
  placa_id: any,
  deviceID: string,
) =>
  new Promise(async (resolve) => {
    Mixpanel.log('Send Location Prime');
    Logger.log(`Api post => sendLocationPrime`);
    // just update store [home reducer]
    store.dispatch({type: LOCATION_SUCCESS, payload: location});
    //
    const uri = 'location-device';
    const {latitude, longitude} = location;
    const device_id = deviceID; //deviceIdSelector(store.getState());
    const device_data = moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z');

    if (typeof device_id !== 'object') {
      // body data
      const bodyData = {
        latitude,
        longitude,
        device_data,
        device_id,
        placa_id,
        user_id,
        street_number: '',
        route: '',
        neighborhood: '',
        sublocality: '',
        locality: '',
        administrative_area_level_1: '',
        country: '',
        postal_code: '',
      };

      try {
        const response = await apiTorre.post(uri, bodyData);
        const data = await response.data;
        Mixpanel.log('Send Location Prime Successful', data);
        Logger.log(`Api post => sendLocationPrime successful ✅`);
        resolve(true);
      } catch (error: any) {
        Mixpanel.log('Send Location Prime Failed', {error: JSON.stringify(error, null, 2)});
        Logger.recordError(error, TAG);
        if (true) {
          Offline.catchEvent(uri, bodyData);
        } else {
          Logger.log(`Api post => sendLocationPrime error ❌`);
        }
        resolve(false);
      }
    } else {
      Mixpanel.log('Send Location Prime No device_id', {
        deviceID,
      });
      Logger.log(`Api post => sendLocationPrime no device_id ❌`);
      resolve(false);
    }
  });

/**
 * Send location to the API
 * @param location
 * @param travel_id
 * @param start_travel
 * @param placa_id
 * @param user_id
 * @returns
 */
export const sendLocationEvent = (
  location: any,
  travel_id: string,
  start_travel: string,
  placa_id: string, // JRY682
  user_id: string,
  deviceID: string,
) =>
  new Promise(async (resolve) => {
    const uri = 'location-device';
    Logger.log('API post => sendLocationEvent');
    // update store
    store.dispatch({type: LOCATION_SUCCESS, payload: location});
    const moto_id = motoIdSelector(store.getState());
    const device_id = deviceID ? deviceID : '123456';
    const device_data = moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z');
    console.log({
      moto_id,
      device_id,
      user_id,
      placa_id,
      travel_id,
      location,
      device_data,
      start_travel,
    });

    if (device_id) {
      const bodyData = {
        latitude: location.latitude,
        longitude: location.longitude,
        device_data,
        device_id,
        travel_id,
        start_travel,
        placa_id,
        user_id: user_id ? user_id : '123456',
      };

      try {
        const response = await apiTorre.post(uri, bodyData);
        const data = await response.data;
        if (data.success) {
          Logger.log('API post => sendLocationEvent successful ✅');
          store.dispatch({type: ETA_CALCULATION, payload: data.data});
          resolve(true);
        }
        if (!data.success) {
          // store smth in realm
          await setTracking({
            moto_id,
            device_id,
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString(),
            device_data: new Date().toISOString(),
            travel_id,
            placa_id,
            start_travel,
            sync: 0,
          });
          resolve(true);
        }
      } catch (error) {
        Logger.recordError(error, TAG);
        if (JSON.stringify(error).includes('Network Error')) {
          Offline.catchEvent(uri, bodyData);
        } else {
          Logger.log('API post => sendLocationEvent failed ❌');
        }
        // store smth in realm
        await setTracking({
          moto_id,
          device_id,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          device_data: new Date().toISOString(),
          travel_id,
          start_travel,
          sync: 0,
        });
        resolve(false);
      }
    }
  });

export const getTravelIsRunning = () =>
  new Promise(async (resolve) => {
    const motoId = motoIdSelector(store.getState());
    const data = await getTravel(motoId);
    resolve(data);
  });

export const sendLocationBackground = () =>
  new Promise(async (resolve) => {
    Logger.log('API post => sendLocationBackground');
    const location = {latitude: '', longitude: ''};
    const moto_id = motoIdSelector(store.getState());
    const device_id = deviceIdSelector(store.getState());
    const data = await getTravel(moto_id);
    if (data.length > 0) {
      if (!location.latitude) {
        return;
      }
      const evento =
        'actions.geolocation.transport-position ' +
        data[0].rom_id +
        ' (' +
        getDateBD() +
        ')';
      const id_geo = data[0].rom_id;
      if (device_id !== {}) {
        try {
          await apiTorre.post('location-device', {
            latitude: location.latitude,
            longitude: location.longitude,
            device_data: moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z'),
            device_id: device_id,
            id_geo,
            evento,
          });
        } catch (e) {
          await setTracking({
            moto_id,
            device_id,
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString(),
            device_data: moment().utc().format('Y-MM-DD HH:mm:ss.SSS Z'),
            id_geo,
            evento,
            sync: 0,
          });
        }
      }
    }
    resolve();
  });
