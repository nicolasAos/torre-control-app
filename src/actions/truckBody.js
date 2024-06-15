import api, {baseURL, baseURLHomolog, getToken} from '../services/apiGo';
import RNFetchBlob from 'rn-fetch-blob';
import {GET_TRUCK_BODIES_SUCCESS} from './types';
import {loginHomologSelector} from '../reducers/selectors';
import {store} from '../store';

export const set = (params) =>
  new Promise(async (resolve, reject) => {
    const paramNames = [
      'plate',
      'typeTruckBody',
      'tracker',
      'pallets',
      'ton',
      'm3',
    ];

    const undefinedVariables = [];

    paramNames.forEach((element) => {
      if (typeof params[element] === 'undefined') {
        undefinedVariables.push(element);
      }

      if (params[element] === '') {
        undefinedVariables.push(element);
      }

      if (params[element] === null) {
        undefinedVariables.push(element);
      }
    });

    if (undefinedVariables.length > 0) {
      reject(new Error('actions.truck-body.fill-in-all-fields'));
      return;
    }

    const paramsRequest = [
      {name: 'cnh_id', data: params.cnhId.toString()},
      {name: 'tipo_carrocerias_id', data: params.typeTruckBody.toString()},
      {name: 'rastreador_id', data: params.tracker.toString()},
      {name: 'pallets', data: params.pallets},
      {name: 'toneladas', data: params.ton},
      {name: 'metros_cubicos', data: params.m3},
      {name: 'placa', data: params.plate},
    ];

    let url;

    if (params.truckBodyId) {
      url = `carroceria/${params.truckBodyId}`;
    } else {
      url = 'carroceria';
    }

    const token = await getToken();

    const base_url = loginHomologSelector(store.getState())
      ? baseURLHomolog
      : baseURL;

    RNFetchBlob.fetch(
      'POST',
      base_url + url,
      {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      paramsRequest,
    )
      .then((response) => response.data)
      .then((data) => {
        data = JSON.parse(data);
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const getById = (id) =>
  new Promise((resolve, reject) => {
    api
      .get(`carroceria/${id}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data.data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const getTruckBodiesByCnhId = (cnhId) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .get(`cnh/carrocerias/${cnhId}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({type: GET_TRUCK_BODIES_SUCCESS, payload: data.data});
          resolve(data.data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
