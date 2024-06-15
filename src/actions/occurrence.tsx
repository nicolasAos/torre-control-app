import api from '../services/api';
import {setSendOccurence} from '../database/models/occurrence';
import {sendLocationEvent} from './geolocation';
import {InvoiceService} from '../services/InvoicesServices';
import GeoLocation from '@react-native-community/geolocation';

// utils
import {Logger, Offline} from '../utils';

export const getOccurrencesType = (dispatch: any, type: any) =>
  new Promise((resolve, reject) => {
    api
      .get('ocorrencia')
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          resolve(data.data);
          dispatch({type, payload: data.data});
        } else {
          reject(new Error(data.error));
        }
      })
      .catch(reject);
  });

/**
 * Send ocurrence
 * @param moto_id
 * @param occurrences
 * @param user_id
 * @returns
 */
export const sendOccurence = (moto_id: any, occurrences: any, user_id: any) =>
  new Promise(async (resolve, reject) => {
    Logger.log(`send ocurrence`);
    if (occurrences[0].nf_obs === '') {
      reject(new Error('actions.ocurrence.descripition'));
    }

    if (occurrences.photos === []) {
      reject(new Error('actions.ocurrence.photo-required'));
      return;
    }

    const invoiceService = new InvoiceService();
    Logger.log(`get location`);
    GeoLocation.getCurrentPosition(
      async (info) => {
        const position = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };

        occurrences[0].nf_lat_long_ocorrencia = `${info.coords.latitude}, ${info.coords.longitude}`;

        try {
          /*
          [COMMENTED]: this overrite some dates in the server 
           await sendLocationEvent(
            position,
            occurrences[0].rom_id,
            occurrences[0].start_travel,
            occurrences[0].placa,
            user_id,
            user_id,
          );
          */
        } catch (error) {
          console.log(error);
        }

        const uri = 'nota-fiscal/ocorrencia';
        const bodyData = occurrences[0];
        const headers = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };

        await invoiceService
          .sendOccurrence(uri, bodyData, headers)
          .then(async (data: any) => {
            const success = data.data.success ? 1 : 0;
            Logger.log(`send ocurrence successful ✅`);
            resolve(true);
          })
          .catch(async (error: any) => {
            Logger.log(`send ocurrence fail ❌`);
            Offline.catchEvent(uri, bodyData, headers);
            Logger.recordError(error);
            await setSendOccurence(moto_id, occurrences[0], 0);
            resolve(true);
          });
        const docType = occurrences.length == 1 ? 'Nota Fiscal' : 'CT-e';
      },
      (error) => {
        reject(error);
        Logger.recordError(error);
      },
    );
  });
