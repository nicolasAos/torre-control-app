import api from '../services/apiGo';
import Validator from 'email-validator';
import {cnhSelector} from '../reducers/selectors';
import {RESPONSIBLE_FREIGHT_SUCCESS} from '../actions/types';

export const set = (params) =>
  new Promise((resolve, reject) => {
    let paramNames;
    paramNames = ['name', 'telCell1Formated', 'email'];

    const emptyVariables = [];
    paramNames.forEach((element) => {
      if (typeof params[element] === 'undefined') {
        emptyVariables.push(element);
      }

      if (params[element] === '') {
        emptyVariables.push(element);
      }
    });

    if (emptyVariables.length > 0) {
      throw new Error('actions.responsible-freigth.fill-in-all-fields');
    }

    if (
      params.telCell1Formated.length !== 10 &&
      params.telCell1Formated.length !== 11
    ) {
      throw new Error('actions.responsible-freigth.cell-phone-valid');
    }

    if (
      params.telCell2Formated &&
      params.telCell2Formated.length !== 10 &&
      params.telCell2Formated.length !== 11
    ) {
      throw new Error('actions.responsible-freigth.cell-phone-valid');
    }

    if (!Validator.validate(params.email)) {
      throw new Error('actions.responsible-freigth.valid-email');
    }

    let paramsRequest;
    paramsRequest = {
      nome: params.name,
      tel_1: params.telCell1Formated,
      email: params.email,
      cnh_id: params.cnhId,
    };

    if (
      params.telCell2Formated !== '' &&
      typeof params.telCell2Formated !== 'undefined'
    ) {
      paramsRequest.tel_2 = params.telCell2Formated;
    }

    let request;
    let url;

    if (params.responsibleId) {
      paramsRequest.id = params.responsibleId;
      request = api.put;
      url = `responsavel-frete/${params.responsibleId}`;
    } else {
      request = api.post;
      url = 'responsavel-frete';
    }

    request(url, paramsRequest)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const getByIdCNH = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const cnh = cnhSelector(getState());

    api
      .get(`cnh/responsavel/${cnh.id}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: RESPONSIBLE_FREIGHT_SUCCESS,
            payload: data.data[0],
          });
          resolve(data.data[0]);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });
