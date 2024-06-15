import api from '../services/apiGo';
import NetInfo from '@react-native-community/netinfo';

export const getCardRepom = (moto_id) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.payment-card.check-connection'));
      return;
    }

    api
      .get(`/cnh/cartao-pef/${moto_id}`)
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

export const saveCardRepom = (moto_id, cartao_pef) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.payment-card.check-connection'));
      return;
    }

    api
      .put(`/cnh/cartao-pef/${moto_id}`, {
        cartao_pef,
      })
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
