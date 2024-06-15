import api, {baseURL, baseURLHomolog, getToken} from '../services/api';
import {
  getLows,
  getOccurrences,
  getTraveling,
  getTravelsFinished,
  getCheckIn,
  getCheckOut,
  getCheckInOut,
  getLocationsDevice,
  setUpdateLow,
  updateSendOccurence,
  updateTravel,
  updateCheckIn,
  updateCheckOut,
  updateTracking,
  getTravelsGpsStatus,
  setTravelGpsStatus,
  syncDelete,
} from '../database/models/sync';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';
import {loginHomologSelector} from '../reducers/selectors';
import {store} from '../store';

export const syncTravelData = () =>
  new Promise(async (resolve, reject) => {
    const netIsConnected = await NetInfo.fetch();
    if (!netIsConnected.isConnected) {
      reject(new Error('actions.sync-travels-manual.connect-to-the-Internet'));
      return;
    }
    await syncTravelsGpsStatus();
    await syncLow();
    await syncOccurrence();
    await syncTraveling();
    await syncTravelsFinished();
    await syncCheckIn();
    await syncCheckInOut();
    await syncCheckOut();
    await syncLocationDevice();
    resolve();
  });

export const deleteData = () => {
  syncDelete();
};

export const syncTravelsGpsStatus = () =>
  new Promise((resolve) => {
    getTravelsGpsStatus().then((travels) => {
      Promise.all(
        travels.map(async (travel) => {
          await sendTravelGpsStatus(travel);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncLow = () =>
  new Promise((resolve) => {
    getLows().then((lows) => {
      Promise.all(
        lows.map(async (low) => {
          await updateLow(low);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncOccurrence = () =>
  new Promise((resolve) => {
    getOccurrences().then((occurrences) => {
      Promise.all(
        occurrences.map(async (occurrence) => {
          await updateOccurence(occurrence);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncTraveling = () =>
  new Promise((resolve) => {
    getTraveling().then((travels) => {
      Promise.all(
        travels.map(async (travel) => {
          await updateTransport(travel, false);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncTravelsFinished = () =>
  new Promise((resolve) => {
    getTravelsFinished().then((travels) => {
      Promise.all(
        travels.map(async (travel) => {
          await updateTransport(travel, true);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncCheckIn = () =>
  new Promise((resolve) => {
    getCheckIn().then((checkIns) => {
      Promise.all(
        checkIns.map(async (check) => {
          await setCheckIn(check, 1);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncCheckInOut = () =>
  new Promise((resolve) => {
    getCheckInOut().then((checks) => {
      Promise.all(
        checks.map(async (check) => {
          await setCheckIn(check, 3);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncCheckOut = () =>
  new Promise((resolve) => {
    getCheckOut().then((checkOuts) => {
      Promise.all(
        checkOuts.map(async (check) => {
          await setCheckOut(check);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const syncLocationDevice = () =>
  new Promise((resolve) => {
    getLocationsDevice().then((locationsDevice) => {
      Promise.all(
        locationsDevice.map(async (locationDevice) => {
          await sendLocationDevice(locationDevice);
        }),
      )
        .then(resolve)
        .catch(resolve);
    });
  });

export const updateLow = (low) =>
  new Promise(async (resolve, reject) => {
    const token = await getToken();

    const base_url = loginHomologSelector(store.getState())
      ? baseURLHomolog
      : baseURL;

    RNFetchBlob.fetch(
      'POST',
      base_url + 'nota-fiscal/entrega',
      {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'canhoto_img',
          filename: low.file_name_cachoto,
          data: RNFetchBlob.wrap(low.canhoto_img),
        },
        {name: 'cte_numero', data: low.cte_numero},
        {name: 'nf_resp_receber', data: low.nf_resp_receber},
        {name: 'nf_ocorrencia', data: '0'},
        {name: 'nf_obs', data: 'actions.sync-travels-manual.delivery-mode'},
        {name: 'nf_dt_entrega', data: low.nf_dt_entrega},
        {name: 'nf_lat_long_entrega', data: low.nf_lat_long_entrega},
        {name: 'nf_dt_canhoto', data: low.nf_dt_canhoto},
        {name: 'nf_chave', data: low.nf_chave},
        {name: 'cte_info_controle', data: 'M'},
        {name: 'cte_id', data: low.cte_id.toString()},
      ],
    )
      .then((response) => response.data)
      .then((data) => {
        data = JSON.parse(data);
        if (data.success) {
          low.sync = 1;
          setUpdateLow(low);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });

export const updateOccurence = (occurrence) =>
  new Promise(async (resolve, reject) => {
    const token = await getToken();

    const base_url = loginHomologSelector(store.getState())
      ? baseURLHomolog
      : baseURL;

    RNFetchBlob.fetch(
      'POST',
      base_url + 'nota-fiscal/ocorrencia',
      {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'nf_chave', data: occurrence.nf_chave},
        {
          name: 'nf_oco_foto_1',
          filename: occurrence.file_name_foto_1,
          data: RNFetchBlob.wrap(occurrence.nf_oco_foto_1),
        },
        {
          name: 'nf_oco_foto_2',
          filename: occurrence.file_name_foto_2,
          data: RNFetchBlob.wrap(occurrence.nf_oco_foto_2),
        },
        {
          name: 'nf_oco_foto_3',
          filename: occurrence.file_name_foto_3,
          data: RNFetchBlob.wrap(occurrence.nf_oco_foto_3),
        },
        {name: 'nf_ocorrencia', data: occurrence.nf_ocorrencia.toString()},
        {name: 'nf_dt_ocorrencia', data: occurrence.nf_dt_ocorrencia},
        {name: 'nf_obs', data: occurrence.nf_obs},
        {
          name: 'nf_lat_long_ocorrencia',
          data: occurrence.nf_lat_long_ocorrencia,
        },
        {name: 'cte_info_controle', data: 'M'},
        {
          name: 'cte_obs',
          data: 'actions.sync-travels-manual.delivery-type-ocurrence',
        },
        {name: 'cte_numero', data: occurrence.cte_numero},
      ],
    )
      .then((response) => response.data)
      .then((data) => {
        data = JSON.parse(data);
        if (data.success) {
          occurrence.sync = 1;
          updateSendOccurence(occurrence);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });

export const updateTransport = (travel, isFinished) =>
  new Promise((resolve, reject) => {
    const data = {
      rom_id: travel.rom_id,
      rom_motorista: travel.rom_motorista,
      rom_km_total: travel.rom_km_total,
      rom_origem: travel.rom_origem,
      rom_destino: travel.rom_destino,
      rom_manifesto: travel.rom_manifesto,
      rom_dt_manifesto: travel.rom_dt_manifesto,
      rom_inicio_transp: travel.rom_inicio_transp,
      rom_empresa: travel.rom_empresa,
      rom_chat_key: travel.rom_chat_key,
      rom_device_id: travel.rom_device_id,
      rom_total_notas: travel.nfsQtdRom,
      rom_lat_long_inicio: travel.rom_lat_long_inicio,
      rom_dt_gps: travel.rom_dt_gps,
      rom_gps_ativo: travel.rom_gps_ativo,
    };

    if (isFinished) {
      data.rom_resp_fim = null;
      data.rom_lat_long_fim = travel.rom_lat_long_fim;
      data.rom_fim_transp = travel.rom_fim_transp;
      api
        .put(`romaneio/${travel.rom_id_controle}/viagem`, data)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            travel.sync_fim = 2;
            updateTravel(travel);
            resolve();
          } else {
            reject();
          }
        })
        .catch(reject);
    } else {
      data.rom_id_controle = travel.rom_id_controle;
      api
        .put(`romaneio/${travel.rom_id_controle}/viagem`, data)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            travel.sync = 1;
            updateTravel(travel);
            resolve();
          } else {
            reject();
          }
        })
        .catch(reject);
    }
  });

export const setCheckIn = (check, sync) =>
  new Promise((resolve, reject) => {
    api
      .post('checkin-app-parceiro', {
        motorista_id: check.motorista_id,
        user_id: 1,
        cte: check.cte,
        cte_id: check.cte_id,
        chave_cte: check.chave_cte,
        device_id: check.device_id,
        latitude_checkin: check.latitude_checkIn,
        longitude_checkin: check.longitude_checkIn,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          check.id_api = data.data.id;
          updateCheckIn(check, sync);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });

export const setCheckOut = (check) =>
  new Promise((resolve, reject) => {
    api
      .put(`checkin-app-parceiro/${check.id_api}`, {
        latitude_checkout: check.latitude_checkOut,
        longitude_checkout: check.longitude_checkOut,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          updateCheckOut(check, 4);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });

export const sendLocationDevice = (locationDevice) =>
  new Promise((resolve, reject) => {
    console.log(locationDevice);
    api
      .post('location-device', {
        latitude: locationDevice.latitude,
        longitude: locationDevice.longitude,
        device_data: locationDevice.device_data,
        device_id: locationDevice.device_id,
        evento: locationDevice.evento,
        id_geo: locationDevice.id_geo,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          locationDevice.sync = 1;
          updateTracking(locationDevice);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });

export const sendTravelGpsStatus = (travel) =>
  new Promise((resolve, reject) => {
    api
      .put(`romaneio/${travel.rom_id_controle}/viagem`, {
        rom_dt_gps: travel.rom_dt_gps,
        rom_gps_ativo: travel.rom_gps_ativo,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          travel.sync = 1;
          setTravelGpsStatus(travel);
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });
