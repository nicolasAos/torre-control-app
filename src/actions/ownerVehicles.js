import api from '../services/apiGo';
import Validator from 'email-validator';
import {OWNERS_VEHICLES} from './types';

export const set = (params) =>
  new Promise((resolve, reject) => {
    let paramNames;
    if (params.isCpf === 'F') {
      paramNames = ['name', 'cpfFormated', 'rg', 'typeCarrier', 'emailOwner'];
    } else {
      paramNames = ['razao', 'cnpjFormated', 'ie', 'typeCarrier', 'emailOwner'];
    }
    const emptyVariables = [];
    paramNames.forEach((element) => {
      if (typeof params[element] === 'undefined') {
        emptyVariables.push(element);
      }
    });

    if (emptyVariables.length > 0) {
      throw new Error('actions.owner-vehicles.fill-in-all-fields');
    }

    if (params.isCpf === 'F' && params.cpfFormated.length != 11) {
      throw new Error('actions.owner-vehicles.valid-cpf');
    }

    if (params.isCpf === 'J' && params.cnpjFormated.length != 14) {
      throw new Error('actions.owner-vehicles.valid-cnpj');
    }

    if (!Validator.validate(params.emailOwner)) {
      throw new Error('actions.owner-vehicles.valid-email');
    }

    if (!params.cnhId) {
      throw new Error('actions.owner-vehicles.response-new-owner');
    }

    let paramsRequest;
    if (params.isCpf === 'F') {
      paramsRequest = {
        cnh_id: params.cnhId,
        tipo_transp: params.typeCarrier,
        tipo_pessoa: params.isCpf,
        nome: params.name,
        cpf_cnpj: params.cpfFormated,
        rg_ie: params.rg,
        email: params.emailOwner,
      };
    } else {
      paramsRequest = {
        cnh_id: params.cnhId,
        tipo_transp: params.typeCarrier,
        tipo_pessoa: params.isCpf,
        nome: params.razao,
        cpf_cnpj: params.cnpj,
        rg_ie: params.ie,
        email: params.emailOwner,
      };
    }

    let request;
    let url;

    if (params.ownerId) {
      paramsRequest.id = params.ownerId;
      request = api.put;
      url = `proprietario/${params.ownerId}`;
    } else {
      request = api.post;
      url = 'proprietario';
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

export const getById = (id) =>
  new Promise((resolve, reject) => {
    api
      .get(`proprietario/${id}`)
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

export const getOwners = (cnhId) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .get(`cnh/proprietarios/${cnhId}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: OWNERS_VEHICLES,
            payload: data.data,
          });
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });
