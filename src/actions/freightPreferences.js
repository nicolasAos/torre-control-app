import api from '../services/apiGo';
import NetInfo from '@react-native-community/netinfo';
import {FREIGHT_PREFERENCES_SUCCESS} from './types';

export const setPreferences = (moto_id, params, regions) => (dispatch) =>
  new Promise((resolve, reject) => {
    var destinos = [];
    if (params.isPreferences) {
      if (!params.shortRoute && !params.longRoute) {
        throw new Error('actions.freigth-references.route-length');
      }

      if (
        !params.centroOeste &&
        !params.norte &&
        !params.sul &&
        !params.nordeste &&
        !params.sudeste
      ) {
        throw new Error('actions.freigth-references.select-region');
      }

      destinos = regions.map((region) => {
        if (region.descricao === 'SUL') {
          return {...region, regiao_id: region.id, ativo: params.sul ? 1 : 0};
        }
        if (region.descricao === 'SUDESTE') {
          return {
            ...region,
            regiao_id: region.id,
            ativo: params.sudeste ? 1 : 0,
          };
        }
        if (region.descricao === 'CENTRO OESTE') {
          return {
            ...region,
            regiao_id: region.id,
            ativo: params.centroOeste ? 1 : 0,
          };
        }
        if (region.descricao === 'NORTE') {
          return {...region, regiao_id: region.id, ativo: params.norte ? 1 : 0};
        }
        if (region.descricao === 'NORDESTE') {
          return {
            ...region,
            regiao_id: region.id,
            ativo: params.nordeste ? 1 : 0,
          };
        }
      });
    }

    api
      .put('/perfil/' + moto_id, {
        raio_origem: params.isPreferences ? params.loadValueKMs : 0,
        raio_destino_curto: params.isPreferences
          ? !params.shortRoute
            ? 0
            : params.shortValueKMs
          : 0,
        raio_destino_longo: params.isPreferences
          ? !params.longRoute
            ? 0
            : params.longValueKMs
          : 0,
        ativo: params.isPreferences ? 1 : 0,
        destinos: destinos,
      })
      .then((response) => response.data)
      .then((data) => {
        dispatch({type: FREIGHT_PREFERENCES_SUCCESS, payload: data.data[0]});
        resolve(data.data[0]);
      })
      .catch(async (error) => {
        const netIsConnected = await NetInfo.fetch();
        if (!netIsConnected.isConnected) {
          reject(new Error('actions.freigth-references.check-connection'));
        } else {
          reject(error);
        }
      });
  });

export const getPreferences = (moto_id) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .get('perfil/' + moto_id)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({type: FREIGHT_PREFERENCES_SUCCESS, payload: data.data[0]});
          resolve(data.data[0]);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(async (error) => {
        const netIsConnected = await NetInfo.fetch();
        if (!netIsConnected.isConnected) {
          reject(new Error('actions.freigth-references.check-connection'));
        } else {
          reject(error);
        }
      });
  });
