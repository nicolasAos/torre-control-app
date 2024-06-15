import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOGIN_HOMOLOG_SUCCESS,
  FORGOT_SUCCESS,
  FORGOT_TOKEN_SUCCESS,
  ON_LOAD_FUEL_TYPES,
  ON_LOAD_TRUCK_BODY_TYPES,
  ON_LOAD_VEHICLE_TYPES,
  ON_LOAD_REGIONS,
  ON_LOAD_TRACKER_TYPES,
  CNH_SUCCESS,
  RESPONSIBLE_FREIGHT_SUCCESS,
  ON_LOAD_OCCURRENCE_TYPES,
  OWNERS_VEHICLES,
  GET_VEHICLES_SUCCESS,
  GET_TRUCK_BODIES_SUCCESS,
  ON_LOAD_OCCURRENCE_TYPES_GO,
  ON_LOAD_CNH_TYPES,
  DEVICE_ID_SUCCESS,
  ON_LOAD_STATUS_MONITORING,
  ON_LOAD_STATUS_REASON_MONITORING,
  FREIGHT_WISH_SUCCESS,
  PREVENTIVE_MONITORING_SUCCESS,
  FREIGHT_PREFERENCES_SUCCESS,
  IS_TRAVEL,
  ON_LOAD_SACREPORT_TYPES,
} from './types';
import Validator from 'email-validator';
import {setMotoLogin} from '../database/models/user';
import apiGo from '../services/apiGo';
import api from '../services/api';
import apiLogin from '../services/apiLogin';
import AsyncStorage from '@react-native-community/async-storage';
import {saveStoreLogin, validateCPF, getDateBD} from '../configs/utils';
import {getOccurrencesType} from './occurrence';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import {deleteDataCtes} from './driver';
import {getPreventiveMonitoringByCnhId} from './monitoringPreventive';
import {getSACReportType} from './sacReport';
//import { deleteCtesSupervisorProfile, getCtesSupervisorOffline } from '../database/models/invoice';

// utils
import {Logger} from '../utils';

export const getToken = () =>
  new Promise((resolve, reject) => {
    Logger.log(`API post => apiLogin`);
    apiLogin
      .post(
        'oauth/token?grant_type=password&username=user&password=secret',
        {
          grant_type: 'password',
          username: 'user',
          password: 'secret',
        },
        {
          auth: {
            username: 'cliente',
            password: 'password',
          },
        },
      )
      .then((response) => response.data)
      .then((data) => {
        saveToken(data);
        resolve();
      })
      .catch(reject);
  });

const saveToken = async (data) => {
  await AsyncStorage.setItem('token', data.access_token);
};

// export const getToken = async () => {
//   const req = await fetch(
//     'https://strackqa.solistica.com/api-agv/oauth/token',
//     {
//       method: 'POST',
//       body: JSON.stringify({
//         grant_type: 'password',
//         username: 'user',
//         password: 'secret',
//       }),
//       headers: {'Content-Type': 'aplication/josn'},
//     },
//   );
//   const json = await req.json();
// };

export const doLogin =
  (cpf = '', password = '') =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      //cpf = '1808222'
      //password = '1234567'
      // cpf = '20210323'
      // password = '1234567'
      //cpf = '20210325'
      //password = '1234567'
      //cpf = '20210324'
      //password = '1234567'
      //cpf = '1845507';
      //password = '1234567';
      //cpf = '1806568';
      //password = '1234567';
      // cpf = '20210324';
      // password = '1234567';
      //cpf = '1880450';
      //password = '1234567';
      switch (cpf.length) {
        case 11:
        case 7:
        case 14:
          break;
        default:
      }

      // if (cpf.length !== 7) {
      //   throw new Error('actions.login.only-11-characters');
      // }

      // if (cpf.length !== 11) {
      //   throw new Error('actions.login.only-11-characters');
      // }

      if (password.length < 1) {
        throw new Error('actions.login.password-empty');
      }

      const recoveryToken = async () => {
        let token = await AsyncStorage.getItem('token');

        return token;
      };
      await apiLogin.post('agv-parceiro/logout-app', {
        userIdPk: `${cpf}`,
        loginApp: '1',
        registrationDate: `${getDateBD()}`,
      });
      await apiLogin
        .post('agv-parceiro/login-motorista', {
          moto_cpf: cpf,
          moto_senha: password,
        })
        .then((response) => response.data)
        .then(async (data) => {
          if (data.success) {
            data.data = data.data[0];
            data.data.moto_senha = password;
            await saveStoreLogin(data, reject);
            //sendMotoLogin(data.data.moto_id, true);
            await dispatch({type: LOGIN_SUCCESS, payload: data.data});
            await refreshDataTypes(dispatch);
            await refreshAllData(dispatch, data.data.moto_id);
            resolve(data.data);
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(async () => {
          const netIsConnected = await NetInfo.fetch();
          if (!netIsConnected.isConnected) {
            reject(new Error('actions.login.check-connection'));
          } else {
            reject(new Error('actions.login.login-error'));
          }
        });
    });

export const loginHomolog = (isHomolog) => (dispatch) =>
  new Promise((resolve) => {
    dispatch({type: LOGIN_HOMOLOG_SUCCESS, payload: isHomolog});
    resolve();
  });

export const doLogout = (moto_id, user_id) => (dispatch) =>
  new Promise(async (resolve) => {
    await apiLogin.post('agv-parceiro/logout-app', {
      userIdPk: `${user_id}`,
      loginApp: '0',
      registrationDate: `${getDateBD()}`,
    });
    try {
      //await sendMotoLogin(moto_id, false);
      AsyncStorage.removeItem('LOGIN');
      dispatch({type: LOGIN_HOMOLOG_SUCCESS, payload: false});
      dispatch({type: IS_TRAVEL, payload: false});
      dispatch({type: CNH_SUCCESS, payload: {}});
      // dispatch({ type: RESPONSIBLE_FREIGHT_SUCCESS, payload: {} });
      // dispatch({ type: OWNERS_VEHICLES, payload: {} });
      dispatch({type: GET_VEHICLES_SUCCESS, payload: {}});
      dispatch({type: GET_TRUCK_BODIES_SUCCESS, payload: {}});
      dispatch({type: DEVICE_ID_SUCCESS, payload: {}});
      dispatch({type: FREIGHT_WISH_SUCCESS, payload: []});
      dispatch({type: CNH_SUCCESS, payload: {}});
      dispatch({type: PREVENTIVE_MONITORING_SUCCESS, payload: {}});
      dispatch({type: LOGOUT_SUCCESS, payload: {}});
      deleteDataCtes();
      resolve();
    } catch (error) {
      console.log('error', error.message);
    }
  });

export const doLogoutRefreshToken = (store) =>
  new Promise((resolve) => {
    try {
      AsyncStorage.removeItem('LOGIN');
      store.dispatch({type: LOGOUT_SUCCESS, payload: {}});
      store.dispatch({type: LOGIN_HOMOLOG_SUCCESS, payload: false});
      store.dispatch({type: IS_TRAVEL, payload: false});
      store.dispatch({type: CNH_SUCCESS, payload: {}});
      // dispatch({ type: RESPONSIBLE_FREIGHT_SUCCESS, payload: {} });
      // dispatch({ type: OWNERS_VEHICLES, payload: {} });
      store.dispatch({type: GET_VEHICLES_SUCCESS, payload: {}});
      store.dispatch({type: GET_TRUCK_BODIES_SUCCESS, payload: {}});
      store.dispatch({type: DEVICE_ID_SUCCESS, payload: {}});
      store.dispatch({type: FREIGHT_WISH_SUCCESS, payload: []});
      store.dispatch({type: CNH_SUCCESS, payload: {}});
      store.dispatch({type: PREVENTIVE_MONITORING_SUCCESS, payload: {}});
      deleteDataCtes();
      resolve();
    } catch (error) {
      console.log('error', error);
    }
  });

const refreshAllData = async (dispatch, motoId) => {
  try {
    fetchData(`perfil/${motoId}`, dispatch, FREIGHT_PREFERENCES_SUCCESS, true);
    const cnh = await fetchData(
      `cnh/motorista/${motoId}`,
      dispatch,
      CNH_SUCCESS,
    );
    if (cnh != null) {
      // const responsibleFreight = await fetchData(`cnh/responsavel/${cnh.id}`);
      // dispatch({ type: RESPONSIBLE_FREIGHT_SUCCESS, payload: responsibleFreight[0] });
      // const ownerVehicles = await fetchData(`cnh/proprietarios/${cnh.id}`);
      // dispatch({ type: OWNERS_VEHICLES, payload: ownerVehicles });
      fetchData(
        `cnh/${cnh.id}/disponibilidade`,
        dispatch,
        FREIGHT_WISH_SUCCESS,
      );
      dispatch(getPreventiveMonitoringByCnhId(cnh.id));
      fetchData(`cnh/veiculos/${cnh.id}`, dispatch, GET_VEHICLES_SUCCESS);
      fetchData(
        `cnh/carrocerias/${cnh.id}`,
        dispatch,
        GET_TRUCK_BODIES_SUCCESS,
      );
    }
  } catch (error) {
    console.log(error, 'HERROR');
  }
};

const refreshDataTypes = async (dispatch) => {
  try {
    fetchData(
      '/monitoramento-preventivo/status',
      dispatch,
      ON_LOAD_STATUS_MONITORING,
    );
    fetchData(
      '/monitoramento-preventivo/status-motivo',
      dispatch,
      ON_LOAD_STATUS_REASON_MONITORING,
    );
    fetchData('/veiculo/tipo_veiculos', dispatch, ON_LOAD_VEHICLE_TYPES);
    fetchData(
      '/carroceria/tipo_carrocerias',
      dispatch,
      ON_LOAD_TRUCK_BODY_TYPES,
    );
    fetchData('/static/regioes', dispatch, ON_LOAD_REGIONS);
    // const cnhTypes = await fetchData('/cnh/categorias');
    // dispatch({ type: ON_LOAD_CNH_TYPES, payload: cnhTypes });
    fetchData('/combustivel/tipo_combustiveis', dispatch, ON_LOAD_FUEL_TYPES);
    fetchData('/static/rastreadores', dispatch, ON_LOAD_TRACKER_TYPES);

    getOccurrencesType(dispatch, ON_LOAD_OCCURRENCE_TYPES);
    getSACReportType(dispatch, ON_LOAD_SACREPORT_TYPES);

    const occurrenceTypesGo = await fetchData('ocorrencia/tipo_ocorrencias');
    dispatch({type: ON_LOAD_OCCURRENCE_TYPES_GO, payload: occurrenceTypesGo});
  } catch (error) {
    console.log(error);
  }
};

const fetchData = (url, dispatch, type, first = false) =>
  new Promise((resolve, reject) => {
    apiGo
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          if (!first) {
            dispatch({type, payload: data.data});
          } else {
            dispatch({type, payload: data.data[0]});
          }
          resolve(data.data);
        } else {
          reject(new Error(data.error));
        }
      })
      .catch(reject);
  });

export const cpfConfirmResetPassword = (cpf) => (dispatch) =>
  new Promise((resolve, reject) => {
    switch (cpf.length) {
      case 11:
        break;
      default:
        reject(new Error('actions.login.only-11-characters'));
    }

    apiLogin
      .get(`reset-password/${cpf}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({type: FORGOT_SUCCESS, payload: data.data});
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const confirmToken = (moto_id, moto_cod_check) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (!moto_cod_check) {
      reject(new Error('actions.login.code-not-empty'));
      return;
    }
    apiLogin
      .post(`consulta-token/${moto_id}`, {
        moto_cod_check,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: FORGOT_TOKEN_SUCCESS,
            payload: {motorista: data.data},
          });
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(reject);
  });

export const resetPassword =
  (moto_id, moto_senha = '', confirmPassword = '') =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      if (!moto_senha) {
        reject(new Error('actions.login.password-empty.'));
        return;
      }

      if (moto_senha !== confirmPassword) {
        reject(new Error('actions.login.password-empty'));
        return;
      }

      apiLogin
        .put(`change-password/${moto_id}`, {
          moto_senha,
        })
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            dispatch({type: FORGOT_TOKEN_SUCCESS, payload: {}});
            resolve(data);
          } else {
            reject(new Error(data.message));
          }
        })
        .catch(reject);
    });

export const createDriver = (
  apelido,
  moto_nome,
  moto_email,
  moto_senha,
  moto_cpf,
  moto_tel,
  confirmPassword,
) =>
  new Promise((resolve, reject) => {
    if (
      !apelido ||
      !moto_nome ||
      !moto_email ||
      !moto_cpf ||
      !moto_tel ||
      !moto_senha
    ) {
      reject(new Error('actions.login.fill-in-all-fields'));
      return;
    }

    if (moto_tel.length != 11) {
      reject(new Error('actions.login.cell-phone-incomplete'));
      return;
    }

    if (!validateCPF(moto_cpf)) {
      reject(new Error('actions.login.enter-a-valid-CPF'));
      return;
    }

    if (moto_senha.length < 6) {
      reject(new Error('actions.login.password-length'));
      return;
    }

    if (moto_senha !== confirmPassword) {
      reject(new Error('actions.login.password-confirmation'));
      return;
    }

    if (!Validator.validate(moto_email)) {
      reject(new Error('actions.login.valid-email'));
      return;
    }

    if (
      moto_email.includes('@agv.com.br') ||
      moto_email.includes('@3pl.com.br')
    ) {
      reject(new Error('actions.login.corporate-email'));
      return;
    }

    apiLogin
      .post('cad-motorista', {
        apelido,
        moto_nome,
        moto_email,
        moto_senha,
        moto_cpf,
        moto_tel,
        moto_ativo: 1,
      })
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

export const sendMotoLogin = (moto_id, moto_login) =>
  new Promise((resolve) => {
    const sync = 0;
    const moto_versao_app = `GO ${DeviceInfo.getVersion()}`;
    let motoLogin = moto_login ? 1 : 0;
    api
      .put(`motorista/${moto_id}`, [
        {
          moto_id,
          moto_login: motoLogin,
          moto_versao_app,
        },
      ])
      .then((response) => response.data)
      .then(async (data) => {
        if (!data.success) {
          await setMotoLogin({
            moto_id: moto_id,
            moto_login: motoLogin,
            moto_versao_app: moto_versao_app,
            sync: sync,
          });
        }
        resolve();
      })
      .catch(async (error) => {
        await setMotoLogin({
          moto_id: moto_id,
          moto_login: motoLogin,
          moto_versao_app: moto_versao_app,
          sync: sync,
        });
        resolve();
      });
  });
