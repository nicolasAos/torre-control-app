import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {store} from '../store';
import {loginHomologSelector} from '../reducers/selectors';
import {refreshTokenURL, refreshTokenURLHomolog} from './apiLogin';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import {doLogoutRefreshToken} from '../actions/login';
import navigationService from '../navigationService';
import {saveStoreLogin} from '../configs/utils';

export const getToken = async () => {
  const value = await AsyncStorage.getItem('LOGIN');
  const data = await JSON.parse(value);
  return `Bearer ${data.ouath.access_token}`;
};

export const getRefreshToken = async () => {
  const value = await AsyncStorage.getItem('LOGIN');
  const data = await JSON.parse(value);
  return data.ouath.refresh_token;
};

export const baseURL = 'https://gateway.agv.com.br/services/market-place/';
/*
export const baseURLHomolog =
  'https://hml-gateway.agv.com.br/services/market-place/';
*/
export const baseURLHomolog =
  'http://strackqa.solistica.com/api-agv/services/agv-parceiro/';

const apiGo = axios.create({
  baseURL,
  headers: {'Content-Type': 'application/json'},
});

apiGo.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (loginHomologSelector(store.getState())) {
      config.baseURL = baseURLHomolog;
    }
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest) => {
  const refresh_token = await getRefreshToken();
  axios
    .post(
      loginHomologSelector(store.getState())
        ? refreshTokenURLHomolog
        : refreshTokenURL,
      {
        refresh_token,
      },
    )
    .then(async (tokenRefreshResponse) => {
      const value = await AsyncStorage.getItem('LOGIN');
      const data = await JSON.parse(value);
      const newToken = {
        ...data,
        ouath: tokenRefreshResponse,
      };
      saveStoreLogin(newToken, Promise.reject());
      return Promise.resolve();
    })
    .catch(() => {
      doLogoutRefreshToken(store).then(() => {
        navigationService.navigate('Auth');
      });
    });
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(apiGo, refreshAuthLogic);

export default apiGo;
