import Realm from 'realm';
import {
  SendOccurrenceSchema,
  LowSchema,
  TransportSchema,
  CTEsSchema,
  CheckInSchema,
  TrackingSchema,
  TrackingGoSchema,
  TransportStatusGpsSchema,
  MotoLoginSchema,
  TermHistorySchema,
  Photos,
} from '../schemas';
var RNFS = require('react-native-fs');
// sync
// utils
import {Logger} from '../../utils';

export const getLows = () =>
  new Promise((resolve) => {
    Logger.log('Realm get => getLows');
    Realm.open({
      schema: [LowSchema, Photos],
    })
      .then((realm) => {
        let dataLows: any = [];
        const lows = realm.objects('baixas').filtered('sync = $0', 0);
        if (lows.length > 0) {
          dataLows = Object.values(JSON.parse(JSON.stringify(lows)));
        }
        realm.close();
        resolve(dataLows);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getOccurrences = () =>
  new Promise((resolve) => {
    Logger.log('realm get => getOccurrences');
    Realm.open({
      schema: [SendOccurrenceSchema, Photos],
    })
      .then((realm) => {
        var dataOccurrences: any = [];
        const occurrences = realm
          .objects('envio_ocorrencias')
          .filtered('sync = $0', 0);
        if (occurrences.length > 0) {
          dataOccurrences = Object.values(
            JSON.parse(JSON.stringify(occurrences)),
          );
        }
        realm.close();
        resolve(dataOccurrences);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getTraveling = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getTraveling');
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var dataTravels: any = [];
        const tranports = realm.objects('transporte').filtered('sync = $0', 0);
        if (tranports.length > 0) {
          dataTravels = Object.values(JSON.parse(JSON.stringify(tranports)));
        }
        realm.close();
        resolve(dataTravels);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getTravelsFinished = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getTravelsFinished');
    Realm.open({
      schema: [TransportSchema],
    })
      .then((realm) => {
        var dataTravels: any = [];
        const tranports = realm
          .objects('transporte')
          .filtered('sync_fim = $0', 1);
        if (tranports.length > 0) {
          dataTravels = Object.values(JSON.parse(JSON.stringify(tranports)));
        }
        realm.close();
        resolve(dataTravels);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getCheckIn = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getCheckIn');
    Realm.open({
      schema: [CheckInSchema],
    })
      .then((realm) => {
        let data: any = [];
        const checkIn = realm.objects('check').filtered('sync = $0', 0);
        if (checkIn.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(checkIn)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getCheckInOut = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getCheckInOut');
    Realm.open({
      schema: [CheckInSchema],
    })
      .then((realm) => {
        let data: any = [];
        const checkInOut = realm.objects('check').filtered('sync = $0', 2);
        if (checkInOut.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(checkInOut)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getCheckOut = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getCheckOut');
    Realm.open({
      schema: [CheckInSchema],
    })
      .then((realm) => {
        let data: any = [];
        const checkOut = realm.objects('check').filtered('sync = $0', 3);
        if (checkOut.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(checkOut)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getLocationsDevice = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getLocationsDevice');
    Realm.open({
      schema: [TrackingSchema],
    })
      .then((realm) => {
        let data: any = [];
        const locationsDevice = realm
          .objects('tracking')
          .filtered('sync = $0', 0);
        if (locationsDevice.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(locationsDevice)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getLocationsDeviceGo = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getLocationsDeviceGo');
    Realm.open({
      schema: [TrackingGoSchema],
    })
      .then((realm) => {
        let data: any = [];
        const locationsDeviceGo = realm
          .objects('tracking_go')
          .filtered('sync = $0', 0);
        if (locationsDeviceGo.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(locationsDeviceGo)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getTravelsGpsStatus = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getTravelsGpsStatus');
    Realm.open({
      schema: [TransportStatusGpsSchema],
    })
      .then((realm) => {
        let data: any = [];
        const travelsStatusGps = realm
          .objects('transporte_status_gps')
          .filtered('sync = $0', 0);
        if (travelsStatusGps.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(travelsStatusGps)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getTermHistories = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getTermHistories');
    Realm.open({
      schema: [TermHistorySchema],
    })
      .then((realm) => {
        let data: any = [];
        const termHistories = realm
          .objects('termo_historico')
          .filtered('sync = $0', 0);
        if (termHistories.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(termHistories)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const getMotoLogins = () =>
  new Promise((resolve) => {
    Logger.log('REALM => getMotoLogins');
    Realm.open({
      schema: [MotoLoginSchema],
    })
      .then((realm) => {
        let data: any = [];
        const motoLogins = realm.objects('moto_login').filtered('sync = $0', 0);
        if (motoLogins.length > 0) {
          data = Object.values(JSON.parse(JSON.stringify(motoLogins)));
        }
        realm.close();
        resolve(data);
      })
      .catch((error) => Logger.recordError(error));
  });

export const syncDelete = () => {
  Realm.open({
    schema: [
      SendOccurrenceSchema,
      LowSchema,
      TransportSchema,
      CTEsSchema,
      CheckInSchema,
      TrackingSchema,
      TrackingGoSchema,
      TransportStatusGpsSchema,
      MotoLoginSchema,
      TermHistorySchema,
    ],
  })
    .then((realm) => {
      realm.write(() => {
        const transports = realm
          .objects('transporte')
          .filtered('sync_fim = $0', 2);
        transports.map(async (transport) => {
          const occurrences = realm
            .objects('envio_ocorrencias')
            .filtered('sync = $0 && rom_id = $1', 1, transport.rom_id);
          const lows = realm
            .objects('baixas')
            .filtered('sync = $0 && rom_id = $1', 1, transport.rom_id);
          const ctes = realm
            .objects('notas_fiscais')
            .filtered('rom_id = $0', transport.rom_id);

          await Promise.all(
            occurrences.map(async (occurrence) => {
              await deleteFiles(occurrence.nf_oco_foto_1_original);
              await deleteFiles(occurrence.nf_oco_foto_2_original);
              await deleteFiles(occurrence.nf_oco_foto_3_original);
            }),
            lows.map(
              async (low) => await deleteFiles(low.canhoto_img_original),
            ),
          );

          realm.delete(occurrences);
          realm.delete(lows);
          realm.delete(ctes);
        });
        if (transports.length > 0) {
          realm.delete(transports);
        }
        const checks = realm.objects('check').filtered('sync = $0', 4);
        if (checks.length > 0) {
          realm.delete(checks);
        }
        const trackings = realm
          .objects('tracking')
          .filtered('sync = $0 OR device_id = $1', 1, '');
        if (trackings.length > 0) {
          realm.delete(trackings);
        }
        const trackingsGo = realm
          .objects('tracking_go')
          .filtered('sync = $0 OR device_id = $1', 1, '');
        if (trackingsGo.length > 0) {
          realm.delete(trackingsGo);
        }
        const travelsStatusGps = realm
          .objects('transporte_status_gps')
          .filtered('sync = $0', 1);
        if (travelsStatusGps.length > 0) {
          realm.delete(travelsStatusGps);
        }
        const motoLogins = realm.objects('moto_login').filtered('sync = $0', 1);
        if (motoLogins.length > 0) {
          realm.delete(motoLogins);
        }
        const termHistories = realm
          .objects('termo_historico')
          .filtered('sync = $0', 1);
        if (termHistories.length > 0) {
          realm.delete(termHistories);
        }
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const deleteFiles = (pathFile = null) => {
  if (!pathFile) {
    return;
  }
  return (
    RNFS.unlink(pathFile)
      .then(() => {
        console.log('FILE DELETED');
        RNFS.scanFile(pathFile)
          .then(() => {
            console.log('scanned');
          })
          .catch((err) => {
            console.log(err);
          });
      })
      // `unlink` will throw an error, if the item to unlink does not exist
      .catch((err) => {
        console.log(err.message);
      })
  );
};

export const setUpdateLow = (low) => {
  Realm.open({
    schema: [LowSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'baixas',
          {
            id: low.id,
            moto_id: low.moto_id,
            rom_id: low.rom_id,
            nf_chave: low.nf_chave,
            nf_dt_entrega: low.nf_dt_entrega,
            nf_dt_canhoto: low.nf_dt_canhoto,
            nf_resp_receber: low.nf_resp_receber,
            nf_ocorrencia: low.nf_ocorrencia,
            nf_obs: low.nf_obs,
            cte_numero: low.cte_numero,
            cte_info_controle: low.cte_info_controle,
            canhoto_img: low.canhoto_img,
            cte_id: low.cte_id,
            nf_lat_long_entrega: low.nf_lat_long_entrega,
            sync: low.sync,
          },
          true,
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateSendOccurence = (occurrence: any) => {
  Logger.log(`Realm create => updateSendOccurence`);
  Realm.open({
    schema: [SendOccurrenceSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'envio_ocorrencias',
          {
            id: occurrence.id,
            moto_id: occurrence.moto_id,
            rom_id: occurrence.rom_id,
            cte_id: occurrence.cte_id,
            cte_numero: occurrence.cte_numero,
            nf_chave: occurrence.nf_chave,
            nf_ocorrencia: occurrence.nf_ocorrencia,
            nf_dt_ocorrencia: occurrence.nf_dt_ocorrencia,
            nf_obs: occurrence.nf_obs,
            nf_oco_foto_1: occurrence.nf_oco_foto_1,
            nf_oco_foto_2: occurrence.nf_oco_foto_2,
            nf_oco_foto_3: occurrence.nf_oco_foto_3,
            cte_obs: occurrence.cte_obs,
            cte_info_controle: occurrence.cte_info_controle,
            nf_lat_long_ocorrencia: occurrence.nf_lat_long_ocorrencia,
            sync: occurrence.sync,
          },
          true,
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateTravel = (travel) => {
  Realm.open({
    schema: [TransportSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'transporte',
          {
            id: travel.id,
            moto_id: travel.moto_id,
            rom_id: travel.rom_id,
            rom_id_controle: travel.rom_id_controle,
            rom_motorista: travel.rom_motorista,
            rom_km_total: travel.rom_km_total,
            rom_origem: travel.rom_origem,
            rom_destino: travel.rom_destino,
            rom_manifesto: travel.rom_manifesto,
            rom_dt_manifesto: travel.rom_dt_manifesto,
            rom_inicio_transp: travel.rom_inicio_transp,
            rom_fim_transp: travel.rom_fim_transp,
            rom_empresa: travel.rom_empresa,
            rom_chat_key: travel.rom_chat_key,
            rom_device_id: travel.rom_device_id,
            rom_total_notas: travel.rom_total_notas,
            rom_notas_entregues: travel.rom_notas_entregues,
            rom_ocorrencias: travel.rom_ocorrencias,
            rom_notas_paradas: travel.rom_notas_paradas,
            rom_lat_long_inicio: travel.rom_lat_long_inicio,
            rom_lat_long_fim: travel.rom_lat_long_fim,
            rom_resp_fim: travel.rom_resp_fim,
            rom_dt_gps: travel.rom_dt_gps,
            rom_gps_ativo: travel.rom_gps_ativo,
            sync: travel.sync,
            sync_fim: travel.sync_fim,
          },
          true,
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateCheckIn = (check, sync) => {
  Realm.open({
    schema: [CheckInSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'check',
          {
            id: check.id,
            id_api: check.id_api,
            motorista_id: check.motorista_id,
            chave_cte: check.chave_cte,
            cte_id: check.cte_id,
            cte: check.cte,
            device_id: check.device_id,
            latitude_checkIn: check.latitude_checkIn,
            longitude_checkIn: check.longitude_checkIn,
            latitude_checkOut: check.latitude_checkOut,
            longitude_checkOut: check.longitude_checkOut,
            sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateCheckOut = (check, sync) => {
  Realm.open({
    schema: [CheckInSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'check',
          {
            id: check.id,
            id_api: check.id_api,
            motorista_id: check.motorista_id,
            chave_cte: check.chave_cte,
            cte_id: check.cte_id,
            cte: check.cte,
            device_id: check.device_id,
            latitude_checkIn: check.latitude_checkIn,
            longitude_checkIn: check.longitude_checkIn,
            latitude_checkOut: check.latitude_checkOut,
            longitude_checkOut: check.longitude_checkOut,
            sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateTracking = (params) => {
  Realm.open({
    schema: [TrackingSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'tracking',
          {
            id: params.id,
            moto_id: params.moto_id,
            latitude: params.latitude,
            longitude: params.longitude,
            device_data: params.device_data,
            device_id: params.device_id,
            evento: params.evento,
            id_geo: params.id_geo.toString(),
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateTrackingGo = (params) => {
  Realm.open({
    schema: [TrackingGoSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'tracking_go',
          {
            id: params.id,
            moto_id: params.moto_id,
            latitude: params.latitude,
            longitude: params.longitude,
            device_data: params.device_data,
            device_id: params.device_id,
            evento: params.evento,
            id_geo: params.id_geo.toString(),
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const setTravelGpsStatus = (params) => {
  Realm.open({
    schema: [TransportStatusGpsSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'transporte_status_gps',
          {
            id: params.id,
            moto_id: params.moto_id,
            rom_id_controle: params.rom_id_controle,
            rom_dt_gps: params.rom_dt_gps,
            rom_gps_ativo: params.rom_gps_ativo,
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const setTermHistory = (params) => {
  Realm.open({
    schema: [TermHistorySchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'termo_historico',
          {
            id: params.id,
            motorista_id: params.motorista_id,
            termo_id: params.termo_id,
            latitude: params.latitude,
            longitude: params.longitude,
            empresa: params.empresa,
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};

export const updateMotoLogin = (params) => {
  Realm.open({
    schema: [MotoLoginSchema],
  })
    .then((realm) => {
      realm.write(() => {
        realm.create(
          'moto_login',
          {
            id: params.id,
            moto_id: params.moto_id,
            moto_login: params.moto_login,
            moto_versao_app: params.moto_versao_app,
            sync: params.sync,
          },
          'modified',
        );
      });
      realm.close();
    })
    .catch((error) => console.log('error', error));
};
