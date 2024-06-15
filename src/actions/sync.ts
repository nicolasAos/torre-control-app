import api, { baseURL, baseURLHomolog, getToken } from '../services/api';
import apiGo from '../services/apiGo';
import {
  getLows,
  getOccurrences,
  getTraveling,
  getTravelsFinished,
  getCheckIn,
  getCheckOut,
  getCheckInOut,
  getLocationsDevice,
  getLocationsDeviceGo,
  getTermHistories,
  setUpdateLow,
  getMotoLogins,
  updateMotoLogin,
  updateSendOccurence,
  updateTravel,
  updateCheckIn,
  updateCheckOut,
  updateTracking,
  updateTrackingGo,
  getTravelsGpsStatus,
  setTravelGpsStatus,
  setTermHistory,
  syncDelete,
} from '../database/models/sync';
import RNFetchBlob from 'rn-fetch-blob';
import { loginHomologSelector } from '../reducers/selectors';
import { store } from '../store';
import { Logger } from '../utils';

/**
 * Sync local data with server
 */
export const syncData = async () => {
  Logger.log('sync data');
  try {
    await syncTravelsGpsStatus();
    await syncTermHistory();
    await syncLow();
    await syncOccurrence();
    await syncTraveling();
    await syncTravelsFinished();
    await syncCheckIn();
    await syncCheckInOut();
    await syncCheckOut();
    await syncLocationDevice();
    await syncLocationDeviceGo();
    await syncMotoLogin();
  } catch (error) {
    Logger.recordError(error);
  }
};

export const deleteData = () => {
  syncDelete();
};

export const syncTravelsGpsStatus = () =>
  new Promise((resolve, reject) => {
    Logger.log(`syncTravelsGpsStatus`);
    getTravelsGpsStatus()
      .then((travels: any) => {
        Logger.log(`travels: ${travels.length}`);
        travels.map((travel: any, i: number) => {
          Logger.log(`send travel: ${i}`);
          sendTravelGpsStatus(travel);
        });
        Logger.log(`syncTravelsGpsStatus resolved`);
        resolve(true);
      })
      .catch((e) => {
        reject(e);
      });
  });

export const syncTermHistory = () =>
  new Promise((resolve, reject) => {
    Logger.log(`syncTermHistory`);
    getTermHistories()
      .then((termHistories: any) => {
        Logger.log(`termHistories: ${termHistories.length}`);
        termHistories.map((termHistory: any, i: number) => {
          Logger.log(`send termHistory ${i}`);
          sendTermHistory(termHistory);
        });
        Logger.log(`syncTermHistory resolved`);
        resolve(true);
      })
      .catch((e) => {
        reject(e);
      });
  });

export const syncMotoLogin = () =>
  new Promise((resolve) => {
    getMotoLogins().then((motoLogins: any) => {
      motoLogins.map((motoLogin: any) => {
        sendMotoLogin(motoLogin);
      });
      resolve(true);
    });
  });

export const syncLow = () =>
  new Promise((resolve, reject) => {
    Logger.log(`sync low`);
    getLows()
      .then((lows: any) => {
        Logger.log(`lows: ${lows.length}`);
        lows.map((low: any, i: number) => {
          Logger.log(`update low ${i}`);
          updateLow(low);
        });
        resolve(true);
      })
      .catch((e) => {
        reject(e);
      });
  });

export const syncOccurrence = () =>
  new Promise((resolve) => {
    Logger.log('sync ocurrences');
    getOccurrences().then((occurrences: any) => {
      Logger.log(`ocurrences: ${occurrences.length}`);
      occurrences.map((occurrence: any, i: number) => {
        Logger.log(`update ocurrence ${i}`);
        updateOccurence(occurrence);
      });
      resolve(true);
    });
  });

export const syncTraveling = () =>
  new Promise((resolve) => {
    Logger.log('syncTraveling');
    getTraveling().then((travels: any) => {
      travels.map((travel: any) => {
        updateTransport(travel, false);
      });
      resolve(true);
    });
  });

export const syncTravelsFinished = () =>
  new Promise((resolve, reject) => {
    Logger.log('syncTravelsFinished');
    getTravelsFinished()
      .then((travels: any) => {
        travels.map((travel: any) => {
          updateTransport(travel, true);
        });
        resolve(true);
      })
      .catch((e) => {
        reject(e);
      });
  });

export const syncCheckIn = () =>
  new Promise((resolve) => {
    Logger.log('syncCheckIn');
    getCheckIn().then((checkIns: any) => {
      checkIns.map((check: any) => {
        setCheckIn(check, 1);
      });
      resolve(true);
    });
  });

export const syncCheckInOut = () =>
  new Promise((resolve) => {
    Logger.log('syncCheckInOut');
    getCheckInOut().then((checks: any) => {
      checks.map((check: any) => {
        setCheckIn(check, 3);
      });
      resolve(true);
    });
  });

export const syncCheckOut = () =>
  new Promise((resolve) => {
    Logger.log('syncCheckOut');
    getCheckOut().then((checkOuts: any) => {
      checkOuts.map((check: any) => {
        setCheckOut(check);
      });
      resolve(true);
    });
  });

export const syncLocationDevice = () =>
  new Promise((resolve) => {
    Logger.log('syncLocationDevice');
    getLocationsDevice().then((locationsDevice: any) => {
      locationsDevice.map((locationDevice: any) => {
        sendLocationDevice(locationDevice);
      });
      resolve(true);
    });
  });

export const syncLocationDeviceGo = () =>
  new Promise((resolve) => {
    Logger.log('syncLocationDeviceGo');
    getLocationsDeviceGo().then((locationsDevice: any) => {
      locationsDevice.map((locationDevice: any) => {
        sendLocationDeviceGo(locationDevice);
      });
      resolve(true);
    });
  });

export const updateLow = (low: any) =>
  new Promise(async (resolve) => {
    Logger.log('Api post => update low');
    const token = await getToken();
    const base_url = loginHomologSelector(store.getState())
      ? baseURLHomolog
      : baseURL;
    const uri = base_url + 'nota-fiscal/entrega';
    const headers = {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await RNFetchBlob.fetch('POST', uri, headers, [
        {
          name: 'canhoto_img',
          filename: low.file_name_cachoto,
          data: RNFetchBlob.wrap(low.canhoto_img),
        },
        { name: 'cte_numero', data: low.cte_numero },
        { name: 'nf_resp_receber', data: low.nf_resp_receber },
        { name: 'nf_ocorrencia', data: '0' },
        { name: 'nf_obs', data: 'actions.sync.delivery-mode' },
        { name: 'nf_dt_entrega', data: low.nf_dt_entrega },
        { name: 'nf_lat_long_entrega', data: low.nf_lat_long_entrega },
        { name: 'nf_dt_canhoto', data: low.nf_dt_canhoto },
        { name: 'nf_chave', data: low.nf_chave },
        { name: 'cte_info_controle', data: 'M' },
        { name: 'cte_id', data: low.cte_id.toString() },
      ])
      const _data = await response.data;
      Logger.log('API post => update low parse data');
      const data = JSON.parse(_data);
      console.log({ data });
      if (data.success) {
        Logger.log('API post => update low sucessfull');
        low.sync = 1;
        setUpdateLow(low);
      }
      resolve(true);
    } catch (e) {
      Logger.log('API post => update low fail');
      Logger.recordError(e);
    }
    /*
    RNFetchBlob.fetch('POST', uri, headers, [
      {
        name: 'canhoto_img',
        filename: low.file_name_cachoto,
        data: RNFetchBlob.wrap(low.canhoto_img),
      },
      {name: 'cte_numero', data: low.cte_numero},
      {name: 'nf_resp_receber', data: low.nf_resp_receber},
      {name: 'nf_ocorrencia', data: '0'},
      {name: 'nf_obs', data: 'actions.sync.delivery-mode'},
      {name: 'nf_dt_entrega', data: low.nf_dt_entrega},
      {name: 'nf_lat_long_entrega', data: low.nf_lat_long_entrega},
      {name: 'nf_dt_canhoto', data: low.nf_dt_canhoto},
      {name: 'nf_chave', data: low.nf_chave},
      {name: 'cte_info_controle', data: 'M'},
      {name: 'cte_id', data: low.cte_id.toString()},
    ])
      .then((response) => response.data)
      .then((data) => {
        data = JSON.parse(data);
        if (data.success) {
          Logger.log('Api post => update low sucessfull');
          low.sync = 1;
          setUpdateLow(low);
        }
        resolve(true);
      })
      .catch((e) => {
        Logger.log('Api post => update low fail');
        Logger.recordError(e);
      });
      */
  });

export const updateOccurence = (occurrence: any) =>
  new Promise(async (resolve) => {
    Logger.log('API post => send local occurences to server');
    const token = await getToken();
    const base_url = loginHomologSelector(store.getState())
      ? baseURLHomolog
      : baseURL;
    const uri = base_url + 'nota-fiscal/ocorrencia';

    const bodyData = [
      { name: 'nf_chave', data: occurrence.nf_chave },
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
      { name: 'nf_ocorrencia', data: occurrence.nf_ocorrencia.toString() },
      { name: 'nf_dt_ocorrencia', data: occurrence.nf_dt_ocorrencia },
      { name: 'nf_obs', data: occurrence.nf_obs },
      {
        name: 'nf_lat_long_ocorrencia',
        data: occurrence.nf_lat_long_ocorrencia,
      },
      { name: 'cte_info_controle', data: 'M' },
      { name: 'cte_obs', data: 'actions.sync.delivery-type-ocurrence' },
      { name: 'cte_numero', data: occurrence.cte_numero },
    ];

    const headers = {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    };

    RNFetchBlob.fetch('POST', uri, headers, bodyData)
      .then((response) => response.data)
      .then((data) => {
        data = JSON.parse(data);
        if (data.success) {
          Logger.log('API post => send local occurences to server successful');
          occurrence.sync = 1;
          updateSendOccurence(occurrence);
        }
        resolve();
      })
      .catch((e) => {
        Logger.log('API post => send local occurences to server fail');
        Logger.recordError(e);
      });
  });

export const updateTransport = (travel, isFinished) =>
  new Promise((resolve) => {
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
          }
          resolve();
        });
    } else {
      data.rom_id_controle = travel.rom_id_controle;
      api
        .put(`romaneio/${travel.rom_id_controle}/viagem`, data)
        .then((response) => response.data)
        .then((data) => {
          if (data.success) {
            travel.sync = 1;
            updateTravel(travel);
          }
          resolve();
        });
    }
  });

export const setCheckIn = (check, sync) =>
  new Promise((resolve) => {
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
        }
        resolve();
      });
  });

export const setCheckOut = (check) =>
  new Promise((resolve) => {
    api
      .put(`checkin-app-parceiro/${check.id_api}`, {
        latitude_checkout: check.latitude_checkOut,
        longitude_checkout: check.longitude_checkOut,
      })
      .then((response) => response.data)
      .then(async (data) => {
        if (data.success) {
          updateCheckOut(check, 4);
        }
        resolve();
      });
  });

export const sendLocationDevice = (locationDevice) =>
  new Promise((resolve) => {
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
        }
        resolve();
      });
  });

export const sendLocationDeviceGo = (locationDevice) =>
  new Promise((resolve) => {
    apiGo
      .post('location-device', {
        latitude: locationDevice.latitude,
        longitude: locationDevice.longitude,
        device_data: locationDevice.device_data,
        device_id: locationDevice.device_id,
        evento: locationDevice.evento,
        id_geo: locationDevice.id_geo,
        monitoramento_preventivos_id:
          locationDevice.monitoramento_preventivos_id,
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          locationDevice.sync = 1;
          updateTrackingGo(locationDevice);
        }
        resolve();
      });
  });

export const sendTravelGpsStatus = (travel: any) => {
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
      }
    });
};

export const sendTermHistory = (termHistory) => {
  api
    .post('historico-termo-motorista', {
      motorista: termHistory.motorista_id,
      termo_id: termHistory.termo_id,
      latitude: termHistory.latitude,
      longitude: termHistory.longitude,
      empresa: termHistory.empresa,
    })
    .then((response) => response.data)
    .then((data) => {
      if (data.success) {
        termHistory.sync = 1;
        setTermHistory(termHistory);
      }
    });
};

export const sendMotoLogin = (motoLogin) => {
  api
    .put(`motorista/${motoLogin.moto_id}`, {
      moto_login: motoLogin.moto_login,
      moto_versao_app: motoLogin.moto_versao_app,
    })
    .then((response) => response.data)
    .then((data) => {
      if (data.success) {
        motoLogin.sync = 1;
        updateMotoLogin(motoLogin);
      }
    });
};
