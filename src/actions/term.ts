import api from '../services/api';
import {
  createOrUpdateTerm,
  getTermOffline,
  setTermOffline,
  setTermHistoryOffline,
} from '../database/models/term';
import {sendLocationEvent} from './geolocation';
import {getDateBD} from '../configs/utils';
// utils
import {Logger} from '../utils';

/**
 * Get terms
 * @param moto_id
 * @returns
 */
export const getTerms = (moto_id: any) =>
  new Promise((resolve) => {
    const uri = 'termo-motorista';
    Logger.log(`API get => ${uri}`);
    api
      .get(uri)
      .then((response) => response.data)
      .then((data) => {
        console.log({data});
        if (data.success) {
          // save smth in realm
          createOrUpdateTerm(moto_id, data.data);
        }
        resolve();
      })
      .catch((error) => console.log(error))
      .finally(resolve);
  });

export const getTerm = (moto_id, empresa) =>
  new Promise((resolve, reject) => {
    // get smth from realm
    getTermOffline(moto_id, empresa).then(resolve).catch(reject);
  });

export const setTerm = (moto_id, empresa, termo_id) =>
  new Promise(async (resolve, reject) => {
    const position = {latitude: '', longitude: ''};

    api
      .post('historico-termo-motorista', {
        motorista: moto_id,
        termo_id,
        latitude: position.latitude,
        longitude: position.longitude,
        empresa,
      })
      .then((response) => response.data)
      .then((data) => {
        if (!data.success) {
          setTermHistoryOffline({
            moto_id,
            termo_id,
            latitude: position.latitude,
            longitude: position.longitude,
            empresa,
            sync: 0,
          });
        }
        setTermOffline(moto_id, empresa, termo_id);
        sendLocationEvent(
          position,
          moto_id,
          `actions.term.local-termo(${getDateBD()})`,
        );
        resolve();
      })
      .catch(() => {
        setTermHistoryOffline({
          moto_id,
          termo_id,
          latitude: position.latitude,
          longitude: position.longitude,
          empresa,
          sync: 0,
        });
        setTermOffline(moto_id, empresa, termo_id);
        sendLocationEvent(
          position,
          moto_id,
          `actions.term.local-termo(${getDateBD()})`,
        );
        resolve();
      });
  });
