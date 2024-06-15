import api from '../services/apiGo';
import {PREVENTIVE_MONITORING_SUCCESS} from './types';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';

export const getPreventiveMonitoringByAvailability = (availability) =>
  new Promise((resolve) => {
    if (availability.length > 0) {
      api
        .get(
          `monitoramento-preventivo/planilha/${availability[0].cnh_id}/${availability[0].veiculo_id}`,
        )
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            if (data.data.length > 0) {
              const orderData = data.data.sort(
                (a, b) => a.data_coleta - b.data_coleta,
              );
              data.data = orderData;
            }
            resolve(data.data);
          }
          resolve();
        });
    }
    return;
  });

export const getPreventiveMonitoringByCnhId = (cnhid) => (dispatch) =>
  new Promise((resolve) => {
    api
      .get(`monitoramento-preventivo/motorista/${cnhid}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          if (data !== null && data.data.length > 0) {
            dispatch({
              type: PREVENTIVE_MONITORING_SUCCESS,
              payload: data.data[0],
            });
          }
        }
        resolve();
      });
  });

export const setPreventiveMonitoring = (push) => (dispatch) => {
  dispatch({type: PREVENTIVE_MONITORING_SUCCESS, payload: push});
};

export const setGaveBad = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    // if (!params.state.isDelay && !params.state.isArrive) {
    //     reject(new Error('Por favor, selecione se vai se atrasar ou se não vai conseguir chegar'));
    //     return;
    // }

    // if (!params.state.occurrence) {
    //     reject(new Error('Por favor, selecione um motivo'));
    //     return;
    // }

    if (params.state.isDelay) {
      if (!params.state.delayDate) {
        reject(new Error('actions.monitoring-preventive.put-a-date'));
        return;
      }

      const dataFormated = moment(
        params.state.delayDate,
        'DD/MM/YYYY HH:mm',
      ).format('YYYY-MM-DD HH:mm:ss');

      const dataMonitoring = {
        user_id: params.moto_id,
        obs: `actions.monitoring-preventive.delayed ${params.state.delayDate}`,
        monitoramento_preventivos_id: params.idMonitoring,
        status_motivo_id: params.state.occurrence,
        data_reprogramado: dataFormated,
        status_id: 2,
        origem_usuario: 'm',
      };

      api
        .post('monitoramento-preventivo/log/', dataMonitoring)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            resolve('actions.monitoring-preventive.delay-response');
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(async (error) => {
          const netIsConnected = await NetInfo.fetch();
          if (!netIsConnected.isConnected) {
            reject(new Error('actions.monitoring-preventive.check-connection'));
          } else {
            reject(error);
          }
        });
    } else {
      const dataMonitoring = {
        user_id: params.moto_id,
        obs: 'actions.monitoring-preventive.i-cant-collect',
        monitoramento_preventivos_id: params.idMonitoring,
        status_motivo_id: params.state.occurrence,
        status_id: 4,
        origem_usuario: 'm',
      };

      api
        .post('monitoramento-preventivo/log/', dataMonitoring)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            dispatch({
              type: PREVENTIVE_MONITORING_SUCCESS,
              payload: {},
            });
            resolve('actions.monitoring-preventive.response-i-cant-collect');
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(async (error) => {
          const netIsConnected = await NetInfo.fetch();
          if (!netIsConnected.isConnected) {
            reject(new Error('actions.monitoring-preventive.check-connection'));
          } else {
            reject(error);
          }
        });
    }
  });

export const setGaveGood = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    api
      .post('monitoramento-preventivo/log/', {
        user_id: params.moto_id,
        obs: 'actions.monitoring-preventive.all-right',
        monitoramento_preventivos_id: params.idMonitoring,
        status_id: 6,
        origem_usuario: 'm',
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: PREVENTIVE_MONITORING_SUCCESS,
            payload: {},
          });
          resolve();
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(async (error) => {
        const netIsConnected = await NetInfo.fetch();
        if (!netIsConnected.isConnected) {
          reject(new Error('actions.monitoring-preventive.check-connection'));
        } else {
          reject(error);
        }
      });
  });
