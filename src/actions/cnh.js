import api, {baseURL, baseURLHomolog, getToken} from '../services/apiGo';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {loginSelector, loginHomologSelector} from '../reducers/selectors';
import {CNH_SUCCESS} from './types';

/**
 * @description
 * Retorna a CNH do motorista.
 *
 * @returns {Promise}
 */
export const get = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const driver = loginSelector(getState());

    api
      .get(`cnh/motorista/${driver.moto_id}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: CNH_SUCCESS,
            payload: data.data,
          });
          resolve(data.data);
        } else {
          resolve({});
        }
      })
      .catch(reject);
  });

/**
 * @description
 * Cria uma CNH a partir dos dados passados.
 *
 * @param {Int} params.cnhId - ID da CNH (Caso tenha irá realizar o put ao invés do post)
 * @param {Int} params.driverId - ID do motorista
 * @param {Int} params.cnh - Número da CNH
 * @param {Int} params.cnhCategory - CNH categoria (A, B, C, D ou E)
 * @param {Int} params.cnhPhoto - uri
 * @param {Int} params.cnhDate - Format DD/MM/YYYY
 * @param {Int} params.driverPhoto - uri
 * @param {Int} params.mopp - Int 0 (Desativado) / 1 (Ativado)
 * @param {Int} params.moppDate - Format DD/MM/YYYY - (Opcional)
 *
 * @returns {Promise}
 */
export const set = (params) => (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    let paramNames;
    if (params.mopp === 1) {
      paramNames = [
        'driverId',
        'cnhCategory',
        'cnh',
        'cnhDate',
        'cnhPhoto',
        'driverPhoto',
        'mopp',
        'moppDate',
      ];
    } else {
      paramNames = [
        'driverId',
        'cnhCategory',
        'cnh',
        'cnhDate',
        'cnhPhoto',
        'driverPhoto',
      ];
    }
    const undefinedVariables = [];

    paramNames.forEach((element) => {
      if (typeof params[element] === 'undefined') {
        undefinedVariables.push(element);
      }
      if (params[element] === '') {
        undefinedVariables.push(element);
      }
    });

    if (undefinedVariables.length > 0) {
      throw new Error('actions.cnh.fill-in-all-fields');
    }

    if (params.cnh.length !== 11) {
      throw new Error('actions.cnh.cnh-number-valid');
    }

    const cnhDateMoment = moment(params.cnhDate, 'DD/MM/YYYY');
    if (!cnhDateMoment.isValid()) {
      throw new Error('actions.cnh.date-formate');
    }

    const cnhFormatedDate = moment(params.cnhDate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );

    let paramsRequest = [
      {name: 'motorista_id', data: params.driverId.toString()},
      {name: 'categoria_id', data: params.cnhCategory.toString()},
      {name: 'cnh', data: params.cnh},
      {name: 'cnh_validade', data: cnhFormatedDate},
      {name: 'mopp', data: params.mopp.toString()},
      {name: 'device_id', data: params.deviceId},
    ];

    if (params.mopp === 1) {
      const moppDateMoment = moment(params.moppDate, 'DD/MM/YYYY');
      if (!moppDateMoment.isValid()) {
        throw new Error('actions.cnh.date-formate');
      }
      const moppFormatedDate = moment(params.moppDate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      );
      paramsRequest.push({
        name: 'mopp_validade',
        data: moppFormatedDate,
      });
    }

    if (params.cnhPhoto.fileName) {
      paramsRequest.push({
        name: 'foto_cnh',
        filename: params.cnhPhoto.fileName,
        data: RNFetchBlob.wrap(params.cnhPhoto.path),
      });
    }

    if (params.driverPhoto.fileName) {
      paramsRequest.push({
        name: 'foto_motorista',
        filename: params.driverPhoto.fileName,
        data: RNFetchBlob.wrap(params.driverPhoto.path),
      });
    }

    let url;

    if (params.cnhId) {
      url = `cnh/${params.cnhId}`;
    } else {
      url = 'cnh';
    }

    const token = await getToken();
    const base_url = loginHomologSelector(getState())
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
          dispatch({
            type: CNH_SUCCESS,
            payload: data.data,
          });
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
