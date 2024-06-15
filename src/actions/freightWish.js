import api from '../services/apiGo';
import NetInfo from '@react-native-community/netinfo';
import {FREIGHT_WISH_SUCCESS} from './types';
import {getTravel} from '../database/models/transport';

export const setAvailability = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (params.id) {
      api
        .put(`disponibilidade/${params.id}`, {
          ativo: params.enabledFreight ? 1 : 0,
        })
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            dispatch({type: FREIGHT_WISH_SUCCESS, payload: []});
            data.data.id = null;
            resolve(data.data);
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(async (error) => {
          const netIsConnected = await NetInfo.fetch();
          if (!netIsConnected.isConnected) {
            reject(new Error('actions.freigth-wish.check-connection'));
          } else {
            reject(error);
          }
        });
    } else {
      
    }
  });

export const getAvailability = (cnh_id, moto_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .get(`cnh/${cnh_id}/disponibilidade`)
      .then((response) => response.data)
      .then(async (data) => {
        if (data.success) {
          const travel = await getTravel(moto_id);
          const availability = {};
          availability.data = data.data[0];
          availability.isTravel = travel.length > 0;
          dispatch({
            type: FREIGHT_WISH_SUCCESS,
            payload: typeof data.data[0] !== 'undefined' ? [data.data[0]] : [],
          });
          resolve(availability);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(async (error) => {
        const netIsConnected = await NetInfo.fetch();
        if (!netIsConnected.isConnected) {
          reject(new Error('actions.freigth-wish.check-connection'));
        } else {
          reject(error);
        }
      });
  });

export const sendDeviceId = (cnh_id, deviceId) => {
  api.post(`cnh/${cnh_id}`, {
    device_id: deviceId,
  });
};
