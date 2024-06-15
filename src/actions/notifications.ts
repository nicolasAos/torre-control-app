import api from '../services/apiTorreControl';
// utils
import {Logger} from '../utils';

export const getMessages = (moto_id: any, status: any) =>
  new Promise(async (resolve, reject) => {
    Logger.log(`API get => get-recepcion-alertas`);
    api
      .get(`get-recepcion-alertas/${moto_id}/${status}`)
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
