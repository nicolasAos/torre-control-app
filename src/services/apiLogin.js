import axios from 'axios';
import {store} from '../store';
import {loginHomologSelector} from '../reducers/selectors';
import AsyncStorage from '@react-native-community/async-storage';

export const baseURL = 'https://annuit.solistica.com/api-agv/';
/*
export const baseURLHomolog =
  'https://hml-gateway.agv.com.br/proxy/torre-control/api-agv/';
*/
export const baseURLHomolog = 'http://strackqa.solistica.com/api-agv/';
//export const refreshTokenURL =
//   'https://gateway.agv.com.br/agv-parceiro/refresh-token';
// export const refreshTokenURLHomolog =
//   'https://hml-gateway.agv.com.br/agv-parceiro/refresh-token';

const headers = {
  'content-type': 'application/json',
};

const apiLogin = axios.create({
  baseURL,
  headers,
});

export const getToken = async () => {
  const value = await AsyncStorage.getItem('token');
  return `Bearer ${value}`;
};

apiLogin.interceptors.request.use(
  async (config) => {
    if (loginHomologSelector(store.getState())) {
      config.baseURL = baseURLHomolog;
    }
    const token = await getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiLogin;
