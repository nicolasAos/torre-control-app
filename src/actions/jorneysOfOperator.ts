import api from '../services/api';
import {
  ON_LOAD_JOURNEYS_OF_OPERATOR_TYPES,
  ON_LOAD_JOURNEYS_OF_OPERATOR,
} from './types';
import {journeysOfOperatorTypesSelector} from '../reducers/selectors';
import moment from 'moment';
// utils
import {Logger} from '../utils';

export const getJourneysOfOperator = () => (dispatch:any) =>
  new Promise((resolve, reject) => {
    const uri = `cat_jornada_operador`;
    Logger.log(`API => get: ${uri}`);
    api
      .get(uri)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: ON_LOAD_JOURNEYS_OF_OPERATOR_TYPES,
            payload: journeysOfOperatorTypesSelector(data.data),
          });
          resolve;
        } else {
          reject;
        }
      })
      .catch(reject);
  });

export const getListJourneysOfOperator = (id:any) => (dispatch:any) =>
  new Promise((resolve, reject) => {
    const uri = `jornada-operador/${id}`;
    Logger.log(`API => get: ${uri}`);
    api
      .get(uri)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          Logger.log(
            `API => get: ${uri} data ${JSON.stringify(data, null, 2)}`,
          );
          dispatch({
            type: ON_LOAD_JOURNEYS_OF_OPERATOR,
            payload: data.data,
          });
          resolve;
        } else {
          reject;
        }
      })
      .catch(reject);
  });

/**
 * Logs driver activity
 * @param param0
 * @returns
 */
export const postJourneysOfOperator =
  ({option, hour, user_id}: any) =>
  (dispatch: any) =>
    new Promise((resolve, reject) => {
      const uri = `drivers-logs`;
      Logger.log(`API => post: ${uri}`);

      const dateevent = moment(hour, 'DD:MM:YYYY HH:mm:ss').format(
        'YYYY-MM-DD HH:mm:ss',
      );
      const hoursOnService = moment(hour, 'DD:MM:YYYY HH:mm:ss').format(
        'DD/MM/YYYY HH:mm:ss',
      );
      const bodyData = {
        userId: user_id,
        dateevent,
        descevent: option.label,
        typeevent: option.oco_id,
        hoursOnService,
      };
      api
        .post(uri, bodyData)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            dispatch({
              type: ON_LOAD_JOURNEYS_OF_OPERATOR,
              payload: data.data,
            });
            resolve;
          } else {
            reject;
          }
        })
        .catch((e) => {
          // save to cached events
          // queed.push
          Logger.recordError(e);
          reject(e);
        });
    });
