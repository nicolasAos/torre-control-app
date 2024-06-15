import api, {baseURL, baseURLHomolog, getToken} from '../services/apiGo';
import RNFetchBlob from 'rn-fetch-blob';
import {GET_VEHICLES_SUCCESS} from './types';
import {loginHomologSelector} from '../reducers/selectors';
import {store} from '../store';

export const set = (params) =>
  new Promise(async (resolve, reject) => {
    const paramNames = ['tracker', 'fuel', 'plate'];

    if (params.requiresTruckBody === '0') {
      paramNames.push('m3');
      paramNames.push('ton');
      paramNames.push('pallets');
      paramNames.push('typeTruckBody');
    }

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
      reject(new Error('Por favor, preencha todos os campos.'));
      return;
    }

    let url;

    const paramsRequest = [
      {name: 'cnh_id', data: params.cnhId.toString()},
      {name: 'rastreador_id', data: params.tracker.toString()},
      {name: 'tipo_combustivel_id', data: params.fuel.toString()},
      {name: 'placa', data: params.plate},
    ];

    if (params.requiresTruckBody === '0') {
      paramsRequest.push({name: 'metros_cubicos', data: params.m3});
      paramsRequest.push({name: 'toneladas', data: params.ton});
      paramsRequest.push({name: 'pallets', data: params.pallets});
    }

    if (params.requiresTruckBody === '1') {
      paramsRequest.push({
        name: 'tipo_carroceria',
        data: params.typeTruckBody.toString(),
      });
    }

    if (params.vehicleId) {
      url = `veiculo/${params.vehicleId}`;
    } else {
      url = 'veiculo';
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
      .get(`veiculo/${id}`)
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

export const getVehiclesByCnhId = (cnhId) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .get(`cnh/veiculos/${cnhId}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({type: GET_VEHICLES_SUCCESS, payload: data.data});
          resolve(data.data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
