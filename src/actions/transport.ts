import {
  setTransport,
  deleteTraveling,
  finishTransport,
  setTraveling,
  getTravelsInitiate as getTravelsInitiateBD,
  getTravelsFinish as getTravelsFinishBD,
  getTravelsToSync as getTravelsToSyncBD,
} from '../database/models/transport';
import api from '../services/api';
import {sendLocationEvent} from './geolocation';
import NetInfo from '@react-native-community/netinfo';
import {getDateBD} from '../configs/utils';
import {CURRENT_TRIP, IS_TRAVEL} from './types';
import GeoLocation from '@react-native-community/geolocation';
import {Logger, Offline, Location} from '../utils';

export const startTransport = (moto_id: any, params: any) => (dispatch: any) =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.transport.connect-to-the-Internet'));
      return;
    }

    GeoLocation.getCurrentPosition(async (info) => {
      // if (!!position && position.latitude) {
      const position = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };
      params.rom.rom_lat_long_inicio = `${info.coords.latitude}, ${info.coords.longitude}`;
      // }

      params.rom.rom_dt_gps = getDateBD();

      const romDeviceId = params.rom.rom_device_id;
      const placaID = params.rom.placa;

      api
        .put(`romaneio/${params.rom.rom_id_controle}/viagem`, {
          rom_id: params.rom.rom_id,
          rom_id_controle: params.rom.rom_id_controle,
          rom_motorista: moto_id.toString(),
          rom_km_total: params.rom.rom_km_total,
          rom_origem: params.rom.rom_origem,
          rom_destino: params.rom.rom_destino,
          rom_manifesto: params.rom.rom_manifesto,
          rom_dt_manifesto: params.rom.rom_dt_manifesto,
          rom_inicio_transp: params.rom.rom_inicio_transp,
          rom_empresa: params.rom.nf_empresa,
          rom_chat_key: params.rom.rom_chat_key,
          rom_device_id: params.rom.rom_device_id,
          rom_total_notas: params.nfsQtdRom,
          rom_lat_long_inicio: params.rom.rom_lat_long_inicio,
          rom_dt_gps: params.rom.rom_dt_gps,
          rom_gps_ativo: true,
        })
        .then((response) => response.data)
        .then(async (data) => {
          if (data.success) {
            setTransport(moto_id, params, 1);
            dispatch({type: IS_TRAVEL, payload: true});
          } else {
            setTransport(moto_id, params, 0);
          }
          await sendLocationEvent(
            position,
            params.rom.rom_id,
            params.rom.rom_inicio_transp,
            placaID,
            romDeviceId,
            romDeviceId,
          );
          resolve(true);
        })
        .catch(async () => {
          setTransport(moto_id, params, 0);
          await sendLocationEvent(
            position,
            params.rom.rom_id,
            params.rom_inicio_transp,
            placaID,
            romDeviceId,
            romDeviceId,
          );
          resolve(true);
        });
    });
  });

export const finishedTransport =
  (moto_id: string, params: any) => (dispatch: any) =>
    new Promise(async (resolve, reject) => {
      GeoLocation.getCurrentPosition(async (info) => {
        console.log('2.1.1 Dentro de finishedTransport');
        const position = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };

        const romDeviceId = params.rom.rom_device_id;
        const placaID = params.rom.placa;
        // if (!!position && position.latitude) {
        params.rom.rom_lat_long_fim = `${info.coords.latitude}, ${info.coords.longitude}`;
        // }

        params.rom.rom_dt_gps = getDateBD();
        console.log(
          '2.1.1.1 Dentro de finishedTransport: Parámetros - rom_id_controle: ',
          params.rom.rom_id_controle,
          ' - rom_id: ',
          params.rom.rom_id,
          ' - nf_empresa: ',
          params.rom.nf_empresa,
          ' -  moto_id: ',
          moto_id.toString(),
          ' - rom_fim_transp: ',
          params.rom.rom_fim_transp,
          ' - rom_lat_long_fim: ',
          params.rom.rom_lat_long_fim,
          ' - rom_dt_gps: ',
          params.rom.rom_dt_gps,
        );
        await finishTransport(moto_id, params, 1);
        dispatch({type: IS_TRAVEL, payload: false});
        await sendLocationEvent(
          position,
          params.rom.rom_id,
          params.rom.rom_inicio_transp,
          placaID,
          romDeviceId,
          romDeviceId,
        );
        resolve(true);
        // });
      });
    });

export const getTraveling = (moto_id: string) => (dispatch: any) =>
  new Promise((resolve) => {
    api
      .get(`motorista/${moto_id}/verifica-viagem`)
      .then((response) => response.data)
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setTraveling(moto_id, data.data[0], 1, 0);
          dispatch({type: IS_TRAVEL, payload: true});
        } else if (data.success && data.data.length == 0) {
          deleteTraveling(moto_id);
        }
        resolve(true);
      })
      .catch(resolve);
  });

export const getTravelsInitiate = (moto_id: string) =>
  new Promise((resolve) => {
    getTravelsInitiateBD(moto_id).then(resolve);
  });

export const getTravelsFinish = (moto_id: string) =>
  new Promise((resolve) => {
    getTravelsFinishBD(moto_id).then(resolve);
  });

/**
 * Get travels from realm
 * @param moto_id
 * @returns
 */
export const getTravelsToSync = (moto_id: any) =>
  new Promise((resolve) => {
    getTravelsToSyncBD(moto_id).then(resolve);
  });

/**
 * Send location to torre
 * @param moto_id
 * @param params
 * @returns
 */
export const startTransportTorre =
  (moto_id: any, params: any) => (dispatch: any) =>
    new Promise(async (resolve, reject) => {
      const uri = `romaneio/${params.rom.rom_id_controle}/viagem`;
      Logger.log(`[deprecated] API post => startTransportTorre ${uri}`);

      //const netIsConnected = await NetInfo.fetch();

      /*if (!netIsConnected.isConnected) {
        reject(new Error('actions.transport.connect-to-the-Internet'));
        return;
      }*/

      const coords = await Location.getCurrentPosition();

      if (!coords) {
        reject(new Error('actions.transport.connect-to-the-Internet'));
        return;
      }

      const position = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      const romDeviceId = params.rom.rom_device_id;
      const placaID = params.rom.placa;
      params.rom.rom_lat_long_inicio = `${coords.latitude}, ${coords.longitude}`;
      params.rom.rom_dt_gps = getDateBD();

      await setTransport(moto_id, params, 0);

      dispatch({type: CURRENT_TRIP, payload: params.rom.rom_id});

      await sendLocationEvent(
        position,
        params.rom.rom_id,
        params.rom.rom_inicio_transp,
        placaID,
        romDeviceId,
        romDeviceId,
      );
      resolve(true);
    });
